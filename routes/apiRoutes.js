import express from "express";
import { checkBrandMention } from "../controllers/brandMentionController.js";

const router = express.Router();

router.post('/check', checkBrandMention);

export default router;
