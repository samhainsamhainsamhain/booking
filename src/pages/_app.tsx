import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import "../styles/Calendar.css";
import "../styles/Spinner.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default api.withTRPC(MyApp);
