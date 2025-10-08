
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, profile, handleSignOut, currentClass, classes, onClassSelect }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
  className="text-white bg-purple-700 flex justify-between items-center px-6 py-4 shadow-lg"
  
>

      {/* العنوان */}
      <h1
        className="text-2xl font-extrabold tracking-wide cursor-pointer hover:scale-105 transition-transform"
        onClick={() => navigate("/dashboard")}
      >
        Numix
      </h1>

      {/* القائمة اليمنى */}
      {user && (
        <div className="flex items-center gap-6">
          {/* للطلاب: قائمة اختيار الصف إذا لم يتم تحديده */}
          {profile?.role === "student" && !currentClass && classes.length > 0 && (
            <select
              className="bg-white text-purple-700 font-medium px-3 py-1 rounded-full shadow-md cursor-pointer hover:scale-105 transition-transform"
              onChange={(e) => onClassSelect(e.target.value)}
            >
              <option value="" disabled selected>
                اختر صفك
              </option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          )}

          {/* عرض الصف الحالي إذا تم اختياره */}
          {currentClass && (
            <span className="hidden md:inline text-sm bg-white/20 px-3 py-1 rounded-full shadow-sm">
              الصف: <strong>{currentClass}</strong>
            </span>
          )}

          {/* أيقونة البروفايل */}
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
             <div className="w-10 h-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
  {profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt="avatar"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-purple-700 font-bold">
      {profile?.full_name?.[0] || "U"}
    </span>
  )}
</div>

              <div className="flex flex-col">
    <span className="hidden md:inline font-medium flex items-center gap-2">
  {profile?.full_name || "مستخدم"}
  {profile?.role === "student" && (
    <span className="text-yellow-300 font-semibold">
      ⭐ {profile.points || 0}
    </span>
  )}
</span>

    
  </div>
           </div>

            {/* القائمة المنسدلة */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg py-2 z-50">
                <button
                  className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/profile")}
                >
                   الملف الشخصي
                </button>
                <button
                  className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
                  onClick={handleSignOut}
                >
                   تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
