import Tenant from "../models/Tenant.js";
import Ticket from "../models/Ticket.js";
import Message from "../models/Message.js";
import { getIO } from "../socket/index.js";
import { classifyMessage, autoReply } from "../services/ai.service.js";
import { routeTicket } from "../services/routing.service.js";
import crypto from "crypto";

/**
 * GET /api/widget/config/:apiKey
 * Public - returns widget display config for the embed script.
 */
export const getWidgetConfig = async (req, res) => {
  const tenant = await Tenant.findOne({ apiKey: req.params.apiKey });
  if (!tenant)
    return res.status(404).json({ success: false, message: "Invalid API key" });

  res.json({
    success: true,
    config: {
      tenantId:    tenant._id,
      name:        tenant.name,
      accentColor: tenant.settings?.widget?.accentColor || "#00E676",
      greeting:    tenant.settings?.widget?.greeting || "Hi! How can we help?",
      aiEnabled:   tenant.settings?.ai?.enabled ?? true,
    },
  });
};

/**
 * POST /api/widget/session
 * Creates or resumes a customer chat session.
 * Returns a sessionToken for the widget to use on Socket.IO connections.
 */
export const createSession = async (req, res) => {
  const { apiKey, customerName, customerEmail, sessionToken } = req.body;

  if (!apiKey)
    return res.status(400).json({ success: false, message: "apiKey is required" });

  const tenant = await Tenant.findOne({ apiKey });
  if (!tenant)
    return res.status(404).json({ success: false, message: "Invalid API key" });

  // Resume existing session or create new one
  const token = sessionToken || `sess_${crypto.randomBytes(16).toString("hex")}`;

  res.json({
    success: true,
    session: {
      sessionToken: token,
      tenantId:     tenant._id,
      greeting:     tenant.settings?.widget?.greeting || "Hi! How can we help?",
    },
  });
};

/**
 * POST /api/widget/ticket
 * Public widget endpoint — creates a ticket from the embedded chat.
 * Auth is the tenant API key, not a JWT. Runs the same AI pipeline as
 * the authenticated POST /tickets so the customer gets an immediate auto-reply
 * (or, on low confidence, the ticket is routed to a human agent).
 */
export const createTicketFromWidget = async (req, res) => {
  const { apiKey, content, customerName, customerEmail, subject, transcript } = req.body;

  const tenant = await Tenant.findOne({ apiKey });
  if (!tenant)
    return res.status(404).json({ success: false, message: "Invalid API key" });

  const tenantId = tenant._id;
  const body = transcript ? `${transcript}\n\n---\n${content}` : content;

  const ticket = await Ticket.create({
    tenantId,
    customer: {
      name:  customerName  || "Website Visitor",
      email: customerEmail || `guest+${Date.now()}@widget.local`,
    },
    subject: subject || content.slice(0, 80),
    body,
    priority: "medium",
  });

  await Message.create({
    tenantId,
    ticketId:   ticket._id,
    senderType: "customer",
    content,
  });

  // AI pipeline (non-blocking)
  try {
    const classification = await classifyMessage(tenantId, content);
    const updates = {
      category:     classification.intent,
      priority:     classification.priority || "medium",
      aiConfidence: classification.confidence || 0,
      sentiment:    classification.sentiment || "neutral",
    };

    if (classification.confidence >= 0.7) {
      const aiResult = await autoReply(tenantId, ticket._id);
      if (aiResult.reply && !aiResult.escalate) {
        await Message.create({
          tenantId,
          ticketId:   ticket._id,
          senderType: "ai",
          content:    aiResult.reply,
        });
        updates.aiReplied = true;
      }
    }

    if (!updates.aiReplied) {
      const agent = await routeTicket(tenantId, classification.intent);
      if (agent) updates.assignedTo = agent._id;
      updates.status = "open";
    }

    await Ticket.findByIdAndUpdate(ticket._id, { $set: updates });
    Object.assign(ticket, updates);
  } catch (err) {
    console.warn("Widget AI pipeline error (non-fatal):", err.message);
  }

  // Broadcast to tenant agents so the dashboard updates live
  try {
    const io = getIO();
    io.to(`tenant:${tenantId}`).emit("ticket:new", { ticket });
  } catch { /* ignore */ }

  // Pull persisted messages so the widget can render the AI reply (if any)
  const messages = await Message.find({ ticketId: ticket._id }).sort({ createdAt: 1 }).lean();

  res.status(201).json({ success: true, ticket, messages });
};
