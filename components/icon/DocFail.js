import React from "react";
import Svg, { Path } from "react-native-svg";

export function DocFail(props) {
  const size = props.size || 48;
  const color = props.color || "#383838"; 

  return (
    <Svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <Path
        d="M38 4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 30h14M17 36h7M20 21l8-8m0 8l-8-8"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
