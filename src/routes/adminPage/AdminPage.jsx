import { useEffect, useState, useContext } from "react";
import "./adminPage.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { 
  Users, 
  Home, 
  Ban, 
  Trash2, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiRequest.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch administrative data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBan = async (userId) => {
    if (!window.confirm("Are you sure you want to ban this user? They will no longer be able to log in.")) return;
    try {
      await apiRequest.put(`/admin/ban/${userId}`);
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: true } : u));
    } catch (err) {
      alert("Failed to ban user.");
    }
  };

  const handleDelist = async (postId) => {
    if (!window.confirm("Are you sure you want to delist this property? It will be marked as delisted for all users.")) return;
    try {
      await apiRequest.put(`/admin/delist/${postId}`, { adminEmail: currentUser.email });
      setUsers(users.map(u => ({
        ...u,
        posts: u.posts.map(p => p.id === postId ? { ...p, status: "delisted" } : p)
      })));
    } catch (err) {
      alert("Failed to delist property.");
    }
  };

  if (isLoading) return <div className="admin-loader"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-title">
            <ShieldAlert size={32} />
            <h1>Admin Dashboard</h1>
          </div>
          <p>Manage users and property listings across PrimeNest</p>
        </header>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-grid">
          {/* Users Section */}
          <section className="admin-section">
            <div className="section-header">
              <Users size={20} />
              <h2>Users Management</h2>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Posts</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={user.isBanned ? "banned-row" : ""}>
                      <td>
                        <div className="user-info">
                          <img src={user.avatar || "/noavatar.jpg"} alt="" />
                          <span>{user.username}</span>
                          {user.isAdmin && <span className="admin-badge">Admin</span>}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.posts.length}</td>
                      <td>
                        {user.isBanned ? (
                          <span className="status-tag banned">Banned</span>
                        ) : (
                          <span className="status-tag active">Active</span>
                        )}
                      </td>
                      <td>
                        {!user.isBanned && !user.isAdmin && (
                          <button 
                            className="admin-btn ban" 
                            onClick={() => handleBan(user.id)}
                            title="Ban User"
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Properties Section */}
          <section className="admin-section">
            <div className="section-header">
              <Home size={20} />
              <h2>Property Listings</h2>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.flatMap(u => u.posts.map(p => ({ ...p, owner: u.username }))).map((post) => (
                    <tr key={post.id} className={post.status === "delisted" ? "delisted-row" : ""}>
                      <td>
                        <img src={post.images[0]} alt="" className="post-thumb" />
                      </td>
                      <td>{post.title}</td>
                      <td>{post.owner}</td>
                      <td>
                        {post.status === "delisted" ? (
                          <span className="status-tag delisted">Delisted</span>
                        ) : (
                          <span className="status-tag active">Active</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <Link to={`/${post.id}`} className="admin-btn view" title="View Post">
                          <ExternalLink size={16} />
                        </Link>
                        {post.status !== "delisted" && (
                          <button 
                            className="admin-btn delist" 
                            onClick={() => handleDelist(post.id)}
                            title="Delist Property"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
