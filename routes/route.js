import { loginUser ,registerUser} from "../controller/controller.js"
import {authMiddleware} from "../middlewear/middlewear.js"
import { Router } from "express"
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const router = Router()

router.post("/register",registerUser)
router.post("/login",loginUser)

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  })
})
