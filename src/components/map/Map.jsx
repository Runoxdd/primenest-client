import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useEffect } from "react";
import L from "leaflet"; // 1. Import Leaflet

// 2. Fix for missing marker icons in production
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function Map({ items }) {
  const center = items.length === 1
    ? [items[0].latitude, items[0].longitude]
    : [52.4797, -1.90269];

  return (
    <MapContainer
      center={center}
      zoom={items.length === 1 ? 12 : 7}
      scrollWheelZoom={false}
      className="map"
    >
      <ChangeView center={center} zoom={items.length === 1 ? 12 : 7} />
      <TileLayer
        attribution='&copy; OpenStreetMap &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;