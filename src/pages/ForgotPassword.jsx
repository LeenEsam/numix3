import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://numix3.vercel.app//reset-password",
    });
    if (error) return alert("خطأ: " + error.message);
    alert("تم إرسال إيميل لإعادة التعيين — تحقق من صندوق البريد (أو Spam).");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="بريدك" />
      <button type="submit">إرسال رابط إعادة التعيين</button>
    </form>
  );
}


