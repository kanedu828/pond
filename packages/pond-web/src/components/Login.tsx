import {
  Anchor,
  Group,
  Modal,
  Stack,
  Title,
  Image,
  Text,
  BackgroundImage,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useStatus } from "../hooks/UseAuthClient";
import IdleWithFishAnimation from "../assets/images/LoginPageImage.png";
import LilyPadBackground from "../assets/images/LilyPadBackground.png";

import { IconBrandGoogleFilled } from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_POND_API_URL;

const loginButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white", // Google's button is typically white
  padding: "8px 16px",
  borderRadius: "4px",
  border: "1px solid #ddd", // Light border
  textDecoration: "none", // Remove underline from anchor
};

export const Login = () => {
  const { data } = useStatus();

  const [opened, { open, close }] = useDisclosure(data?.authenticated);

  useEffect(() => {
    if (!data?.authenticated) {
      open();
    } else {
      close();
    }
  }, [data]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      radius={0}
      fullScreen
      transitionProps={{ transition: "fade", duration: 1000 }}
      withCloseButton={false}
      padding={0}
    >
      <BackgroundImage src={LilyPadBackground}>
        <Stack justify="center" style={{ height: "100vh" }}>
          <Group justify="center">
            <Image w="auto" src={IdleWithFishAnimation} />
            <Stack justify="space-around" align="center">
              <Title order={1} c="pondTeal.9">
                Welcome to Pond!
              </Title>
              <Anchor href={`${API_URL}/auth/google`} style={loginButtonStyle}>
                <Group align="center">
                  <IconBrandGoogleFilled size={24} />
                  <Text size="md" style={{ color: "#757575" }}>
                    Sign in with Google
                  </Text>
                </Group>
              </Anchor>
            </Stack>
          </Group>
        </Stack>
      </BackgroundImage>
    </Modal>
  );
};
