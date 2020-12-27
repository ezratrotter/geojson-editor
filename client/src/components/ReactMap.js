import React from "react";
import { Map, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useGlobalContext } from "../context/Context";

const mapStyle = {
  margin: 0,
  height: "92.5vh",
};

function ReactMap() {
  const { addGeometry, editGeometry, deleteGeometry } = useGlobalContext();
  const featureRef = React.useRef();
  const mapRef = React.useRef();

  const position = [51.505, -0.09];

  React.useEffect(() => {
    console.log("render");
  }, []);

  return (
    <Map
      ref={mapRef}
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={mapStyle}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={featureRef}>
        <EditControl
          position="topright"
          onCreated={addGeometry}
          onEdited={editGeometry}
          onDeleted={deleteGeometry}
          draw={{
            marker: false,
          }}
        />
      </FeatureGroup>
    </Map>
  );
}

export default ReactMap;
