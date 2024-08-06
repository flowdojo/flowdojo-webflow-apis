import { Router } from "express";
import { sitesWithFareHarborScript } from "../../services/relay";



export const relayRouter = Router()


relayRouter.get("/sites-with-fareharbor-scripts", sitesWithFareHarborScript)