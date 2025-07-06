import React from "react";
import Svg, { G, Path } from "react-native-svg";

export function Ranking2(props) {
  return (
    <Svg
      viewBox="0 0 48 48"
      width={props.size || 48}
      height={props.size || 48}
      {...props}
    >
      <G fill="none" stroke={props.color || "#000"} strokeLinejoin="round" strokeWidth={4}>
        <Path strokeLinecap="round" d="M17 18H4V42H17V18Z" />
        <Path d="M30 6H17V42H30V6Z" />
        <Path strokeLinecap="round" d="M43 26H30V42H43V26Z" />
      </G>
    </Svg>
  );
}
