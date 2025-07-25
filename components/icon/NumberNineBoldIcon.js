import React from "react";
import Svg, { Path } from "react-native-svg";

export default function NumberNineBoldIcon({ size = 32, color = "#000" }) {
  return (
    <Svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
    >
      <Path d="M188 96a60 60 0 1 0-60 60a59 59 0 0 0 7.81-.53l-26.27 46.64a12 12 0 0 0 20.92 11.78l49.54-88A59.57 59.57 0 0 0 188 96m-96 0a36 36 0 1 1 36 36a36 36 0 0 1-36-36" />
    </Svg>
  );
}
