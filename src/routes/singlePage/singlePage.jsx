import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      setSaved((prev) => !prev);
    }
  };

  const handleContact = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.id === post.userId) {
      alert("Operational Error: You cannot initiate a channel with yourself.");
      return;
    }

    try {
      await apiRequest.post("/chats", { receiverId: post.userId });
      navigate("/profile");
    } catch (err) {
      alert("Existing channel found. Redirecting to comms.");
      navigate("/profile");
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="pin" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar || "/noavatar.jpg"} alt="user" />
                <span>{post.user.username}</span>
                <p>Authorized Agent</p>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title"> Specifications</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Maintenance</span>
                <p>{post.postDetail.utilities === "owner" ? "Managed by Owner" : "Managed by Tenant"}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Biosignature Policy</span>
                <p>{post.postDetail.pet === "allowed" ? "Pets Authorized" : "No Pets Permitted"}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Financial Clearance</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>

          <p className="title">Architecture</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" className="specimg" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt=""  className="specimg"/>
              <span>{post.bedroom} Units</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt=""  className="specimg"/>
              <span>{post.bathroom} Facilities</span>
            </div>
          </div>

          <p className="title">Proximity Grid</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt=""  />
              <div className="featureText">
                <span>Education</span>
                <p>{post.postDetail.school > 999 ? post.postDetail.school / 1000 + "km" : post.postDetail.school + "m"}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Transit</span>
                <p>{post.postDetail.bus}m</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Dining</span>
                <p>{post.postDetail.restaurant}m</p>
              </div>
            </div>
          </div>

          <p className="title">Tactical Map</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="buttons">
            <button className="chatBtn" onClick={handleContact}>
              <img src="/chat.png" alt="" className="specimg" />
              Secure Message
            </button>
            <button 
              className={`saveBtn ${saved ? "saved" : ""}`} 
              onClick={handleSave}
            >
              <img src="/save.png" alt="" className="specimg" />
              {saved ? "Archived" : "Archive Property"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;