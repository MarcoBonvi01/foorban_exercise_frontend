import { Typography } from "@mui/material";

interface TitleProps {
  text: string;
}

export function Title({ text }: TitleProps) {
  return (
    <Typography variant="h5" textAlign={"center"}>
      {text}
    </Typography>
  );
}
