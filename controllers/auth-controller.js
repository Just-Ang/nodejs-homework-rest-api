import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HtttpError.js";
import dotenv from "dotenv";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import gravatar from "gravatar";
import createVerifyEmail from "../helpers/createVerifyEmail.js";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";


dotenv.config();

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");


const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const userAvatar = gravatar.url(email);

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();


  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: userAvatar,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail({ email, verificationToken });
  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: "starter",
  });
};

const signin = async (req, res) => {
  const { email, password} = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  const {subscription} = user;

  res.json({
    token,
    "user": {
        email,
        subscription,
      }
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.user)
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "Signout success" });
};

const changeSubscription = async (req, res) => {
  const { _id} = req.user;
  const result = await User.findByIdAndUpdate({ _id }, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  const { subscription } = result;
  res.json({subscription});
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "File not found");
  }
  
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;

  const avatar = await Jimp.read(oldPath);
  await avatar.resize(250, 250);
  console.log(avatar);
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};



const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }


  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail({
    email,
    verificationToken: user.verificationToken,
  });

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeSubscription: ctrlWrapper(changeSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
};