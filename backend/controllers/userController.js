const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

/* @desc   Register new user */
/* @route  /api/users */
/* @access Public */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  //Find if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exist");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

/* @desc   Login user */
/* @route  /api/users/login */
/* @access Public */
const logUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  Find user on DB and compare password with hash value from bcrypt
  const user = await User.findOne({ email });
  const comparePassword = await bcrypt.compare(password, user.password);

  if (user && comparePassword) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

module.exports = {
  registerUser,
  logUser,
};
