import { isBrower } from "../is";
import createUseStorageState from "./createUseStorageState";

const useLocalStorageState = createUseStorageState(() =>
  isBrower ? localStorage : undefined
);

export default useLocalStorageState;
