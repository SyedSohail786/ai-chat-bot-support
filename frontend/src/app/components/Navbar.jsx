"use client";
import { motion } from 'framer-motion';
import { FiMessageSquare, FiMenu, FiLogOut, FiHome, FiPieChart, FiMessageCircle, FiSettings, FiX } from 'react-icons/fi';
import { FaRegEnvelope } from "react-icons/fa6";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add event listener for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdmin(!!token);
    };

    // Check auth status immediately
    checkAuth();
    setIsLoading(false);

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check auth status periodically (optional)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    setMobileMenuOpen(false);
    router.push('/admin');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const item = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200 }
    }
  };

  const mobileItem = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 200 }
    }
  };

  if (isLoading) return null;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="bg-white shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div variants={item} className="flex items-center">
            <Link href={localStorage.getItem("adminToken")? "/admin/dashboard": "/"} className="flex items-center">
              <FiMessageSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">SmartSupport</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div variants={item} className="hidden md:flex items-center space-x-8">
            {isAdmin ? (
              <>
                <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors flex items-center">
                  <FiHome className="mr-1" /> Dashboard
                </Link>
                <Link href="/admin/intents" className="hover:text-blue-600 transition-colors flex items-center">
                  <FiMessageCircle className="mr-1" /> Intents
                </Link>
                <Link href="/admin/analytics" className="hover:text-blue-600 transition-colors flex items-center">
                  <FiPieChart className="mr-1" /> Analytics
                </Link>
                <Link href="/admin/feedbacks" className="hover:text-blue-600 transition-colors flex items-center">
                  <FaRegEnvelope className="mr-1" /> Feedbacks
                </Link>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:shadow-md flex items-center"
                  >
                    <FiLogOut className="mr-1" /> Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    href="/chat" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-md"
                  >
                    Start Chat
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-md"
                  >
                    Admin
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <motion.div variants={item} className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="md:hidden bg-white pb-4 px-4 shadow-md"
        >
          {isAdmin ? (
            <>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/admin/dashboard" 
                  className="hover:text-blue-600 transition-colors flex items-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiHome className="mr-2" /> Dashboard
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/admin/intents" 
                  className="hover:text-blue-600 transition-colors flex items-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiMessageCircle className="mr-2" /> Intents
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/admin/analytics" 
                  className="hover:text-blue-600 transition-colors flex items-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiPieChart className="mr-2" /> Analytics
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/admin/feedbacks" 
                  className="hover:text-blue-600 transition-colors flex items-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaRegEnvelope className="mr-2" /> Feedbacks
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:shadow-md flex items-center justify-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </motion.div>
            </>
          ) : (
            <>
            <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/" 
                  className="hover:text-blue-600 transition-colors block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/about" 
                  className="hover:text-blue-600 transition-colors block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/contact" 
                  className="hover:text-blue-600 transition-colors block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/chat" 
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-md text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Chat
                </Link>
              </motion.div>
              <motion.div variants={mobileItem} className="py-2">
                <Link 
                  href="/admin" 
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-md text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
