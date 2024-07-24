import { LoadingOverlay } from "@mantine/core";

export const LoadingPage = () => {
  return (
    <LoadingOverlay
      visible={true}
      zIndex={1000}
      loaderProps={{ color: "pondTeal.9", size: "xl" }}
    />
  );
};
