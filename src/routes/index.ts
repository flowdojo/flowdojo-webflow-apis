import { Router } from "express";
import { evisortRouter } from "./evisort";

const router = Router()

router.use("/evisort", evisortRouter)

export default router