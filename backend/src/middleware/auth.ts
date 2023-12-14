import jwt from "jsonwebtoken";
import { missInfoERROR, randomERROR } from "../services/const.service";
import { Request, Response } from "express";
import { DUser, User } from "../models/user.model";

export const auth = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = (decodedToken as jwt.JwtPayload).userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

/**
 * Vérifie que l'id contenu dans le token et celui en param de la requête sont les mêmes
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const authID = (req: Request, res: Response, next: any) => {
  if(!req.headers.authorization || !req.params.id) return res.status(401).json(missInfoERROR);
  const decodedToken = jwt.verify(req.headers.authorization?.split(" ")[1], "RANDOM_TOKEN_SECRET");
  const userId = (decodedToken as jwt.JwtPayload).userId;

  if(userId === req.params.id.toString()) next()
  else res.status(401).json({message: "Accès non autorisé"})
}

/**
 * Vérifie que l'id contenu dans le token et celui en body de la requête sont les mêmes
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const authBodyID = (req: Request, res: Response, next: any) => {
  if(!req.headers.authorization || !req.body.user) return res.status(401).json(missInfoERROR);
  const decodedToken = jwt.verify(req.headers.authorization?.split(" ")[1], "RANDOM_TOKEN_SECRET");
  const userId = (decodedToken as jwt.JwtPayload).userId;

  if(userId === req.body.user.toString()) next()
  else res.status(401).json({message: "Accès non autorisé"})
}

/**
 * Retrouve l'utilisateur à partir du token
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const findTokenUser = async (req: Request, res: Response, next: any) => {
  if(!req.headers.authorization) return res.status(401).json(missInfoERROR);
  const decodedToken = jwt.verify(req.headers.authorization?.split(" ")[1], "RANDOM_TOKEN_SECRET");
  const userId = (decodedToken as jwt.JwtPayload).userId;

  const user: DUser | null = await User.findOne({ _id: userId })

  if(user) {
    req.body.user = user
    next()
  }
  else res.status(401).json({message: "Accès non autorisé"})
}