import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import dotenv from 'dotenv';
import HttpError from "../helpers/HtttpError.js";

dotenv.config();

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next)=> {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(' ');
    if(bearer !== "Bearer") {
        throw HttpError(401);
    }

    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token ) {
          throw HttpError(401);
        }
        req.user = user;
        next();
    }
    catch(error) {
        throw HttpError(401, error.message);
    }
}

export default ctrlWrapper(authenticate);