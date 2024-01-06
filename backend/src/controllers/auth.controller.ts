import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { loginERROR, randomERROR } from "../services/const.service";

export const signUp = async (req: Request, res: Response) => {
  await bcrypt
    .hash(req.body.password, 10)
    .then((hash: string) => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(() => res.status(401).json(randomERROR));
    })
    .catch(() => res.status(401).json(randomERROR));
};

export const login = async (req: Request, res: Response) => {

  const foundedUser = await User.findOne({ email: req.body.email })
  
  if (!foundedUser) return res.status(401).json(loginERROR);

  bcrypt
    .compare(req.body.password, foundedUser.password)
    .then((valid) => {
      if (!valid) return res.status(401).json(loginERROR);
      res.status(200).json({
        userId: foundedUser._id,
        token: jwt.sign({ userId: foundedUser._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "1h",
        }),
      });
    })
    .catch(() => res.status(500).json(randomERROR));
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if(!token) return res.status(401).json(loginERROR);

    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = (decodedToken as jwt.JwtPayload).userId;
  
    const foundedUser = await User.findById(userId)
    
    if (!foundedUser) {
      return res.status(401).json(loginERROR);
    }

    const newToken = jwt.sign({ userId: userId }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "1h",
    })
    res.status(200).json(newToken)
  } catch (error) {
    res.status(401).json({ error })
  }
};