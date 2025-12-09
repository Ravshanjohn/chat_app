import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return; // prevent duplicate runs (StrictMode)
    attemptedRef.current = true;

    const run = async () => {
      const ok = await verifyEmail(token);
      if (ok) {
        navigate("/");
      } else {
        navigate("/signup");
      }
    };
    run();
  }, [token, navigate, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Loader2 className="size-8 text-primary animate-spin" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-base-content">Verify Your Email</h2>
          <p className="text-base-content/70">
            Please check your email for a verification link. You will be redirected shortly.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
