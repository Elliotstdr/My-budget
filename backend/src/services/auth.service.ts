import jwt from "jsonwebtoken";
import { DUser, User } from "../models/user.model";

export const findTokenUserID = (token: string): string => {
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = (decodedToken as jwt.JwtPayload).userId;

  return userId
}

export const findTokenUser = async (authorization: string | undefined): Promise<DUser | null> => {
  if(!authorization) return null

  const userId = findTokenUserID(authorization.split(" ")[1])
  const user: DUser | null = await User.findOne({ _id: userId })

  return user
}

export const compareTokenUserID = (authorization: string | undefined, id: string | undefined): boolean => {
    if(!authorization || !id) return false;
    const decodedToken = jwt.verify(authorization?.split(" ")[1], "RANDOM_TOKEN_SECRET");
    const userId = (decodedToken as jwt.JwtPayload).userId;

    return userId === id.toString()
}