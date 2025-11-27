import z from "zod";

export const CheckFromValues = z
  .object({
    name: z.string().min(1, "Name must be at least 1 characters long"),
    age: z
      .number("Age must be a number")
      .positive("Age must be a positive number"),
    is_married: z.boolean().nullable(),
    birth_date: z.date("Birth date must be a valid date"),
  })
  .refine(
    (data) => {
      if (data.age >= 18) return data.is_married !== null;

      return true;
    },
    {
      message: "If age is 18 or older, is_married must be specified",
    }
  );
