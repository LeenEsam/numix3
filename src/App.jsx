

// src/App.jsx
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import RouterComponent from "./Router";
import AuthForm, { handleForgotPassword } from "./AuthPage";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  const getSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      await fetchProfile(user.id);
    }
    setLoading(false);
  };
  getSession();
}, []);




const fetchProfile = async (id) => {
  setLoading(true);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!error && data) {
    setProfile(data);
    if (data.role === "teacher") navigate("/teacher");
    else navigate("/student"); // كل الحسابات الطلاب
  }
  setLoading(false);
};





const handleSignUp = async () => {
  if (!fullName) return alert("الرجاء إدخال الاسم الكامل");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    if (error.message.includes("already registered") || error.message.includes("exists")) {
      setAuthError("هذا الحساب موجود بالفعل 👀");
    } else {
      setAuthError("حدث خطأ أثناء التسجيل: " + error.message);
    }
    return { error };
  }

  const userId = data.user?.id;
  if (!userId) return;

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName,
      points: 0,
      role: "student", // دائمًا طالب
    });

  if (profileError) {
    setAuthError("حدث خطأ أثناء إنشاء الملف الشخصي");
    return { error: profileError };
  }

  setUser(data.user);
  await fetchProfile(userId);
  setAuthError(null);
  alert("تم إنشاء الحساب بنجاح، تحقق من بريدك الإلكتروني 👌");
  return { data };
};


  const handleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    setAuthError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    return { error }; // ← مهم يرجع error
  }

  setAuthError(null);
  setUser(data.user);
  await fetchProfile(data.user.id);
  return { data }; // ← يرجع data لو نجحت العملية
};


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-bold text-gray-600">جار التحميل ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        handleSignUp={handleSignUp}
        handleSignIn={handleSignIn}
        authError={authError}
      />
    );
  }

  return (
    <RouterComponent
      user={user}
      profile={profile}
      setProfile={setProfile}
      handleSignOut={handleSignOut}
    />
  );
  
}

 