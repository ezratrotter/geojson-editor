import React from "react";
import { Map, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useGlobalContext } from "../context/Context";

import { data } from "../dummydata";

const L = window.L;

const mapStyle = {
  margin: 0,
  height: "92.5vh",
};

function ReactMap() {
  const { addGeometry, editGeometry, deleteGeometry } = useGlobalContext();
  const featureRef = React.useRef();
  const mapRef = React.useRef();
  const position = [51.505, -0.09];

  // React.useEffect(() => {
  //   const map = mapRef.current.leafletElement;
  //   const geoData = L.geoJSON(data);
  //   map.addLayer(geoData);

  //   // var drawnItems = new L.FeatureGroup();
  //   var drawControl = new L.Control.Draw({
  //     edit: {
  //       featureGroup: geoData,
  //     },
  //   });

  //   map.addControl(drawControl);
  // }, []);

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
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={addGeometry}
          onEdited={editGeometry}
          onDeleted={deleteGeometry}
          draw={{
            marker: false,
          }}
        />
        <GeoJSON data={data}></GeoJSON>
      </FeatureGroup>
    </Map>
  );
}

export default ReactMap;
