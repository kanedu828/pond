import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PondClientSingleton from "../clients/PondClientSingleton";

const pondUserClient = PondClientSingleton.getInstance().getPondUserClient();

export const useGetUserFish = () => {
  const result = useQuery({
    queryKey: ["fish"],
    queryFn: async () => await pondUserClient.getUserFish(),
  });
  return result;
};

export const useGetUser = () => {
  const result = useQuery({
    queryKey: ["user"],
    queryFn: async () => await pondUserClient.getUser(),
  });
  return result;
};

export const useGetTopHundredUsersByExp = () => {
  const result = useQuery({
    queryKey: ["topHundredUsersByExp"],
    queryFn: async () => await pondUserClient.getTopHundredUsersByExp(),
  });
  return result;
};

export const useUpdateUsername = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newUsername: string) => {
      return await pondUserClient.updateUsername(newUsername);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  return mutation;
};
