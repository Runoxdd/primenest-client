import "./aboutPage.scss";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Diamond, 
  Target, 
  Eye,
  Building2,
  Users,
  Award,
  TrendingUp
} from "lucide-react";

function AboutPage() {
  const values = [
    {
      id: 1,
      title: "Precision Intelligence",
      desc: "Our AI doesn't just search—it understands market patterns to find hidden value in every transaction.",
      icon: Zap 
    },
    {
      id: 2,
      title: "Secure Connections",
      desc: "End-to-end encrypted communications between buyers, sellers, and agents. Your data stays yours.",
      icon: Shield
    },
    {
      id: 3,
      title: "Radical Transparency",
      desc: "No hidden fees or ghost listings. Every data point is verified and every transaction is clear.",
      icon: Diamond
    }
  ];

  const stats = [
    { label: "Properties Listed", value: "10K+" },
    { label: "Happy Customers", value: "5K+" },
    { label: "Cities Covered", value: "50+" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-badge">About PrimeNest</div>
          <h1>
            Redefining the <span>future</span> of real estate
          </h1>
          <p className="hero-subtitle">
            We started with a simple premise: The traditional real estate market is broken. 
            Slow, opaque, and outdated. We built PrimeNest to be the operating system for property—
            a fast, AI-augmented ecosystem where finding a home is as seamless as it should be.
          </p>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src="about-hero.jpg" alt="Modern Architecture" />
          <div className="image-overlay" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="mission-grid">
          <motion.div 
            className="mission-card"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-icon">
              <Target size={24} />
            </div>
            <h2>Our Mission</h2>
            <p>
              To eliminate the friction of property acquisition using proprietary AI agents 
              that understand your needs before you even express them.
            </p>
          </motion.div>
          
          <motion.div 
            className="mission-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="card-icon">
              <Eye size={24} />
            </div>
            <h2>Our Vision</h2>
            <p>
              A world where the home you want is found before you even start looking. 
              Where technology serves humanity's most basic need: shelter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2>Core Principles</h2>
          <p>The values that drive everything we do</p>
        </motion.div>

        <div className="values-grid">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div 
                key={value.id}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="value-icon">
                  <Icon size={28} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2>Ready to find your perfect home?</h2>
          <p>Join thousands of satisfied customers who found their dream property with PrimeNest.</p>
          <div className="cta-buttons">
            <a href="/list" className="cta-primary">Browse Properties</a>
            <a href="/contact" className="cta-secondary">Contact Us</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutPage;
