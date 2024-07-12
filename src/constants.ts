import { CorsOptions } from "cors";

import dotenv from "dotenv";

dotenv.config();

export const bespokeWhitelistedDomainsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.BESPOKE_ALLOWED_ORIGINS?.split(" ");

    if (allowedOrigins?.indexOf(origin!) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Request from unauthorized domain"));
    }
  },
};
