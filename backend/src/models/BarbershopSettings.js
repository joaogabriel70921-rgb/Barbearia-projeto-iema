import mongoose from "mongoose";

const barbershopSettingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Barbearia Premium",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    openingHours: {
      type: Object,
      default: {},
    },
    cancellationPolicy: {
      type: String,
      default: "Cancelamentos devem ser feitos com antecedencia.",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BarbershopSettings", barbershopSettingsSchema);
