import { Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useLogout } from "../hooks/UseAuthClient";
import { Collection } from "./Collection";
import { Leaderboard } from "./Leaderboard";

export const Navbar = () => {

    const logout = useLogout();

    const [isCollectionOpen, { open: openCollection, close: closeCollection }] = useDisclosure(false);
    const [isLeaderboardOpen, { open: openLeaderboard, close: closeLeaderboard }] = useDisclosure(false);

    const onClickLogout = async () => {
        logout.mutate();
    }

    return (
        <>
            <Leaderboard isOpen={isLeaderboardOpen} close={closeLeaderboard}/>
            <Collection isOpen={isCollectionOpen} close={closeCollection}/>
            <Container p={15}>
                <Flex gap='xl' justify='center'>
                    <Button color='teal' size='md' radius='xl' onClick={openCollection}>Collection</Button>
                    <Button color='teal' size='md' radius='xl' onClick={openLeaderboard}>Leaderboard</Button>
                    <Button color='teal' size='md' radius='xl' onClick={onClickLogout}>
                        Logout
                    </Button>
                </Flex>
            </Container>
        </>
        
    );
}