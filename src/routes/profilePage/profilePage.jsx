import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  LogOut, 
  Edit3, 
  Plus, 
  Home, 
  Heart, 
  MessageSquare,
  Settings,
  ChevronRight,
  Loader2,
  AlertCircle,
  Building2
} from "lucide-react";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'listings';
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null); // This now also clears the token from localStorage
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <motion.aside 
        className="profile-sidebar"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="sidebar-content">
          {/* User Card */}
          <div className="user-card">
            <div className="user-avatar">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt={currentUser.username} />
              <div className="avatar-ring" />
            </div>
            <div className="user-info">
              <h2>{currentUser.username}</h2>
              <p>{currentUser.email}</p>
            </div>
            <div className="user-actions">
              <Link to="/profile/update" className="action-btn edit">
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </Link>
              <button className="action-btn logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <Home size={18} />
              <span>My Listings</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <button 
              className={`nav-item ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              <Heart size={18} />
              <span>Saved Properties</span>
              <ChevronRight size={16} className="chevron" />
            </button>
            <Link 
              to="/messages"
              className="nav-item"
            >
              <MessageSquare size={18} />
              <span>Messages</span>
              <ChevronRight size={16} className="chevron" />
            </Link>
          </nav>

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="/add" className="quick-action-btn primary">
              <Plus size={18} />
              <span>Create New Listing</span>
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="profile-main">
        <AnimatePresence mode="wait">
          {activeTab === "listings" && (
            <motion.div
              key="listings"
              className="content-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="section-header">
                <div className="header-content">
                  <h1>My Listings</h1>
                  <p>Manage your property listings</p>
                </div>
              </div>
              <Suspense 
                fallback={
                  <div className="loading-state">
                    <Loader2 size={32} className="animate-spin" />
                    <p>Loading your listings...</p>
                  </div>
                }
              >
                <Await resolve={data.postResponse} errorElement={<ErrorState />}>
                  {(postResponse) => (
                    postResponse.data.userPosts.length > 0 ? (
                      <List posts={postResponse.data.userPosts} />
                    ) : (
                      <EmptyState 
                        icon={Building2}
                        title="No listings yet"
                        description="Create your first property listing to start attracting buyers and renters."
                        actionLabel="Create Listing"
                        actionLink="/add"
                      />
                    )
                  )}
                </Await>
              </Suspense>
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              className="content-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="section-header">
                <div className="header-content">
                  <h1>Saved Properties</h1>
                  <p>Properties you've bookmarked</p>
                </div>
              </div>
              <Suspense 
                fallback={
                  <div className="loading-state">
                    <Loader2 size={32} className="animate-spin" />
                    <p>Loading saved properties...</p>
                  </div>
                }
              >
                <Await resolve={data.postResponse} errorElement={<ErrorState />}>
                  {(postResponse) => (
                    postResponse.data.savedPosts.length > 0 ? (
                      <List posts={postResponse.data.savedPosts} />
                    ) : (
                      <EmptyState 
                        icon={Heart}
                        title="No saved properties"
                        description="Start exploring and save properties you're interested in."
                        actionLabel="Browse Properties"
                        actionLink="/list"
                      />
                    )
                  )}
                </Await>
              </Suspense>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div
              key="messages"
              className="content-section messages-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="section-header">
                <div className="header-content">
                  <h1>Messages</h1>
                  <p>Your conversations with other users</p>
                </div>
              </div>
              <div className="messages-redirect">
                <MessageSquare size={48} />
                <h3>Messages Moved</h3>
                <p>We've upgraded our messaging experience! Visit the new dedicated messages page for a better chat experience.</p>
                <Link to="/messages" className="redirect-btn">
                  Open Messages
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }) {
  return (
    <motion.div 
      className="empty-state"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="empty-icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="empty-action">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}

// Error State Component
function ErrorState() {
  return (
    <div className="error-state">
      <AlertCircle size={48} strokeWidth={1.5} />
      <h3>Something went wrong</h3>
      <p>Unable to load data. Please try again later.</p>
    </div>
  );
}

export default ProfilePage;
