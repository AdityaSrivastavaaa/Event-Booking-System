const { Booking, Attendance } = require("../models");

exports.markAttendance = async (req, res) => {
  try {
    const { code } = req.body;
    const eventId = req.params.id;

    // 🔹 Validation
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Booking code is required",
      });
    }

    // 🔹 Find booking by code
    const booking = await Booking.findOne({
      where: { booking_code: code },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Invalid booking code",
      });
    }

    // 🔹 Check if booking belongs to this event (IMPORTANT)
    if (booking.event_id != eventId) {
      return res.status(400).json({
        success: false,
        message: "Booking does not belong to this event",
      });
    }

    // 🔹 Prevent duplicate attendance (VERY IMPORTANT ⭐)
    const existingAttendance = await Attendance.findOne({
      where: { booking_id: booking.id },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    // 🔹 Create attendance
    const attendance = await Attendance.create({
      booking_id: booking.id,
    });

    // 🔹 Success response
    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: {
        bookingId: booking.id,
        eventId: booking.event_id,
        ticketsBooked: 1, // 1 booking = 1 ticket
        entryTime: attendance.entry_time,
      },
    });

  } catch (err) {
    console.error("Attendance Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};