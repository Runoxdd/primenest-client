import { useState, useRef, useEffect } from "react";
import "./slider.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const changeSlide = (direction) => {
    if (direction === "left") {
      setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
    } else {
      setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }
  };

  const changeMobileSlide = (direction) => {
    if (direction === "left") {
      setMobileIndex(mobileIndex === 0 ? images.length - 1 : mobileIndex - 1);
    } else {
      setMobileIndex(mobileIndex === images.length - 1 ? 0 : mobileIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setImageIndex(null);
    if (e.key === "ArrowLeft") changeSlide("left");
    if (e.key === "ArrowRight") changeSlide("right");
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      changeMobileSlide("right");
    }
    if (isRightSwipe) {
      changeMobileSlide("left");
    }
  };

  return (
    <div className="slider" ref={sliderRef}>
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

      {/* Mobile Gallery - Swipeable Carousel */}
      {isMobile ? (
        <div className="mobile-gallery">
          {/* Swipeable Image */}
          <div 
            className="mobile-image-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setImageIndex(mobileIndex)}
          >
            <motion.img 
              key={mobileIndex}
              src={images[mobileIndex]} 
              alt={`Property image ${mobileIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <div className="mobile-image-overlay">
              <Images size={18} />
              <span>Tap to view gallery</span>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="dot-indicators">
            {images.slice(0, 6).map((_, index) => (
              <button
                key={index}
                className={`dot ${mobileIndex === index ? 'active' : ''}`}
                onClick={() => setMobileIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
            {images.length > 6 && (
              <span className="more-dots">+{images.length - 6}</span>
            )}
          </div>

          {/* Image Counter */}
          <div className="mobile-counter">
            {mobileIndex + 1} / {images.length}
          </div>
        </div>
      ) : (
        /* Desktop Gallery Grid */
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
      )}
    </div>
  );
}

export default Slider;
