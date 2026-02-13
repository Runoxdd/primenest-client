import "./contactPage.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Send,
  User,
  AtSign,
  MessageSquare,
  ChevronDown,
  Loader2,
  CheckCircle
} from "lucide-react";

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Headquarters",
      value: "Prime Nest Building, London, E14"
    },
    {
      icon: Mail,
      label: "Email",
      value: "runoefekemo@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+234 8027552093"
    }
  ];

  return (
    <div className="contact-page">
      {/* Left Side - Info */}
      <motion.div 
        className="contact-info-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="info-content">
          <div className="info-badge">Get in Touch</div>
          <h1>
            Let's start a <span>conversation</span>
          </h1>
          <p>
            Have questions about a listing or want to join our verified agent network? 
            Reach out to the PrimeNest team and we'll get back to you within 24 hours.
          </p>

          <div className="contact-details">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  className="contact-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="item-icon">
                    <Icon size={20} />
                  </div>
                  <div className="item-content">
                    <span className="item-label">{item.label}</span>
                    <span className="item-value">{item.value}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Decorative Element */}
          <div className="decorative-card">
            <div className="decorative-icon">
              <MessageSquare size={32} />
            </div>
            <div className="decorative-content">
              <h3>Quick Response</h3>
              <p>Our team typically responds within 2-4 hours during business days.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        className="contact-form-section"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="form-container">
          {!isSubmitted ? (
            <>
              <div className="form-header">
                <h2>Send us a message</h2>
                <p>Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                {/* Name Input */}
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <AtSign size={18} className="input-icon" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Subject Select */}
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <div className="select-wrapper">
                    <select id="subject" name="subject" required>
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="agent">Agent Verification</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Partnership</option>
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div 
              className="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button 
                className="reset-button"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Message
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ContactPage;
