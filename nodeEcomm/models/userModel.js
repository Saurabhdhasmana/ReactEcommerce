const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z ]+$/.test(v);
      },
      message: 'Name must contain only letters and spaces.'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9._%+-]+@gmail\.com$/, 'Email must be a valid @gmail.com address and all lowercase.']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128
  },
  isAdmin: { type: Boolean, default: false }, // Admin user
}, { timestamps: true });

// Ensure email is always lowercase before saving
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('user', userSchema);
