import { Box } from "@chakra-ui/react";
import React from "react";

export type WrapperVariant = "small" | "regular";

interface Props {
  variant?: "small" | "regular";
  children: React.ReactNode;
}

function Wrapper({ children, variant }: Props) {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
}

export default Wrapper;
