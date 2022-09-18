import express from "express";
import cors from "cors";
import expressHelper from "../logic/expressHelper";

const expressApp = express();

expressApp.use(cors());

expressApp.use("/", expressHelper);

export default expressApp;
