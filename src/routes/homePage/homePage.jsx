import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Clock, 
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp
} from "lucide-react";

// Animated counter hook
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return [count, setIsVisible];
}

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const [propertiesCount, setPropertiesVisible] = useCounter(12000, 2500);
  const [partnersCount, setPartnersVisible] = useCounter(450, 2000);
  const [supportCount, setSupportVisible] = useCounter(24, 1500);

  const stats = [
    { 
      value: propertiesCount.toLocaleString() + "+", 
      label: "Elite Properties",
      icon: Building2,
      color: "#6366F1"
    },
    { 
      value: partnersCount.toLocaleString() + "+", 
      label: "Luxury Partners",
      icon: Users,
      color: "#8B5CF6"
    },
    { 
      value: supportCount + "/7", 
      label: "Smart Support",
      icon: Clock,
      color: "#10B981"
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Search",
      description: "Find your perfect property with intelligent recommendations"
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Curated listings in the most sought-after neighborhoods"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Real-time data to make informed investment decisions"
    }
  ];

  return (
    <div className="home-page">
      {/* Background Elements */}
      <div className="home-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image Layer */}
        <div className="hero-background">
          <img src="/bg.png" alt="Modern Architecture" className="hero-bg-image" />
          <div className="hero-bg-overlay" />
        </div>

        {/* Content Layer */}
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>AI-Powered Real Estate Platform</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Find Your
              <span className="gradient-text"> Perfect </span>
              <br />
              Living Space
            </motion.h1>

            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover a curated collection of premium properties tailored to your 
              lifestyle. From high-rise urban sanctuaries to serene coastal retreats, 
              we connect you with exclusive real estate opportunities through 
              seamless AI-driven technology.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              className="hero-search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SearchBar />
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onViewportEnter={() => {
                setPropertiesVisible(true);
                setPartnersVisible(true);
                setSupportVisible(true);
              }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <stat.icon size={20} />
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Cards Layer */}
        <div className="hero-floating-elements">
          <motion.div 
            className="floating-card card-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="card-icon">
              <Building2 size={18} />
            </div>
            <div className="card-content">
              <span className="card-value">2,500+</span>
              <span className="card-label">Active Listings</span>
            </div>
          </motion.div>

          <motion.div 
            className="floating-card card-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="card-icon success">
              <TrendingUp size={18} />
            </div>
            <div className="card-content">
              <span className="card-value">98%</span>
              <span className="card-label">Happy Clients</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Find Your Dream Home?</h2>
          <p>Join thousands of satisfied homeowners who found their perfect property with PrimeNest.</p>
          <div className="cta-buttons">
            <a href="/list" className="cta-btn primary">
              Browse Properties
              <ArrowRight size={18} />
            </a>
            <a href="/assistant" className="cta-btn secondary">
              <Sparkles size={18} />
              Try AI Agent
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;
