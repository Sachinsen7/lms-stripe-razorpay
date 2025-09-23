import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { match } from 'assert';

// encrypt can be decrypted but hash cannot be decrypted

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [40, 'Name must be less than 40 characters'],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address',
            ],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // when we fetch user data, password will not be fetched
        },

        role: {
            type: String,
            enum: {
                values: ['student', 'instructor', 'admin'],
                message: 'Role is either: student, instructor, admin',
            },
            default: 'student',
        },

        avatar: {
            // public_id: {
            //     type: String,
            //     required: true,
            // },
            // url: {
            //     type: String,
            //     required: true,
            // },
            type: String,
            default: 'default-avatar.png',
        },

        bio: {
            type: String,
            maxlength: [250, 'Bio must be less than 250 characters'],
            default: 'bio',
        },

        enrolledCourses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Course',
                },
                enrolledAt: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],

        createCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],

        resetPasswordToken: String,
        resetPasswordExpire: Date,
        lstActive: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
