"use client";
import { motion } from 'framer-motion';

export default function AboutPage() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "AI enthusiast with 10+ years in customer experience technology.",
      img: "https://www.transitivemanagement.com/files/uploads/2013/11/dummy_team_member.jpg"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Natural language processing expert from Stanford University.",
      img: "https://www.spaciodevelopers.com/wp-content/uploads/team/team2.jpg"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Product visionary with background in enterprise SaaS solutions.",
      img: "https://www.spaciodevelopers.com/wp-content/uploads/team/team1.jpg"
    },
    {
      name: "Emily Wilson",
      role: "Customer Success",
      bio: "Dedicated to ensuring seamless implementation for our clients.",
      img: "https://guamhomesforsaleandrent.com/sites/default/files/team10.jpg"
    }
  ];

  const stats = [
    { value: "24/7", label: "Availability" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "50+", label: "Industries Served" },
    { value: "10M+", label: "Queries Resolved" }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SmartSupport</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
          Transforming customer support through AI-powered solutions that deliver instant, accurate, and personalized assistance.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div variants={itemVariants} className="bg-indigo-50 rounded-2xl p-8 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 mb-6">
            To revolutionize customer interactions by combining artificial intelligence with human understanding, creating support experiences that are faster, smarter, and more empathetic.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Story & Technology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Founded in 2023, SmartSupport began with a simple observation: customers were frustrated with long wait times and inconsistent support, while businesses struggled with scaling their support teams.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            Our team of AI researchers and customer experience experts came together to build a solution that leverages the latest advances in natural language processing to understand customer needs instantly.
          </p>
          <p className="text-gray-600 text-lg">
            Today, we serve hundreds of companies worldwide across industries from e-commerce to healthcare, helping them deliver exceptional support at scale.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Technology</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Powered by proprietary AI models trained on billions of customer interactions, our system understands context, remembers conversation history, and provides responses indistinguishable from human agents.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            Our multi-model architecture combines:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 text-lg">
            <li>Conversational understanding for natural dialogue</li>
            <li>Knowledge graph for factual accuracy</li>
            <li>Sentiment analysis for empathetic responses</li>
            <li>Continuous learning to improve with every interaction</li>
          </ul>
        </motion.div>
      </div>

      {/* Team Section */}
      <motion.div variants={itemVariants} className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
           <motion.div
  key={index}
  variants={itemVariants}
  whileHover={{ y: -5 }}
  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
>
  {/* Image container with proper aspect ratio */}
  <div className="relative pt-[75%] bg-gray-200 overflow-hidden"> {/* 4:3 aspect ratio */}
    <img 
      src={member.img} 
      alt={member.name}
      className="absolute top-0 left-0 w-full h-full object-cover object-top"
    />
  </div>
  {/* Text content */}
  <div className="p-6 flex-1">
    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
    <p className="text-indigo-600 mb-2">{member.role}</p>
    <p className="text-gray-600">{member.bio}</p>
  </div>
</motion.div>
          ))}
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
            <p className="text-gray-600">
              Every decision starts with what's best for the end user. We measure success by customer satisfaction.
            </p>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Learning</h3>
            <p className="text-gray-600">
              Our systems and our team are always evolving, improving, and adapting to new challenges.
            </p>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ethical AI</h3>
            <p className="text-gray-600">
              We develop responsible AI that's transparent, unbiased, and respects user privacy.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
