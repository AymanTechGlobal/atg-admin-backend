const mongoose = require("mongoose");

const careNavigatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      validate: {
        validator: async function (email) {
          const count = await this.constructor.countDocuments({ email });
          return count === 0;
        },
        message: "Email already exists",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
      validate: {
        validator: function (phone) {
          return /^[0-9]{10}$/.test(phone);
        },
        message: "Phone number must be 10 digits",
      },
    },
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "On Leave"],
        message: "Status must be either Active, Inactive, or On Leave",
      },
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for faster queries
careNavigatorSchema.index({ email: 1 });
careNavigatorSchema.index({ status: 1 });

// Add a virtual for formatted phone number
careNavigatorSchema.virtual("formattedPhone").get(function () {
  const phone = this.phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
});

// Add a pre-save middleware to ensure email is lowercase
careNavigatorSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Add a pre-validate middleware to trim all string fields
careNavigatorSchema.pre("validate", function (next) {
  Object.keys(this.schema.paths).forEach((path) => {
    if (this.schema.paths[path].instance === "String" && this[path]) {
      this[path] = this[path].trim();
    }
  });
  next();
});

module.exports = mongoose.model("CareNavigator", careNavigatorSchema);
