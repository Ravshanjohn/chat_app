import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Error sending reset link";
      setSubmitError(msg);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Forgot Password
              </h2>
              <p className="text-base-content/60">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="alert alert-error" role="alert">
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-base-content/40" />
                    </div>
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-2">Check your email</h3>
                  <p className="text-base-content/60 text-sm">
                    If an account exists for <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm link link-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Reset your password"}
        subtitle={"Enter your email to receive a password reset link."}
      />
    </div>
  );
};
export default ForgotPasswordPage;
