import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content or multi-character input
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  // Global keyboard listener for automatic input
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      // Only capture digit keys
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        setCode((prevCode) => {
          const newCode = [...prevCode];
          // Find the first empty field and fill it
          const emptyIndex = newCode.findIndex((digit) => digit === "");
          if (emptyIndex !== -1) {
            newCode[emptyIndex] = e.key;
            // Focus on the input field
            setTimeout(() => {
              inputRefs.current[emptyIndex]?.focus();
            }, 0);
            return newCode;
          }
          return prevCode;
        });
      }
      // Handle backspace to delete from the last filled field
      if (e.key === "Backspace") {
        e.preventDefault();
        setCode((prevCode) => {
          const newCode = [...prevCode];
          const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
          if (lastFilledIndex !== -1) {
            newCode[lastFilledIndex] = "";
            // Focus on the cleared field
            setTimeout(() => {
              inputRefs.current[lastFilledIndex]?.focus();
            }, 0);
            return newCode;
          }
          return prevCode;
        });
      }
    };

    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => window.removeEventListener("keydown", handleGlobalKeyPress);
  }, []);

  return (
    <div className='flex items-center justify-center h-screen overflow-y-auto  relative px-4'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
        <div className='absolute left-0 right-0 top-0 -z-10 m-auto h-[80vw] w-[80vw] max-h-[310px] max-w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]' />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-background/50 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-md border border-base-300'
      >
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-br from-primary to-secondary text-transparent bg-clip-text'>
          Verify Your Email
        </h2>
        <p className='text-center text-base-content mb-4 sm:mb-6'>Enter the 6-digit code sent to your email address.</p>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex justify-center gap-1 sm:gap-2'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                maxLength='1'
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-base-200/50 border-2 border-base-300 rounded-lg focus:outline-none ring-1 focus:ring-2 focus:ring-primary'
              />
            ))}
          </div>
          {error && <p className='text-error font-semibold mt-2 text-center'>{error}</p>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type='submit'
            disabled={isLoading || code.some((digit) => !digit)}
            className='w-full btn btn-primary'
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
export default EmailVerificationPage;
