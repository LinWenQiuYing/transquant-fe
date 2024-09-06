import React from "react";
import stores from "../stores";
import usePagination from "./usePagination";

export const useStores = () => {
  const storesContext = React.createContext(stores);

  return React.useContext(storesContext);
};

export { default as useTableScroll } from "./useTableScroll";
export default {
  usePagination,
};
