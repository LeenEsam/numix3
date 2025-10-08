// src/components/DashboardSVGSection.jsx
import React, { useRef, useEffect, useState } from "react";

export default function DashboardSVGSection() {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        position: "relative",
        overflow: "hidden", // لتجنب تجاوز الأشكال
      }}
    >
      <svg
        viewBox="0 0 2036 268"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "300px",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* اللون السفلي: يملأ المساحة تحت الخط */}
        <path
          d="
            M 2026 132.5
            C 2026 132.5 1985.5 33.5 1857.5 23
            C 1729.5 12.5 1705.5 125 1676 132.5
            C 1646.5 140 1595 59.5 1481 82.4998
            C 1367 105.5 1353.5 163.83 1342 162
            C 1330.5 160.17 1342.5 105 1219.5 82.4998
            C 1096.5 59.9998 1098 168 1061.5 168
            C 1025 168 991 118.5 882.5 117
            C 774 115.5 714 168 692.5 168
            C 671 168 635 104.5 559 105
            C 483 105.5 453 168 427 168
            C 401 168 390.5 22.5 248 10.9998
            C 105.5 -0.500156 0 135.5 0 135.5
            L 0 268
            L 2036 268
            Z
          "
          fill="#f3e8ff" // اللون السفلي
        />

        {/* الخط العلوي: يظهر فوق اللون */}
        <path
          ref={pathRef}
          d="
            M 2026 132.5
            C 2026 132.5 1985.5 33.5 1857.5 23
            C 1729.5 12.5 1705.5 125 1676 132.5
            C 1646.5 140 1595 59.5 1481 82.4998
            C 1367 105.5 1353.5 163.83 1342 162
            C 1330.5 160.17 1342.5 105 1219.5 82.4998
            C 1096.5 59.9998 1098 168 1061.5 168
            C 1025 168 991 118.5 882.5 117
            C 774 115.5 714 168 692.5 168
            C 671 168 635 104.5 559 105
            C 483 105.5 453 168 427 168
            C 401 168 390.5 22.5 248 10.9998
            C 105.5 -0.500156 0 135.5 0 135.5
          "
          stroke="#f3e8ff" // اللون العلوي
          strokeWidth="5"
          fill="none"
          strokeDasharray={pathLength}
          strokeDashoffset={0}
        />
      </svg>
    </div>
  );
}
