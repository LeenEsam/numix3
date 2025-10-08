import React from "react";

export default function CoursesSection() {
  const courses = [
    {
      title: "دورة ICDL الدولية",
      height: "600px",
      image: true,
      imageSrc: "/assets/img/10.jpeg",
      colSpan: "col-span-1 ",
    },

    {
      multi: true,
      colSpan: "col-span-1",
      items: [
      


     {
      title: "حاصلة على بكالوريوس في الرياضيات والدبلوم العالي في التربية",
      height: "170px",
      iconSrc: "/assets/img/graduate.png",
      iconPosition: "center",
 
    },
    
    {
      title:  "دورة اكسل متقدم",
      height: "420px",
      image: true,
      imageSrc: "/assets/img/8.jpeg",
      colSpan: "col-span-1 sm:col-span-2",
      
      
    },
      ],
    },



// كاردين معًا داخل نفس العمود
    {
      multi: true,
      colSpan: "col-span-1",
      items: [
        
       

   {
     
       
          title: "حاصلة على جائزة المعلم المتميز لسنة 2025",
          iconSrc: "/assets/img/3.png",
          iconPosition: "center",
          height: "250px",
            image: true,
      imageSrc: "/assets/img/t1.jpeg",
     
    }, 
{
      title: "",
      height: "300px",
      image: true,
      imageSrc: "/assets/img/t2.jpeg",
      colSpan: "col-span-1",
     
    }, 
   
    
      ],
    },

    {
      multi: true,
      colSpan: "col-span-1",
      items: [
        
        {
          title: "دورة HR الموارد البشرية",
          height: "250px",
             image: true,
      imageSrc: "/assets/img/hr.jpg",
        },
        {
          title: "مدربة معتمدة في تدريب وإعداد المعلمين (TOT)",
          height: "350px",   
       image: true,
      imageSrc: "/assets/img/6.jpeg",
        },
       
   
    
      ],
    },
   
     {
      title:  " دورة مهارات الحاسوب المتقدمة ",
      
      height: "660px",
      image: true,
      imageSrc: "/assets/img/7.jpeg",
      colSpan: "col-span-1 sm:col-span-2",
      
      
    },
     // كاردين معًا داخل نفس العمود
    {
      multi: true,
      colSpan: "col-span-1",
      items: [
        {
          title: "دورة أساليب واستراتيجيات التدريس",
          height: "100px",
          image: false,
          iconSrc: "/assets/img/shape.png",
      iconPosition: "center",
        },
        {
          title: "دورة ادراك السلوك",
          height: "270px",
           image: true,
      imageSrc: "/assets/img/3.jpeg",
            
        },
        {
          title: "دورة التعليم والتعلم",
          height: "270px",
          
            iconSrc: "/assets/img/batitdd.png",
      iconPosition: "right",
       image: true,
      imageSrc: "/assets/img/4.jpeg",
        },
      ],
    },
    {
      title: "دورة ادخال وطباعة البيانات",
      height: "670px",
     
      iconSrc: "/assets/img/Microsoft_Excel-Logo.wine.png",
      iconPosition: "right",
      image: true,
      imageSrc: "/assets/img/5.jpeg",
    },
    {
      title: "دورة التعليم الافتراضي",
      height: "400px",
       image: true,
      imageSrc: "/assets/img/2.jpeg",

    },
   {
      title: "دورة التعليم المتميز",
      height: "400px",
      image: true,
      imageSrc: "/assets/img/1.jpeg",
      colSpan: "col-span-1 sm:col-span-2"

    },
   
    {
      title: " دورة طرق التعليم الحديث ",
      height: "400px",
       image: true,
      imageSrc: "/assets/img/9.jpeg",

    },
  ];

  // دالة لتوليد كارد عادي (تستخدم داخل الماب)
  function renderCard(course, idx) {
    return (
      <div
        key={idx}
        style={{ height: course.height || "250px" }}
        className={`shadow-lg bg-purple-50 rounded-xl hover:scale-105 transition-transform duration-300  flex flex-col relative ${course.colSpan || ""}`}
      >
        {/* الصورة أو مساحة فارغة للنصف العلوي */}
        {course.image && course.imageSrc ? (
       <div className="w-full h-3/4">
  <img
    src={course.imageSrc}
    alt={course.title}
    className="w-full h-full object-cover rounded-t-xl"
  />
</div>


        ) : (
          <div className="h-1/2" />
        )}

        {/* الأيقونة خارج الكارد من الأعلى */}
        {course.iconSrc && (
          <div
            className="absolute -top-6"
            style={{
              right: course.iconPosition === "right" ? "1rem" : "auto",
              left:
                course.iconPosition === "left"
                  ? "1rem"
                  : course.iconPosition === "center"
                  ? "50%"
                  : "auto",
              transform:
                course.iconPosition === "center" ? "translateX(-50%)" : "none",
            }}
          >
            <img
              src={course.iconSrc}
              alt="icon"
              className="w-80 h-30 object-contain"
            />
          </div>
        )}

        {/* النص في النصف السفلي */}
        <div className="h-1/4 flex items-center justify-center px-2 text-center">
          <span className="text-purple-700 font-semibold text-sm sm:text-base">
            {course.title}
          </span>
        </div>
      </div>
    );
  }

  // دالة لتوليد كروت متعددة داخل عمود واحد
  function renderMultiCard(course, idx) {
    return (
      <div
        key={idx}
        className={`flex flex-col gap-4 ${course.colSpan || "col-span-1"}`}
      >
        {course.items.map((item, subIdx) => (
         <div
  key={subIdx}
  style={{ height: item.height || "150px" }}
  className="bg-purple-50 p-4 rounded-xl shadow flex flex-col items-center text-center gap-3 relative hover:scale-105 transition-transform duration-300"
          >
            {/* الصورة أو مساحة للنصف العلوي */}
            {item.image && item.imageSrc ? (
              <div className="w-full h-3/4">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-t-xl"
                />

 

              </div>
            ) : (
              <div className="h-1/4" />
            )}

            {/* الأيقونة خارج الكارد من الأعلى */}
            {item.iconSrc && (
              <div
                className="absolute -top-6"
                style={{
                  right: item.iconPosition === "right" ? "1rem" : "auto",
                  left:
                    item.iconPosition === "left"
                      ? "1rem"
                      : item.iconPosition === "center"
                      ? "50%"
                      : "auto",
                  transform:
                    item.iconPosition === "center"
                      ? "translateX(-50%)"
                      : "none",
                }}
              >
                <img
                  src={item.iconSrc}
                  alt="icon"
                  className="w-32 h-20 object-contain"
                />
              </div>
            )}

            {/* النص في النصف السفلي */}
            <div className="h-1/2 flex items-center justify-center px-2 text-center">
              <span className="text-purple-700 font-semibold text-sm sm:text-base">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-purple-100" id="about">
      <div className="container mx-auto px-6">
     <h2 className="text-4xl font-bold text-center mb-4 text-purple-700">
        T.Nazera alnajjar

</h2> 
  <h2 className="text-4xl font-bold text-center mb-4 text-purple-700">
  المؤهلات والدورات التدريبية
</h2>  

<p className="text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-10">
  خبرة 6 سنوات في تدريس مادة الرياضيات (الرابع – الثاني ثانوي)<br />
  مدربة معتمدة في تدريب وإعداد المعلمين
  <br />
  حاصلة على درجة البكالوريوس في الرياضيات وعلى درجة الدبلوم العالي في التربية.
</p>

        {/* الشبكة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) =>
            course.multi && Array.isArray(course.items)
              ? renderMultiCard(course, idx)
              : renderCard(course, idx)
          )}
        </div>
      </div>
    </section>
  );
}
