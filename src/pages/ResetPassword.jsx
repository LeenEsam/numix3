/*import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token"); // يأتي من الرابط في البريد

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("كلمة المرور غير متطابقة");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    }, {
      accessToken: accessToken
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => navigate("/"), 2000); // العودة للصفحة الرئيسية
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">إعادة تعيين كلمة المرور</h1>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 mb-3 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-3 rounded border border-gray-300"
        />
        <button
          onClick={handleReset}
          className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition"
        >
          إعادة التعيين
        </button>
        {message && <p className="mt-3 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
*/
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    const setSessionFromUrl = async () => {
      if (accessToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: searchParams.get("refresh_token") || "", // أضف refresh_token إن وجد
        });

        if (error) {
          console.error("خطأ في تعيين الجلسة:", error.message);
          setMessage("حدث خطأ في تسجيل الدخول");
        }
      }
    };

    setSessionFromUrl();
  }, [accessToken]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("كلمة المرور غير متطابقة");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">إعادة تعيين كلمة المرور</h1>
        <input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 mb-3 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-3 rounded border border-gray-300"
        />
        <button
          onClick={handleReset}
          className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition"
        >
          إعادة التعيين
        </button>
        {message && <p className="mt-3 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
