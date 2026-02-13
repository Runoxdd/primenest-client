import './list.scss';
import Card from "../card/Card";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

function List({ posts }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.length > 0 ? (
        posts.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card item={item} />
          </motion.div>
        ))
      ) : (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="empty-icon">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
          <h3>No properties found</h3>
          <p>Try adjusting your filters to find more properties.</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default List;
