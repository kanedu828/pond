import { Anchor, Container, Flex, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import PondClientSingleton from "../Clients/PondClientSingleton";

export const Login = () => {
    document.title = 'Pond'
    const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();
    const apiUrl = import.meta.env.VITE_POND_API_URL;

    return (
        <Container fluid>
            <Flex
                direction='column'
            >
            <Title>
                Hello World
            </Title>
            <Anchor href={`${apiUrl}/auth/google`}>
                Login
            </Anchor>
            </Flex>
            
        </Container>
    );

};