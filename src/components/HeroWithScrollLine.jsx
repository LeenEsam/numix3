
import { useRef, useEffect, useState } from "react";

export default function HeroScrollLineSection() {
  const pathRef = useRef(null);
  const sectionRef = useRef(null);
  const [dashOffset, setDashOffset] = useState(0);

  useEffect(() => {
    const pathLength = pathRef.current.getTotalLength();
    setDashOffset(pathLength); // بداية الخط مخفي بالكامل

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // نحسب نسبة التمرير داخل السكشن (0 → بداية السكشن، 1 → نهاية السكشن)
      let scrollFraction = (windowHeight - sectionTop) / (sectionHeight + windowHeight);
      scrollFraction = Math.min(Math.max(scrollFraction, 0), 1);

      // نحرك الخط بناءً على النسبة
      setDashOffset(pathLength * (1 - scrollFraction));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ height: "700px", position: "relative" }}>
      {/* هذا هو السكشن الذي سيتحرك داخله الخط */}
      <div
        ref={sectionRef}
        style={{ height: "30px", marginTop: "30px", position: "relative" }}
      >
        <svg
          viewBox="0 0 2036 268"
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: "300px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
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
            stroke="#7e22ce"
            strokeWidth="5"
            fill="none"
            strokeDasharray={pathRef.current?.getTotalLength()}
            strokeDashoffset={dashOffset}
          />
        </svg>
      </div>
    </div>
  );
}
