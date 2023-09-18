import { useNavigate } from "react-router-dom";
import { useStatus } from "./UseAuthClient";

export const useCheckAuthentication = () => {
    const { data } = useStatus();
    const navigate = useNavigate();

    if (!data?.authenticated) {
        navigate('/login');
    }
}