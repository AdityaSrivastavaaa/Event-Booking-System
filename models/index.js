const User = require("./User.model");
const Event = require("./Event.model");
const Booking = require("./Booking.model");
const Attendance = require("./Attendance.model");

// ======================
// 🔗 User ↔ Booking
// ======================
User.hasMany(Booking, { foreignKey: "user_id", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });

// ======================
// 🔗 Event ↔ Booking
// ======================
Event.hasMany(Booking, { foreignKey: "event_id", as: "bookings" });
Booking.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// ======================
// 🔗 Booking ↔ Attendance
// ======================
Booking.hasOne(Attendance, { foreignKey: "booking_id", as: "attendance" });
Attendance.belongsTo(Booking, { foreignKey: "booking_id", as: "booking" });

module.exports = {
  User,
  Event,
  Booking,
  Attendance,
};