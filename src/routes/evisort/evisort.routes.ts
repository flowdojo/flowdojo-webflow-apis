import { Router } from "express";
import { getAllDocuments, downloadDocument, getNewEvisortToken } from "../../services";
import { evisortTokenMiddleware } from "../../services/middleware";

export const evisortRouter = Router()

evisortRouter.get("/documents", evisortTokenMiddleware, getAllDocuments)

// id refers to the evisortId of the document
evisortRouter.get("/documents/download/:id", evisortTokenMiddleware, downloadDocument)


evisortRouter.get("/generate-token", getNewEvisortToken)