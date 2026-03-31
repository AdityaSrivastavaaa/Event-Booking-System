const { User } = require("../models");

// POST /users (Register)
exports.createUser = async (req, res) => {
  try {
    let { name, email } = req.body;

    // 🔹 Basic sanitization
    name = name?.trim();
    email = email?.trim().toLowerCase();

    // 🔹 Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // 🔹 Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 🔹 Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔹 Create user
    const user = await User.create({ name, email });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

  } catch (err) {
    console.error("Create User Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (err) {
    console.error("Get Users Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔹 Validate id
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (err) {
    console.error("Get User Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};