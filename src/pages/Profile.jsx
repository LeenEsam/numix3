
// src/pages/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../Navbar";
import { useNavigate, useLocation } from "react-router-dom";


export default function Profile({ user, profile, setProfile, handleSignOut }) {
  const [localProfile, setLocalProfile] = useState(profile || null);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [loading, setLoading] = useState(!profile);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const navigate = useNavigate();
  const location = useLocation(); // معرفة الصفحة التي جاء منها المستخدم

const [email, setEmail] = useState(user?.email || "");

useEffect(() => {
  const fetchUserEmail = async () => {
    if (!user?.email) {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("خطأ أثناء جلب البريد:", error.message);
        return;
      }
      setEmail(data?.user?.email || "");
    } else {
      setEmail(user.email);
    }
  };

  fetchUserEmail();
}, [user]);



const handleSubmitAllAndGoBack = async () => {
  // حفظ الاسم إذا تغير
  if (fullName !== localProfile.full_name) {
    await handleSaveName();
  }

  // يمكن إضافة أي حفظ آخر هنا (مثل رفع الصورة إذا لم تُرفع)

  // العودة للصفحة السابقة
  //const returnPath = location.state?.from || "/";

const returnPath = location.state?.from || navigate(-1) || "/";


  navigate(returnPath, { replace: true });
};


  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    const tryFetch = async () => {
      if (localProfile) return;
      setLoading(true);
      try {
        let uid = user?.id;
        if (!uid) {
          const res = await supabase.auth.getUser();
          uid = res?.data?.user?.id;
        }
        if (!uid) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .single();

        if (error) {
          console.warn("Profile.jsx: profile not found:", error.message);
          setLocalProfile(null);
          setLoading(false);
          return;
        }

        setLocalProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
        if (setProfile) setProfile(data);
      } catch (err) {
        console.error("Profile.jsx: tryFetch error", err);
      } finally {
        setLoading(false);
      }
    };
    tryFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadAvatar = async (file) => {
    if (!file) return;
    setUploading(true);

    try {
      let uid = user?.id;
      if (!uid) {
        const res = await supabase.auth.getUser();
        uid = res?.data?.user?.id;
      }
      if (!uid) throw new Error("لا يوجد معرف مستخدم لرفع الصورة");

      const ext = file.name.split(".").pop();
      const filePath = `${uid}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const getUrlResult = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = getUrlResult?.data?.publicUrl ?? getUrlResult?.publicUrl;

      if (!publicUrl) throw new Error("تعذر الحصول على رابط عام للصورة");

      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", uid)
        .select()
        .single();

      if (updateError) throw updateError;

      setLocalProfile(updated);
      setAvatarUrl(publicUrl);
      if (setProfile) setProfile(updated);
    } catch (err) {
      console.error("uploadAvatar error:", err);
      alert("خطأ أثناء رفع الصورة: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) uploadAvatar(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadAvatar(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleSaveName = async () => {
    if (!fullName.trim()) return alert("الاسم لا يمكن أن يكون فارغًا");
    setLoading(true);
    try {
      let uid = user?.id;
      if (!uid) {
        const res = await supabase.auth.getUser();
        uid = res?.data?.user?.id;
      }
      if (!uid) throw new Error("لا يوجد معرف مستخدم");

      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", uid)
        .select()
        .single();

      if (error) throw error;
      setLocalProfile(data);
      if (setProfile) setProfile(data);
      alert("تم حفظ الاسم بنجاح");
    } catch (err) {
      console.error("handleSaveName:", err);
      alert("خطأ أثناء حفظ الاسم: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-bold text-gray-600">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-4">لم يتم إيجاد بروفايل</h2>
          <button
            onClick={() => alert("أضف منطق إنشاء البروفايل هنا")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            إنشاء البروفايل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar user={user} profile={localProfile} handleSignOut={handleSignOut} />

      <div className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">بروفايل</h1>

        {/* صورة + رفع + سحب وإفلات */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-300">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                صورة
              </div>
            )}
          </div>

          <div
            className={`flex-1 border-2 rounded-lg p-4 text-center cursor-pointer transition ${
              isDragging
                ? "border-purple-600 bg-purple-100"
                : "border-dashed border-purple-400 bg-purple-50 hover:bg-purple-100"
            }`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <p className="text-sm text-purple-600">
              {uploading ? "⏳ جارٍ رفع الصورة..." : "📂 اسحب صورتك هنا أو اضغط لاختيار ملف"}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* الاسم */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">الاسم الكامل</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSaveName}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            حفظ الاسم
          </button>
        </div>

        {/* البريد */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">البريد الإلكتروني</label>
          <div className="p-3 bg-gray-100 rounded">{email}</div>

        </div>

        {/* النقاط */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">النقاط</label>
          <div className="p-3 bg-gray-100 rounded">{localProfile.points ?? 0}</div>
        </div>

        <div className="mt-6">
          <button
  onClick={handleSubmitAllAndGoBack}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
>
  Submit All and Save
</button>


        </div>
      </div>
    </div>
  );
}
  
