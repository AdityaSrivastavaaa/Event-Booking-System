const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attendance = sequelize.define("Attendance", {
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "bookings", // table name
      key: "id",
    },
  },
}, {
  tableName: "attendance",
  timestamps: false,
});

module.exports = Attendance;