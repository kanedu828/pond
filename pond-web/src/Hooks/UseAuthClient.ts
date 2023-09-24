import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PondClientSingleton from "../Clients/PondClientSingleton";

const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();

export const useStatus = () => {
    const result = useQuery({
        queryKey: ['auth', 'status'], queryFn: async () => await pondAuthClient.status()
    });
    return result;
}

export const useLogout = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            return await pondAuthClient.logout();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
        },
    });
    return mutation;
}