import { useState } from "react";
import { useMutation } from "react-query";
import { sendForm2 } from "../../apis/form2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckFromValues } from "../../forms/check-form";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { BaseResponse } from "../../interfaces";
import { SelectableBox } from "./components/selectableBox";
import { Title } from "./components/title";

export interface CheckFormData {
  name: string;
  age: number;
  is_married: boolean | null;
  birth_date: Date;
}

export function CheckForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [data, setData] = useState<{ success: boolean } | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckFormData>({
    defaultValues: {
      name: undefined,
      age: undefined,
      is_married: null,
      birth_date: undefined,
    },
    resolver: zodResolver(CheckFromValues),
    mode: "onChange",
  });

  const name = watch("name");
  const age = watch("age");
  const isMarried = watch("is_married");
  const birthDate = watch("birth_date");

  const [status, setStatus] = useState<
    | "INITIAL"
    | "SEND_DATA"
    | "SENDING_DATA"
    | "DATA_SENDED"
    | "ERROR_SENDING_DATA"
  >("INITIAL");

  const isLastStep = () => {
    if (age < 18 && currentStep === 2) return true;

    if (age >= 18 && currentStep === 3) return true;

    return false;
  };

  const { mutate: submitForm } = useMutation({
    mutationFn: (values: CheckFormData): Promise<BaseResponse> => {
      setStatus("SEND_DATA");

      return sendForm2(values);
    },
    onSuccess: (response: BaseResponse) => {
      toast.success("Form submitted successfully!");

      setStatus("DATA_SENDED");

      reset();

      setData(response);
    },
    onError: (error: { message: string }) => {
      console.log(error);

      toast.error(error.message);

      setStatus("ERROR_SENDING_DATA");
    },
  });

  const isValidStep = () => {
    if (currentStep === 0) return name && !errors.name;

    if (currentStep === 1) return age && !errors.age;

    if (currentStep === 2 && age >= 18) return isMarried !== null;

    if ((currentStep === 2 && age < 18) || currentStep === 3) return birthDate;

    return true;
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: "20px",
        width: "600px",
        margin: "auto",
        borderRadius: "10px",
      }}
    >
      {status === "ERROR_SENDING_DATA" && (
        <Stack gap={2}>
          <Typography variant="h3">ERRORE INVIO DATI</Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setCurrentStep(0);
              reset();
              setStatus("INITIAL");
            }}
          >
            RIPROVA
          </Button>
        </Stack>
      )}

      {(status === "SEND_DATA" || status === "SENDING_DATA") && (
        <Stack gap={2}>
          <Typography variant="h3">INVIO IN CORSO</Typography>

          <Button onClick={() => setStatus("INITIAL")}>ANNULLA</Button>
        </Stack>
      )}

      {status === "DATA_SENDED" && (
        <Stack gap={2}>
          <Typography variant="h3">
            {data?.success === true && "DATI INVIATI VALIDI"}
            {data?.success === false && "DATI INVIATI NON VALIDI"}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setCurrentStep(0);
              reset();
              setStatus("INITIAL");
            }}
          >
            INVIA UN ALTRO FORM
          </Button>
        </Stack>
      )}

      {status === "INITIAL" && (
        <form
          onSubmit={handleSubmit((data) => {
            setStatus("SENDING_DATA");

            submitForm(data);
          })}
        >
          <Stack gap={2}>
            {currentStep === 0 && (
              <>
                <Title text="Qual'è il tuo nome?" />

                <OutlinedInput
                  fullWidth
                  placeholder="Inserisci qui il tuo nome.."
                  {...register("name")}
                  error={!!errors.name}
                />

                {errors.name && (
                  <Typography color="error" variant="caption">
                    {errors.name.message}
                  </Typography>
                )}
              </>
            )}

            {currentStep === 1 && (
              <>
                <Title text="Quanti anni hai?" />

                <OutlinedInput
                  type="number"
                  fullWidth
                  placeholder="Inserisci qui la tua età.."
                  {...register("age", {
                    valueAsNumber: true,
                  })}
                  error={!!errors.age}
                />

                {errors.age && (
                  <Typography color="error" variant="caption">
                    {errors.age.message}
                  </Typography>
                )}
              </>
            )}

            {currentStep === 2 && age >= 18 && (
              <>
                <Title text="Sei sposato?" />

                <Stack direction={"row"} spacing={2} alignItems="center">
                  <SelectableBox
                    label="Si"
                    isActive={isMarried === true}
                    onClick={() => setValue("is_married", true)}
                  />

                  <SelectableBox
                    label="No"
                    isActive={isMarried === false}
                    onClick={() => setValue("is_married", false)}
                  />
                </Stack>
              </>
            )}

            {((currentStep === 2 && age < 18) || currentStep === 3) && (
              <>
                <Title text="Quando sei nato?" />

                <DatePicker
                  value={birthDate ? dayjs(birthDate) : null}
                  format="DD-MM-YYYY"
                  onChange={(value: PickerValue) => {
                    if (value) setValue("birth_date", value.toDate());
                  }}
                />
              </>
            )}

            <Stack direction={"row"} spacing={2} justifyContent="space-between">
              {currentStep > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  sx={{
                    p: 1.5,
                    flex: 0.5,
                  }}
                  type="button"
                >
                  Indietro
                </Button>
              )}

              {isLastStep() ? (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  disabled={!isValidStep()}
                  sx={{ p: 1.5, flex: 1 }}
                  type="submit"
                >
                  Invia
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  disabled={!isValidStep()}
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  sx={{ p: 1.5, flex: 1 }}
                  type="button"
                >
                  Avanti
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
