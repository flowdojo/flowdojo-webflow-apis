import { Router } from "express";
import { evisortRouter } from "./evisort";
import { relayRouter } from "./relay";

const router = Router()

router.use("/evisort", evisortRouter)

router.use("/relay", relayRouter)

export default router