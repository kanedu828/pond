import { Button, Modal, Image, Stack, Title, Text, Group } from "@mantine/core";
import { FishInstance } from "../../../shared/types/types";
import { getFishImagePath, getFishImageUnknownPath } from "../util/util";

interface CatchFishModalProps {
  fishInstance: FishInstance | null;
  isOpen: boolean;
  close: any;
}

export const CatchFishModal = (props: CatchFishModalProps) => {
  return (
    <Modal
      opened={props.isOpen}
      onClose={() => {
        props.close();
      }}
      radius={30}
      size="60rem"
      transitionProps={{ transition: "fade", duration: 500 }}
    >
      <Stack align="center" justify="center">
        <Title order={3} c="pondTeal.9">
          You caught a {props.fishInstance?.fish.rarity} fish!
        </Title>
        <Image
          h="300px"
          w="300px"
          alt={getFishImageUnknownPath()}
          src={getFishImagePath(
            props.fishInstance?.fish.name ?? "",
            props.fishInstance?.fish.id ?? -1,
          )}
        />
        <Group justify="space-between">
          <Title order={4} c="pondTeal.9">
            {props.fishInstance?.fish.name}
          </Title>
          <Text size="sm" c="dimmed">
            #{props.fishInstance?.fish.id}
          </Text>
        </Group>

        <Text c="pondTeal.8" style={{ width: "50%" }}>
          {props.fishInstance?.fish.description}
        </Text>
        <Text c="dimmed">Length: {props.fishInstance?.length}cm</Text>
        <Button
          color="pondTeal"
          size="md"
          radius="md"
          onClick={props.close}
          style={{ marginBottom: "20px" }}
        >
          Close
        </Button>
      </Stack>
    </Modal>
  );
};
