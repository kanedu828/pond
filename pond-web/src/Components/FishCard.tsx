import { Card, Group, Image, SimpleGrid, Text } from "@mantine/core"

interface FishCardProps {
    name: string;
    id: number;
    description: string;
    largestCaught: number;
    amountCaught: number;
}

export const FishCard = (props: FishCardProps) => {
    return (
        <Card style={{borderTop: '1rem solid blue', borderTopRightRadius: '1rem', borderTopLeftRadius: '1rem'}} withBorder padding='md' w='300px' h='520px'>
            <Card.Section>
                <Image h='300px' w='300px' src='https://dummyimage.com/500x500/000/ffffff.png'/>
            </Card.Section>
            
            <SimpleGrid cols={1}>
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Fish Name</Text>
                    <Text size="sm" c="dimmed">
                        #1002
                    </Text>
                </Group>
                <Text size="sm" c="dimmed" h={75}>
                    Description about the fish. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                </Text>
                <Group justify="space-between" mt="md" mb="xs" align='center' gap='xs'>
                    <Text size="xs" c="dimmed">
                        Largest Caught: 522cm
                    </Text>
                    <Text size="xs" c="dimmed">
                        Amount Caught: 343123
                    </Text>
                </Group>
            </SimpleGrid>
        </Card>
    )
}