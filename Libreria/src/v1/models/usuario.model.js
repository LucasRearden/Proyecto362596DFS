import mongoose from "mongoose";
import { Role, Roles, Plan, Plans } from "../constants/role.constants.js";


const usuarioSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: { type: String, enum: Roles, default: Role.user },
    plan: { type: String, enum: Plans, default: Plan.plus },
    password: {
        type: String,
        required: true,
        select: false
    }
});

usuarioSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;