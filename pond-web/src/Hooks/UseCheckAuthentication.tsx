import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStatus } from "./UseAuthClient";

export const useCheckAuthentication = () => {
    const { isLoading, data } = useStatus();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !data?.authenticated) {
            navigate('/login');
        }
        if (!isLoading && data?.authenticated) {
            navigate('/');
        }
    }, [data, isLoading])
    
}