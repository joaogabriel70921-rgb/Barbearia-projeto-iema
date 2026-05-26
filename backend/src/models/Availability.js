import mongoose from "mongoose";

const timeRangeSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      min: 0,
      max: 6,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    weekDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6],
    },
    workHours: {
      type: [timeRangeSchema],
      default: [],
    },
    breaks: {
      type: [timeRangeSchema],
      default: [],
    },
    daysOff: {
      type: [String],
      default: [],
    },
    blockedSlots: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Availability", availabilitySchema);
