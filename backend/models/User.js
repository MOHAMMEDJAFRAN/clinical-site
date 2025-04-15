import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  full_name: String,
  phone_number: String,
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'super-admin'], default: 'patient' },
  is_active: { type: Boolean, default: true },
  is_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'user_details' }); // Explicit collection name

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserDetails = mongoose.models.User || mongoose.model('User', userSchema);
export default UserDetails;