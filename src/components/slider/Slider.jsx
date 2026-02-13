import { useState } from "react";
import "./slider.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
    } else {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setImageIndex(null);
    if (e.key === "ArrowLeft") changeSlide("left");
    if (e.key === "ArrowRight") changeSlide("right");
  };

  return (
    <div className="slider">
      {/* Full Screen Modal */}
      <AnimatePresence>
        {imageIndex !== null && (
          <motion.div 
            className="full-slider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Navigation Arrows */}
            <button 
              className="nav-arrow left"
              onClick={() => changeSlide("left")}
              aria-label="Previous image"
            >
              <ChevronLeft size={48} />
            </button>

            {/* Main Image */}
            <motion.div 
              className="image-container"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <img src={images[imageIndex]} alt={`Property image ${imageIndex + 1}`} />
            </motion.div>

            <button 
              className="nav-arrow right"
              onClick={() => changeSlide("right")}
              aria-label="Next image"
            >
              <ChevronRight size={48} />
            </button>

            {/* Close Button */}
            <button 
              className="close-btn"
              onClick={() => setImageIndex(null)}
              aria-label="Close gallery"
            >
              <X size={32} />
            </button>

            {/* Image Counter */}
            <div className="image-counter">
              {imageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {/* Main Large Image */}
        <motion.div 
          className="main-image"
          onClick={() => setImageIndex(0)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <img src={images[0]} alt="Property main image" />
          <div className="image-overlay">
            <span>View Gallery</span>
          </div>
        </motion.div>

        {/* Thumbnail Grid */}
        <div className="thumbnail-grid">
          {images.slice(1, 5).map((image, index) => (
            <motion.div
              key={index}
              className="thumbnail"
              onClick={() => setImageIndex(index + 1)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img src={image} alt={`Property image ${index + 2}`} />
              {index === 3 && images.length > 5 && (
                <div className="more-overlay">
                  <span>+{images.length - 5}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
