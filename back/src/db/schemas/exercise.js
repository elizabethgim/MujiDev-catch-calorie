import { Schema, model } from "mongoose";

const ExerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    kcal_per_kg: {
        type: Number,
        required: true,
    },
    kcal_per_lb: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
});

const ExerciseModel = model("Exercise", ExerciseSchema);

export { ExerciseModel };
