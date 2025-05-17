// src/components/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, Frown, Smile } from 'lucide-react';
import { Helmet } from 'react-helmet';
import * as Sentry from '@sentry/react';

const NotFound = ({
  message = "Oops! The page you're looking for has vanished.",
  showSearch = true,
  redirectPath = "/",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    Sentry.captureMessage(`404 Not Found: ${location.pathname}`);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const easterEggMessages = [
    "Maybe the page went on vacation 🏖️",
    "Perhaps it's hiding behind the couch 🛋️",
    "Could be lost in the digital wilderness 🌲",
    "Might have joined the circus 🎪",
    "Probably playing hide and seek 🙈"
  ];

  const randomMessage = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto text-center"
      >
        {/* Animated Illustration */}
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 0],
            y: [0, -10, 10, -10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <img
            src="/404-illustration.svg" // Consider using a more modern illustration
            alt="Page Not Found"
            className="w-64 sm:w-72 mx-auto"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          />
          {isHovering && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 -mt-4 -mr-4"
            >
              <span className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full">
                {isHovering ? "I'm lost!" : ""}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Error Code with Animation */}
        <motion.h1 
          className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>

        {/* Message */}
        <div className="mb-6">
          <motion.p 
            className="text-2xl font-semibold text-gray-800 dark:text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The page <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{location.pathname}</code> does not exist.
          </p>
        </div>

        {/* Search Form */}
        {showSearch && (
          <motion.form 
            onSubmit={handleSearch}
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search our site..."
                aria-label="Search"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Go
              </button>
            </div>
          </motion.form>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-5 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <button
            onClick={() => navigate(redirectPath)}
            className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <Home className="w-5 h-5 mr-2" /> Homepage
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          className="mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-2">Popular pages:</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => navigate('/about')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              About Us
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contact
            </button>
            <button 
              onClick={() => navigate('/help')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Help Center
            </button>
          </div>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          className="mt-8 cursor-pointer"
          onClick={() => setShowEasterEgg(!showEasterEgg)}
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            {showEasterEgg ? (
              <span className="flex items-center justify-center">
                <Smile className="w-4 h-4 mr-1" /> {randomMessage}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Frown className="w-4 h-4 mr-1" /> Feeling lost? Click me!
              </span>
            )}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;