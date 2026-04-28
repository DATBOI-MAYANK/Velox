const mongoose = require("mongoose");
const Item = require("../models/Item");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const invalidIdResponse = (res) =>
  res.status(400).json({ success: false, message: "Invalid item ID" });

// GET /api/items
const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/items/:id
const getItemById = async (req, res) => {
  if (!isValidId(req.params.id)) return invalidIdResponse(res);
  try {
    const item = await Item.findById(toObjectId(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/items
const createItem = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const item = await Item.create({ name, description, price });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/items/:id
const updateItem = async (req, res) => {
  if (!isValidId(req.params.id)) return invalidIdResponse(res);
  try {
    // Destructure only the fields we allow to be updated (prevents NoSQL injection)
    const { name, description, price } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;

    const item = await Item.findByIdAndUpdate(toObjectId(req.params.id), updateData, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  if (!isValidId(req.params.id)) return invalidIdResponse(res);
  try {
    const item = await Item.findByIdAndDelete(toObjectId(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };

