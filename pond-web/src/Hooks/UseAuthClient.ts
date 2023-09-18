import { useQuery } from "@tanstack/react-query";
import PondClientSingleton from "../Clients/PondClientSingleton";

export const useStatus = () => {
    const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();
    const result = useQuery({
        queryKey: ['isAuthenticated'], queryFn: () => pondAuthClient.status()
    });
    return result;
}