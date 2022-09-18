import { Router, Request, Response } from "express";

const expressHelper = Router();

expressHelper.route("/").get((req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

export default expressHelper;
