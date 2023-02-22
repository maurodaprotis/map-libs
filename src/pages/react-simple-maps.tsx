import { Card } from "@/components/Card";
import { Layout } from "@/components/Layout";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
import allStates from "@/data/allStates.json";

// FL #B692F6
// NY #53389E
// CA #F4EBFF
// OR #F4EBFF
// NV #F4EBFF
// AZ #F4EBFF
const customStates = {
  FL: "#B692F6",
  NY: "#53389E",
  CA: "#F4EBFF",
  OR: "#F4EBFF",
  NV: "#F4EBFF",
  AZ: "#F4EBFF",
};

const allColoredStates = allStates.map((state) => {
  const color = (customStates as any)[state.id] ?? "#F9FAFB";

  return {
    ...state,
    color,
  };
});

const ReactSimpleMaps = () => {
  return (
    <Layout title="react-simple-maps" url="https://www.react-simple-maps.io/">
      <div className="flex w-full">
        <Card.Root>
          <Card.Title>US States (Albers Projection)</Card.Title>
          <div className="w-full">
            <ComposableMap projection="geoAlbersUsa">
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const state = allColoredStates.find(
                        (state) => state.val === geo.id
                      );

                      return (
                        <Geography
                          key={geo.rsmKey}
                          stroke="#D0D5DD"
                          geography={geo}
                          fill={state?.color ?? "#F9FAFB"}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </Card.Root>
      </div>
    </Layout>
  );
};

export default ReactSimpleMaps;
