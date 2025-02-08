import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <motion.footer
      className="bg-black text-white py-6 px-4 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Social Icons */}
      <div className="flex space-x-6 mb-4">
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="mailto:your-email@example.com"
          className="hover:text-gray-400"
        >
          <FaEnvelope size={24} />
        </a>
      </div>

      {/* Copyright Text */}
      <p className="text-sm">
        Solis © {new Date().getFullYear()} - All Rights Reserved
      </p>
    </motion.footer>
  );
}

export default Footer;
