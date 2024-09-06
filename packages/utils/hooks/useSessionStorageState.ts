import { isBrower } from "../is";
import createUseStorageState from "./createUseStorageState";

const useSessionStorageState = createUseStorageState(() =>
  isBrower ? sessionStorage : undefined
);

export default useSessionStorageState;
