import { Box, Button, Stack, Typography } from "@mui/material";
import Lottie from "lottie-react";
import errorLottie from "../../../lotties/error.json";

interface SelectableBoxProps {
  errors: string[];
  createNew: () => void;
}

export function ValidationErrorsBox({ errors, createNew }: SelectableBoxProps) {
  return (
    <Stack gap={3}>
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Lottie
          animationData={errorLottie}
          loop={true}
          style={{ width: 150, height: 100 }}
        />

        <Box textAlign="center">
          <Typography variant="h5" fontWeight="600">
            Validation Failed
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Some fields are not correct and produces validations errors
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1} sx={{ width: "100%" }}>
        {errors.map((error, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: "grey.200",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        ))}
      </Stack>

      <Button
        onClick={createNew}
        variant="outlined"
        fullWidth
        color="primary"
        sx={{ p: 1.5 }}
      >
        RETRY
      </Button>
    </Stack>
  );
}
