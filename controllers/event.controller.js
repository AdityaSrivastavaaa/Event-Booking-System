const { Event } = require("../models");

// GET /events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });

  } catch (err) {
    console.error("Get Events Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, capacity } = req.body;

    // 🔹 Validation
    if (!title || !date || !capacity) {
      return res.status(400).json({
        success: false,
        message: "title, date and capacity are required",
      });
    }

    // 🔹 Create event
    const event = await Event.create({
      title,
      description,
      date,
      total_capacity: capacity,
      remaining_tickets: capacity,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });

  } catch (err) {
    console.error("Create Event Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};