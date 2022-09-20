import { Router, Request, Response } from "express";
import prisma from "./prisma";
const expressHelper = Router();

expressHelper
  .route("/update-user")
  .post(async (req: Request, res: Response) => {
    try {
      const player = await prisma.updatePlayer(req.body, {
        uuid: req.body.uuid,
      });
      res.json({ data: player });
    } catch {}
  });
  
export default expressHelper;
