"use client";
import { motion } from 'framer-motion';
import { FiMessageSquare, FiMenu, FiLogOut, FiHome, FiPieChart, FiMessageCircle, FiSettings } from 'react-icons/fi';
import { FaRegEnvelope } from "react-icons/fa6";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    router.push('/admin');
  };

  const item = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
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
                  <FaRegEnvelope  className="mr-1" /> Feedbacks
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
        </div>
      </div>
    </motion.nav>
  );
}