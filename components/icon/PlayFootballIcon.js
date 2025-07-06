import React from "react";
import Svg, { G, Path } from "react-native-svg";

export default function PlayFootballIcon({ size = 32, color = "#fff" }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
    >
      <G
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <Path d="M11 4a1 1 0 1 0 2 0a1 1 0 0 0-2 0M3 17l5 1l.75-1.5M14 21v-4l-4-3l1-6" />
        <Path d="M6 12V9l5-1l3 3l3 1" />
        <Path fill={color} d="M19.5 20a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1" />
      </G>
    </Svg>
  );
}
