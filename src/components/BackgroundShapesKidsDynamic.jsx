// src/components/BackgroundShapesWithMath.jsx
import React, { useEffect, useRef } from "react";

export default function BackgroundShapesWithMath({ shapeCount = 30, maxMath = 3 }) {
  const canvasRef = useRef(null);
  const shapes = useRef([]);
  const mathItems = useRef([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // توليد الأشكال الهندسية
    shapes.current = Array.from({ length: shapeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 30 + Math.random() * 50,
      type: ["circle", "triangle", "hexagon", "octagon", "trapezoid", "diamond"][Math.floor(Math.random() * 6)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.001,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      mouseFactor: 0.05
    }));

    // قائمة مسائل بسيطة للأطفال
    const problems = [
      "3 + 2 = 5", "5 - 1 = 4", "2 × 2 = 4", "6 ÷ 2 = 3",
      "1 + 4 = 5", "7 - 3 = 4", "2 × 3 = 6",
      "مساحة المستطيل = الطول × العرض",
      "مساحة المربع = الضلع × الضلع",
      "محيط الدائرة = 2 × π × نصف القطر",
      "مساحة المثلث = 0.5 × القاعدة × الارتفاع"
    ];

    // توليد عناصر رياضية أولية
    mathItems.current = Array.from({ length: maxMath }, () => ({
      text: "",       // النص الذي سيكتب تدريجيًا
      fullText: problems[Math.floor(Math.random() * problems.length)],
      x: Math.random() * width,
      y: Math.random() * height,
      fontSize: 24,
      progress: 0,    // عدد الأحرف المكتوبة
      visible: true,  
      timer: 0        // عداد الوقت قبل اختفاء النص
    }));

    const drawShape = (s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      switch (s.type) {
        case "circle":
          ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
          break;
        case "triangle":
          ctx.moveTo(0, -s.size / 2);
          ctx.lineTo(-s.size / 2, s.size / 2);
          ctx.lineTo(s.size / 2, s.size / 2);
          ctx.closePath();
          break;
        case "hexagon":
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = (s.size / 2) * Math.cos(angle);
            const y = (s.size / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case "octagon":
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i;
            const x = (s.size / 2) * Math.cos(angle);
            const y = (s.size / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        case "trapezoid":
          ctx.moveTo(-s.size/2, -s.size/4);
          ctx.lineTo(s.size/2, -s.size/4);
          ctx.lineTo(s.size/3, s.size/4);
          ctx.lineTo(-s.size/3, s.size/4);
          ctx.closePath();
          break;
        case "diamond":
          ctx.moveTo(0, -s.size/2);
          ctx.lineTo(s.size/2, 0);
          ctx.lineTo(0, s.size/2);
          ctx.lineTo(-s.size/2, 0);
          ctx.closePath();
          break;
      }
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // تحريك الأشكال الهندسية
      shapes.current.forEach(s => {
        const dx = mouseX - width / 2;
        const dy = mouseY - height / 2;
        s.x += s.speedX + dx * s.mouseFactor * 0.01;
        s.y += s.speedY + dy * s.mouseFactor * 0.01;
        s.rotation += s.rotationSpeed;
        if (s.x > width + s.size) s.x = -s.size;
        if (s.x < -s.size) s.x = width + s.size;
        if (s.y > height + s.size) s.y = -s.size;
        if (s.y < -s.size) s.y = height + s.size;
        drawShape(s);
      });

      // رسم المسائل الرياضية تدريجيًا
      mathItems.current.forEach(item => {
        if (!item.visible) return;

        // كتابة النص تدريجيًا
        if (item.progress < item.fullText.length) {
          item.progress += 0.2; // سرعة الكتابة
          item.text = item.fullText.substring(0, Math.floor(item.progress));
        } else {
          // بعد كتابة النص بالكامل، انتظر ثم أعد التعيين
          item.timer += 1;
          if (item.timer > 200) { // مدة العرض قبل التغيير
            item.progress = 0;
            item.text = "";
            item.timer = 0;
            item.fullText = problems[Math.floor(Math.random() * problems.length)];
            item.x = Math.random() * width;
            item.y = Math.random() * height;
          }
        }

        ctx.font = `${item.fontSize}px Arial`;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText(item.text, item.x, item.y);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, [shapeCount, maxMath]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

