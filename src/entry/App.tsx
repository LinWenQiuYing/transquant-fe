import {
  ErrorBoundary,
  initGlobalAntd,
  initGlobalEcharts,
} from "@transquant/ui";
import "@transquant/ui/styles/index.less";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import MicorApp from "./registerApp";
import router, { Router } from "./RouteTable";

initGlobalAntd();
initGlobalEcharts();

const getRoute = (routers: Router[]) => {
  return (
    <>
      {routers.map((router) => (
        <Route
          path={router.path}
          key={router.path}
          element={<router.component />}
          index={router.index as any}
        >
          {router.children?.length && getRoute(router.children)}
        </Route>
      ))}
    </>
  );
};

const app = (
  <ErrorBoundary>
    <BrowserRouter>
      <MicorApp />
      <Routes>{getRoute(router)}</Routes>
    </BrowserRouter>
  </ErrorBoundary>
);

export default app;
