import { useQuery } from "@tanstack/react-query";
import PondClientSingleton from "../Clients/PondClientSingleton";

const pondAuthClient = PondClientSingleton.getInstance().getPondUserClient();

export const useGetUserFish = () => {
    const result = useQuery({
        queryKey: ['fish'], queryFn: async () => await pondAuthClient.getUserFish()
    });
    return result;
}
