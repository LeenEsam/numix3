

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../Navbar";



export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // للتحكم في drawer على الشاشات الصغيرة
//new22
// new: العناصر الإضافية
const [importantItems, setImportantItems] = useState([]);
const [resourcesItems, setResourcesItems] = useState([]);

// بيانات الإدخال للمعلمة
const [extraTitle, setExtraTitle] = useState("");
const [extraContent, setExtraContent] = useState({ text: "", link: "", image: "", video: "" });
const [extraType, setExtraType] = useState("important"); 
const [extraVideoFile, setExtraVideoFile] = useState(null); // رفع ملف فيديو جديد

  const navigate = useNavigate(); 

//new
const [coursesItems, setCoursesItems] = useState([]);
const [courseTitle, setCourseTitle] = useState("");
const [courseCaption, setCourseCaption] = useState("");
const [coursePrice, setCoursePrice] = useState("");
const [courseLink, setCourseLink] = useState("");
const [courseContent, setCourseContent] = useState({ image: "", video: "" });


  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) return console.error("Error fetching user:", userError.message);

      if (user) {
        setUser(user);
        await fetchProfile(user.id);
        await fetchClasses(user.id);
      }
    };
    getUserAndData();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    }
  };
//new
useEffect(() => {
  const fetchExtras = async () => {
    // الأخبار المهمة
    const { data: importantData, error: importantError } = await supabase
      .from("classes_extra")
      .select("*")
      .eq("type", "important");
    if (importantError) console.error(importantError.message);
    else setImportantItems(importantData || []);

    // الموارد المفيدة
    const { data: resourcesData, error: resourcesError } = await supabase
      .from("classes_extra")
      .select("*")
      .eq("type", "resource");
    if (resourcesError) console.error(resourcesError.message);
    else setResourcesItems(resourcesData || []);
  };
  fetchExtras();
}, []);
//new
useEffect(() => {
  const fetchCourses = async () => {
    if (!user) return;
  const { data, error } = await supabase
     .from("classes_extra")
     .select("*")
     .eq("teacher_id", user.id)
     .eq("type", "course")
    .order("created_at", { ascending: false });
    if (error) console.error(error.message);
    else setCoursesItems(data || []);
  };
  fetchCourses();
}, [user]);
const handleAddCourse = async () => {
  if (!courseTitle.trim()) return alert("أدخل عنوان الكورس");

  try {
      const { data, error } = await supabase
     .from("classes_extra")
     .insert([{
       teacher_id: user.id,
       type: "course",
       title: courseTitle,
       content: {
         caption: courseCaption,
         price: coursePrice,
         link: courseLink,
         image: courseContent.image,
         video: courseContent.video
       }
     }])
     .select();

    if (error) throw error;

    setCoursesItems(prev => [data[0], ...prev]);
    setCourseTitle("");
    setCourseCaption("");
    setCoursePrice("");
    setCourseLink("");
    setCourseContent({ image: "", video: "" });

    alert("تمت إضافة الكورس بنجاح!");
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
};
const handleDeleteCourse = async (item) => {
  if (!window.confirm("هل تريد الحذف؟")) return;

  try {
   const { error } = await supabase
     .from("classes_extra")
     .delete()
     .eq("id", item.id)
     .eq("teacher_id", user.id);

    if (error) throw error;

    setCoursesItems(prev => prev.filter(i => i.id !== item.id));
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
};




// إضافة عنصر جديد
const handleAddExtra = async () => {
  if (!extraTitle.trim()) return alert("أدخل عنواناً");
  try {
    const { data, error } = await supabase
      .from("classes_extra")
      .insert([{ teacher_id: user.id, type: extraType, title: extraTitle, content: extraContent }])
      .select();
    if (error) throw error;

    alert("تمت الإضافة بنجاح!");
    if (extraType === "important") setImportantItems(prev => [data[0], ...prev]);
    else setResourcesItems(prev => [data[0], ...prev]);

    setExtraTitle("");
    setExtraContent({ text: "", link: "", image: "", video: "" });
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
};

// تعديل عنصر موجود
const handleEditExtra = async (item) => {
  const newTitle = prompt("ادخلي العنوان الجديد:", item.title);
  if (!newTitle) return;
  const newText = prompt("النص الجديد:", item.content.text || "");
  try {
    const { error } = await supabase
      .from("classes_extra")
      .update({ title: newTitle, content: { ...item.content, text: newText } })
      .eq("id", item.id)
      .eq("teacher_id", user.id);
    if (error) throw error;

    if (item.type === "important") {
      setImportantItems(prev => prev.map(i => i.id === item.id ? { ...i, title: newTitle, content: { ...i.content, text: newText } } : i));
    } else {
      setResourcesItems(prev => prev.map(i => i.id === item.id ? { ...i, title: newTitle, content: { ...i.content, text: newText } } : i));
    }
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
};

// حذف عنصر
const handleDeleteExtra = async (item) => {
  if (!window.confirm("هل تريد الحذف؟")) return;
  try {
    const { error } = await supabase
      .from("classes_extra")
      .delete()
      .eq("id", item.id)
      .eq("teacher_id", user.id);
    if (error) throw error;

    if (item.type === "important") setImportantItems(prev => prev.filter(i => i.id !== item.id));
    else setResourcesItems(prev => prev.filter(i => i.id !== item.id));
  } catch (err) {
    alert("حدث خطأ: " + err.message);
  }
};




  const fetchClasses = async (teacherId) => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err.message);
    }
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) return alert("الرجاء كتابة اسم الصف");
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("classes")
        .insert([{ name: newClassName, teacher_id: user.id }])
        .select();
      if (error) throw error;

      setClasses((prev) => [data[0], ...prev]);
      setNewClassName("");
    } catch (err) {
      alert("حدث خطأ عند إضافة الصف: " + err.message);
    }
  };
//new
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("هل أنت متأكدة أنك تريدين حذف هذا الصف؟")) return;

    try {
      const { error } = await supabase
        .from("classes")
        .delete()
        .eq("id", classId)
        .eq("teacher_id", user.id); // فقط المعلمة تقدر تحذف صفها

      if (error) throw error;

      setClasses((prev) => prev.filter((cls) => cls.id !== classId));
    } catch (err) {
      alert("حدث خطأ عند حذف الصف: " + err.message);
    }
  };

  const handleEditClass = async (classId, oldName) => {
    const newName = prompt("ادخلي الاسم الجديد للصف:", oldName);
    if (!newName || !newName.trim()) return;

    try {
      const { error } = await supabase
        .from("classes")
        .update({ name: newName })
        .eq("id", classId)
        .eq("teacher_id", user.id);

      if (error) throw error;

      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === classId ? { ...cls, name: newName } : cls
        )
      );
    } catch (err) {
      alert("حدث خطأ عند تعديل الصف: " + err.message);
    }
  };


//end new

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate("/");
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`);
    setIsSidebarOpen(false); // إغلاق sidebar على الشاشات الصغيرة عند اختيار صف
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar user={user} profile={profile} handleSignOut={handleSignOut} />


      <div className="flex flex-1">
        {/* زر فتح/غلق sidebar على الشاشات الصغيرة */}
        <button
          className="sm:hidden p-2 m-2 bg-purple-500 text-white rounded"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ الصفوف
        </button>
{/* Sidebar* */}
<div
  className={`fixed inset-y-0 left-0 bg-gray-100 p-4 border-r w-64 transform transition-transform duration-300 ease-in-out z-10
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  sm:translate-x-0 sm:relative sm:flex flex-col`} // <-- إضافة flex-col هنا
>
  <h2 className="text-xl font-bold mb-4">صفوفك</h2>
  <div className="flex flex-col space-y-2 flex-1 overflow-y-auto"> {/* حاوية الصفوف */}
    {classes.length === 0 ? (
  <p>لا يوجد صفوف بعد.</p>
) : (
  classes.map((cls) => (
    <div
      key={cls.id}
      className="p-2 bg-white rounded shadow flex justify-between items-center"
    >
      {/* عند الضغط على الاسم → فتح الصف */}
      <span
        className="cursor-pointer hover:text-purple-600 font-medium"
        onClick={() => handleClassClick(cls.id)}
      >
        {cls.name}
      </span>

      {/* أزرار تعديل/حذف */}
      <div className="flex gap-2">
        <button
          className="text-sm bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded"
          onClick={() => handleEditClass(cls.id, cls.name)}
        >
          تعديل
        </button>
        <button
          className="text-sm bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
          onClick={() => handleDeleteClass(cls.id)}
        >
          حذف
        </button>
      </div>
    </div>
  ))
)}


  </div>

  <div className="mt-6">
    <input
      type="text"
      placeholder="اسم الصف الجديد"
      className="w-full p-2 border rounded mb-2"
      value={newClassName}
      onChange={(e) => setNewClassName(e.target.value)}
    />
    <button
      className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded font-bold"
      onClick={handleAddClass}
    >
      إضافة صف جديد
    </button>
  </div>

  {/* زر إغلاق sidebar على الشاشات الصغيرة */}
  <button
    className="sm:hidden mt-4 p-2 w-full bg-red-500 text-white rounded"
    onClick={() => setIsSidebarOpen(false)}
  >
    إغلاق
  </button>
</div>


        {/* Main content area*/}
        <div className="flex-1 p-6  overflow-hidden box-border max-w-full">

          <h1 className="text-3xl font-bold text-purple-700 mb-4">
            لوحة تحكم المعلمة
          </h1>
          <p className="text-gray-700">
            اختر أي صف من الشريط الجانبي لرؤية الدروس الخاصة به.
          </p>
          {/*new */}
<section className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
  <h2 className="text-2xl font-bold mb-4">أضف محتوى جديد</h2>
  <select className="mb-2 p-2 border rounded" value={extraType} onChange={e => setExtraType(e.target.value)}>
    <option value="important">أخبار مهمة</option>
    <option value="resource">معلومات مفيدة</option>
  </select>
  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="العنوان"
    value={extraTitle}
    onChange={e => setExtraTitle(e.target.value)}
  />
  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="النص"
    value={extraContent.text}
    onChange={e => setExtraContent(prev => ({ ...prev, text: e.target.value }))}
  />
  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="رابط"
    value={extraContent.link}
    onChange={e => setExtraContent(prev => ({ ...prev, link: e.target.value }))}
  />
   <label className="text-purple-700 mb-1 font-semibold text-gray-700">
  عند الاضافة في سكشن النبذه عن الشرح او الاخبار احرص على اختيار شيئ واحد اما صورة او فيديو اما في سكشن الكورسات بامكانك اضافة الاثنين معا لا مشكلة في ذلك 
</label>
  <label className="block mb-1 font-semibold text-gray-700">
  اختر صورة 
</label>
 <input
  type="file"
  accept="image/*"
  className="w-full p-2 mb-2 border rounded"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;

      // رفع الصورة إلى Supabase Storage
      const { error } = await supabase.storage
        .from("class_resources")
        .upload(fileName, file);

      if (error) throw error;

      // خزّن فقط اسم الملف (وليس الرابط)
      setExtraContent((prev) => ({ ...prev, image: fileName }));

      alert("تم رفع الصورة بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الصورة: " + err.message);
    }
  }}
/>


 <label className="block mb-1 font-semibold text-gray-700">
اختر فيديو 
</label>
  <input
  type="file"
  accept="video/*"
  className="w-full p-2 mb-2 border rounded"
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;

      // رفع الفيديو إلى Supabase Storage
      const { error } = await supabase.storage
        .from("class_resources")
        .upload(fileName, file);

      if (error) throw error;

      // خزّن اسم الملف فقط
      setExtraContent(prev => ({ ...prev, video: fileName }));

      alert("تم رفع الفيديو بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء رفع الفيديو: " + err.message);
    }
  }}
/>

  <button onClick={handleAddExtra} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">إضافة</button>
</section>

{/*new */}
<section className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
  <h2 className="text-2xl font-bold mb-4">أضف كورس جديد</h2>

  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="عنوان الكورس"
    value={courseTitle}
    onChange={e => setCourseTitle(e.target.value)}
  />

  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="وصف الكورس (Caption)"
    value={courseCaption}
    onChange={e => setCourseCaption(e.target.value)}
  />

  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="السعر"
    value={coursePrice}
    onChange={e => setCoursePrice(e.target.value)}
  />

  <input
    className="w-full p-2 mb-2 border rounded"
    placeholder="رابط الكورس"
    value={courseLink}
    onChange={e => setCourseLink(e.target.value)}
  />

  <label className="block mb-1 font-semibold text-gray-700">اختر صورة للكورس</label>
  <input
    type="file"
    accept="image/*"
    className="w-full p-2 mb-2 border rounded"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("class_resources").upload(fileName, file);
      if (error) return alert(error.message);
      setCourseContent(prev => ({ ...prev, image: fileName }));
      alert("تم رفع الصورة!");
    }}
  />

  <label className="block mb-1 font-semibold text-gray-700">اختر فيديو للكورس</label>
  <input
    type="file"
    accept="video/*"
    className="w-full p-2 mb-2 border rounded"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("class_resources").upload(fileName, file);
      if (error) return alert(error.message);
      setCourseContent(prev => ({ ...prev, video: fileName }));
      alert("تم رفع الفيديو!");
    }}
  />

  <button onClick={handleAddCourse} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">إضافة كورس</button>
</section>


<section className="mt-8">
  <h2 className="text-2xl font-bold mb-4">الكورسات التي أضفتها</h2>
  {coursesItems.length === 0 ? (
    <p className="text-gray-500">لا توجد كورسات بعد.</p>
  ) : (
    <div className="flex space-x-4 overflow-x-auto py-2">
      {coursesItems.map(item => (
        <div key={item.id} className="min-w-[250px] bg-white rounded-xl shadow p-4 flex-shrink-0 relative">
          <h4 className="font-bold mb-2">{item.title}</h4>
          <p className="text-gray-700 mb-2">{item.caption}</p>
          {item.price && <p className="font-semibold mb-2">السعر: {item.price}</p>}
          {item.link && <a href={item.link} target="_blank" className="text-blue-500 underline block mb-2">رابط الكورس</a>}
          {item.content.image && <img src={supabase.storage.from("class_resources").getPublicUrl(item.content.image).data.publicUrl} alt={item.title} className="w-full h-40 object-cover rounded mb-2" />}
          {item.content.video && <video controls className="w-full h-32 rounded mb-2"><source src={supabase.storage.from("class_resources").getPublicUrl(item.content.video).data.publicUrl} type="video/mp4" />متصفحك لا يدعم الفيديو</video>}
          <button onClick={() => handleDeleteCourse(item)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">حذف</button>
        </div>
      ))}
    </div>
  )}
</section>












{/* عرض الكاردز */}
<section className="mt-8 ">
  <h2 className="text-2xl font-bold mb-4">المحتوى الذي أضفته</h2>

  {/* الأخبار المهمة */}
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-2">أخبار مهمة</h3>
    {importantItems.length === 0 ? (
      <p className="text-gray-500">لا يوجد أخبار بعد.</p>
    ) : (
      <div className="flex space-x-4 overflow-x-auto py-2">
        {importantItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] bg-white rounded-xl shadow p-4 flex-shrink-0 relative z-2"
          >
            <h4 className="font-bold mb-2">{item.title}</h4>
            <p className="text-gray-700 mb-2">{item.content.text}</p>
            {item.content.link && (
              <a
                href={item.content.link}
                target="_blank"
                className="text-blue-500 underline block mb-2"
              >
                رابط
              </a>
            )}
             {item.content.image && (
              <img
                src={`${supabase.storage.from("class_resources").getPublicUrl(item.content.image).data.publicUrl}`}
                alt={item.title}
                className="w-72 h-72 object-cover rounded mb-2 "
              />
            )}
            {item.content.video && (
  <video controls className="w-full h-32 rounded mb-2">
    <source
      src={supabase
        .storage
        .from("class_resources")
        .getPublicUrl(item.content.video)
        .data.publicUrl
      }
      type="video/mp4"
    />
    المتصفح لا يدعم الفيديو.
  </video>
)}

            <button
              onClick={() => handleDeleteExtra(item)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* الموارد المفيدة */}
  <div>
    <h3 className="text-xl font-semibold mb-2">الموارد المفيدة</h3>
    {resourcesItems.length === 0 ? (
      <p className="text-gray-500">لا يوجد موارد بعد.</p>
    ) : (
      <div className="flex space-x-4 overflow-x-auto py-2">
        {resourcesItems.map((item) => (
          <div
            key={item.id}
            className="min-w-[250px] bg-white rounded-xl shadow p-4 flex-shrink-0 relative"
          >
            <h4 className="font-bold mb-2">{item.title}</h4>
            <p className="text-gray-700 mb-2">{item.content.text}</p>
            {item.content.link && (
              <a
                href={item.content.link}
                target="_blank"
                className="text-blue-500 underline block mb-2"
              >
                رابط
              </a>
            )}
            {item.content.image && (
              <img
                src={`${supabase.storage.from("class_resources").getPublicUrl(item.content.image).data.publicUrl}`}
                alt={item.title}
                className="w-full h-72 object-cover rounded mb-2"
              />
            )}
        {item.content.video && (
  <video controls className="w-full h-32 rounded mb-2">
    <source
      src={supabase
        .storage
        .from("class_resources")
        .getPublicUrl(item.content.video)
        .data.publicUrl
      }
      type="video/mp4"
    />
    المتصفح لا يدعم الفيديو.
  </video>
)}

            <button
              onClick={() => handleDeleteExtra(item)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</section>



        </div>
      </div>
    </div>
  );
}
