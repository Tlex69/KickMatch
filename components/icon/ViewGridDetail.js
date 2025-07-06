import React from "react";
import Svg, { G, Rect, Path } from "react-native-svg";

export function ViewGridDetail(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={24} 
      height={24}
      {...props}
    >
      <G
        fill="none"
        stroke={props.color || "currentColor"}
        strokeLinejoin="round"
        strokeWidth={4}
      >
        <Rect width={36} height={36} x={6} y={6} rx={3} />
        <Path d="M13 13h8v8h-8z" />
        <Path
          strokeLinecap="round"
          d="M27 13h8m-8 7h8m-22 8h22m-22 7h22"
        />
      </G>
    </Svg>
  );
}
