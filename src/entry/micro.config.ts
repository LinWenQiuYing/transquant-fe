import { paths, USER_TOKEN } from "@transquant/constants";
import { ls } from "@transquant/utils";
import { getToken } from "@transquant/utils/ajax";

export default {
  microApps: [
    {
      name: "transchaos",
      entry:
        process.env.NODE_ENV === "development"
          ? "//localhost:7000"
          : "/transchaos/index.html",
      container: "#container",
      activeRule: (location: Location) => {
        return location.pathname.includes("transchaos");
      },
      props: {
        transmatrixName: "TransMatrix",
        baseRoute: paths.transmatrix,
        getToken: (url: string) => {
          const ssToken = ls.getItem(USER_TOKEN);
          return getToken(ssToken, url);
        },
      },
    },
  ],
};
