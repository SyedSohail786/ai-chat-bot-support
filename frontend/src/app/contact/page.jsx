'use client';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react'
import { toast } from 'react-toastify';
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ContactPage() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col lg:flex-row"
      >
        {/* Contact Info Section */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            Get in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Touch</span>
          </motion.h2>

          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3 sm:mr-4">
                <FiMail className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Email</h3>
                <p className="text-sm sm:text-base text-gray-600">support@smartsupport.ai</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 mr-3 sm:mr-4">
                <FiPhone className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Phone</h3>
                <p className="text-sm sm:text-base text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 bg-purple-100 rounded-full text-purple-600 mr-3 sm:mr-4">
                <FiMapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Office</h3>
                <p className="text-sm sm:text-base text-gray-600">123 Tech Street, San Francisco, CA</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex flex-col justify-center order-1 lg:order-2"
          ref={formRef}
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            Send us a <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Message</span>
          </motion.h2>

          <motion.form
            variants={containerVariants}
            className="space-y-4 sm:space-y-6"
            onSubmit={handleSubmit}
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Your name"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="your@email.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Your message..."
                required
              ></textarea>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    <span className="text-sm sm:text-base">Send Message</span>
                    <FiSend className="ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}