import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export default Student;