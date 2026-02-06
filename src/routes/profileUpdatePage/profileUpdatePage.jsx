import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0]
      });
      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Protocol override failed. Check credentials.");
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Account Core Settings</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Security Protocol (Password)</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Leave blank to maintain current"
            />
          </div>
          <button className="updateBtn">Update Identity</button>
          {error && <span className="errorMsg">{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <div className="imageWrapper">
          <img src={avatar[0] || currentUser.avatar || "/noavatar.jpg"} alt="User Avatar" className="avatar" />
          <div className="scanLine"></div>
        </div>
        <UploadWidget
          uwConfig={{
            cloudName: "dfui2sgjw",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
        <p className="hintText">image upload</p>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;