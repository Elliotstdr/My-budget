import { DUser, User } from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { missInfoERROR, noUserERROR, randomERROR } from "../services/const.service";

export const findUser = async (req: Request, res: Response) => {
  const user: Partial<DUser> | null = await User.findOne({ _id: req.params.id }).select('-password')

  if(!user) {
    return res.status(401).json(noUserERROR);
  }

  res.status(200).json(user)
};

export const editUser = async (req: Request, res: Response) => {
  const user: Partial<DUser> | null = await User.findById(req.params.id).select('-password');

  if(!req.body.email && !req.body.username && !req.body.allowPropositions) {
    return res.status(401).json(missInfoERROR);
  }

  if (!user) {
    return res.status(401).json(noUserERROR);
  }

  const newUser: Partial<DUser> = {}
  if(req.body.allowPropositions) newUser.allowPropositions = req.body.allowPropositions
  if(req.body.email) newUser.email = req.body.email
  if(req.body.username) newUser.username = req.body.username

  // Vérifie que le nouveau mail n'est pas déjà utilisé
  if(newUser.email && newUser.email !== user.email) {
    const existingUser = await User.find({ email: req.body.email })
    if(existingUser) {
      return res.status(401).json({ message: "Un erreur est survenue, essayez un autre email" });
    }
  }

  if(newUser.allowPropositions) {
    newUser.allowPropositions = newUser.allowPropositions
  }

  User.findByIdAndUpdate(user, newUser, { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch(() => res.status(400).json(randomERROR))
};

export const editPassword = async (req: Request, res: Response) => {
  const user: DUser | null = await User.findById(req.params.id);

  if(!req.body.password || !req.body.oldPassword) {
    return res.status(401).json(missInfoERROR);
  }

  if (!user) {
    return res.status(401).json(noUserERROR);
  }
  
  // Vérifie que l'ancien mot de passe est le bon
  const isOldPassword = await bcrypt.compare(req.body.password, user.password)

  if(!isOldPassword) {
    return res.status(401).json({ message: "Ancien mot de passe incorrect" });
  }

  const newPassword = await bcrypt.hash(req.body.password, 10)
  User.findByIdAndUpdate(user, { password: newPassword }, { new: true })
    .then(() => res.status(200).json("Mot de passe mis à jour"))
    .catch(() => res.status(400).json(randomERROR))
}

export const removeUser = async (req: Request, res: Response) => {
  const userId = req.params.id

  const user: DUser | null = await User.findOne({ _id: userId })

  if(!user) {
    return res.status(401).json(noUserERROR);
  }
  
  User.deleteOne({ _id: userId })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch(() => res.status(400).json(randomERROR));
};