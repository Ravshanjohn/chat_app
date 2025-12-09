import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, isEmailSent } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const isLoggedIn = Boolean(authUser);

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : isEmailSent ? (
              <Navigate to="/email-verification/:token" />
            ) : (
              <SignUpPage />
            )
          }
        />

        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="/settings" element={<SettingsPage />} />

        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/email-verification/:token"
          element={<EmailVerificationPage />}
        />

        <Route
          path="/reset-password/:token"
          element={!isLoggedIn ? <ResetPasswordPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
