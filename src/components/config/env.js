import { DEV_BACKEND_URL, PROD_BACKEND_URL } from "@env";
const devEnvironmentVariables = {
  DEV_BACKEND_URL,
};

const prodEnvironmentVariables = {
  PROD_BACKEND_URL,
};

// console.log(
//   "hdsfhsdl",
//   devEnvironmentVariables,
//   prodEnvironmentVariables,
//   __DEV__
// );

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;
