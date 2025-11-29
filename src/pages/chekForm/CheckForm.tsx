import { useState } from "react";
import { useMutation } from "react-query";
import { sendForm2 } from "../../apis/form2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Button, OutlinedInput, Paper, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckFromValues } from "../../forms/check-form";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { BaseResponse, ValidationError } from "../../interfaces";
import { SelectableBox } from "./components/selectableBox";
import { Title } from "./components/title";
import { ValidationErrorsBox } from "./components/validationErrorsBox";
import { ValidationSuccessBox } from "./components/validationSuccessBox";

export interface CheckFormData {
  name: string;
  age: number;
  is_married: boolean | null;
  birth_date: Date;
}

export function CheckForm() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [data, setData] = useState<BaseResponse | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckFormData>({
    // specify default values
    defaultValues: {
      name: undefined,
      age: undefined,
      is_married: null,
      birth_date: undefined,
    },
    resolver: zodResolver(CheckFromValues), // specify validation handler
    mode: "onChange", // that indicates when to trigger validation is executed.
    // onChange means that it will be executed when the input value changes
  });

  // used to retrive the value inserted by the user and used for validate step
  const name = watch("name");
  const age = watch("age");
  const isMarried = watch("is_married");
  const birthDate = watch("birth_date");

  // stuses in which the process could be
  const [status, setStatus] = useState<
    | "INITIAL"
    | "SEND_DATA"
    | "SENDING_DATA"
    | "DATA_SENDED"
    | "ERROR_SENDING_DATA"
  >("INITIAL");

  const isLastStep = () => {
    // verify if current step is the last step

    // if age are less than 18 and current step is 2 return true -> it is not necessary to request if is married
    if (age < 18 && currentStep === 2) return true;

    // if age are less than 18 and current step is 3 return true -> it is necessary to request if is married
    if (age >= 18 && currentStep === 3) return true;

    return false;
  };

  const { mutate: submitForm } = useMutation({
    mutationFn: (values: CheckFormData): Promise<BaseResponse> => {
      setStatus("SEND_DATA"); // update current state

      return sendForm2(values);
    },
    onSuccess: (response: BaseResponse) => {
      toast.success("Form submitted successfully!"); // show toast

      setStatus("DATA_SENDED"); // update current state

      reset(); // reset values inside the form

      setData(response);
    },
    onError: (error: { message: string }) => {
      console.info(error); // print errors

      toast.error(error.message); // show toast

      setStatus("ERROR_SENDING_DATA"); // update current state
    },
  });

  const isValidStep = () => {
    // for each step verify that the field is filled and pass the validation

    if (currentStep === 0) return name && !errors.name;

    if (currentStep === 1) return age && !errors.age;

    if (currentStep === 2 && age >= 18) return isMarried !== null;

    if ((currentStep === 2 && age < 18) || currentStep === 3) return birthDate;

    return false; // return false in any other case
  };

  const resetForm = () => {
    reset({
      name: undefined,
      age: undefined,
      is_married: null,
      birth_date: undefined,
    });

    setStatus("INITIAL");

    setCurrentStep(0);
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
          <Typography variant="h3">ERROR WHILE SENDING DATA</Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSubmit((values) => {
              setStatus("SENDING_DATA");
              submitForm(values);
            })}
          >
            RETRY
          </Button>
        </Stack>
      )}

      {(status === "SEND_DATA" || status === "SENDING_DATA") && (
        <Stack gap={2}>
          <Typography variant="h3">SENDING DATA</Typography>

          <Button onClick={resetForm}>UNDO</Button>
        </Stack>
      )}

      {status === "DATA_SENDED" && (
        <Stack gap={2}>
          {data?.success === false && (
            <ValidationErrorsBox
              errors={data.errors
                .map((error: ValidationError) =>
                  error.constraints ? Object.values(error.constraints) : []
                )
                .flat()}
              createNew={resetForm}
            />
          )}

          {data?.success === true && (
            <ValidationSuccessBox createNew={resetForm} />
          )}
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
                <Title text="What's your name?" />

                <OutlinedInput
                  fullWidth
                  placeholder="Insert here your name.."
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
                <Title text="How old are you?" />

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
                <Title text="Are you married?" />

                <Stack direction={"row"} spacing={2} alignItems="center">
                  <SelectableBox
                    label="Yes"
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
                <Title text="When were you born?" />

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
                  Back
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
                  Send
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
                  Next
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
