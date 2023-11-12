import { useQuery } from "@tanstack/react-query";
import PondClientSingleton from "../clients/PondClientSingleton";

const pondUserClient = PondClientSingleton.getInstance().getPondUserClient();

export const useGetUserFish = () => {
    const result = useQuery({
        queryKey: ['fish'], queryFn: async () => await pondUserClient.getUserFish()
    });
    return result;
}

export const useGetUser = () => {
    const result = useQuery({
        queryKey: ['user'], queryFn: async () => await pondUserClient.getUser()
    });
    return result;
}