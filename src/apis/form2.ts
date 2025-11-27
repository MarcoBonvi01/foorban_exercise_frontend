import FORMS from "../endpoints/endpoints";
import { BaseResponse } from "../interfaces";
import { CheckFormData } from "../pages/chekForm/CheckForm";
import apiBase from "./apiBase";

export const sendForm2 = async (
  values: CheckFormData
): Promise<BaseResponse> => {
  return apiBase
    .post<BaseResponse>(FORMS.F2.url, {
      name: values.name,
      age: values.age,
      is_married: values.is_married,
      birth_date: values.birth_date,
    })
    .then((response) => response.data);
};
