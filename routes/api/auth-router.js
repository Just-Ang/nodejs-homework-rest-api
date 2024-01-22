import express from "express";
const authRouter = express.Router();
import validateBody from "../../decorators/validateBody.js";
import usersSchemas from "../../schemas/users-schema.js";
import authController from "../../controllers/auth-controller.js";
import authenticate from "../../middlewars/authenticate.js";
import upload from "../../middlewars/upload.js";

authRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authController.signup);

authRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authController.signin);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.patch("/", authenticate, authController.changeSubscription);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);



export default authRouter;