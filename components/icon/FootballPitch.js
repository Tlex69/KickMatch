import React from "react";
import Svg, { Path, Circle, G } from "react-native-svg";

export function FootballPitch(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 20}
      height={props.height || 20}
      {...props}
    >
      <G
        fill="none"
        stroke={props.color || "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <Path d="M2 8.571c0-2.155 0-3.232.586-3.902S4.114 4 6 4h12c1.886 0 2.828 0 3.414.67c.586.668.586 1.745.586 3.9v6.858c0 2.155 0 3.232-.586 3.902S19.886 20 18 20H6c-1.886 0-2.828 0-3.414-.67C2 18.662 2 17.585 2 15.43z" />
        <Circle cx="12" cy="12" r="2" />
        <Path d="M12 10V5m0 9v5M22 9h-2.5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H22M2 9h2.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2" />
      </G>
    </Svg>
  );
}
