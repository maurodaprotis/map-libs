import * as React from "react";

const pinStyle = {
  cursor: "pointer",
  fill: "#9E77ED",
  stroke: "none",
};

function Pin({ size = 8 }) {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <circle cx="12" cy="12" r="12" />
    </svg>
  );
}

export default React.memo(Pin);
