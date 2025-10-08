"use client";

import { memo, useMemo } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { 
  LazyHeader, 
  LazyFooter 
} from "@/components/lazy-components";
import { 
  Award, 
  Users, 
  Globe, 
  Heart, 
  Shield, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  CheckCircle,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";

const AboutPage = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  // Optimize animations based on user preferences
  const pageVariants = useMemo(() => ({
    initial: { opacity: prefersReducedMotion ? 1 : 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: "easeInOut" as const
    } satisfies Transition
  }), [prefersReducedMotion]);

  const stats = [
    { icon: Users, value: "5000+", label: "Happy Travelers", color: "from-blue-500 to-blue-600" },
    { icon: Globe, value: "25+", label: "Countries Covered", color: "from-green-500 to-green-600" },
    { icon: Calendar, value: "5+", label: "Years Experience", color: "from-purple-500 to-purple-600" },
    { icon: Star, value: "4.9", label: "Customer Rating", color: "from-yellow-500 to-yellow-600" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description: "Our love for exploration drives us to curate journeys that connect people with cultures and landscapes in the most authentic way.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "Your safety and satisfaction are our top priorities. Every journey is planned with care to make it secure, seamless, and memorable.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "From itineraries to execution, we maintain the highest standards, ensuring every detail of your trip reflects premium quality.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Personal Touch",
      description: "No two travelers are the same. That's why every itinerary we craft is personalized to suit your style, preferences, and dreams.",
      color: "from-green-500 to-teal-500"
    }
  ];

  const teamHighlights = [
    {
      name: "Expert Travel Planners",
      description: "Our team of seasoned travel professionals brings years of expertise, firsthand experiences, and insider knowledge to design journeys that go beyond the ordinary making us the best travel agency in Dehradun.",
      image: "/capella-lodge.webp"
    },
    {
      name: "Local Connections",
      description: "With strong relationships with local guides, hotels, and partners, we ensure that every experience feels authentic and truly connected to the destination.",
      image: "/trust-business-main.jpg"
    },
    {
      name: "24/7 Support",
      description: "Travel comes with surprises, but with Paradise Yatra, you're never alone. Our team is available round-the-clock, ensuring assistance no matter where in the world you are.",
      image: "/247.jpg"
    }
  ];

  return (
    <motion.div 
      initial={pageVariants.initial}
      animate={pageVariants.animate}
      transition={pageVariants.transition}
      className="min-h-screen bg-background overflow-x-hidden w-full"
      role="main"
      aria-label="About Paradise Yatra - Our Story and Mission"
    >
      <LazyHeader />
            
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cover.png"
            alt="Travel background"
            fill
            className=""
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-playfair-display mt-10"
          >
            About Paradise Yatra
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
          >
            Crafting unforgettable journeys since 2019
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <MapPin className="w-5 h-5 text-blue-300" />
              <span className="text-sm">Dehradun, Uttarakhand</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <Phone className="w-5 h-5 text-blue-300" />
              <span className="text-sm">+91 8979396413</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-playfair-display">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Paradise Yatra, we believe that travel is not just about visiting new places—it's about creating moments that stay with you forever. Founded in the heart of the Himalayas, our journey started in Dehradun with a simple vision: to make travel accessible, enjoyable, and meaningful for every traveler.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              From a small team of passionate explorers to becoming recognized as one of the Best Travel Agencies in Dehradun, we've grown into a trusted travel partner for thousands of adventurers, families, and businesses worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/hero.jpg"
                alt="Paradise Yatra team"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-playfair-display">
                From Local Roots to Global Dreams
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our roots lie in Dehradun, where we first discovered the magic of the mountains and the warmth of Himalayan hospitality. That inspiration continues to guide us in designing experiences that blend adventure with cultural authenticity.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Paradise Yatra which is the best travel agency in Dehradun has proudly helped over 5,000 travelers explore 25+ countries, from the snowy peaks of Himachal to the tropical islands of Maldives. Yet, our personal touch and attention to detail ensure that every trip feels tailor-made—just for you.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Licensed & Insured</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Owner Section */}
      <section className="py-16 md:py-24 bg-gray-50">
  <div className="container mx-auto px-4">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-playfair-display">
        Meet Our Founder
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        The visionary behind Paradise Yatra's success story
      </p>
    </motion.div>

    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Founder Image */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative w-[280px] md:w-[320px]">
            <Image
              src="/Male Profile (1).png"
              alt="Dikshant Sharma - Founder"
              width={400}
              height={380}
              className="rounded-lg shadow-xl object-cover"
            />
            <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md text-center">
              <div className="text-lg font-bold">5+</div>
              <div className="text-xs">Years of Excellence</div>
            </div>
          </div>
        </motion.div>

        {/* Founder Info */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-playfair-display">
              Dikshant Sharma
            </h3>
            <p className="text-blue-600 font-semibold text-lg">Founder & CEO</p>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            Dikshant Sharma, the visionary behind Paradise Yatra, has redefined travel experiences in India. With a passion for exploring hidden gems and crafting unforgettable journeys, Dikshant has positioned Paradise Yatra as the best travel agency in Dehradun.
          </p>
          
          <p className="text-gray-600 leading-relaxed">
            Under his leadership, the company combines personalized service, expert guidance, and seamless travel planning to ensure every trip is extraordinary. His commitment to excellence and innovation drives the team to create memorable adventures for every traveler.
          </p>
          
          <div className="pt-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Travel Industry Expert</span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">25+ Countries Explored</span>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Passionate About Customer Satisfaction</span>
            </div>
          </div>
          
          <div className="pt-6">
            <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700">
              "Our mission is to transform ordinary trips into extraordinary adventures, creating memories that last a lifetime while ensuring every traveler feels like family."
            </blockquote>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-playfair-display">
              Our Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our dedication to excellence and guest satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-playfair-display">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-playfair-display">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The values that make Paradise Yatra the Best Travel Agency in Dehradun are deeply rooted in everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-playfair-display">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Highlights Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-playfair-display">
              What Makes Us Special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team's expertise and dedication set us apart in the travel industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={highlight.image}
                    alt={highlight.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-playfair-display">
                    {highlight.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair-display">
              Find Us
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Visit our office in the heart of Dehradun, where our travel experts are ready to help you plan your next adventure.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden w-full"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.9778110684483!2d78.01086157522484!3d30.323148974784417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092a19318db8c3%3A0x4145eb2d8145d725!2s48%2C%20GMS%20Rd%2C%20near%20Balliwala%20chowk%2C%20Shakti%20Enclave%2C%20Mohit%20Nagar%2C%20Dehradun%2C%20Uttarakhand%20248001!5e0!3m2!1sen!2sin!4v1756551458987!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair-display">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Let the best travel agency in Dehradun help you create memories that last a lifetime. Whether it's a family trip, a honeymoon, or an international adventure, our dedicated team is here to plan every detail for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+918979396413"
                className="flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 group"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a 
                href="mailto:info@paradiseyatra.com"
                className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 group"
              >
                <Mail className="w-5 h-5" />
                <span>Email Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <LazyFooter />
      
      {/* Performance monitoring - only visible in development */}
      <PerformanceMonitor showInProduction={false} />
    </motion.div>
  );
});

AboutPage.displayName = 'AboutPage';

export default AboutPage;
