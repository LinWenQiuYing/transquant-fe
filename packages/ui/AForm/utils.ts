import React from "react";
import {
  generateInput,
  generateInputNumber,
  generateRadio,
  generateSelect,
} from "./com";
import { ComType, Json } from "./index";

export type ComOptions<T> = Json<T> & { formValues: Partial<T> };

export function getCom<T>(options: ComOptions<T>) {
  const { type } = options;

  const validate = (t: ComType) => t === type;

  const coms: Record<ComType, React.ReactNode> = {
    input: validate("input") && generateInput(options),
    radio: validate("radio") && generateRadio(options),
    "input-number": validate("input-number") && generateInputNumber(options),
    select: validate("select") && generateSelect(options),
  };

  return coms[type];
}

export default {};
