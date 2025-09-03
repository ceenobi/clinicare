import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Inpatient from "../models/inpatient.js";
import Doctor from "../models/doctor.js";
import mailService from "./email.service.js";
import responseHandler from "../utils/responseHandler.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
const { errorResponse, notFoundResponse } = responseHandler;

const userService = {
  register: async (userData, next) => {
    //check if email already exists
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exists", 400));
    }
    //if fresh new userData-email, then we proceed to creating our user
    //handle verificationCode to be sent to user email
    const verificationCode = crypto.randomInt(100000, 999999).toString(); //six characters randomly generated
    const verificationCodeExpiry = new Date(Date.now() + 3600000); //1hr expiry
    //handle password encryption
    const salt = await bcrypt.genSalt(10); //degree of encryption
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    //proceed to creating our user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
    });
    //proceed to sending email to user
    //we are going to use a process from node process.nextTick - this allows us to not block synchronous operations - the api response wont wait for the email to be sent, even if email fails it won't affect the creation of the user
    process.nextTick(() => {
      mailService.sendWelcomeMail(user).catch(console.error); //catch email sending error
    });
    //if user could not be registered, then we send a server error
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user; //send user to our controller
  },
  //login user
  login: async (userData, next) => {
    //find user with email from the form
    const user = await User.findOne({ email: userData.email }).select(
      "+password"
    ); //select includes the field we want to have access to, in this case the password
    if (!user) {
      return next(errorResponse("Account not found", 401));
    }
    //handle password
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      user.password
    ); //userData.passsword is from the form, while user.password is the password saved about the user in the database
    if (!isPasswordCorrect) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    return user;
  },
  authenticateUser: async (userId, next) => {
    //get userId from our jwt decoded token
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user;
  },
  //get a new accessToken when current one expires
  refreshAccessToken: async (refreshToken, next) => {
    if (!refreshToken) {
      return next(errorResponse("Refresh token is required", 401));
    }
    //verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(errorResponse("Invalid refresh token", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(notFoundResponse("User account not found"));
    }
    return user;
  },
  verifyUserAccount: async (data, next) => {
    //destructure data
    const { userId, verificationToken } = data;
    //find our user, and get the verifcationToken/Expiry saved to the user
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    //check if user is already verified
    if (user.isVerified) {
      return next(errorResponse("Account is already verified", 400));
    }
    //check if verificationToken saved in db is same as the one received from the form
    if (user.verificationToken !== verificationToken) {
      return next(errorResponse("Invalid verification token", 400));
    }
    //check for token expiry
    if (user.verificationTokenExpiry < new Date()) {
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      return next(
        errorResponse(
          "Verification token has expired, please get a new one",
          400
        )
      );
    }
    //verify user if token has not expired
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    return user;
  },
  resendVerificationToken: async (userId, next) => {
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.isVerified) {
      return next(notFoundResponse("Account already verified"));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000); //1 hr
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationCodeExpiry;
    await user.save();
    process.nextTick(() => {
      mailService.sendVerificationCode(user).catch(async (error) => {
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send verification token", error);
      });
    });
    return user;
  },
  forgotPassword: async (userData, next) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    //generate reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 900000); //15minutes
    user.passwordResetToken = resetCode;
    user.passwordResetTokenExpiry = resetCodeExpiry;
    await user.save();
    process.nextTick(() => {
      mailService.sendPasswordResetEmail(user).catch(async (error) => {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send password token", error);
      });
    });
    return user;
  },
  resetPassword: async (userData, next) => {
    const { email, password, confirmPassword, passwordResetToken } = userData;
    if (password !== confirmPassword) {
      return next(errorResponse("Passwords do not match", 400));
    }
    const user = await User.findOne({ email }).select(
      "+password +passwordResetToken +passwordResetTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found with that email"));
    }
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetToken
    ) {
      return next(errorResponse("Password reset token not found", 400));
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    if (user.passwordResetTokenExpiry < new Date()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Password reset token has expired", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return user;
  },
  logout: async (req, res, next) => {
    res.cookie("userRefreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token",
    });
    return true;
  },
  uploadAvatar: async (userId, avatar, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (!avatar) {
      return next(errorResponse("No file uploaded", 400));
    }
    //check if user has avatar already
    const currentAvatar = user.avatar;
    const currentAvatarId = user.avatarId;
    if (currentAvatar) {
      //if avatar exists, delete and replace with new avatar
      await deleteFromCloudinary(currentAvatarId);
    }
    const { url, public_id } = await uploadToCloudinary(avatar, {
      folder: "Clinicare/avatars",
      width: 200,
      height: 200,
      crop: "fit",
      format: "webp",
    });
    user.avatar = url || user.avatar;
    user.avatarId = public_id || user.avatarId;
    await user.save();
    return user;
  },
  updateUserPassword: async (userId, userData, next) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    const { password, newPassword, confirmPassword } = userData;
    const [checkPassword, isPasswordSame] = await Promise.all([
      bcrypt.compare(password, user.password),
      bcrypt.compare(newPassword, user.password),
    ]);
    if (!checkPassword) {
      return next(errorResponse("Incorrect current password", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(
        errorResponse("New password and confirm password does not match", 400)
      );
    }
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    const updatedUser = await user.save();
    return updatedUser;
  },
  updateUser: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found with that email"));
    }
    if (userData.phone) {
      const phoneExists = await User.findOne({ phone: userData.phone });
      if (phoneExists) {
        return next(errorResponse("User with phone already exists", 400));
      }
    }
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  deleteAccount: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }
    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId });
      const inpatient = await Inpatient.findOne({ patientId: patient });
      if (inpatient) {
        await inpatient.deleteOne();
      }
      await Patient.findOneAndDelete({ userId });
    }
    if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ userId });
    }
    await user.deleteOne();
    return true;
  },
  getAllUsers: async (page = 1, limit = 3, query = "", role = "", next) => {
    const sanitizeQuery =
      query || role
        ? (query || role).toLowerCase().replace(/[^\w\s]/gi, "")
        : "";
    const [users, total] = sanitizeQuery
      ? await Promise.all([
          User.find({
            $or: [
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
          })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments({
            $or: [
              { fullname: { $regex: sanitizeQuery, $options: "i" } },
              { role: { $regex: sanitizeQuery, $options: "i" } },
            ],
          }),
        ])
      : await Promise.all([
          User.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
          User.countDocuments(),
        ]);
    if (!users) {
      return next(notFoundResponse("No users found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + users.length < total,
        limit,
      },
      users,
    };
  },
  deleteAccountAdmins: async (userId, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.avatarId) {
      await deleteFromCloudinary(user.avatarId);
    }
    if (user.role === "patient") {
      const patient = await Patient.findOne({ userId });
      const inpatient = await Inpatient.findOne({ patientId: patient });
      if (inpatient) {
        await inpatient.deleteOne();
      }
      await Patient.findOneAndDelete({ userId });
    }
    if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ userId });
    }
    await user.deleteOne();
    return true;
  },
  updateUserRole: async (userId, userData, next) => {
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("No user found"));
    }
    if (user.role === "patient") {
      return next(errorResponse("Patient role cannot be updated"));
    }
    if (user.role === "admin" && userData.role !== "admin") {
      return next(errorResponse("Admin cannot update or downgrade an admin"));
    }
    for (const [key, value] of Object.entries(userData)) {
      if (value) {
        user[key] = value;
      }
    }
    const updatedUser = await user.save();
    return updatedUser;
  },
  createUserAdmins: async (userData, next) => {
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exists", 400));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000);
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(userData.password, salt);
    const user = await User.create({
      ...userData,
      password: hashedPass,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
    });
    process.nextTick(() => {
      mailService.sendWelcomeMail(user, userData.password).catch(console.error);
    });
    if (user.role === "doctor") {
      await Doctor.create({
        userId: user._id,
        availability: userData.availability,
        specialization: userData.specialization,
      });
    }
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user;
  },
};

export default userService;
