import mongoose, { Schema } from "mongoose";

const pdfschema = new mongoose.Schema({
   pdf: String,
   title: String
}, { collection: "pdfcollection" });

const pdfmodel = mongoose.model("pdf", pdfschema);

export default pdfmodel;