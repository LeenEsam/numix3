
import { useEffect, useState } from "react";

export default function HeroWithClouds() {
  const [showBackground, setShowBackground] = useState(false);
  const [showClouds, setShowClouds] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    // ظهور الخلفية تدريجيًا
    const bgTimer = setTimeout(() => setShowBackground(true), 200);

    // ظهور الغيوم بعد 500ms
    const cloudsTimer = setTimeout(() => setShowClouds(true), 500);

    // ظهور الشخصية بعد 1000ms
    const charTimer = setTimeout(() => setShowCharacter(true), 1000);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(cloudsTimer);
      clearTimeout(charTimer);
    };
  }, []);

  return (
    <section className="relative w-full h-[600px] overflow-hidden flex items-end justify-center" style={{
        backgroundImage: "url('/assets/img/BG.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      
      <div
        className={`absolute inset-0 transition-all duration-1000 ease-out ${
          showBackground ? "opacity-100 blur-0" : "opacity-0 blur-lg"
        }`}
        style={{
          backgroundImage: "url('/assets/img/background1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
       </div>

     
      <div className="z-10">
  
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="5100"
          height="450"
          fill="none"
          viewBox="0 0 5100 450"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            d="M2641.4 401.5C2613.31 399.999 2525.75 198 2121.01 198C1862 198 1840 264.5 1806.88 259.5C1773.77 254.499 1723.34 129.991 1562.17 136C1401 142.009 1366.58 313.5 1339 321C1311.42 328.5 1279 226.5 1034.79 234.5C802.99 242.093 724.297 318.5 697 313C669.703 307.5 681 75.9996 430.496 32.4996C214.304 -5.042 99.7464 183.937 60.6394 266.475C51.4353 285.9 27.9703 295.392 8.5729 286.129C-15.3473 274.705 -43 292.144 -43 318.652V429.5C-43 443.859 -31.3592 455.5 -16.9999 455.5H5103C5127.3 455.5 5147 435.8 5147 411.5V232.89C5147 226.643 5146.46 220.404 5144.55 214.457C5136.92 190.729 5108.7 128.5 5022.5 128.5C4881 128.5 4935 253.704 4838.83 249C4808.16 247.499 4757.27 55.5004 4535 59C4312.73 62.4996 4283.98 270.5 4250.5 268.5C4217.02 266.5 4197 199 4037.27 189.5C3834.76 177.455 3790.86 285 3753.5 279C3716.14 273 3652.96 98.8238 3377.5 153.5C3156.46 197.374 3191.5 387.48 3139.82 376.5C3118.64 371.999 3078.5 339 2948.03 339C2894.2 339 2890.37 330.676 2837.19 339C2708.5 359.141 2669.5 403 2641.4 401.5Z"
          ></path>
        </svg>
   



      </div>


{/* الشخصية الكرتونية */}
<div
  className={`absolute bottom-0 transition-all duration-1000 ease-out
    left-1/2 transform -translate-x-1/2 
    md:left-auto md:right-25 md:translate-x-0
    z-[1]  /* z-index منخفض ليكون خلف الغيوم */
    ${showCharacter ? "translate-y-0 " : "translate-y-72 "}
  `}
>
  <img
    src="/assets/img/batitdd.png"
    alt="شخصية"
    className="w-55 h-55 object-contain drop-shadow-lg" // حجم أصغر
  />
</div>




    </section>
  );
}
