import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "../../../../shared/types/AuthTypes";
import PondClientSingleton from "../../clients/PondClientSingleton";

const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();

export const useStatus = () => {
  const result = useQuery({
    queryKey: ["auth", "status"],
    queryFn: async () => await pondAuthClient.status(),
  });
  return result;
};

export const useSetAuthCookie = () => {
  const result = useQuery({
    queryKey: ["auth", "setAuthCookie"],
    queryFn: async () => await pondAuthClient.setAuthCookie(),
  });
  return result;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      return await pondAuthClient.logout();
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["auth", "status"] });
    },
  });
  return mutation;
};

export const useGuestLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await pondAuthClient.guestLogin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      return await pondAuthClient.login(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: RegisterRequest) => {
      return await pondAuthClient.register(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};