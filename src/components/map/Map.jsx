import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import { useEffect } from "react";

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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        // UPDATED TO TRUE DARK MODE TILES:
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;