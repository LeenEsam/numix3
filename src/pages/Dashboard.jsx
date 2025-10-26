
// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import HeroWithClouds from "../components/HeroWithClouds";
import HeroWithScrollLine from "../components/HeroWithScrollLine";
import { useRef } from "react";
import DashboardSVGScrollSection from "../components/DashboardSVGSection";

import CoursesSection from "../components/CoursesSection"

//new 7.10
import Leaderboard from "../components/Leaderboard";


export default function Dashboard() {
  /*const [classStats, setClassStats] = useState([]);
  const [topClassId, setTopClassId] = useState(null);*/
  const [menuOpen, setMenuOpen] = useState(false);
const navigate = useNavigate();
const bigDivRef = useRef(null);
const [characterVisible, setCharacterVisible] = useState(false);
const sectionRef = useRef(null); // هذا المرجع للسكشن الذي تريد التحكم فيه


const [activeSection, setActiveSection] = useState("home"); // لتحديد القسم النشط






const text = " مرحباً بك هنا استمتع بتعلم الرياضيات بطريقة ممتعة وتفاعلية مع معلمتك نظيرة النجار وارتقِ بمهاراتك خطوة بخطوة";
const [displayedText, setDisplayedText] = useState("");
const [index, setIndex] = useState(0);

// نجهز الصوت مرة واحدة فقط
const audioRef = useRef(null);

useEffect(() => {
  const audio = new Audio("/assets/sounds/keyboard-typing-asmr.mp3");
  audio.volume = 0.4;

  audio.addEventListener("canplaythrough", () => {
    //audioRef.current = audio;
  });
}, []);


useEffect(() => {
  if (index < text.length) {
    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[index]);
      setIndex((prev) => prev + 1);

      // تشغيل الصوت بدون إعادة إنشائه
      if (audioRef.current) {
        
        audioRef.current.play();
      }
    }, 70);

    return () => clearTimeout(timeout);
  }
}, [index, text]); 


const [importantItems, setImportantItems] = useState([]);
const [resourcesItems, setResourcesItems] = useState([]);
const [coursesItems, setCoursesItems] = useState([]);

useEffect(() => {
  const fetchExtras = async () => {
    // جلب الأخبار المهمة
    const { data: importantData, error: importantError } = await supabase
      .from("classes_extra")
      .select("*")
      .eq("type", "important");

    if (importantError) {
      console.error("خطأ في جلب البيانات المهمة:", importantError.message);
    } else {
      setImportantItems(importantData || []);
    }

    // جلب الموارد (روابط، ملفات)
    const { data: resourcesData, error: resourcesError } = await supabase
      .from("classes_extra")
      .select("*")
      .eq("type", "resource");

    if (resourcesError) {
      console.error("خطأ في جلب الموارد:", resourcesError.message);
    } else {
      setResourcesItems(resourcesData || []);
    }

    // جلب الكورسات فقط
    const { data: coursesData, error: coursesError } = await supabase
      .from("classes_extra")
      .select("*")
      .eq("type", "course");

    if (coursesError) {
      console.error("خطأ في جلب الكورسات:", coursesError.message);
    } else {
      setCoursesItems(coursesData || []);
    }
  };

  fetchExtras();
}, []);

 /*
  useEffect(() => {
  const fetchData = async () => {
    const { data: classesData, error: classesError } = await supabase
      .from("classes")
      .select("id, name");
    if (classesError) return console.error(classesError.message);

    const { data: studentsData, error: studentsError } = await supabase
      .from("profiles")
      .select("id, full_name, points, class_id, avatar_url");
    if (studentsError) return console.error(studentsError.message);

    const stats = classesData.map((cls) => {
      const classStudents = studentsData.filter(s => s.class_id === cls.id);

      // لا يوجد طلاب
      if (classStudents.length === 0) {
        return {
          ...cls,
          topStudent: { full_name: "لا يوجد طلاب", points: 0 },
          totalPoints: 0
        };
      }

      // تحويل النقاط لأرقام
      const classStudentsWithPoints = classStudents.map(s => ({
        ...s,
        points: Number(s.points) || 0
      }));

      // أعلى طالب
      const topStudent = classStudentsWithPoints.reduce((prev, curr) => {
        return curr.points > prev.points ? curr : prev;
      }, classStudentsWithPoints[0]);

      // مجموع النقاط
      const totalPoints = classStudentsWithPoints.reduce((sum, s) => sum + s.points, 0);

      return { ...cls, topStudent, totalPoints };
    });


    setClassStats(stats);

    // تحديد الصف صاحب أعلى مجموع نقاط
    if (stats.length > 0) {
      let topClass = stats[0]; // البداية بالصف الأول
      stats.forEach(cls => {
        if (cls.totalPoints > topClass.totalPoints) {
          topClass = cls;
        }
      });
      setTopClassId(topClass.id);
    }
  };

  fetchData();
}, []);

*/

//new
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (bigDivRef.current) {
    observer.observe(bigDivRef.current);
  }

  return () => {
    if (bigDivRef.current) {
      observer.unobserve(bigDivRef.current);
    }
  };
}, []);




const [importantIndex, setImportantIndex] = useState(0);
const [resourceIndex, setResourceIndex] = useState(0);
// التنقل في الأخبار المهمة
const scrollImportant = (direction) => {
  setImportantIndex((prev) => {
    const next = prev + direction;
    if (next < 0) return importantItems.length - 1;
    if (next >= importantItems.length) return 0;
    return next;
  });
};

// التنقل في الموارد
const scrollResources = (direction) => {
  setResourceIndex((prev) => {
    const next = prev + direction;
    if (next < 0) return resourcesItems.length - 1;
    if (next >= resourcesItems.length) return 0;
    return next;
  });
};


 //new
 const coursesSliderRef = useRef(null);
const coursesSectionRef = useRef(null);

const [isDraggingCourses, setIsDraggingCourses] = useState(false);
const [startXCourses, setStartXCourses] = useState(0);
const [scrollLeftCourses, setScrollLeftCourses] = useState(0);

// دوال مستقلة للكورسات
const startDragCourses = (e) => {
  setIsDraggingCourses(true);
  setStartXCourses(e.pageX ?? e.touches[0].pageX);
  setScrollLeftCourses(coursesSliderRef.current.scrollLeft);
};

const onDragCourses = (e) => {
  if (!isDraggingCourses) return;
  e.preventDefault();
  const x = e.pageX ?? e.touches[0].pageX;
  const walk = startXCourses - x;
  coursesSliderRef.current.scrollLeft = scrollLeftCourses + walk;
};

const endDragCourses = () => {
  setIsDraggingCourses(false);
};

useEffect(() => {
  const handleScroll = () => {
    if (!coursesSectionRef.current) return;

    const rect = coursesSectionRef.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const visiblePart =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const visiblePercentage = (visiblePart / sectionHeight) * 100;

    setCharacterVisible(visiblePercentage >= 10);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

 //end new


const resourcesSliderRef = useRef(null);
const [isDraggingResources, setIsDraggingResources] = useState(false);
const [startXResources, setStartXResources] = useState(0);
const [scrollLeftResources, setScrollLeftResources] = useState(0);

const startDragResources = (e) => {
  setIsDraggingResources(true);
  setStartXResources(e.pageX ?? e.touches[0].pageX);
  setScrollLeftResources(resourcesSliderRef.current.scrollLeft);
};

const onDragResources = (e) => {
  if (!isDraggingResources) return;
  e.preventDefault();
  const x = e.pageX ?? e.touches[0].pageX;
  const walk = startXResources - x;
  resourcesSliderRef.current.scrollLeft = scrollLeftResources + walk;
};

const endDragResources = () => {
  setIsDraggingResources(false);
};
//new

const resourcesSectionRef = useRef(null);

useEffect(() => {
  const handleScroll = () => {
    if (!resourcesSectionRef.current) return;

    const rect = resourcesSectionRef.current.getBoundingClientRect();
    const sectionHeight = rect.height;
    const visiblePart =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const visiblePercentage = (visiblePart / sectionHeight) * 100;

    //  تظهر فقط لما يظهر 10٪ من السكشن
   
    setCharacterVisible(visiblePercentage >= 10);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center ">
    
    
{/*navebare*/ }
      {/* Navbar زجاجية */}
      <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md border-b border-white/40 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center ">
          <h1 className="text-2xl font-bold text-purple-700">Numix </h1>

          {/* الروابط العادية للشاشات الكبيرة */}
         <div className="hidden md:flex space-x-6 justify-center items-center"> 
  <a
    href="#courses"
    onClick={() => setActiveSection("courses")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "courses"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
courses
  </a>

           <a
    href="#resources"
    onClick={() => setActiveSection("resources")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "resources"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
  Lesson Overview
  </a> 
           <a
    href="#important"
    onClick={() => setActiveSection("important")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "important"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
News
  </a>
             <a
    href="#whyUs"
    onClick={() => setActiveSection("whyUs")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "whyUs"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
     Why us
     
  </a>
     <a
    href="#about"
    onClick={() => setActiveSection("about")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "about"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
About 
  </a>
   <a
    href="#classespoint"
    onClick={() => setActiveSection("classespoint")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "classespoint"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
   Leaderboard
  </a>
  <a
    href="#home"
    onClick={() => setActiveSection("home")}
    className={`relative font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-purple-700 after:transition-all ${
      activeSection === "home"
        ? "text-purple-900 after:w-full"
        : "text-purple-700 after:w-0 hover:text-purple-900 hover:after:w-full"
    }`}
  >
   Home
  </a>

 

 <div>
   <button
    onClick={() => navigate("/auth")}
    className="px-4 py-2  text-purple-700 rounded-lg hover:text-white transition-colors"
  >
تسجيل الدخول  
  </button> 
  <button
    onClick={() => navigate("/auth")}
    className="px-4 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-900 transition-colors"
  >
    إنشاء حساب
  </button> </div>
</div>


          {/* برغر ميني للشاشات الصغيرة */}
          <div className="flex items-center space-x-4 md:hidden"> 
            <button
      onClick={() => navigate("/auth")}
      className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-900 transition-colors"
    >
      التسجيل
    </button>
          <button
            className="md:hidden text-purple-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
        </div>
</div>
        {/* قائمة منسدلة */}
       {menuOpen && (
  <div className="md:hidden bg-white/50 backdrop-blur-md border-t border-white/40">
    <a href="#home" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors">Home</a>
    <a href="#classespoint" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors"> Leaderboard</a>
    <a href="#whyUs" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors">   Why us</a>

 <a href="#about" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors"> About </a>

    <a href="#important" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors">News</a>
    <a href="#resources" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors">Lesson Overview</a>
    <a href="#courses" className="block px-6 py-3 text-purple-700 font-medium hover:bg-purple-100 transition-colors">courses</a>
  </div>
)}

      </nav>
{/*home  */}

<HeroWithClouds />






{/*  home*/}
<section className="w-full h-[430px] bg-white relative overflow-hidden flex items-center" id="home">
  <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 px-6 h-full">
 
   {/* صورة */}
<div className="hidden md:flex md:w-1/3 justify-center  relative">
  {/* الدائرة الخلفية */}
  <div className="flex items-center justify-center relative transform transition duration-500 hover:scale-105">
    <img 
      src="/assets/img/shape.png" 
      alt="تعليم الرياضيات للأطفال" 
      className="rounded-full object-cover"
    />
  </div>
</div>


   <div className="md:w-2/3 text-center md:text-right">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-purple-900 mb-6 leading-tight">
  {displayedText}
  <span className="animate-pulse">|</span>
</h1>
      <p className="text-purple-700 text-lg mb-6">
        تعلم الرياضيات بطريقة ممتعة وتفاعلية مع متابعة دقيقة لتقدم كل طفل.
      </p>
      <button 
        onClick={() => navigate("/auth")}
        className="bg-purple-700 text-white px-8 py-4 rounded-lg hover:bg-purple-900 transition text-lg font-semibold shadow-md mb-6"
      >
        ابدأ الآن
      </button>
    </div>
  </div>
</section>

<section className="bg-wihte h-[300px] w-full">





<div 
  ref={bigDivRef}
  style={{
    position: "relative",
    height: "600px",
    width: "100%",
    background: "transparent", 
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(50px)",
    transition: "all 1s ease",
    overflow: "hidden",

  }}
>
  {/* الخلفية السفلى */}
  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "300px", zIndex: 0  }}>
    <DashboardSVGScrollSection /> 
  </div>

  {/* الخط فوق الخلفية */}
  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "300px", zIndex: 1 }}>
    <HeroWithScrollLine />
  </div>

 
</div>



</section>
<Leaderboard />

   {/* 
  <section className="w-full py-12 bg-purple-100 min-h-[700px]" id="classespoint">



      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-purple-700">Leaderboard 🥇لوحة الشرف</h2>
        <p className="text-gray-600 mt-2"></p>
      </div>

      {/* مربعات الصفوف /}
     <div
  id="classes"
  className="w-full max-w-6xl px-4 pt-8 pb-8 flex gap-4 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory scroll-smooth"
  style={{
    minHeight: "400px",
  }}
>



        {classStats.map((cls) => (
         <div
  key={cls.id}
  className={`
    relative
    rounded-2xl snap-center min-w-[250px] sm:min-w-0
  p-6 text-center transform transition-all duration-500
    backdrop-blur-md bg-white/20 shadow-lg hover:scale-105
    ${
      cls.id === topClassId
        ? "bg-yellow-200/30 border border-yellow-400"
        : cls.topStudent.full_name === "لا يوجد طلاب"
        ? "bg-gray-100/40 text-gray-400"
        : ""
    }
  `}
  style={{
    boxShadow: cls.id === topClassId
      ? "0 0 10px 3px rgba(255, 230, 0, 0.35)" // إشعاع أصفر خفيف افتراضياً
      : "0 0 8px 2px rgba(128, 0, 128, 0.25)" // إشعاع بنفسجي خفيف افتراضياً
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = cls.id === topClassId
      ? "0 0 22px 10px rgba(255, 230, 0, 0.75)" // تقوية الإشعاع عند الهوفر
      : "0 0 20px 8px rgba(128, 0, 128, 0.6)";  // تقوية الإشعاع البنفسجي عند الهوفر
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = cls.id === topClassId
      ? "0 0 10px 3px rgba(255, 230, 0, 0.35)" // يرجع الإشعاع خفيف
      : "0 0 8px 2px rgba(128, 0, 128, 0.25)";
  }}
>

  <h3 className="text-2xl font-bold text-purple-700 mb-4">{cls.name}</h3>

  {/* صورة الطالب المتصدر /}
  {cls.topStudent.avatar_url ? (
    <img
      src={cls.topStudent.avatar_url}
      alt={cls.topStudent.full_name}
      className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md mx-auto mb-3"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
      <span className="text-gray-600 text-sm">No Avatar</span>
    </div>
  )}

  <p className="text-lg text-gray-800">
    الطالب صاحب اعلى نقاط في الصف: 🥇{" "}
    <span className="font-semibold">{cls.topStudent.full_name}</span>
  </p>
  <p className="text-gray-700">نقاطه: {cls.topStudent.points}</p>
  <p className="text-gray-700 mt-2 font-medium">مجموع نقاط الصف: {cls.totalPoints}</p>
</div>

        ))}
      </div>

 </section>
*/}


{/* new section*/}
{/* سكشن الموارد - تصميم جديد */}
<section id="resources" className="w-full py-12 px-6 bg-purple-100">
  <div className="max-w-8xl mx-auto relative" style={{ height: "900px" }}>
    <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
      تعلم معنا
    </h2>

    {resourcesItems.length === 0 ? (
      <p className="text-yellow-800 font-medium mx-auto text-center">
        لا توجد موارد حالياً.
      </p>
    ) : (
      <div className="relative w-full mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.01]">

        {/* الجزء العلوي: الصورة أو الفيديو يغطي السكشن */}
        <div className="w-full h-[700px]">
          {resourcesItems[resourceIndex].content?.image ? (
            <img
              src={supabase.storage
                .from("class_resources")
                .getPublicUrl(resourcesItems[resourceIndex].content.image).data.publicUrl}
              alt={resourcesItems[resourceIndex].title}
              className="w-full h-full object-cover"
            />
          ) : resourcesItems[resourceIndex].content?.video ? (
            <video
              src={supabase.storage
                .from("class_resources")
                .getPublicUrl(resourcesItems[resourceIndex].content.video).data.publicUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/assets/img/batot+.png"
              alt="Default"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* الجزء السفلي: التفاصيل */}
        <div className="bg-purple-50 p-6 flex flex-col justify-center text-center border-t-2 border-purple-200">
          <h3 className="font-bold text-2xl mb-3 text-purple-700">
            {resourcesItems[resourceIndex].title}
          </h3>

          {resourcesItems[resourceIndex].content?.text && (
            <p className="text-gray-700 text-sm mb-3">
              {resourcesItems[resourceIndex].content.text}
            </p>
          )}

          {resourcesItems[resourceIndex].content?.link && (
            <a
              href={resourcesItems[resourceIndex].content.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              اضغط هنا للمزيد
            </a>
          )}
        </div>

        {/* الأسهم على الأطراف للتنقل بين الموارد */}
       <button
  onClick={() => scrollResources(-1)}
  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-300 p-3 rounded-full shadow hover:bg-yellow-400 transition"
>
  &#8592;
</button>
<button
  onClick={() => scrollResources(1)}
  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-yellow-300 p-3 rounded-full shadow hover:bg-yellow-400 transition"
>
  &#8594;
</button>

      </div>
    )}
  </div>
</section>








<section className="w-full min-h-[750px] bg-purple-100 relative overflow-hidden flex items-center" id="whyUs">
  <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 px-6 h-full">
    <div className="md:w-1/2 text-center md:text-right">
    <h2 className="text-3xl md:text-4xl font-extrabold text-purple-800 mb-6">
  لماذا تسجل معنا؟
</h2>
<p className="text-purple-700 mb-8">
  منصة تعليمية مبتكرة للأطفال بإشراف المعلمة نظيرة النجار، تجمع بين المتعة والتفاعل والتكنولوجيا الحديثة
</p>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
  {[
    "تعليم ممتع وتفاعلي بإشراف المعلمة نظيرة النجار",
    "دروس مبسّطة تناسب مختلف المراحل العمرية",
    "أنشطة وألعاب تعزز الفهم وتنمّي التفكير",
    "متابعة مستمرة وتقييم تطوّر الأطفال",
    "مواكبة مستمرة للتطور باستخدام التكنولوجيا وأوراق العمل التفاعلية والذكاء الاصطناعي",
    "الالتحاق بدورات متعددة لاكتساب مهارات وخبرات متقدمة لضمان أفضل تجربة تعليمية"
  ].map((text, index) => (
    <div
      key={index}
      className="flex items-center gap-3 bg-green-200 rounded-lg p-4 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <span className="w-1/6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full font-bold animate-bounce">
        ✓
      </span>
      <span className=" w-5/6 text-purple-700 font-medium">{text}</span>
    </div>
  ))}
</div>


     
    </div>
    {/* صورة */}
    <div className="md:w-1/2 flex justify-center md:justify-end relative">
      

      {/* الدائرة الخلفية */}
      <div className="w-90 h-90 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center relative shadow-2xl z-10 transform transition duration-500 hover:scale-105">
        {/* الصورة */}
        <img 
          src="/assets/img/numiix.png" 
          alt="تعليم الرياضيات للأطفال" 
          className="w-90 h-90 rounded-full object-cover border-4 border-white shadow-xl "
        />
      </div> 
    </div>
  </div>
</section>




     
    {/* سكشن الأخبار المهمة */}
<section id="important" className="w-full py-12 px-6 bg-purple-100">
  <div className="max-w-6xl mx-auto" style={{height:"700px",}} >
    <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
  رسائل المعلمة
</h2>

    {importantItems.length === 0 ? (
      <p className="text-yellow-800 font-medium mx-auto text-center">لا توجد أخبار حالياً.</p>
    ) : (
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01] shadow-2xl
bg-white
                        w-full max-w-[900px] h-[500px] mx-auto">

          {/* نصف الكارد الأيسر: صورة أو فيديو */}
          <div className="w-full md:w-2/3 h-[250px] md:h-full">
            {importantItems[importantIndex].content?.image ? (
              <img
                src={supabase.storage
                  .from("class_resources")
                  .getPublicUrl(importantItems[importantIndex].content.image).data.publicUrl}
                alt={importantItems[importantIndex].title}
                className="w-full h-full object-cover"
              />
            ) : importantItems[importantIndex].content?.video ? (
              <video
                src={supabase.storage
                  .from("class_resources")
                  .getPublicUrl(importantItems[importantIndex].content.video).data.publicUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
             <img
  src="/assets/img/batot+1.png" 
  alt="Default"
  className="w-full h-full object-cover"
/>
            )}
          </div>

          {/* نصف الكارد الأيمن: نص ورابط */}
          <div className="w-full md:w-1/3 h-[250px] md:h-full p-6 flex flex-col justify-center bg-purple-50">
            <h3 className="font-bold text-2xl mb-4">{importantItems[importantIndex].title}</h3>

            {importantItems[importantIndex].content?.text && (
              <p className="text-gray-700 text-sm mb-3">{importantItems[importantIndex].content.text}</p>
            )}

           {importantItems[importantIndex].content?.link && (
  <a
    href={importantItems[importantIndex].content.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline text-sm mb-2 block"
  >
    اضغط هنا
  </a>
)}

          </div>
        </div>

        {/* الأسهم للتنقل بين الأخبار */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            onClick={() => scrollImportant(-1)}
            className="bg-yellow-300 p-3 rounded-full shadow hover:bg-yellow-400 transition"
          >
            &#8592;
          </button>
          <button
            onClick={() => scrollImportant(1)}
            className="bg-yellow-300 p-3 rounded-full shadow hover:bg-yellow-400 transition"
          >
            &#8594;
          </button>
        </div>
      </div>
    )}
  </div>
</section>




{/* سكشن الكورسات */}
<section id="courses" ref={coursesSectionRef} className="w-full bg-purple-100 py-20 px-10 relative overflow-visible" style={{ height: "750px" }}>

  <div className="flex justify-center items-start" style={{ minHeight: "200px" }}>
    {/* الثقب 3D + الشخصية داخل الثقب + النص */}
    <div className="relative flex items-center gap-4">
      <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-purple-400 to-purple-700 shadow-inner flex items-end justify-center overflow-visible">
        {/* الشخصية تتحرك داخل الثقب */}
        <div
          className="absolute bottom-0 w-38 h-38 transition-all duration-500"
          style={{
            opacity: characterVisible ? 1 : 0,
            transform: characterVisible ? "translate(0%, 0%)" : "translate(0, 5%)",
          }}
        >
          <img
            src="/assets/img/cbatot.png"
            alt="character"
            className="w-auto h-full object-contain"
          />
        </div>
      </div>

      {/* النص ثابت بجانب الثقب */}
      <span className="text-purple-700 font-bold text-lg" style={{ fontSize: "40px" }}>
        الدورات المتاحة 
      </span>
     
    </div>
  
  </div>
  <div className="text-center"> <p className="text-purple-700  mb-8 text-lg">انضم لنا لتتعلم الرياضيات بطريقة ممتعة </p></div>
  <style>{`
    .shadow-inner {
      box-shadow: inset 0 4px 15px rgba(0,0,0,0.4);
    }
  `}</style>

  <div className="max-w-6xl mx-auto">
      <div
    ref={coursesSliderRef}
    className={`flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth ${isDraggingResources ? 'cursor-grabbing' : 'cursor-grab'}`}
    onMouseDown={startDragCourses}
    onMouseMove={onDragCourses}
    onMouseUp={endDragCourses}
    onMouseLeave={endDragCourses}
    onTouchStart={startDragCourses}
    onTouchMove={onDragCourses}
    onTouchEnd={endDragCourses}
  >
   
      {coursesItems.length === 0 ? (
        <p className="text-purple-700 font-medium mx-auto">لا توجد كورسات حالياً.</p>
      ) : (
        coursesItems.map((item) => (
          <div key={item.id} className="w-72 h-80 snap-start flex-shrink-0 perspective">
            {/* Wrapper للكارد */}
            <div className="relative w-full h-full cursor-pointer card-wrapper">
              {/* الوجه الأمامي */}
              <div className="absolute inset-0 rounded-2xl shadow-lg card-front flex flex-col items-center justify-center overflow-hidden">
                {item.content?.image ? (
                  <img
                    src={supabase.storage.from("class_resources").getPublicUrl(item.content.image).data.publicUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : item.content?.video ? (
                  <video
                    src={supabase.storage.from("class_resources").getPublicUrl(item.content.video).data.publicUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                    <img src="/assets/img/batot+.png" alt="placeholder" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-white bg-purple-800 bg-opacity-70 px-2 py-1 rounded">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {item.content?.price && <p className="text-sm mt-1">السعر: {item.content.price}</p>}
                </div>
              </div>

              {/* الوجه الخلفي */}
              <div className="absolute inset-0 rounded-2xl shadow-lg card-back bg-purple-50 p-4 flex flex-col justify-center text-left overflow-auto">
                {item.content?.video && (
                  <video
                    src={supabase.storage.from("class_resources").getPublicUrl(item.content.video).data.publicUrl}
                    controls
                    className="w-full h-28 mt-2 rounded mb-2"
                  />
                )}
                {item.content?.link && (
                  <a
                    href={item.content.link}
                    target="_blank"
                    className="text-blue-500 hover:underline mb-2 block"
                  >
                    🔗 اضغط هنا
                  </a>
                )}
                {item.content?.caption && <p className="text-gray-700">{item.content.caption}</p>}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>

  <style>{`
    .perspective {
      perspective: 1000px;
    }
    .card-wrapper:hover .card-front {
      transform: rotateY(180deg);
    }
    .card-wrapper:hover .card-back {
      transform: rotateY(0deg);
    }
    .card-front, .card-back {
      width: 100%;
      height: 100%;
      position: absolute;
      backface-visibility: hidden;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }
    .card-front {
      transform: rotateY(0deg);
    }
    .card-back {
      transform: rotateY(180deg);
    }
  `}</style>
</section>


<section className="w-full bg-purple-100 py-12 px-6 relative overflow-hidden">
<CoursesSection />
</section>



    <footer className="bg-purple-50 text-purple-700 py-8 px-4 mt-auto w-full" >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* معلومات التواصل */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h2 className="font-bold text-lg">تواصل معنا</h2>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8zm-2 0l-7 5-7-5h14zm0 10H5V8l7 5 7-5v10z"/>
            </svg>
            <a href="mailto:leen@example.com" className="hover:underline">
            Alnajjarnana26@gmail.com

            </a>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24 11.36 11.36 0 0 0 3.55.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.55 1 1 0 0 1-.24 1.05l-2.21 2.19z"/>
            </svg>
            <a href="tel:+962788697501" className="hover:underline">
           +962788697501
              </a>
          </div>
        </div>

        {/* وسائل التواصل */}
        <div className="flex items-center gap-4">
          {/* Facebook */}
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 3h-2.4v7A10 10 0 0 0 22 12z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-purple-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.8 8s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.6 5 12 5 12 5s-3.6 0-6.9.1c-.4 0-1.3 0-2.1.9C2.4 6.5 2.2 8 2.2 8S2 9.5 2 11v2c0 1.5.2 3 .2 3s.2 1.5.8 2.1c.8.8 1.8.8 2.2.9 1.6.1 6.8.1 6.8.1s3.6 0 6.9-.1c.4 0 1.3 0 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.5.2-3v-2c0-1.5-.2-3-.2-3zM10 14V10l4 2-4 2z"/>
            </svg>
          </a>
        </div>
      </div>
{/* الخط الفاصل */}
  <div className="my-4 border-t border-purple-300 w-full"></div>
      {/* رابط الحقوق */}
      <div className="text-center mt-6 text-sm text-purple-700">
        <a 
          href="https://leenesam.github.io/portfolio/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          © 2025 Eng.Leen Abdelazeez | كل الحقوق محفوظة
        </a>
      </div>
    </footer>
 


    </div>
    
  );
}

