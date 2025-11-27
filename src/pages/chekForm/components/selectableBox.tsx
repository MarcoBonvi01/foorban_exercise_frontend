import { Box, Typography } from "@mui/material";

interface SelectableBoxProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function SelectableBox({
  label,
  isActive,
  onClick,
}: SelectableBoxProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "auto",
        p: 2,
        border: 2,
        borderRadius: 1,
        borderColor: isActive ? "primary.main" : "grey.400",
        "&:hover": {
          color: "primary.main",
          borderColor: "primary.main",
          border: 2,
          opacity: 0.9,
          cursor: "pointer",
        },
      }}
      onClick={onClick}
    >
      <Typography>{label}</Typography>
    </Box>
  );
}
