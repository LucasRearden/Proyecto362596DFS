import mongoose from "mongoose";
import { Role, Roles } from "../constants/role.constants.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
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
    password: {
        type: String,
        required: true,
        select: false
    }
});

userSchema.set('toJSON', {
    //doc es el documento de mongoose y ret el elemento a devolver
    transform: (doc, ret) => {
        // renombrar _id → id
        ret.id = ret._id;
        //borramos el id de mongo
        delete ret._id;
        delete ret.password;
        // // eliminar campos que no querés exponer
        // 
        delete ret.__v;
        // delete ret.createdAt;
        // delete ret.updatedAt;
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export default User;


// const user = User.findById(id) 

// return res.status(200).json({  user });

// user = {
//     id:"64a1f8e2c9b1f2a5d6e4b8c3",
//     name: "Bart",  
//     email: "algo@algod.com"     
// }






