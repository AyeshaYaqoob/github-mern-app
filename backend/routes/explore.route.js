import express from "express";
import { explorePopularRepos } from "../controllers/explore.controller.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";

const router = express.Router();

// Route language parameter ke saath hona chahiye
router.get("/repos/:language", ensureAuthenticated, explorePopularRepos);

export default router;