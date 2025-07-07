// app/page.jsx
'use client';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiZap, FiGlobe, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function Hero() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const featureItem = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center"
      >
        <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            SmartSupport AI
          </span>
        </motion.h1>
        
        <motion.p variants={item} className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Revolutionize your customer support with our AI-powered chatbot that delivers instant, accurate responses 24/7.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/chat" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          >
            Start Chat <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Powerful Features
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={featureItem} className="bg-gray-50 p-8 rounded-xl">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <FiMessageSquare className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">Instant Responses</h3>
              <p className="text-gray-600 text-center">
                Get immediate answers to customer inquiries without wait times.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={featureItem} className="bg-gray-50 p-8 rounded-xl">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <FiZap className="w-6 h-6 text-indigo-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">AI-Powered</h3>
              <p className="text-gray-600 text-center">
                Advanced natural language processing for human-like conversations.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={featureItem} className="bg-gray-50 p-8 rounded-xl">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto"
              >
                <FiGlobe className="w-6 h-6 text-purple-600" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">24/7 Availability</h3>
              <p className="text-gray-600 text-center">
                Always-on support across all timezones and holidays.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to Transform Your Support?
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8"
          >
            Experience the future of customer service with our AI chatbot solution.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/chat" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-all"
            >
              Start Chatting Now <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}