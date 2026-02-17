const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
    },
    mode: {
      type: String,
      enum: ["FREE", "PAID"],
      required: [true, "Mode is required"],
    },
    price: {
      type: Number,
      default: 0,
    },
    bannerUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternalUser",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);