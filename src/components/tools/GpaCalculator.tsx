"use client";
import { useState } from "react";

type Scale = "4.0" | "percentage";

const LETTER_GRADES_4 = [
  { letter: "A+", min: 97, points: 4.0 },
  { letter: "A",  min: 93, points: 4.0 },
  { letter: "A-", min: 90, points: 3.7 },
  { letter: "B+", min: 87, points: 3.3 },
  { letter: "B",  min: 83, points: 3.0 },
  { letter: "B-", min: 80, points: 2.7 },
  { letter: "C+", min: 77, points: 2.3 },
  { letter: "C",  min: 73, points: 2.0 },
  { letter: "C-", min: 70, points: 1.7 },
  { letter: "D+", min: 67, points: 1.3 },
  { letter: "D",  min: 63, points: 1.0 },
  { letter: "D-", min: 60, points: 0.7 },
  { letter: "F",  min: 0,  points: 0.0 },
];

type Course = { name: string; grade: string; credits: string };

export default function GpaCalculator() {
  const [scale, setScale] = useState<Scale>("4.0");
  const [courses, setCourses] = useState<Course[]>([
    { name: "Course 1", grade: "90", credits: "3" },
    { name: "Course 2", grade: "85", credits: "3" },
    { name: "Course 3", grade: "78", credits: "4" },
  ]);

  function addCourse() {
    setCourses(c => [...c, { name: `Course ${c.length + 1}`, grade: "", credits: "3" }]);
  }
  function removeCourse(i: number) {
    setCourses(c => c.filter((_, idx) => idx !== i));
  }
  function update(i: number, field: keyof Course, val: string) {
    setCourses(c => c.map((row, idx) => idx === i ? { ...row, [field]: val } : row));
  }

  function gradeToPoints(g: string): number | null {
    const pct = parseFloat(g);
    if (isNaN(pct)) return null;
    if (scale === "percentage") return pct;
    const entry = LETTER_GRADES_4.find(e => pct >= e.min);
    return entry ? entry.points : null;
  }

  let totalPoints = 0, totalCredits = 0;
  const rows = courses.map(c => {
    const pts = gradeToPoints(c.grade);
    const cr = parseFloat(c.credits) || 0;
    if (pts !== null && cr > 0) { totalPoints += pts * cr; totalCredits += cr; }
    return { ...c, pts };
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setScale("4.0")} className={scale === "4.0" ? "btn-primary" : "btn-secondary"}>4.0 Scale</button>
        <button onClick={() => setScale("percentage")} className={scale === "percentage" ? "btn-primary" : "btn-secondary"}>Percentage Scale</button>
      </div>

      <div className="space-y-2">
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className="input col-span-5" placeholder="Course name" value={c.name} onChange={e => update(i, "name", e.target.value)} />
            <input type="number" className="input col-span-3" placeholder={scale === "4.0" ? "Grade %" : "Score %"} value={c.grade} onChange={e => update(i, "grade", e.target.value)} />
            <input type="number" min={0} className="input col-span-2" placeholder="Credits" value={c.credits} onChange={e => update(i, "credits", e.target.value)} />
            <button onClick={() => removeCourse(i)} className="col-span-2 btn-secondary text-red-500 text-xs">Remove</button>
          </div>
        ))}
      </div>

      <button onClick={addCourse} className="btn-secondary text-sm">+ Add Course</button>

      {gpa !== null && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-5xl font-bold text-brand-600 dark:text-brand-400">{gpa.toFixed(2)}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {scale === "4.0" ? "GPA (4.0 scale)" : "Weighted Average (%)"}
            {" · "}{totalCredits} total credits
          </p>
        </div>
      )}
    </div>
  );
}
