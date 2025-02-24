import { Router } from "express";
import { evisortRouter } from "./evisort";
import { relayRouter } from "./relay";
import { britanniaRouter } from "./britannia";

const router = Router()

router.use("/evisort", evisortRouter)

router.use("/relay", relayRouter)

router.use("/britannia", britanniaRouter)

export default router