const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
    },
    duration: {
      type: String,
    },
    lectureMode: {
      type: String,
      enum: ["TEXT", "VIDEO", "AUDIO"],
      required: true,
    },
    lectureType: {
      type: String,
      enum: ["FREE", "PAID"],
      required: true,
    },
    content: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    lectureBannerUrl: {
      type: String,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternalUser",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternalUser",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecture", LectureSchema);