import {Router} from "express"
import { createFlowchart } from "../controllers/flowchart.controller.js";

const route=Router();

route.post('/create',createFlowchart);

export default route;