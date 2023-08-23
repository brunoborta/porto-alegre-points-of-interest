import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_TOKEN_MAPBOX;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11", // style URL
  center: [-51.21235, -30.08325], // Reverse order
  zoom: 13,
  pitch: 45,
  bearing: -20,
  antialias: true,
  //   hash: true,
  minZoom: 13,
});
map.setMaxBounds(map.getBounds());

// eslint-disable-next-line no-undef
const tb = (window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
  defaultLights: true,
  enableTooltips: true,
  enableSelectingObjects: true,
  realSunlight: true,
}));

map.on("style.load", () => {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === "symbol" && layer.layout["text-field"]
  ).id;
  map.addLayer(
    {
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    },
    labelLayerId
  );
  map.addLayer({
    id: "pin",
    type: "custom",
    renderingMode: "3d",
    onAdd: function () {
      // Creative Commons License attribution:  Metlife Building model by https://sketchfab.com/NanoRay
      // https://sketchfab.com/3d-models/metlife-building-32d3a4a1810a4d64abb9547bb661f7f3
      const scale = 25;
      const options = {
        obj: "/models/pointer/scene.gltf",
        type: "gltf",
        scale: { x: scale, y: scale, z: scale },
        units: "meters",
        rotation: { x: 90, y: 90, z: 0 },
        anchor: "center",
      };

      // Hipódromo
      tb.loadObj(options, (model) => {
        model.setCoords([-51.243452, -30.088128]);
        model.addEventListener("SelectedChange", onSelectedChange);
        model.setRotation({ x: 0, y: 0, z: 90 });
        tb.add(model);
      });

      // Pontal
      tb.loadObj(options, (model) => {
        model.setCoords([-51.2473, -30.0806]);
        model.addEventListener("SelectedChange", onSelectedChange);
        model.setRotation({ x: 0, y: 0, z: 90 });
        model.position.z += 1;
        tb.add(model);
      });
    },

    render: function () {
      tb.update();
    },
  });
});

function onSelectedChange(e) {
  //if selected
  if (e.detail.selected) {
    const selectedObject = e.detail;
    console.log(selectedObject);

    //we fly smoothly to the object selected
    map.flyTo({
      center: selectedObject.coordinates,
      zoom: 16,
      curve: Math.pow(6, 0.25),
    });
  }
  tb.update();
  map.repaint = true;
}

export default map;
