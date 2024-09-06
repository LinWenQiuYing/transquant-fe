import React from "react";
import stores from "../stores";
import useMenu, { type MenuType } from "./useMenu";

export const useStores = () => {
  const storesContext = React.createContext(stores);

  return React.useContext(storesContext);
};

export { useMenu, type MenuType };

export default {};
