import {Router} from "express"
import { createFlowchart } from "../controllers/flowchart.controller";

const route=Router();

route.post('/create',createFlowchart);

export default route;