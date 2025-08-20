import express from 'express';
import { CoreContent, ListingContent } from '../controllers/ai.controller.js';
const route = express.Router();

route.post('/generate-content-list',ListingContent)
route.post('/generate-core-content',CoreContent) 
export default route;