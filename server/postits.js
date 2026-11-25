import mongoose from 'mongoose';

const postitItemSchema = new mongoose.Schema({
  job_title: { type: String, required: true, trim: true, maxlength: 100 },
  // start_year: { type: Number, required: true, min: 1900, max: 2100, validate: Number.isInteger },
  // end_year: { type: Number, min: 1900, max: 2100, validate: Number.isInteger },
  // employer: { type: String, required: true, trim: true, maxlength: 100 },
  response: { type: String, required: true, trim: true, maxlength: 2000 }
}, { collection: 'postits', autoIndex: false });

export const Postits = mongoose.models.Postits || mongoose.model('Postits', postitItemSchema);
