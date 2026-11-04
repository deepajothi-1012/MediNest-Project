
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true,
    default: "Home",
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Phone number must contain 10 digits"],
  },
  streetAddress: {
    type: String,
    required: true,
    trim: true,
  },
  locality: {
    type: String,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    match: [/^[1-9][0-9]{5}$/, "Postal code must be a valid 6-digit PIN"],
  },
  country: {
    type: String,
    trim: true,
    default: "India",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tokenVersion: {
      type: Number,
      default: 0,
      select: false,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
