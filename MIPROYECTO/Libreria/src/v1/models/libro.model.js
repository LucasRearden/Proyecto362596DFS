import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    autor: {
        type: String,
        required: true,
        trim: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    sinopsis: {
        type: String,
        required: false
    },
    portadaUrl: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }
}, { timestamps: true });

libroSchema.index({ titulo: 1, autor: 1 }, { unique: true });

libroSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Libro = mongoose.model("Libro", libroSchema);

export default Libro;