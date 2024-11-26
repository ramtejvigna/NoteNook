import express from "express"
import { otpVerification, signUp } from "../controllers/authControllers";

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-otp', otpVerification)

export default router;