const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
require("dotenv").config();

// Encryption Function
const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.AES_SECRET_KEY).toString();
};

// Decryption Function
const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.AES_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // Optimizes search
    },
    content: {
      type: String,
      required: true, // Stored in encrypted format
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links report to a User (if needed)
      required: true,
    },
    category: {
      type: String,
      enum: ["Financial", "Legal", "Technical", "HR", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true, // Speeds up filtering by status
    },
    attachments: [
      {
        fileName: String,
        fileURL: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    metadata: {
      ip: String,
      userAgent: String,
      location: {
        lat: Number,
        lon: Number,
      },
    },
  },
  { timestamps: true }
);

// Middleware to encrypt content before saving
reportSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.content = encryptData(this.content);
  }
  next();
});

// Method to decrypt content when needed
reportSchema.methods.getDecryptedContent = function () {
  return decryptData(this.content);
};

// Export Model
module.exports = mongoose.model("Report", reportSchema);
