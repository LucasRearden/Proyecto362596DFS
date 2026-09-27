import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: { type: String, required: false }

});



tareaSchema.set('toJSON', {
    //doc es el documento de mongoose y ret el elemento a devolver
    transform: (doc, ret) => {
        // renombrar _id → id
        ret.id = ret._id;
        //borramos el id de mongo
        delete ret._id;
        // // eliminar campos que no querés exponer
        delete ret.__v;
        // delete ret.createdAt;
        // delete ret.updatedAt;
        return ret;
    }
});


const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea; 