
// src/pages/Lesson.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../Navbar";


 export default function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  
  const [pdfFile, setPdfFile] = useState(null);
  //new
  const [workPdfFile, setWorkPdfFile] = useState(null); // ملف PDF لأوراق العمل
const [examPdfFile, setExamPdfFile] = useState(null); // ملف PDF للاختبارات

  const [videoFile, setVideoFile] = useState(null);
  const [workUrl, setWorkUrl] = useState("");
  const [examUrl, setExamUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");



const [progressData, setProgressData] = useState({});

// src/pages/Lesson.jsx
const fetchProgress = async () => {
  if (!lessonId) return;

  try {
    const { data, error } = await supabase
      .from("progress")
      .select(`
        id,
        url,
        created_at,
        profiles(full_name, avatar_url)
      `)
      .eq("lesson_id", lessonId);

    if (error) throw error;

    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.url]) grouped[item.url] = [];
      grouped[item.url].push({
        student: item.profiles?.full_name || "غير معروف",
        avatar: item.profiles?.avatar_url || "/default-avatar.png", // ✅ إضافة الافاتار
        time: item.created_at,
      });
    });

    setProgressData(grouped);
  } catch (err) {
    console.error("Error fetching progress:", err.message);
  }
};



  // جلب المستخدم والبروفايل
  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!error) setProfile(profileData);
      } else {
        navigate("/"); // إعادة توجيه إذا لم يكن المستخدم مسجّل الدخول
      }
    };
    getUserAndProfile();
  }, [navigate]);


  //new
useEffect(() => {
  if (lessonId) {
    fetchLesson().then(() => fetchProgress());
  }
}, [lessonId]);


  const fetchLesson = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();
    if (!error) setLesson(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };


  //new
const handleFileUpload = async (file, type) => {
  if (!file) return alert("اختر ملف أولاً");
  const fileName = `${Date.now()}_${file.name}`;

  // رفع الملف
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("lesson-files")
    .upload(fileName, file);
  if (uploadError) return alert(uploadError.message);

  // جلب الرابط العام
  const { data: publicData, error: urlError } = supabase
    .storage
    .from("lesson-files")
    .getPublicUrl(fileName);
  if (urlError) return alert(urlError.message);

  const fileUrl = publicData.publicUrl;

  // تحديد الحقل في جدول الدروس حسب النوع
  const field =
    type === "pdf" ? "pdf_urls" :
    type === "workPdf" ? "worksheet_urls" :
    type === "examPdf" ? "test_urls" :
    type === "video" ? "video_urls" : null;

  if (!field) return alert("نوع الملف غير مدعوم");

  // جلب البيانات الحالية وتحديثها
  const { data: currentLesson } = await supabase
    .from("lessons")
    .select(field)
    .eq("id", lessonId)
    .single();

  const updated = [...(currentLesson[field] || []), fileUrl];

  const { error: updateError } = await supabase
    .from("lessons")
    .update({ [field]: updated })
    .eq("id", lessonId);

  if (updateError) return alert(updateError.message);

  fetchLesson();

  // إعادة تعيين حالة الملف بعد الرفع
  if (type === "pdf") setPdfFile(null);
  if (type === "video") setVideoFile(null);
  if (type === "workPdf") setWorkPdfFile(null);
  if (type === "examPdf") setExamPdfFile(null);
};


  /*
  const handleFileUpload = async (file, type) => {
  if (!file) return alert("اختر ملف أولاً");
  const fileName = `${Date.now()}_${file.name}`;

  // رفع الملف
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("lesson-files")
    .upload(fileName, file);
  if (uploadError) return alert(uploadError.message);

  // جلب الرابط العام
  const { data: publicData, error: urlError } = supabase
    .storage
    .from("lesson-files")
    .getPublicUrl(fileName);
  if (urlError) return alert(urlError.message);

  const fileUrl = publicData.publicUrl;  

  
  const field = type === "pdf" ? "pdf_urls" : "video_urls";




  const { data: currentLesson } = await supabase
    .from("lessons")
    .select(field)
    .eq("id", lessonId)
    .single();

  const updated = [...(currentLesson[field] || []), fileUrl];

  const { error: updateError } = await supabase
    .from("lessons")
    .update({ [field]: updated })
    .eq("id", lessonId);

  if (updateError) return alert(updateError.message);
  fetchLesson();

  if (type === "pdf") setPdfFile(null);
  if (type === "video") setVideoFile(null);
};
*/

  // ✅ إضافة رابط (ورقة عمل / اختبار / فيديو)
  const handleAddUrl = async (url, type) => {
    if (!url.trim()) return alert("الرجاء إدخال الرابط");

    const field =
      type === "work"
        ? "worksheet_urls"
        : type === "exam"
        ? "test_urls"
        : "video_urls";

    const { data: currentLesson } = await supabase
      .from("lessons")
      .select(field)
      .eq("id", lessonId)
      .single();

    const updated = [...(currentLesson[field] || []), url];

    const { error } = await supabase
      .from("lessons")
      .update({ [field]: updated })
      .eq("id", lessonId);

    if (error) return alert(error.message);
    fetchLesson();

    if (type === "work") setWorkUrl("");
    if (type === "exam") setExamUrl("");
    if (type === "video") setVideoUrl("");
  };

  // ✅ تعديل رابط
  const handleEdit = async (oldUrl, newUrl, type) => {
    const field =
      type === "pdf"
        ? "pdf_urls"
        : type === "video"
        ? "video_urls"
        : type === "work"
        ? "worksheet_urls"
        : "test_urls";

    const updatedUrls = lesson[field].map((u) => (u === oldUrl ? newUrl : u));

    const { error } = await supabase
      .from("lessons")
      .update({ [field]: updatedUrls })
      .eq("id", lessonId);

    if (error) return alert(error.message);
    fetchLesson();
  };

  // ✅ حذف رابط
  const handleDelete = async (url, type) => {
    const field =
      type === "pdf"
        ? "pdf_urls"
        : type === "video"
        ? "video_urls"
        : type === "work"
        ? "worksheet_urls"
        : "test_urls";

    const updatedUrls = lesson[field].filter((u) => u !== url);

    const { error } = await supabase
      .from("lessons")
      .update({ [field]: updatedUrls })
      .eq("id", lessonId);

    if (error) return alert(error.message);
    fetchLesson();
  };

  const handleClickResource = async (url, type) => {
    try {
      // افتح الرابط
      window.open(url, "_blank");

      // سجّل التقدّم في جدول progress
      if (user && profile) {
        const { error } = await supabase.from("progress").insert([
          {
            user_id: user.id,
            full_name: profile.full_name, // تأكد أن عندك هذا الحقل في profiles
            url: url,
            lesson_id: lessonId,
            type: type,
          },
        ]);

        if (error) {
          console.error("خطأ أثناء حفظ التقدم:", error.message);
        } else {
          // حدّث البيانات بعد التسجيل
          fetchProgress();
        }
      }
    } catch (err) {
      console.error("Error opening resource:", err.message);
    }
  };




  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
  user={user}
  profile={profile}
  handleSignOut={handleSignOut}
  currentClass={null}   // لا نعرض الصف الحالي
  classes={[]}          // لا نعرض قائمة الصفوف
  onClassSelect={() => {}} // دالة فارغة، لن يتم استخدام الاختيار
/>



      <div className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-700">
          {lesson?.title}
        </h1>
        <p className="text-gray-700">{lesson?.description}</p>

        {/* رفع PDF */}
        <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-center">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="border p-2 rounded flex-1"
          />
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            onClick={() => handleFileUpload(pdfFile, "pdf")}
          >
            رفع PDF
          </button>
        </div>

        {/* إضافة رابط ورقة عمل */}
        <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-center">
          <input
            type="url"
            placeholder="رابط ورقة عمل"
            value={workUrl}
            onChange={(e) => setWorkUrl(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              onClick={() => handleAddUrl(workUrl, "work")}

          >
            إضافة رابط
          </button>
        </div>
{/* رفع ورقة عمل PDF */}
<div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-center">
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setWorkPdfFile(e.target.files[0])}
    className="border p-2 rounded flex-1"
  />
  <button
    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
    onClick={() => handleFileUpload(workPdfFile, "workPdf")}
  >
    رفع ورقة عمل PDF
  </button>
</div>
        {/* إضافة رابط اختبار */}
        <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-center">
          <input
            type="url"
            placeholder="رابط اختبار"
            value={examUrl}
            onChange={(e) => setExamUrl(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => handleAddUrl(examUrl, "exam")}

          >
            إضافة اختبار
          </button>
        </div>
{/* رفع اختبار PDF */}
<div className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-2 items-center">
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setExamPdfFile(e.target.files[0])}
    className="border p-2 rounded flex-1"
  />
  <button
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    onClick={() => handleFileUpload(examPdfFile, "examPdf")}
  >
    رفع اختبار PDF
  </button>
</div>
        {/* رفع فيديو أو إضافة رابط */}
        <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
          <input
            type="url"
            placeholder="رابط فيديو"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
            onClick={() => handleAddUrl(videoUrl, "video")}

          >
            إضافة رابط فيديو
          </button>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="border p-2 rounded flex-1"
          />
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded"
            onClick={() => handleFileUpload(videoFile, "video")}

          >
            رفع فيديو
          </button>
        </div>

{/* عرض الموارد */}
<div className="bg-white p-4 rounded shadow">
  <h2 className="font-semibold mb-4 text-lg md:text-xl">📂 الموارد المضافة</h2>

  {/* PDF */}
  <div className="mb-6">
    <h3 className="font-bold mb-2">📘 ملفات PDF</h3>
    <ul className="flex flex-col gap-2">
      {lesson?.pdf_urls?.map((url, idx) => (
        <li
          key={idx}
          className="bg-purple-50 p-4 rounded shadow flex flex-col gap-2
                     hover:bg-purple-100 hover:shadow-lg transition-colors transition-shadow duration-200"
        >
          <button
            className="text-purple-600 underline break-words flex-1"
            onClick={() => handleClickResource(url, "pdf")}
          >
            {url}
          </button>

          {progressData[url] && progressData[url].length > 0 && (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-purple-700 font-semibold">الطالب</th>
                    <th className="px-4 py-2 text-left text-purple-700 font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData[url].map((entry, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={entry.avatar}
                          alt={entry.student}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {entry.student}
                      </td>
                      <td className="px-4 py-2">{new Date(entry.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 mt-1 sm:mt-0">
            <button
              className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
              onClick={() => {
                const newUrl = prompt("ضع الرابط الجديد:", url);
                if (newUrl) handleEdit(url, newUrl, "pdf");
              }}
            >
              تعديل
            </button>
            <button
              className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              onClick={() => handleDelete(url, "pdf")}
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* الفيديوهات */}
  <div className="mb-6">
    <h3 className="font-bold mb-2">🎥 الفيديوهات</h3>
    <ul className="flex flex-col gap-2">
      {lesson?.video_urls?.map((url, idx) => (
        <li
          key={idx}
          className="bg-orange-50 p-4 rounded shadow flex flex-col gap-2
                     hover:bg-orange-100 hover:shadow-lg transition-colors transition-shadow duration-200"
        >
          <button
            className="text-orange-600 underline break-words flex-1"
            onClick={() => handleClickResource(url, "video")}
          >
            {url}
          </button>

          {progressData[url] && progressData[url].length > 0 && (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-orange-700 font-semibold">الطالب</th>
                    <th className="px-4 py-2 text-left text-orange-700 font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData[url].map((entry, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-orange-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={entry.avatar}
                          alt={entry.student}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {entry.student}
                      </td>
                      <td className="px-4 py-2">{new Date(entry.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 mt-1 sm:mt-0">
            <button
              className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
              onClick={() => {
                const newUrl = prompt("ضع الرابط الجديد:", url);
                if (newUrl) handleEdit(url, newUrl, "video");
              }}
            >
              تعديل
            </button>
            <button
              className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              onClick={() => handleDelete(url, "video")}
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* أوراق العمل */}
  <div className="mb-6">
    <h3 className="font-bold mb-2">📄 أوراق العمل</h3>
    <ul className="flex flex-col gap-2">
      {lesson?.worksheet_urls?.map((url, idx) => (
        <li
          key={idx}
          className="bg-green-50 p-4 rounded shadow flex flex-col gap-2
                     hover:bg-green-100 hover:shadow-lg transition-colors transition-shadow duration-200"
        >
          <button
            className="text-green-600 underline break-words flex-1"
            onClick={() => handleClickResource(url, "work")}
          >
            {url}
          </button>

          {progressData[url] && progressData[url].length > 0 && (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-green-700 font-semibold">الطالب</th>
                    <th className="px-4 py-2 text-left text-green-700 font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData[url].map((entry, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-green-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={entry.avatar}
                          alt={entry.student}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {entry.student}
                      </td>
                      <td className="px-4 py-2">{new Date(entry.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 mt-1 sm:mt-0">
            <button
              className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
              onClick={() => {
                const newUrl = prompt("ضع الرابط الجديد:", url);
                if (newUrl) handleEdit(url, newUrl, "work");
              }}
            >
              تعديل
            </button>
            <button
              className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              onClick={() => handleDelete(url, "work")}
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* الاختبارات */}
  <div>
    <h3 className="font-bold mb-2">📝 الاختبارات</h3>
    <ul className="flex flex-col gap-2">
      {lesson?.test_urls?.map((url, idx) => (
        <li
          key={idx}
          className="bg-blue-50 p-4 rounded shadow flex flex-col gap-2
                     hover:bg-blue-100 hover:shadow-lg transition-colors transition-shadow duration-200"
        >
          <button
            className="text-blue-600 underline break-words flex-1"
            onClick={() => handleClickResource(url, "test")}
          >
            {url}
          </button>

          {progressData[url] && progressData[url].length > 0 && (
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-blue-700 font-semibold">الطالب</th>
                    <th className="px-4 py-2 text-left text-blue-700 font-semibold">الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData[url].map((entry, i) => (
                    <tr key={i} className="border-b last:border-b-0 hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                          src={entry.avatar}
                          alt={entry.student}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {entry.student}
                      </td>
                      <td className="px-4 py-2">{new Date(entry.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-2 mt-1 sm:mt-0">
            <button
              className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
              onClick={() => {
                const newUrl = prompt("ضع الرابط الجديد:", url);
                if (newUrl) handleEdit(url, newUrl, "test");
              }}
            >
              تعديل
            </button>
            <button
              className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
              onClick={() => handleDelete(url, "test")}
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>




      </div>
    </div>
  );
} 