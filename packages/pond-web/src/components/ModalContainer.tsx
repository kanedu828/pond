import { LoadingOverlay, Modal, Stack, Title } from "@mantine/core";

interface ModalContainerProps {
  isOpen: boolean;
  close: any;
  isLoading: boolean;
  title: string;
  children: React.ReactNode;
}

export const ModalContainer = (props: ModalContainerProps) => {
  return (
    <Modal
      opened={props.isOpen}
      onClose={() => {
        props.close();
      }}
      radius={30}
      size={"70%"}
      transitionProps={{ transition: "fade", duration: 500 }}
    >
      <LoadingOverlay
        visible={props.isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack
        justify="center"
        align="center"
        gap="xl"
        style={{
          paddingBottom: "90px",
          paddingLeft: "1px",
          paddingRight: "1px",
        }}
      >
        <Title order={2} c="pondTeal.9">
          {props.title}
        </Title>
        {props.children}
      </Stack>
    </Modal>
  );
};
