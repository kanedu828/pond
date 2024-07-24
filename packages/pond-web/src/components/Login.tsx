import {
  Group,
  Stack,
  Title,
  Image,
  Text,
  BackgroundImage,
  Button,
  TextInput,
  PasswordInput,
  Box,
  Divider,
} from "@mantine/core";
import {
  useGuestLogin,
  useSetAuthCookie,
  useStatus,
} from "../hooks/api/UseAuthClient";
import IdleWithFishAnimation from "../assets/images/LoginPageImage.png";
import LilyPadBackground from "../assets/images/LilyPadBackground.png";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_POND_API_URL;

export const Login = () => {
  useSetAuthCookie();
  const { mutateAsync: guestLogin } = useGuestLogin();
  const navigate = useNavigate();
  const { data: status } = useStatus();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status?.authenticated) {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <BackgroundImage src={LilyPadBackground}>
      <Stack justify="center" style={{ height: "100vh" }}>
        <Group justify="center">
          <Image w="auto" src={IdleWithFishAnimation} />
          <Stack justify="space-around" align="center">
            <Title order={1} c="pondTeal.9">
              Welcome to Pond!
            </Title>

            <Box component="form" onSubmit={() => {}} w="45%">
              <TextInput
                label={
                  <Text fw={700} c="pondTeal.9">
                    Username
                  </Text>
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                mb="sm"
                radius="md"
              />
              <PasswordInput
                label={
                  <Text fw={700} c="pondTeal.9">
                    Password
                  </Text>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mb="md"
                radius="md"
              />
              <Group grow mb="md">
                <Button type="submit" color="pondTeal.9" radius="md">
                  Log In
                </Button>
                <Button
                  type="button"
                  color="pondTeal.9"
                  variant="outline"
                  radius="md"
                  onClick={() => {
                    /* Handle registration */
                  }}
                >
                  Register
                </Button>
              </Group>
            </Box>
            <Divider
              w="45%"
              my="md"
              labelPosition="center"
              label="or login with"
            />

            <Group mb='lg'>
              <Button
                component="a"
                color="pondTeal.9"
                href={`${API_URL}/auth/google`}
              >
                <Group align="center">
                  <IconBrandGoogleFilled size={24} />
                  Sign in with Google
                </Group>
              </Button>

              <Button
                color="pondTeal.9"
                onClick={async () => {
                  await guestLogin();
                }}
              >
                Sign in as a Guest
              </Button>
            </Group>
          </Stack>
        </Group>
      </Stack>
    </BackgroundImage>
  );
};
