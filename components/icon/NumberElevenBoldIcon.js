import React from "react";
import Svg, { Path, G } from "react-native-svg";

export default function NumberElevenBoldIcon({ size = 32, color = "#000" }) {
  return (
    <Svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill={color}
    >
      <G>
        <Path d="M148 48v160a12 12 0 0 1-24 0V69.19l-21.83 13.1a12 12 0 0 1-12.34-20.58l40-24A12 12 0 0 1 148 48"   translateX={-40} 
/>
        <Path
          d="M188 48v160a12 12 0 0 1-24 0V69.19l-21.83 13.1a12 12 0 0 1-12.34-20.58l40-24A12 12 0 0 1 188 48"
          translateX={15} 
        />
      </G>
    </Svg>
  );
}
