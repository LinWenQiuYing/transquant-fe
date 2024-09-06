import React from "react";
import stores from "../stores";

export const useStores = () => {
  const storesContext = React.createContext(stores);

  return React.useContext(storesContext);
};

export default {};
