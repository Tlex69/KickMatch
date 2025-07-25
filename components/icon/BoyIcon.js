// components/BoyIcon.js
import React from "react";
import Svg, { G, Path } from "react-native-svg";

export default function BoyIcon({ size = 32, color = "#fff" }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <G fill={color}>
        <Path d="M9 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2m7-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10m0-2a8 8 0 0 0 7.634-10.4c-.835.226-1.713.346-2.619.346a10 10 0 0 1-8.692-5.053A8 8 0 0 0 12 20"
        />
      </G>
    </Svg>
  );
}

