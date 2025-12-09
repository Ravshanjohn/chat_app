import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import AuthImagePattern from "../components/AuthImagePattern";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let passwordTrimmed = password.trim();
    let confirmPasswordTrimmed = confirmPassword.trim();

    console.log("Password:", `"${passwordTrimmed}"`, "Length:", passwordTrimmed.length);
    console.log("Confirm:", `"${confirmPasswordTrimmed}"`, "Length:", confirmPasswordTrimmed.length);
    console.log("Match:", passwordTrimmed === confirmPasswordTrimmed);

    if (passwordTrimmed !== confirmPasswordTrimmed) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordTrimmed.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await resetPassword(token, passwordTrimmed);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='h-screen grid lg:grid-cols-2 relative overflow-hidden'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[80vw] w-[80vw] max-h-[320px] max-w-[320px] rounded-full bg-primary/15 opacity-30 blur-[100px]' />
      </div>

      {/* Left: Form */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-background/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-base-300 p-6 sm:p-8 space-y-6'
          >
            <div className='text-center space-y-2'>
              <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text'>
                Reset Password
              </h2>
              <p className='text-base-content/60 text-sm sm:text-base'>Enter your new password and confirm to continue.</p>
            </div>

            {error && <p className='text-error text-sm text-center'>{error}</p>}
            {message && <p className='text-success text-sm text-center'>{message}</p>}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                icon={Lock}
                type='password'
                placeholder='New Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />

              <Input
                icon={Lock}
                type='password'
                placeholder='Confirm New Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full btn btn-primary'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Set New Password"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right: Illustration */}
      <AuthImagePattern
        title='Reset your password'
        subtitle='Choose a strong password to secure your account.'
      />
    </div>
  );
};
export default ResetPasswordPage;
