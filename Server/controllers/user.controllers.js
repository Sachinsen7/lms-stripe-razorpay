import { isAuthenticated } from '../middlewares/auth.middlewares';
import { ApiError, catchAsyncErrors } from '../middlewares/error.middlewares';
import { User } from '../models/user.model';
import { generateToken } from '../utils/generateToken';

export const creatUserAccount = catchAsyncErrors(async (req, res) => {
    const { name, email, password, role = 'student' } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
        throw new ApiError('User Already Exists', 400);
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
    });

    await user.updateLastActive();
    generateToken(res, id, 'Account created successfully');
});

export const authenticateUser = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
        '+password'
    );

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError('Invalid email or password');
    }

    await user.updateLastActive();
    generateToken(res, id, `Welcome back ${user.name}`);
});

export const logoutUser = catchAsyncErrors(async (_, res) => {
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({
        success: true,
        message: 'Signed out successfully',
    });
});

export const getCurrentUserProfile = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.id).populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail description',
    });

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        data: {
            ...user.toJSON(),
            totalEnrolledCourses: user.enrolledCourses,
        },
    });
});
