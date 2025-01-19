import express from "express";
import { allDestinations, singleDestination } from "../controllers/destination.controllers.js";


const router = express.Router();

router.get('/destinations', allDestinations);
router.get('/destination/:id', singleDestination)

export default  router;