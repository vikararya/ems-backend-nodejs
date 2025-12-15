import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
  },
  { timestamps: true } // createdAt & updatedAt
);

export default mongoose.model("Employee", employeeSchema);
