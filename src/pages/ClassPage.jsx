
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../Navbar";
import { useParams, useNavigate } from "react-router-dom";

export default function ClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", description: "" });
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ إضافة state خاص بالصف الحالي
  const [currentClass, setCurrentClass] = useState(null);


  // جلب معلومات المستخدم والبروفايل
  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!profileError) setProfile(profileData);
        fetchClasses(user.id);
      }
    };
    getUserAndProfile();
  }, []);


const fetchStudents = async (selectedClassId) => {
  if (!selectedClassId) return;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, points, avatar_url")
      .eq("role", "student")               // فقط الطلاب
      .eq("class_id", selectedClassId);    // الصف المحدد (UUID)

    if (error) throw error;

    setStudents(data || []);
    console.log(`Students in class ${selectedClassId}:`, data);
  } catch (err) {
    console.error("Error fetching students:", err.message);
    setStudents([]);
  }
};



  const fetchClassInfo = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();
    if (!error) setClassInfo(data);
  };

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
      fetchStudents(classId);
      fetchLessons();
      setCurrentClass(classId); // ✅ ضبط الصف الحالي
    }
  }, [classId]);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("class_id", classId)
      .order("created_at", { ascending: false });
    if (!error) setLessons(data);
  };

  const fetchClasses = async (teacherId) => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });
    if (!error) setClasses(data);
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim()) return alert("الرجاء إدخال عنوان الدرس");
    const { error } = await supabase
      .from("lessons")
      .insert([{ ...newLesson, class_id: classId }]);
    if (error) return alert(error.message);
    setNewLesson({ title: "", description: "" });
    fetchLessons();
  };
//new
  // تعديل الدرس
  const handleEditLesson = async (lessonId, oldTitle, oldDescription) => {
    const newTitle = prompt("ادخلي العنوان الجديد للدرس:", oldTitle);
    if (!newTitle || !newTitle.trim()) return;

    const newDescription = prompt("ادخلي الوصف الجديد للدرس:", oldDescription || "");

    try {
      const { error } = await supabase
        .from("lessons")
        .update({ title: newTitle, description: newDescription })
        .eq("id", lessonId)
        .eq("class_id", classId); // تأكيد أن الدرس تابع لنفس الصف

      if (error) throw error;

      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, title: newTitle, description: newDescription }
            : lesson
        )
      );
    } catch (err) {
      alert("حدث خطأ أثناء تعديل الدرس: " + err.message);
    }
  };

  // حذف الدرس
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("هل أنت متأكدة أنك تريدين حذف هذا الدرس؟")) return;

    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId)
        .eq("class_id", classId);

      if (error) throw error;

      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      alert("حدث خطأ أثناء حذف الدرس: " + err.message);
    }
  };

const handleRemoveStudent = async (studentId) => {
  if (!currentClass) return;

  const confirmDelete = window.confirm("هل تريد إزالة هذا الطالب من الصف؟");
  if (!confirmDelete) return;

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ class_id: null })       // إزالة الطالب من الصف
      .eq("id", studentId)
      .eq("class_id", currentClass);   // فقط إذا كان في هذا الصف

    if (error) throw error;

    // تحديث الواجهة فوراً
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    alert("تمت إزالة الطالب من الصف ✅");
  } catch (err) {
    console.error("Error removing student:", err.message);
    alert("حدث خطأ أثناء إزالة الطالب ❌");
  }
};


//end new




const handleUpdatePoints = async (studentId, newPoints) => {
  try {
    // تحديث النقاط في جدول profiles
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", studentId);

    if (error) throw error;

    // تحديث الواجهة فوراً بعد التعديل
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, points: newPoints } : s
      )
    );

    alert("تم تعديل النقاط بنجاح ✅"); // رسالة تأكيد
  } catch (err) {
    console.error("Error updating points:", err.message);
    alert("حدث خطأ أثناء تعديل النقاط ❌");
  }
};



  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/"); // ✅ بعد تسجيل الخروج يرجع لواجهة البداية
  };

 return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar
  user={user}
  profile={profile}
  handleSignOut={handleSignOut}
  currentClass={null}   // لا نعرض الصف الحالي
  classes={[]}          // لا نعرض قائمة الصفوف
  onClassSelect={() => {}} // دالة فارغة، لن يتم استخدام الاختيار
/>


      <div className="flex flex-1">
        {/* زر فتح السايدبار للشاشات الصغيرة */}
        <button
          className="sm:hidden p-2 m-2 bg-purple-500 text-white rounded z-50 fixed top-16 left-2"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ الصفوف
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 bg-gray-100 p-4 border-r w-64 transform transition-transform duration-300 ease-in-out z-40
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            sm:translate-x-0 sm:relative sm:flex flex-col`}
        >
          <h2 className="text-xl font-bold mb-4">صفوفك</h2>
          <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
            {classes.length === 0 ? (
              <p>لا يوجد صفوف بعد.</p>
            ) : (
              classes.map((cls) => (
                <div
                  key={cls.id}
                  className={`p-2 rounded shadow cursor-pointer 
                    ${cls.id === classId ? "bg-purple-500 text-white font-bold" : "bg-white hover:bg-purple-100"}`}
                  onClick={() => {
    navigate(`/class/${cls.id}`);
    setCurrentClass(cls.id);
    fetchStudents(cls.id);
    setIsSidebarOpen(false);
  }}
                >
                  {cls.name}
                </div>
              ))
            )}
          </div>
          <button
            className="sm:hidden mt-4 p-2 w-full bg-red-500 text-white rounded"
            onClick={() => setIsSidebarOpen(false)}
          >
            إغلاق
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 sm:ml-0 md:ml-0 flex flex-col gap-6 overflow-x-hidden">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-700">
            إدارة الصف: {classInfo?.name || "..."}
          </h1>


{/* مربع عدد الطلاب */}
<div className="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 rounded shadow mb-4 w-full md:w-1/3">
  <p className="text-sm md:text-base">عدد الطلاب في هذا الصف:</p>
  <p className="text-2xl font-bold">{students.length}</p>
</div>


          {/* جدول الطلاب للشاشات الكبيرة */}
<div className="hidden md:block bg-white p-2 md:p-4 rounded shadow overflow-x-auto">
  <h2 className="text-lg md:text-xl font-semibold mb-2">الطلاب المسجلون</h2>

  {students.length === 0 ? (
    <p className="text-red-500 font-semibold">لا يوجد طلاب في هذا الصف بعد.</p>
  ) : (



    <table className="w-full text-left border-collapse table-auto text-sm md:text-base">
  <thead>
    <tr className="border-b">
      <th className="py-2 px-4">الأفاتار</th>
      <th className="py-2 px-4">الاسم</th>
      <th className="py-2 px-4">النقاط</th>
      <th className="py-2 px-4">تعديل النقاط</th>
      <th className="py-2 px-4">حذف</th>
    </tr>
  </thead>
  <tbody>
    {students.map((student) => (
      <tr key={student.id} className="border-b">
        {/* ✅ صورة الأفاتار */}
        <td className="py-2 px-4">
          <img
            src={student.avatar_url || "/default-avatar.png"}
            alt={student.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        </td>

        {/* ✅ الاسم */}
        <td className="py-2 px-4">{student.full_name}</td>

        {/* ✅ النقاط */}
        <td className="py-2 px-4">{student.points || 0}</td>

        {/* ✅ تعديل النقاط */}
        <td className="py-2 px-4">
          <input
            type="number"
            defaultValue={student.points || 0}
            onBlur={(e) =>
              handleUpdatePoints(student.id, parseInt(e.target.value))
            }
            className="border px-2 py-1 rounded w-20 text-sm"
          />
        </td>

        {/* ✅ زر حذف الطالب */}
        <td className="py-2 px-4">
          <button
            onClick={() => handleRemoveStudent(student.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            حذف
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>





  )}
</div>

{/* بطاقات الطلاب للشاشات الصغيرة */}
<div className="md:hidden flex flex-col gap-3">
  {students.length === 0 ? (
    <p className="text-red-500 font-semibold">لا يوجد طلاب في هذا الصف بعد.</p>
  ) : (
    students.map((student) => (
      <div
        key={student.id}
        className="bg-white p-3 rounded shadow flex flex-col gap-1"
      >
        <img
          src={student.avatar_url || "/default-avatar.png"}
          alt={student.full_name}
          className="w-12 h-12 rounded-full object-cover mb-1"
        />
        <p><strong>الاسم:</strong> {student.full_name}</p>
        <p><strong>النقاط:</strong> {student.points || 0}</p>
        <input
          type="number"
          defaultValue={student.points || 0}
          onBlur={(e) =>
            handleUpdatePoints(student.id, parseInt(e.target.value))
          }
          className="border px-2 py-1 rounded w-20 text-sm mt-1"
        />
        <button
  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm mt-1"
  onClick={() => handleRemoveStudent(student.id)}
>
  إزالة من الصف
</button>

      </div>
    ))
  )}
</div>





          {/* إدارة الدروس */}
          <div className="bg-white p-2 md:p-4 rounded shadow overflow-x-auto">
            <h2 className="text-lg md:text-xl font-semibold mb-2">الدروس</h2>
            <div className="mb-4 flex flex-col md:flex-row gap-2 flex-wrap">
              <input
                type="text"
                placeholder="عنوان الدرس"
                className="border p-2 rounded flex-1 min-w-[120px] text-sm md:text-base"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="وصف الدرس (اختياري)"
                className="border p-2 rounded flex-1 min-w-[120px] text-sm md:text-base"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              />
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 md:px-4 rounded font-bold text-sm md:text-base"
                onClick={handleAddLesson}
              >
                إضافة درس
              </button>
            </div>

         <ul className="flex flex-col gap-2">
  {lessons.map((lesson) => (
    <li
      key={lesson.id}
      className="bg-white p-2 rounded shadow flex justify-between items-center break-words"
    >
      <div
        className="cursor-pointer hover:text-purple-600 flex-1"
        onClick={() => navigate(`/lesson/${lesson.id}`)}
      >
        <p className="text-sm md:text-base"><strong>{lesson.title}</strong></p>
        {lesson.description && <p className="text-xs md:text-sm">{lesson.description}</p>}
      </div>

      {/* أزرار تعديل / حذف */}
      <div className="flex gap-2 ml-2">
        <button
          className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
          onClick={() => handleEditLesson(lesson.id, lesson.title, lesson.description)}
        >
          تعديل
        </button>
        <button
          className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          onClick={() => handleDeleteLesson(lesson.id)}
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

