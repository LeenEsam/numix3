
//نسخة بتشتغل 100%8-9-2025

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../Navbar";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // للتحكم في إظهار الروابط
  const [showBook, setShowBook] = useState(false);
  const [showPDFs, setShowPDFs] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [showTests, setShowTests] = useState(false);

  const navigate = useNavigate();
const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // جلب المستخدم والبروفايل والصفوف
  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) return console.error("Error fetching user:", userError.message);

      if (user) {
        setUser(user);
        await fetchProfile(user.id);
        await fetchClasses();
      }
    };
    getUserAndData();
  }, []);

  // جلب البروفايل
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;

      setProfile(data);

      if (data.class_id) {
        const { data: classData } = await supabase
          .from("classes")
          .select("name")
          .eq("id", data.class_id)
          .single();
        setCurrentClass(classData?.name || null);

        // جلب الدروس الخاصة بالصف
        fetchLessons(data.class_id);
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };

  // جلب جميع الصفوف
  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err.message);
    }
  };

  // جلب الدروس الخاصة بصف معين
  const fetchLessons = async (classId) => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("class_id", classId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setLessons(data);
    } catch (err) {
      console.error("Error fetching lessons:", err.message);
    }
  };

  // تحديث الصف عند اختيار الطالب
  const handleClassSelect = async (classId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ class_id: classId })
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;

      setProfile(data);

      const cls = classes.find((c) => c.id === classId);
      setCurrentClass(cls?.name || null);

      // جلب الدروس الخاصة بالصف
      fetchLessons(classId);
    } catch (err) {
      console.error("Error updating class_id:", err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate("/"); // رجوع للصفحة الرئيسية
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
  };

//new
// دالة لتسجيل التقدم وزيادة نقاط الطالب
const addProgress = async (action, url, points = 10) => {
  if (!user || !selectedLesson) return;

  // 🔍 تحقق أولاً إذا الطالب سجل نفس المورد من قبل
  const { data: existing, error: checkError } = await supabase
    .from("progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", selectedLesson.id)
    .eq("url", url)
    .eq("action", action)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking progress:", checkError);
    return;
  }

  if (existing) {
    console.log("⚠️ هذا المورد تم فتحه مسبقًا، لن تتم إضافة نقاط جديدة.");
    return; // لا نضيف نقاط إذا كان الطالب فتح نفس الرابط من قبل
  }

  // 🟢 تسجيل الحدث في جدول progress
  const { error } = await supabase.from("progress").insert([
    {
      user_id: user.id,
      lesson_id: selectedLesson.id,
      action,
      url,
      points,
    },
  ]);

  if (error) {
    console.error("Error adding progress:", error);
  } else {
    // 🟢 زيادة نقاط الطالب باستخدام الـ RPC
    const { error: pointsError } = await supabase.rpc("increment_user_points", {
      uid: user.id,
      delta: points,
    });
    if (pointsError) console.error("Error incrementing points:", pointsError);
  }
};

const handleClickResource = async (url, type) => {
  let points;
  let action = type; // 🔹 هنا نحدد نوع المورد

switch (type) {
  case "pdf":
    points = 5;   
    break;
  case "work":
    points = 20;  
    break;
  case "video":
    points = 15;  
        break;
  case "test":
    points = 10;  
    break;
  default:
    points = 5;   
    break;
}


  await addProgress(action, url, points);
 // تسجيل التقدم والنقاط
  window.open(url, "_blank", "noopener,noreferrer"); // فتح الرابط في نافذة جديدة
};






  return (
    <div className="min-h-screen flex flex-col " style={{ backgroundColor: "#cae7f9" }}>
      <Navbar
        user={user}
        profile={profile}
        handleSignOut={handleSignOut}
        currentClass={currentClass}
        classes={classes}
        onClassSelect={handleClassSelect}
      />

      <div className="flex flex-1">
       {/* Sidebar للدروس */}
{/* زر فتح السايدبار على الموبايل */}
<button
  className="sm:hidden p-2 m-2 bg-purple-500 text-white rounded"
  onClick={() => setIsSidebarOpen(true)}
>
  ☰ الدروس
</button>

{/* السايدبار نفسه */}
<div
  className={`fixed inset-y-0 left-0 bg-white p-4 border-r w-64 transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  sm:translate-x-0 sm:relative sm:flex flex-col overflow-y-auto z-20`} // ← أضفنا flex-col وoverflow-y-auto
>
  <h2 className="text-xl font-bold mb-4 text-purple-700">📘 الدروس</h2>

  {currentClass ? (
    lessons.length > 0 ? (
      lessons.map((lesson) => (
        <div
          key={lesson.id}
          className={`p-2 rounded cursor-pointer mb-2 ${
            selectedLesson?.id === lesson.id
              ? "bg-purple-200 font-semibold"
              : "hover:bg-purple-100"
          }`}
          onClick={() => {
            setSelectedLesson(lesson);
            setShowBook(false);
            setShowPDFs(false);
            setShowVideos(false);
            setShowTests(false);
            setIsSidebarOpen(false); // ← يغلق السايدبار على الموبايل عند اختيار درس
          }}
        >
          {lesson.title}
        </div>
      ))
    ) : (
      <p className="text-gray-500">لا يوجد دروس بعد.</p>
    )
  ) : (
    <p className="text-gray-500">اختر صفك لعرض الدروس.</p>
  )}

  {/* زر إغلاق السايدبار على الموبايل */}
  <button
    className="sm:hidden mt-4 p-2 w-full bg-red-500 text-white rounded"
    onClick={() => setIsSidebarOpen(false)}
  >
    إغلاق
  </button>
</div>


        {/* Main content* */}
        <div className="flex-1 p-6 z-6" style={{ backgroundColor: "#cae7f9" }}>

          
          <p className="text-3xl font-bold text-purple-700 mb-4">
            {profile?.full_name
              ? `مرحباً ${profile.full_name} 👋`
              : "جاري تحميل بياناتك..."}
          </p>
          {currentClass ? (
            <p className="mt-4 text-green-600 font-semibold" 
>
              أنت الآن مسجل في صف: {currentClass}
            </p>
          ) : (
            <p className="mt-4 text-red-600 font-semibold">
              الرجاء اختيار صفك من القائمة في الأعلى.
            </p>
          )}

          {/* تفاصيل الدرس */}
        {selectedLesson && (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
    <p className="text-gray-700 mb-6">{selectedLesson.description}</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
      {/* ملف الكتاب PDF */}
      <div className="bg-red-100 hover:bg-red-200 shadow-md rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105 z-10">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">📄</span>
          <h3 className="font-semibold mb-2 text-red-800">ملف الكتاب PDF</h3>
          <p className="text-sm text-red-700">
            {selectedLesson.pdf_urls?.length || 0} ملفات
          </p>
        </div>
        <button
          onClick={() => setShowBook(!showBook)}
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          {showBook ? "إخفاء" : "عرض"}
        </button>

        {/* الموارد داخل الكارد */}
        {showBook && selectedLesson.pdf_urls?.length > 0 && (
          <div className="mt-2 space-y-1">
            {selectedLesson.pdf_urls.map((url, i) => (
              <button
                key={i}
                onClick={() => handleClickResource(url, "pdf")}
                className="w-full text-left text-red-600 underline"
              >
                ملف PDF {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* أوراق العمل */}
      <div className="bg-blue-100 hover:bg-blue-200 shadow-md rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105 z-10">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">🧮</span>
          <h3 className="font-semibold mb-2 text-blue-800">أوراق العمل</h3>
          <p className="text-sm text-blue-700">
            {selectedLesson.worksheet_urls?.length || 0} أوراق
          </p>
        </div>
        <button
          onClick={() => setShowPDFs(!showPDFs)}
          className="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {showPDFs ? "إخفاء" : "عرض"}
        </button>

        {showPDFs && selectedLesson.worksheet_urls?.length > 0 && (
          <div className="mt-2 space-y-1">
            {selectedLesson.worksheet_urls.map((url, i) => (
              <button
                key={i}
                onClick={() => handleClickResource(url, "work")}
                className="w-full text-left text-blue-600 underline"
              >
                ورقة عمل {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* الفيديوهات */}
      <div className="bg-green-100 hover:bg-green-200 shadow-md rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105 z-10">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">🎬</span>
          <h3 className="font-semibold mb-2 text-green-800">الفيديوهات</h3>
          <p className="text-sm text-green-700">
            {selectedLesson.video_urls?.length || 0} فيديوهات
          </p>
        </div>
        <button
          onClick={() => setShowVideos(!showVideos)}
          className="mt-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {showVideos ? "إخفاء" : "عرض"}
        </button>

        {showVideos && selectedLesson.video_urls?.length > 0 && (
          <div className="mt-2 space-y-1">
            {selectedLesson.video_urls.map((url, i) => (
              <button
                key={i}
                onClick={() => handleClickResource(url, "video")}
                className="w-full text-left text-green-600 underline"
              >
                فيديو {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* الاختبارات */}
      <div className="bg-purple-100 hover:bg-purple-200 shadow-md rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105 z-10">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">📝</span>
          <h3 className="font-semibold mb-2 text-purple-800">الاختبارات</h3>
          <p className="text-sm text-purple-700">
            {selectedLesson.test_urls?.length || 0} اختبارات
          </p>
        </div>
        <button
          onClick={() => setShowTests(!showTests)}
          className="mt-4 bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
        >
          {showTests ? "إخفاء" : "عرض"}
        </button>

        {showTests && selectedLesson.test_urls?.length > 0 && (
          <div className="mt-2 space-y-1">
            {selectedLesson.test_urls.map((url, i) => (
              <button
                key={i}
                onClick={() => handleClickResource(url, "test")}
                className="w-full text-left text-purple-600 underline"
              >
                اختبار {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

  
  </div>
)}



        </div>
      </div>
     

<div className="fixed bottom-4 right-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-72 lg:h-72 -z-1">
  <img
    src="/assets/img/batot+1.png"
    alt="شخصية كرتونية "
    className="w-full h-full object-contain"
  />
</div>




    </div>
  );
} 