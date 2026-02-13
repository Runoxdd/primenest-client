import { createContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setPublicId, setState }) {
  const [loaded, setLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      setIsUploading(true);
      
      var myWidget = window.cloudinary.createUploadWidget(
        {
          ...uwConfig,
          styles: {
            palette: {
              window: "#0A0A0B",
              windowBorder: "#27272A",
              tabIcon: "#6366F1",
              menuIcons: "#A1A1AA",
              textDark: "#FAFAFA",
              textLight: "#FAFAFA",
              link: "#6366F1",
              action: "#6366F1",
              inactiveTabIcon: "#71717A",
              error: "#EF4444",
              inProgress: "#6366F1",
              complete: "#22C55E",
              sourceBg: "#18181B"
            },
            fonts: {
              default: null,
              "'Inter', sans-serif": {
                url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
                active: true
              }
            }
          }
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Upload successful:", result.info);
            setState((prev) => [...prev, result.info.secure_url]);
            setIsUploading(false);
          }
          if (result && result.event === "close") {
            setIsUploading(false);
          }
        }
      );

      myWidget.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <motion.button
        id="upload_widget"
        className="upload-widget-button"
        onClick={initializeCloudinaryWidget}
        disabled={!loaded}
        whileHover={{ scale: loaded ? 1.02 : 1 }}
        whileTap={{ scale: loaded ? 0.98 : 1 }}
      >
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload size={18} />
            <span>Upload Images</span>
          </>
        )}
      </motion.button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
