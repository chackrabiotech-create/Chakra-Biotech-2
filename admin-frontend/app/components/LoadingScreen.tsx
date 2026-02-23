"use client";

import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-maroon-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-saffron-500 to-maroon-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-admin-800">
            Chakra Biotech Dashboard
          </h1>
          <p className="text-admin-600">Loading your admin portal...</p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <div className="w-3 h-3 bg-saffron-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-saffron-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-saffron-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-admin-500 text-sm mt-4"
        >
          Authenticating your session...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
