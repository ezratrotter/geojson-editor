import "./Map.css";
import React from "react";
import { useGlobalContext } from "../context/Context";

const Map = () => {
  const [polygons, setPolygons] = React.useState({});
  const { submitPolygons } = useGlobalContext();

  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const L = window.L;
    mapRef.current = L.map("map", { drawControl: true }).setView(
      [51.505, -0.09],
      13
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(mapRef.current);

    const drawnItems = new L.featureGroup();
    mapRef.current.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        marker: false,
        featureGroup: drawnItems,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    mapRef.current.addControl(drawControl);

    mapRef.current.on(L.Draw.Event.CREATED, (e) => {
      // const type = e.layerType;
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const shapes = drawnItems.toGeoJSON();
      const shapes_DB = JSON.stringify(shapes);
      console.log(shapes_DB);
      setPolygons(shapes_DB);
      mapRef.current.addLayer(layer);
    });
  }, [mapRef]);

  return <div id="map"></div>;
};

export default Map;
