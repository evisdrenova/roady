/** @type {import('next').NextConfig} */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./roady.config.js");

const nextConfig = {
  env: {
    AUTH_MODE: config.authMode,
  },
};

export default nextConfig;
