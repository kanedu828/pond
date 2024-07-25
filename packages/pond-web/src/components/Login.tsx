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
  Alert,
} from "@mantine/core";
import {
  useGuestLogin,
  useLogin,
  useRegister,
  useSetAuthCookie,
  useStatus,
} from "../hooks/api/UseAuthClient";
import IdleWithFishAnimation from "../assets/images/LoginPageImage.png";
import LilyPadBackground from "../assets/images/LilyPadBackground.png";
import { IconBrandGoogleFilled, IconInfoCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LoginResponse,
  RegisterResponse,
} from "../../../shared/types/AuthTypes";

const API_URL = import.meta.env.VITE_POND_API_URL;

export const Login = () => {
  useSetAuthCookie();
  const { mutateAsync: guestLogin } = useGuestLogin();
  const { mutateAsync: login } = useLogin();
  const { mutateAsync: register } = useRegister();

  const navigate = useNavigate();
  const { data: status } = useStatus();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (status?.authenticated) {
      navigate("/");
    }
  }, [status, navigate]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res: RegisterResponse = await register({ username, password });
    if (!res.success) {
      setError(res.message);
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    const res: LoginResponse = await login({ username, password });
    if (res.incorrectCredentials) {
      setError(res.message);
    }
  };

  return (
    <BackgroundImage src={LilyPadBackground}>
      <Stack justify="center" style={{ height: "100vh" }}>
        <Group justify="center">
          <Image w="auto" src={IdleWithFishAnimation} />
          <Stack justify="space-around" align="center">
            <Title order={1} c="pondTeal.9">
              Welcome to Pond!
            </Title>

            <Box w="50%">
              {error !== "" && (
                <Alert
                  variant="light"
                  color="red"
                  radius="lg"
                  title={error}
                  mb="md"
                  icon={<IconInfoCircle />}
                  styles={(theme) => ({
                    wrapper: {
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "unset", // Remove minimum height if any
                    },
                    body: {
                      textAlign: "center",
                      padding: 0, // Remove padding from body
                    },
                    title: {
                      textAlign: "center",
                      width: "100%",
                      margin: 0, // Remove margin from title
                      padding: 0, // Add some padding to title for spacing
                    },
                    icon: {
                      marginRight: theme.spacing.sm, // Add some space between icon and text
                      marginTop: 0, // Ensure icon is vertically centered
                    },
                  })}
                />
              )}

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
              {!isLoginMode && (
                <PasswordInput
                  label={
                    <Text fw={700} c="pondTeal.9">
                      Confirm Password
                    </Text>
                  }
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  mb="md"
                  radius="md"
                />
              )}
              <Group grow mb="md">
                <Button
                  color="pondTeal.9"
                  radius="md"
                  onClick={isLoginMode ? handleLogin : handleRegister}
                >
                  {isLoginMode ? "Log In" : "Register"}
                </Button>
              </Group>
              <Text ta="center" size="sm">
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  variant="subtle"
                  color="pondTeal.9"
                  size="compact-sm"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                >
                  {isLoginMode ? "Register" : "Log In"}
                </Button>
              </Text>
            </Box>
            <Divider
              w="50%"
              my="md"
              labelPosition="center"
              label="or login with"
            />

            <Group mb="lg">
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
