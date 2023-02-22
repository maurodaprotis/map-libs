import { Card } from "@/components/Card";
import { Layout } from "@/components/Layout";
import { useMemo, useRef, useState } from "react";
import {
  GeoJSONSource,
  GeolocateControl,
  Layer,
  Map,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
  Source,
} from "react-map-gl";
import CITIES from "@/data/cities.json";
import TRANSACTIONS from "@/data/transactions.json";
import TRANSACTIONS_GEOJSON from "@/data/transactions.geojson.json";
import Pin from "@/components/Pin";
import { transactions } from "@/data/transactions.geojson";
import type { LayerProps } from "react-map-gl";

// GET TOKEN FROM https://account.mapbox.com/
const TOKEN =
  "SET TOKEN HERE!";

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "earthquakes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "earthquakes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

const ReactMapGL = () => {
  const mapRef = useRef<MapRef>(null);

  const onClick = (event) => {
    const feature = event.features?.[0];
    const clusterId = feature?.properties?.cluster_id;

    if (!clusterId && feature?.properties) {
      event.originalEvent.stopPropagation();
      setPopupInfo(feature.properties);
      const bounds = mapRef?.current?.getBounds();
      mapRef.current?.easeTo({
        center: feature.geometry.coordinates,
        zoom: Math.max(8, mapRef?.current.getZoom()),
        duration: 500,
      });

      return;
    }
    if (!clusterId) return;

    const mapboxSource = mapRef.current?.getSource(
      "earthquakes"
    ) as GeoJSONSource;

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      mapRef.current?.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      });
    });
  };

  const [popupInfo, setPopupInfo] = useState<typeof TRANSACTIONS[0] | null>(
    null
  );
  const pins = useMemo(
    () =>
      TRANSACTIONS.map((transaction, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={transaction.lon}
          latitude={transaction.lat}
          anchor="center"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(transaction);
          }}
        >
          <Pin />
        </Marker>
      )),
    []
  );

  return (
    <Layout title="react-map-gl" url="http://visgl.github.io/react-map-gl/">
      {/* <div className="flex w-full">
        <Card.Root>
          <Card.Title>Basic Example</Card.Title>
          <div className="w-full">
            <Map
              zoom={4}
              onClick={console.log}
              mapboxAccessToken="pk.eyJ1IjoibWRsZXYiLCJhIjoiY2xkbml0cDFpMGpnaDNycXVhZHFqNnozNSJ9.M0zmj3a_mqglXfOcLkxgPw"
              initialViewState={{
                zoom: 3.75,
              }}
              style={{ height: 600 }}
              mapStyle="mapbox://styles/mdlev/cldnj17oj001s01ppvdgrtzkk/draft"
            >
              <Popup
                longitude={10.5747442329221428}
                latitude={-0.04910122769607028}
                anchor="bottom"
              >
                You are here
              </Popup>
            </Map>
          </div>
        </Card.Root>
      </div> */}
      <div className="flex w-full">
        <Card.Root>
          <Card.Title>Basic Example</Card.Title>
          <div className="w-full h-[600px]">
            <Map
              ref={mapRef}
              initialViewState={{
                latitude: 40,
                longitude: -100,
                zoom: 3.5,
                bearing: 0,
                pitch: 0,
              }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              interactiveLayerIds={[
                clusterLayer.id as string,
                unclusteredPointLayer.id as string,
              ]}
              mapboxAccessToken={TOKEN}
              onClick={onClick}
              onZoom={console.log}
            >
              {/* <GeolocateControl position="top-left" /> */}
              {/* <FullscreenControl position="top-left" /> */}
              {/* <NavigationControl position="top-left" /> */}
              {/* <ScaleControl /> */}

              {/* {pins} */}

              {/* {popupInfo && (
                <Popup
                  anchor="bottom"
                  longitude={popupInfo.lon}
                  latitude={popupInfo.lat}
                  onClose={() => setPopupInfo(null)}
                >
                  <div>
                    {popupInfo.city}, {popupInfo.state} | <br />
                    {popupInfo.address_line1}, {popupInfo.zip4}
                  </div>
                </Popup>
              )} */}
              {popupInfo && (
                <Popup
                  closeOnClick={false}
                  anchor="bottom"
                  longitude={popupInfo.lon}
                  latitude={popupInfo.lat}
                  onClose={() => setPopupInfo(null)}
                >
                  <div>
                    {popupInfo.city}, {popupInfo.state} | <br />
                    {popupInfo.address_line1}, {popupInfo.zip4}
                  </div>
                </Popup>
              )}
              <Source
                id="earthquakes"
                type="geojson"
                data={transactions as any}
                cluster={true}
                clusterMaxZoom={10}
                clusterRadius={25}
              >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
              </Source>
            </Map>
          </div>
        </Card.Root>
      </div>
      {/* <div className="flex w-full">
        <Card.Root>
          <Card.Title>Basic Example</Card.Title>
          <div className="w-full h-[600px]">
            <Map
              initialViewState={{
                latitude: 40,
                longitude: -100,
                zoom: 3.5,
                bearing: 0,
                pitch: 0,
              }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              mapboxAccessToken={TOKEN}
            >

              {pins}

              {popupInfo && (
                <Popup
                  anchor="bottom"
                  longitude={popupInfo.lon}
                  latitude={popupInfo.lat}
                  onClose={() => setPopupInfo(null)}
                >
                  <div>
                    {popupInfo.city}, {popupInfo.state} | <br />
                    {popupInfo.address_line1}, {popupInfo.zip4}
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        </Card.Root>
      </div> */}
    </Layout>
  );
};

export default ReactMapGL;
