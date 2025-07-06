import React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

export function UserRound(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.height || 24}
      {...props}
    >
      <G
        fill="none"
        stroke={props.color || "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <Circle cx="12" cy="8" r="5" />
        <Path d="M20 21a8 8 0 0 0-16 0" />
      </G>
    </Svg>
  );
}
