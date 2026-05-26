import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    serviceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: [
        "pendente",
        "confirmado",
        "em_andamento",
        "concluido",
        "cancelado",
        "nao_compareceu",
      ],
      default: "pendente",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    cancelReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ employeeId: 1, date: 1, time: 1 });

export default mongoose.model("Appointment", appointmentSchema);
