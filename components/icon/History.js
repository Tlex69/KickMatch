import React from "react";
import Svg, { Path } from "react-native-svg";

export function History(props) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={props.width || 26}
      height={props.height || 26}
      fill="none"
      {...props}
    >
      <Path
        fill={props.color || "currentColor"}
        d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18m-1 5v5l4.25 2.52l.77-1.28l-3.52-2.09V8z"
      />
    </Svg>
  );
}
