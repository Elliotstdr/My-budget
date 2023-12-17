import { randomERROR } from "../services/const.service";
import { NextFunction, Request, Response } from "express";

export const timeout = async (req: Request, res: Response, next: NextFunction) => {
  res.setTimeout(5000, function(){
    return res.status(401).json(randomERROR);
  });

  next()
}