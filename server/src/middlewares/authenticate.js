import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/user.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { forbiddenResponse, unauthorizedResponse } = responseHandler;

export const verifyAuth = tryCatchFn(async (req, res, next) => {
  //check if token exists
  let token;
  //checking for our token in the request headers object and ensuring it starts with the Bearer signature word ensuring its jwt type token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //extracts the token without Bearer
  }
  if (!token) {
    return next(
      unauthorizedResponse(
        "You are not logged in!, Please log in to gain access."
      )
    );
  }
  //verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  //check if a user exists with our decoded id
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      unauthorizedResponse("The user belonging to this token no longer exists.")
    );
  }
  //assign user to our request object
  req.user = currentUser;
  next(); //pass to the next event
});

//role based auth
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        forbiddenResponse("You do not have permission to perform this action")
      );
    }
    next();
  };
};
