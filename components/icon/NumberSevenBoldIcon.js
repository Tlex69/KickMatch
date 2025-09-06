import React from "react";
import Svg, { Path } from "react-native-svg";

export default function NumberSevenBoldIcon({ size = 32, color = "#000" }) {
  return (
    <Svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
    >
      <Path
        d="m179.49 51.45-48 160A12 12 0 0 1 120 220a11.8 11.8 0 0 1-3.45-.51 12 12 0 0 1-8-14.94L151.87 60H88a12 12 0 0 1 0-24h80a12 12 0 0 1 11.49 15.45"
      />
    </Svg>
  );
}
