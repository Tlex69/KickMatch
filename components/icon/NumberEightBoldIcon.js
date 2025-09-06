import React from "react";
import Svg, { Path } from "react-native-svg";

export default function NumberEightBoldIcon({ size = 32, color = "#000" }) {
  return (
    <Svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
    >
      <Path d="M162.44 118.91a52 52 0 1 0-68.88 0a60 60 0 1 0 68.88 0M100 80a28 28 0 1 1 28 28a28 28 0 0 1-28-28m28 124a36 36 0 1 1 36-36a36 36 0 0 1-36 36" />
    </Svg>
  );
}
