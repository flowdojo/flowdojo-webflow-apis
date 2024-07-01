const { getAllEvisortDocuments, getEvisortDocumentDownloadLink } = require("../services/evisort.services");

const { Router } = require("express");


const evisortRouter = Router()

evisortRouter.get("/documents", getAllEvisortDocuments);

evisortRouter.get("/documents/:id/download", getEvisortDocumentDownloadLink)

module.exports = {
  evisortRouter
}