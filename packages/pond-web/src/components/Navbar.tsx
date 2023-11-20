import { Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLogout } from "../hooks/UseAuthClient";
import { Collection } from "./Collection";
import { Leaderboard } from "./Leaderboard";

export const Navbar = () => {

    const { mutateAsync: logout } = useLogout();

    const [isCollectionOpen, { open: openCollection, close: closeCollection }] = useDisclosure(false);
    const [isLeaderboardOpen, { open: openLeaderboard, close: closeLeaderboard }] = useDisclosure(false);

    const onClickLogout = async () => {
        await logout();
    };

    return (
        <>
            <Leaderboard isOpen={isLeaderboardOpen} close={closeLeaderboard}/>
            <Collection isOpen={isCollectionOpen} close={closeCollection}/>
            <Container p={15}>
                <Flex gap='xl' justify='center'>
                    <Button variant="subtle" color='pondTeal' size='xl' radius='md' onClick={openCollection}>Collection</Button>
                    <Button variant="subtle" color='pondTeal' size='xl' radius='md' onClick={openLeaderboard}>Leaderboard</Button>
                    <Button variant="subtle" color='pondTeal' size='xl' radius='md' onClick={onClickLogout}>
                        Logout
                    </Button>
                </Flex>
            </Container>
        </>
        
    );
}