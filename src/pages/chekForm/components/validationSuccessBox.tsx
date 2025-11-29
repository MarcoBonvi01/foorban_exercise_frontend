import { Box, Button, Stack, Typography } from "@mui/material";
import Lottie from "lottie-react";
import successLottie from "../../../lotties/success.json";

interface SelectableBoxProps {
  createNew: () => void;
}

export function ValidationSuccessBox({ createNew }: SelectableBoxProps) {
  return (
    <Stack gap={3}>
      <Stack direction="column" alignItems="center" justifyContent="center">
        <Lottie
          animationData={successLottie}
          loop={true}
          style={{ width: 150, height: 100 }}
        />

        <Box textAlign="center">
          <Typography variant="h5" fontWeight="600">
            Validation Success
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            All fields are correct and produces validations success
          </Typography>
        </Box>
      </Stack>

      <Button
        onClick={createNew}
        variant="outlined"
        fullWidth
        color="primary"
        sx={{ p: 1.5 }}
      >
        CREATE NEW
      </Button>
    </Stack>
  );
}
