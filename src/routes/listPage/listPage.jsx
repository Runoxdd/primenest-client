import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Loader2, 
  AlertCircle,
  Building2
} from "lucide-react";

function ListPage() {
  const data = useLoaderData();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'map'

  return (
    <div className="list-page">
      {/* View Toggle (Mobile) */}
      <div className="view-toggle-mobile">
        <button 
          className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid size={18} />
          <span>Grid</span>
        </button>
        <button 
          className={`toggle-btn ${viewMode === "map" ? "active" : ""}`}
          onClick={() => setViewMode("map")}
        >
          <MapIcon size={18} />
          <span>Map</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="list-content">
        {/* Properties List */}
        <motion.div 
          className={`properties-section ${viewMode === "map" ? "hidden-mobile" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Filter />
          
          <div className="properties-grid-wrapper">
            <Suspense 
              fallback={
                <div className="loading-state">
                  <Loader2 size={32} className="animate-spin" />
                  <p>Loading properties...</p>
                </div>
              }
            >
              <Await
                resolve={data.postResponse}
                errorElement={<ErrorState message="Failed to load properties" />}
              >
                {(postResponse) => (
                  postResponse.data.length > 0 ? (
                    <motion.div 
                      className="properties-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <AnimatePresence>
                        {postResponse.data.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card item={post} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <EmptyState />
                  )
                )}
              </Await>
            </Suspense>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div 
          className={`map-section ${viewMode === "grid" ? "hidden-mobile" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense 
            fallback={
              <div className="loading-state">
                <Loader2 size={32} className="animate-spin" />
                <p>Loading map...</p>
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<ErrorState message="Map unavailable" />}
            >
              {(postResponse) => <Map items={postResponse.data} />}
            </Await>
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
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
      <p>Try adjusting your filters to find more properties</p>
    </motion.div>
  );
}

// Error State Component
function ErrorState({ message }) {
  return (
    <div className="error-state">
      <AlertCircle size={48} strokeWidth={1.5} />
      <h3>Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
}

export default ListPage;
