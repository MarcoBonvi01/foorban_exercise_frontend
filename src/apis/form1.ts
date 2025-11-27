import FORMS from "../endpoints/endpoints";
import { BaseResponse } from "../interfaces";
import apiBase from "./apiBase";

export const sendForm1 = async (name: String) => {
  return apiBase
    .post<BaseResponse>(FORMS.F1.url, {
      name,
    })
    .then((response) => response);
};
