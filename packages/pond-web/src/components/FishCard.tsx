import { Card, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { Fish } from "../../../shared/types/types";
import { getFishImagePath, getFishImageUnknownPath } from "../util/util";

interface FishCardProps {
  fish: Fish;
  largestCaught: number;
  amountCaught: number;
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "common":
      return "#7ff59f"; // Green
      break;
    case "rare":
      return "#7fd5f5"; // Blue
      break;
    case "epic":
      return "#b67ff5"; // Purple
      break;
    case "legendary":
      return "#f7e968"; // Yellow
      break;
    default:
      return "#787878"; // Gray
      break;
  }
}

export const FishCard = (props: FishCardProps) => {
  return (
    <Card
      style={{
        borderTop: `1rem solid ${getRarityColor(props.fish.rarity)}`,
        borderTopRightRadius: "1rem",
        borderTopLeftRadius: "1rem",
      }}
      withBorder
      padding="md"
      w="300px"
      h="520px"
    >
      <Card.Section>
        <Image
          h="300px"
          w="300px"
          alt={getFishImageUnknownPath()}
          src={getFishImagePath(props.fish.name, props.fish.id)}
        />
      </Card.Section>

      <SimpleGrid cols={1}>
        <Group justify="space-between" mt="md">
          <Text fw={500}>{props.fish.name}</Text>
          <Text size="sm" c="dimmed">
            #{props.fish.id}
          </Text>
        </Group>
        <Text size="sm" c="dimmed" h={75}>
          {props.fish.description}
        </Text>
        <Group justify="space-between" mt="md" mb="xs" align="center" gap="xs">
          <Text size="xs" c="dimmed">
            Largest Caught: {props.largestCaught}cm
          </Text>
          <Text size="xs" c="dimmed">
            Amount Caught: {props.amountCaught}
          </Text>
        </Group>
      </SimpleGrid>
    </Card>
  );
};
