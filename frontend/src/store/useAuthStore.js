import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isEmailSent: false,
  isCheckingAuth: true,
  userEmail: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  onlineUsers: [],
  socket: null,

  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (fullName, email, password) => {
    set({ isSigningUp: true, isEmailSent: false });

    try {
      const res = await axiosInstance.post("/auth/signup", { fullName, email, password });

      
      set({ authUser: null, isEmailSent: true, userEmail: email });

      toast.success(res.data.message || "Verification email sent. Please verify your email.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (token) => {
    try {
      const res = await axiosInstance.post(`/auth/verify-email/${token}`);

      set({ authUser: res.data.user });
      get().connectSocket();

      toast.success(res.data.message || "Email verified successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid code");
      return false;
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });
      get().connectSocket();
      toast.success(res.data.message || "Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message || "Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset email sent");
      set({ isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successful");
      set({ isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
      set({ isLoading: false });
    }
  },

  resendResetPasswordEmail: async (email) => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.post("/auth/resend-reset-password", { email });
      toast.success(res.data.message || "Password reset email sent");
      set({ isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
      set({ isLoading: false });
    }
  },
}));
