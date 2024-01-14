'use client';

import AuthService, {
  LoginRequest,
  RegisterRequest,
} from '@/services/authService';
import { useAuthState } from '@/store/authStore';
import axiosResponseMessage from '@/lib/axiosResponseMessage';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();
  const { setUser, setToken, user, token, clearAuth } = useAuthState();

  const signUpMutation = useMutation({
    mutationFn: async (user: RegisterRequest) => {
      const response = await AuthService.register(user);
      // console.log(response.data);
      return response.data;
    },
    onError: (error: AxiosError) => {
      toast.error(axiosResponseMessage(error));
      console.log(axiosResponseMessage(error));
    },
    onSuccess: (data) => {
      const { status, data: responseData } = data;
      // console.log(responseData);
      toast.success(status);
      // setUser(responseData.user);
      // setToken(responseData.jwtToken);
      router.push('/login');
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (user: LoginRequest) => {
      const response = await AuthService.login(user);
      return response?.data;
    },
    onError: (error: AxiosError) => {
      toast.error(axiosResponseMessage(error));
      console.log(axiosResponseMessage(error));
    },
    onSuccess: (data) => {
      const { status, data: responseData } = data;
      // console.log(responseData);
      toast.success(status);
      setUser(responseData.user);
      setToken(responseData.jwtToken);
      router.push('/workspace/1');
    },
  });

  const logOut = () => {
    clearAuth();
    router.push('/login');
  };

  return { signUpMutation, loginMutation, user, token, logOut };
};

export default useAuth;
