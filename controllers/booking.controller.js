const sequelize = require("../config/db");
const { Booking, Event, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

// POST /bookings
exports.createBooking = async (req, res) => {
  const { userId, eventId } = req.body;

  // 🔹 Input validation
  if (!userId || !eventId) {
    return res.status(400).json({
      success: false,
      message: "userId and eventId are required",
    });
  }

  let transaction;

  try {
    transaction = await sequelize.transaction();

    // 🔹 Check user exists
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error("User not found");
    }

    // 🔹 Lock event row (prevents race condition)
    const event = await Event.findByPk(eventId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.remaining_tickets <= 0) {
      throw new Error("No tickets available");
    }

    // 🔹 Update ticket count
    event.remaining_tickets -= 1;
    await event.save({ transaction });

    // 🔹 Create booking
    const booking = await Booking.create(
      {
        user_id: userId,
        event_id: eventId,
        booking_code: uuidv4(),
      },
      { transaction }
    );

    // 🔹 Commit transaction
    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Booking successful",
      data: {
        bookingId: booking.id,
        bookingCode: booking.booking_code,
        eventId: booking.event_id,
        userId: booking.user_id,
      },
    });

  } catch (err) {
    if (transaction) await transaction.rollback();

    console.error("Booking Error:", err);

    return res.status(400).json({
      success: false,
      message: err.message || "Booking failed",
    });
  }
};

// GET /users/:id/bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔹 Validate user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          attributes: ["id", "title", "date"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });

  } catch (err) {
    console.error("Get Bookings Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};