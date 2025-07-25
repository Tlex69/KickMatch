import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export function RoundSupportAgent(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 20}
      height={props.height || 20}
      {...props}
    >
      <Path
        fill={props.color || "currentColor"}
        d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28c-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2c.55 0 1-.45 1-1v-4.81c0-3.83 2.95-7.18 6.78-7.29a7.007 7.007 0 0 1 7.22 7V19h-7c-.55 0-1 .45-1 1s.45 1 1 1h7c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62"
      />
      <Circle cx="9" cy="13" r="1" fill={props.color || "currentColor"} />
      <Circle cx="15" cy="13" r="1" fill={props.color || "currentColor"} />
      <Path
        fill={props.color || "currentColor"}
        d="M18 11.03A6.04 6.04 0 0 0 12.05 6c-3.03 0-6.29 2.51-6.03 6.45a8.07 8.07 0 0 0 4.86-5.89c1.31 2.63 4 4.44 7.12 4.47"
      />
    </Svg>
  );
}
