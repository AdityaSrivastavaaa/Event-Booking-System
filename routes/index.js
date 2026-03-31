const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");
const bookingController = require("../controllers/booking.controller");
const attendanceController = require("../controllers/attendance.controller");
const userController = require("../controllers/user.controller");

// ======================
// 👤 USER ROUTES
// ======================
router.post("/users", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id/bookings", bookingController.getUserBookings); // keep before /users/:id
router.get("/users/:id", userController.getUserById);

// ======================
// 🎉 EVENT ROUTES
// ======================
router.get("/events", eventController.getEvents);
router.post("/events", eventController.createEvent);

// ======================
// 🎟️ BOOKING ROUTES
// ======================
router.post("/bookings", bookingController.createBooking);

// ======================
// 🚪 ATTENDANCE ROUTES
// ======================
router.post("/events/:id/attendance", attendanceController.markAttendance);

module.exports = router;