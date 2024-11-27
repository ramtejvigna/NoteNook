import express from "express"
import { otpVerification, signUp, signIn, verifySignIn } from "../controllers/authControllers";

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-otp', otpVerification);
router.post('/signin', signIn);
router.post('/verify-signin', verifySignIn);

export default router;