import { randomERROR } from "../services/const.service";

export const timeout = async (req: any, res: any, next: any) => {
  res.setTimeout(5000, function(){
    return res.status(401).json(randomERROR);
  });

  next()
}