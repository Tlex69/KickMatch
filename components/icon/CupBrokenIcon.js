import React from "react";
import Svg, { G, Path } from "react-native-svg";

export default function CupBrokenIcon({ size = 32, color = "#fff" }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
    >
      <G fill="none" stroke={color} strokeWidth={1.5}>
        <Path
          strokeLinecap="round"
          d="M17 2.456c.741.141 1.181.297 1.56.765c.477.586.452 1.219.401 2.485c-.18 4.553-1.2 10.294-6.96 10.294S5.22 10.26 5.038 5.706c-.05-1.266-.075-1.9.4-2.485c.476-.586 1.045-.682 2.184-.874A26.4 26.4 0 0 1 12 2q1.078.002 2 .068"
        />
        <Path d="m19 5l.949.316c.99.33 1.485.495 1.768.888S22 7.12 22 8.162v.073c0 .86 0 1.291-.207 1.643s-.584.561-1.336.98L17.5 12.5M5 5l-.949.316c-.99.33-1.485.495-1.768.888S2 7.12 2 8.162v.073c0 .86 0 1.291.207 1.643s.584.561 1.336.98L6.5 12.5" />
        <Path strokeLinecap="round" d="M12 17v2" />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.5 22h-7l.34-1.696a1 1 0 0 1 .98-.804h4.36a1 1 0 0 1 .98.804z"
        />
        <Path strokeLinecap="round" d="M18 22H6" />
      </G>
    </Svg>
  );
}
