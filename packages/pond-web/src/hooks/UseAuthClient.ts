import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PondClientSingleton from '../clients/PondClientSingleton';

const pondAuthClient = PondClientSingleton.getInstance().getPondAuthClient();

export const useStatus = () => {
	const result = useQuery({
		queryKey: ['auth', 'status'],
		queryFn: async () => await pondAuthClient.status(),
	});
	return result;
};

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
};

export const useGuestLogin = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async () => {
			return await pondAuthClient.guestLogin();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['auth', 'status'] });
		},
	});
	return mutation;
};