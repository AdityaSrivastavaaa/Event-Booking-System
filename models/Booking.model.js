const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },

  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "events",
      key: "id",
    },
  },

  booking_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

}, {
  tableName: "bookings",
  timestamps: false,
});

module.exports = Booking;