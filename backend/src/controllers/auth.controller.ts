import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { randomERROR } from "../services/const.service";

export const signUp = async (req: Request, res: Response) => {
  const foundedUser = await User.findOne({ email: req.body.email })

  if(foundedUser) return res.status(401).json({ message: "Email non disponible" })

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
  
  if (!foundedUser) {
    return res
      .status(401)
      .json({ message: "Paire login/mot de passe incorrecte" });
  }

  bcrypt
    .compare(req.body.password, foundedUser.password)
    .then((valid: any) => {
      if (!valid) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      res.status(200).json({
        userId: foundedUser._id,
        token: jwt.sign({ userId: foundedUser._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        }),
      });
    })
    .catch(() => res.status(500).json(randomERROR));
};