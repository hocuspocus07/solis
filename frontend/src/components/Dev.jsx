import React from "react";
import { motion } from "framer-motion";
import team from "../assets/team.png"; // Adjust the path if needed

function Dev() {
  return (
    <div className="min-h-screen flex flex-col text-white relative">
      {/* Top Left Title */}
      <motion.div
        className="absolute top-30 left-85 text-4xl font-bold"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Developers
      </motion.div>

      {/* Center Image */}
      <div className="flex flex-1 items-center justify-center">
        <motion.img
          src={team}
          alt="Developer"
          className="rounded-2xl shadow-lg max-w-xs md:max-w-md lg:max-w-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export default Dev;
