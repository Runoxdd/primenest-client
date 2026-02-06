import "./card.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function Card({ item }) {
  const { currentUser } = useContext(AuthContext);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await apiRequest.delete("/posts/" + item.id);
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt={item.title} />
        <div className="priceBadge">$ {item.price}</div>
      </Link>
      <div className="textContainer">
        <div className="top">
          <h2 className="title">
            <Link to={`/${item.id}`}>{item.title}</Link>
          </h2>
          <p className="address">
            <img src="/pin.png" alt="" />
            <span>{item.address}</span>
          </p>
        </div>

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom}</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="Save" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="Chat" />
            </div>

            {/* OWNER CONTROLS */}
            {currentUser && currentUser.id === item.userId && (
              <>
                <Link 
                  to={`/edit/${item.id}`} 
                  className="icon edit" 
                  title="Edit Listing"
                >
                  <img src="/edit.png" alt="Edit" />
                </Link>
                <div 
                  className="icon delete" 
                  onClick={handleDelete} 
                  title="Delete Listing"
                >
                  <img src="/delete.png" alt="Delete" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;