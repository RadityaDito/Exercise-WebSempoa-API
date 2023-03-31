import mongoose from "mongoose";

const muridSchema = new mongoose.Schema({
    nama: {type: String, required: true},
    cabang: {type: String, required: true},
    tanggal: {type: Date, default: Date.now}
})

const Murid = mongoose.model("Murid", muridSchema);

export default Murid;