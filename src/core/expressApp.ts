import express from "express";
import cors from "cors";
import { urlencoded, json } from "body-parser";
import expressHelper from "../logic/expressHelper";

const expressApp = express();

expressApp.use(cors());

expressApp.use(json());

expressApp.use("/", expressHelper);

export default expressApp;
