import React from "react";
import stores from "../stores";
import useDataSource from "./useDataSource";

export const useStores = () => {
  const storesContext = React.createContext(stores);

  return React.useContext(storesContext);
};

export { useDataSource };
