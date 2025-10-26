// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Leaderboard() {
  const [classStats, setClassStats] = useState([]);
  const [topClassId, setTopClassId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("id, name");
      if (classesError) return console.error(classesError.message);

      const { data: studentsData, error: studentsError } = await supabase
        .from("profiles")
        .select("id, full_name, points, class_id, avatar_url");
      if (studentsError) return console.error(studentsError.message);

      const stats = classesData.map((cls) => {
        const classStudents = studentsData.filter(
          (s) => s.class_id === cls.id
        );

        if (classStudents.length === 0) {
          return {
            ...cls,
            topStudent: { full_name: "لا يوجد طلاب", points: 0 },
            totalPoints: 0,
          };
        }

        const classStudentsWithPoints = classStudents.map((s) => ({
          ...s,
          points: Number(s.points) || 0,
        }));

        const topStudent = classStudentsWithPoints.reduce((prev, curr) =>
          curr.points > prev.points ? curr : prev
        );

        const totalPoints = classStudentsWithPoints.reduce(
          (sum, s) => sum + s.points,
          0
        );

        return { ...cls, topStudent, totalPoints };
      });

      setClassStats(stats);

      if (stats.length > 0) {
        const topClass = stats.reduce((prev, curr) =>
          curr.totalPoints > prev.totalPoints ? curr : prev
        );
        setTopClassId(topClass.id);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="w-full py-12 bg-purple-100 min-h-[700px]" id="classespoint">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-purple-700">
          🥇 لوحة الشرف (Leaderboard)
        </h2>
      </div>

      <div
        id="classes"
        className="w-full min-w-full max-w-6xl px-4 pt-8 pb-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{
          minHeight: "400px",
        }}
      >
        {classStats.map((cls) => (
          <div
            key={cls.id}
            className={`
              relative
              rounded-2xl snap-center w-[250px] sm:w-[280px] md:w-[300px] lg:w-[320px] xl:w-[340px] flex-shrink-0

              p-6 text-center transform transition-all duration-500
              backdrop-blur-md bg-white/20 shadow-lg hover:scale-105
              ${
                cls.id === topClassId
                  ? "bg-yellow-200/30 border border-yellow-400"
                  : cls.topStudent.full_name === "لا يوجد طلاب"
                  ? "bg-gray-100/40 text-gray-400"
                  : ""
              }
            `}
            style={{
              boxShadow:
                cls.id === topClassId
                  ? "0 0 10px 3px rgba(255, 230, 0, 0.35)"
                  : "0 0 8px 2px rgba(128, 0, 128, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                cls.id === topClassId
                  ? "0 0 22px 10px rgba(255, 230, 0, 0.75)"
                  : "0 0 20px 8px rgba(128, 0, 128, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                cls.id === topClassId
                  ? "0 0 10px 3px rgba(255, 230, 0, 0.35)"
                  : "0 0 8px 2px rgba(128, 0, 128, 0.25)";
            }}
          >
            <h3 className="text-2xl font-bold text-purple-700 mb-4">
              {cls.name}
            </h3>

            {cls.topStudent.avatar_url ? (
              <img
                src={cls.topStudent.avatar_url}
                alt={cls.topStudent.full_name}
                className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md mx-auto mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-600 text-sm">No Avatar</span>
              </div>
            )}

            <p className="text-lg text-gray-800">
              الطالب صاحب أعلى نقاط في الصف: 🥇{" "}
              <span className="font-semibold">{cls.topStudent.full_name}</span>
            </p>
            <p className="text-gray-700">نقاطه: {cls.topStudent.points}</p>
            <p className="text-gray-700 mt-2 font-medium">
              مجموع نقاط الصف: {cls.totalPoints}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

