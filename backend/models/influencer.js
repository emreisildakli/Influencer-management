const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const influencerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    accounts: {
      tiktok: [String],
      instagram: [String]
    }
  },
  { timestamps: true }
);

influencerSchema.pre("save", function (next) {
  // Capitalize first letter of name and lastName
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }
  next();
});

const Influencer = mongoose.model("Influencer", influencerSchema);

module.exports = Influencer;
