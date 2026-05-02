import { http } from "./_http";

/**
 * Backend: backend/src/routes/analytics.routes.js (admin role required)
 *
 *   GET /analytics/overview
 *   GET /analytics/trends
 *   GET /analytics/agents
 *   GET /analytics/categories
 *
 * The backend does NOT yet expose CSAT / channel-breakdown / AI-deflection
 * endpoints. Those return safe placeholders so dashboards still render.
 * Backend dev: implement and replace the stubs.
 */
export const analytics = {
  overview: (params) => http.get("/analytics/overview", { params }),
  ticketsTrend: (params) => http.get("/analytics/trends", { params }),
  agentPerformance: (params) => http.get("/analytics/agents", { params }),
  categories: (params) => http.get("/analytics/categories", { params }),

  // ---- Not implemented on backend yet — safe placeholders ----
  csat: async () => ({ score: null, series: [], notImplemented: true }),
  channels: async () => ({ channels: [], notImplemented: true }),
  aiDeflection: async () => ({ rate: null, series: [], notImplemented: true }),
};
