import { Router } from "express";
import {
  getAllDocuments,
  downloadDocument,
  getNewEvisortToken,
  getDownloadableDocuments,
} from "../../services";

export const evisortRouter = Router();

// import cors from "cors";
// import { bespokeWhitelistedDomainsOptions } from "../../constants";
// import { handlDomainWhitelistErrorMiddlware } from "../../services/middleware";

// evisortRouter.use(cors(bespokeWhitelistedDomainsOptions));

// evisortRouter.use(handlDomainWhitelistErrorMiddlware);

evisortRouter.get("/documents", getAllDocuments);

// id refers to the evisortId of the document
evisortRouter.get("/documents/download/:id", downloadDocument);

evisortRouter.get("/generate-token", getNewEvisortToken);

evisortRouter.get("/downloadable-documents", getDownloadableDocuments)
