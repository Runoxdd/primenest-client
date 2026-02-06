import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const scrollToChat = () => {
    document.querySelector('.chatContainer').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Identity & Credentials</h1>
            <Link to="/profile/update">
              <button className="updateBtn">Edit Profile</button>
            </Link>
          </div>
          <div className="info userCard">
            <div className="avatarSection">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar" />
              <div className="text">
                <span>Account: <b>{currentUser.username}</b></span>
                <span>Uplink: <b>{currentUser.email}</b></span>
              </div>
            </div>
            <button className="logoutBtn" onClick={handleLogout}>Logout</button>
          </div>
          
          <div className="title">
            <h1>My Listings</h1>
            <Link to="/add">
              <button className="createBtn">New Listing</button>
            </Link>
          </div>
          <Suspense fallback={<p className="loadingText">Retrieving property data...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Uplink Error!</p>}>
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>

          <div className="title">
            <h1>Saved Listings</h1>
          </div>
          <Suspense fallback={<p className="loadingText">Syncing favorites...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Uplink Error!</p>}>
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p className="loadingText">Establishing secure channel...</p>}>
            <Await resolve={data.chatResponse} errorElement={<p>Comms Error!</p>}>
              {(chatResponse) => <Chat chats={chatResponse.data}/>}
            </Await>
          </Suspense>
        </div>
      </div>

      {/* Floating Chat Button for Mobile Accessibility */}
      <div className="mobileChatFloat" onClick={scrollToChat}>
        <img src="/chat.png" alt="chat-icon" />
      </div>
    </div>
  );
}

export default ProfilePage;