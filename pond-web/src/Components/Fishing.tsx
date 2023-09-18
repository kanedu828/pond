import { Button, Container } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../Hooks/UseAuthClient";
import { useCheckAuthentication } from "../Hooks/UseCheckAuthentication";

export const Fishing = () => {

    const logout = useLogout();

    const navigate = useNavigate();

    useCheckAuthentication();


    return (
        <Container>
            <Button onClick={async () => {
                await logout.mutate();
                navigate('/login')
            }}>
                Logout
            </Button>
        </Container>
    )
};