import { Button, Modal, Stack, Title, TextInput } from "@mantine/core";
import { useState } from "react";
import { useUpdateUsername } from "../hooks/api/UseUserClient";

interface UpdateUsernameModalProps {
  isOpen: boolean;
  close: any;
}

export const UpdateUsernameModal = (props: UpdateUsernameModalProps) => {
  const { mutateAsync: updateUsername } = useUpdateUsername();

  const [usernameInput, setUsernameInput] = useState<string>("");

  const [inputError, setInputError] = useState<string>("");

  const onClick = async () => {
    const updateUsernameResponse = await updateUsername(usernameInput);
    if (!updateUsernameResponse.updated) {
      setInputError(updateUsernameResponse.error ?? "Unknown Error");
    } else {
      setInputError("");
      props.close();
    }
  };

  return (
    <Modal
      opened={props.isOpen}
      onClose={() => {
        props.close();
      }}
      radius={30}
      size="60rem"
      transitionProps={{ transition: "fade", duration: 500 }}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Stack align="center" justify="center">
        <Title>Choose a name!</Title>

        <TextInput
          label="Your Username"
          onChange={(event: any) => setUsernameInput(event.currentTarget.value)}
          error={inputError}
        />
        <Button
          color="pondTeal"
          size="md"
          radius="md"
          onClick={onClick}
          style={{ marginBottom: "20px" }}
        >
          Use This Name!
        </Button>
      </Stack>
    </Modal>
  );
};
