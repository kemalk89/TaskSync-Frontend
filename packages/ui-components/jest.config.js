// Just importing the config from jsconfig workspace and exporting it
import sharedConfig from "@app/jest-config";
const config = {
  ...sharedConfig,
};
export default config;
