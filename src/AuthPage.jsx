
// src/AuthPage.jsx
import React from "react";
//new
import BackgroundShapesKidsDynamic from "./components/BackgroundShapesKidsDynamic";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
 





export const handleForgotPassword = async (email) => {
  if (!email) {
    alert("يرجى إدخال البريد الإلكتروني أولاً");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5174/reset-password", // الرابط التجريبي
  });

  if (error) {
    alert("حدث خطأ: " + error.message);
  } else {
    alert("تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني");
  }
};






export default function AuthForm(
  {
  email,
  setEmail,
  password,
  setPassword,
  fullName,
  setFullName,
  role,
  setRole,
  handleSignUp,
  handleSignIn,
  authError={authError}
}) {

const navigate = useNavigate();
const [hasError, setHasError] = React.useState(false);

  return (
   <div className="relative min-h-screen flex items-center justify-center p-6" style={{ backgroundColor:"#680486ff" }}>
   
<BackgroundShapesKidsDynamic count={30} maxMath={3}/>

{/* زر إغلاق */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500 text-white font-bold text-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
        title="عودة"
      >
        ×
      </button>
<div className="relative z-10  max-w-lg bg-white shadow-2xl rounded-3xl p-8">
      <div className="w-full rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          Numix
        </h1>

        <p className="text-center text-gray-700 mb-4">
          تعلم الرياضيات بطريقة ممتعة
        </p>
 <p className="text-center text-purple-600 mb-2 text-lg font-medium">
   T.Nazera alnajjar
  </p>
        <input
          className={`w-full p-3 mb-3 rounded-xl border ${hasError ? "border-red-500" : "border-purple-300"} focus:ring-2 focus:ring-purple-400`}

          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={`w-full p-3 mb-3 rounded-xl border ${hasError ? "border-red-500" : "border-purple-300"} focus:ring-2 focus:ring-purple-400`}

          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-3 mb-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="الاسم الكامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

{/*new */}

{hasError && (
  <p className="text-red-600 text-sm mb-2 text-center">
    
  </p>
)}

{authError && (
  <p className="text-red-600 text-sm mb-2 text-center">
    {authError}
  </p>
)}



        {/* اختيار الدور 
        <select
          className="w-full p-3 mb-3 rounded-xl border border-purple-300 focus:ring-2 focus:ring-purple-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">اختر دورك</option>
          <option value="student">طالب</option>
          <option value="teacher">معلم</option>
        </select>*/}

        <div className="flex gap-4 justify-center mt-4">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all"
            onClick={handleSignUp}
          >
            إنشاء حساب
          </button>
         

<button
  className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all"
  onClick={async () => {
    const { error } = await handleSignIn();
    if (error) {
      setHasError(true);  // الحقول تصير حمراء
    } else {
      setHasError(false); // ترجع طبيعية
    }
  }}
>
  تسجيل الدخول
</button>


          




        </div>
     <div className="text-center mt-2">
  <button
    className="text-sm text-blue-500 hover:underline"
    onClick={() => handleForgotPassword(email)}
  >
    نسيت كلمة المرور؟
  </button>
</div>
      </div>
    </div>
    </div> 
  );
}






      






     


