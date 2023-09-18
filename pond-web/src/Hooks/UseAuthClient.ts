import { useMutation, useQuery } from "@tanstack/react-query";
import PondClientSingleton from "../Clients/PondClientSingleton";

const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();

export const useStatus = () => {
    const result = useQuery({
        queryKey: ['isAuthenticated'], queryFn: () => pondAuthClient.status()
    });
    return result;
}

export const useLogout = () => {
    const mutation = useMutation({
        mutationFn: () => pondAuthClient.logout()
    });
    return mutation;
}