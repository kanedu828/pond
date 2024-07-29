import { Button, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/api/UseAuthClient";
import { Collection } from "./Collection";
import { GuideModal } from "./GuideModal";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";

export const Navbar = () => {
  const { mutateAsync: logout } = useLogout();

  const [isCollectionOpen, { open: openCollection, close: closeCollection }] =
    useDisclosure(false);
  const [
    isLeaderboardOpen,
    { open: openLeaderboard, close: closeLeaderboard },
  ] = useDisclosure(false);
  const [isGuideOpen, { open: openGuide, close: closeGuide }] =
    useDisclosure(false);

  const [isProfileOpen, { open: openProfile, close: closeProfile }] =
    useDisclosure(false);

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Leaderboard isOpen={isLeaderboardOpen} close={closeLeaderboard} />
      <Collection isOpen={isCollectionOpen} close={closeCollection} />
      <GuideModal isOpen={isGuideOpen} close={closeGuide} />
      <Profile isOpen={isProfileOpen} close={closeProfile} />
      <Container p={15}>
        <Flex gap="xl" justify="center">
          <Button
            variant="subtle"
            color="pondTeal"
            size="xl"
            radius="md"
            onClick={openCollection}
          >
            Collection
          </Button>
          <Button
            variant="subtle"
            color="pondTeal"
            size="xl"
            radius="md"
            onClick={openLeaderboard}
          >
            Leaderboard
          </Button>
          <Button
            variant="subtle"
            color="pondTeal"
            size="xl"
            radius="md"
            onClick={openGuide}
          >
            Guide
          </Button>
          <Button
            variant="subtle"
            color="pondTeal"
            size="xl"
            radius="md"
            onClick={openProfile}
          >
            Profile
          </Button>
          <Button
            variant="subtle"
            color="pondTeal"
            size="xl"
            radius="md"
            onClick={onClickLogout}
          >
            Logout
          </Button>
        </Flex>
      </Container>
    </>
  );
};
