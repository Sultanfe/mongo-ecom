import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: true,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        role: {
            type: String,
            enum: ["customer", "vendor", "admin", "super_admin"],
            default: "customer",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving.
// Mongoose 8+ async hooks: do NOT use the `next` callback — use return/throw.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare a candidate password with the stored hash.
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// Strip sensitive fields from JSON output.
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
