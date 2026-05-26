import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "Barbeiro",
      trim: true,
    },
    specialties: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["online", "offline", "trabalhando", "pausado"],
      default: "offline",
    },
    socialLinks: {
      instagram: String,
      youtube: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", employeeSchema);
