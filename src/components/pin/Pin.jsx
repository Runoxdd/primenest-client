import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt={item.title} />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <div className="details">
              <span>{item.bedroom} Bed</span>
              <span className="separator">|</span>
              <b>$ {item.price}</b>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;