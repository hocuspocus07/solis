import React from "react";
import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      className="min-h-screen flex items-center bg-cover bg-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="w-full max-w-7xl mx-50 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
        {/* Left Section: Title */}
        <motion.div
          className="text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About SOLIS</h1>
        </motion.div>

        {/* Right Section: Content */}
        <motion.div
          className="text-right text-lg leading-relaxed"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <p>
            <strong>SOLIS</strong> detects bot-generated reviews using Machine
            Learning, extracts reviews via Web Scraping, and ensures
            authenticity by storing verified review hashes on Ethereum
            (Sepolia).
          </p>
          <p className="mt-4">
            With a seamless integration of Blockchain, AI, and Automation,
            SOLIS prevents data tampering, making online reviews more reliable.
          </p>
          <p className="mt-4">
            Built with <strong>React, Web3.py</strong>, and{" "}
            <strong>Scikit-learn</strong>, it delivers a secure, transparent,
            and efficient review verification system.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default About;
