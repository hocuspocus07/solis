import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
function HeroSection() {
    const word = "S O L I S";
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [blink, setBlink] = useState(true);
    const typingSpeed = 200;
    const deletingSpeed = 100;
    const pauseDuration = 1000;
    const navigate = useNavigate();

    const handleButtonClick = () => {
      navigate("/verify-review"); // Navigate to the VerifyReview component
    };
  
    useEffect(() => {
      const handleTyping = () => {
        if (!isDeleting) {
          if (text !== word) {
            setText((prev) => word.slice(0, prev.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration); // Pause before deleting
          }
        } else {
          if (text !== "") {
            setText((prev) => prev.slice(0, prev.length - 1));
          } else {
            // Restart the cycle
            setIsDeleting(false);
          }
        }
      };
  
      const timer = setTimeout(
        handleTyping,
        isDeleting ? deletingSpeed : typingSpeed
      );
  
      return () => clearTimeout(timer);
    }, [text, isDeleting]);
  
    useEffect(() => {
      const cursorBlink = setInterval(() => {
        setBlink((prev) => !prev);
      }, 250);
      return () => clearInterval(cursorBlink);
    }, []);

  return (
    <motion.section
  className="min-h-screen w-screen flex flex-col items-center justify-center px-4 md:px-40 text-white"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, ease: "easeInOut" }}
>
  {/* Main Heading with Typewriter Effect */}
  <motion.span
    className="text-5xl sm:text-7xl md:text-9xl font-bold mt-10 text-white custom-font"
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, delay: 2 }}
  >
    {text}
    <span
      className={`ml-1 ${blink ? "opacity-100" : "opacity-0"} text-white`}
    >
      |
    </span>
  </motion.span>

  {/* Subheading */}
  <motion.p
    className="mt-4 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
  >
    Keeping it real
  </motion.p>

  {/* Description */}
  <motion.p
    className="mt-4 text-xs sm:text-sm md:text-lg max-w-xl sm:max-w-2xl text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
  >
    Detecting fake reviews using AI and ensuring authenticity on the Ethereum blockchain — because trust should be tamper-proof.
  </motion.p>
</motion.section>
  );
}

export default HeroSection;
