const results = [
    { id: 1, name: "Ali", department: "CS", course: "FSWD", marks: 82 },
    { id: 2, name: "Sara", department: "CS", course: "FSWD", marks: 91 },
    { id: 3, name: "Usman", department: "SE", course: "FSWD", marks: 47 },
    { id: 4, name: "Hina", department: "AI", course: "FSWD", marks: 73 },
    { id: 5, name: "Ahmed", department: "SE", course: "FSWD", marks: 64 },
    { id: 6, name: "Zoya", department: "AI", course: "FSWD", marks: 91 }
];

function getGrade(marks) {
    if (marks >= 85) return { grade: "A", points: 4.0 };
    if (marks >= 80) return { grade: "A-", points: 3.7 };
    if (marks >= 75) return { grade: "B+", points: 3.3 };
    if (marks >= 70) return { grade: "B", points: 3.0 };
    if (marks >= 65) return { grade: "B-", points: 2.7 };
    if (marks >= 60) return { grade: "C+", points: 2.3 };
    if (marks >= 50) return { grade: "C", points: 2.0 };
    return { grade: "F", points: 0.0 };
}

// A. Process each student's result
const processed = results.map(student => {
    const gradeInfo = getGrade(student.marks);

    return {
        ...student,
        grade: gradeInfo.grade,
        gradePoints: gradeInfo.points,
        status: student.marks >= 50 ? "PASS" : "FAIL"
    };
});

console.log("Processed Results:", processed);

// B. Ranked merit list; sort a copy to protect original array
const ranked = [...processed].sort((a, b) =>
    b.marks - a.marks || a.name.localeCompare(b.name)
);

console.log("Ranked List:", ranked);

// C. Department statistics
const departments = {};

processed.forEach(student => {
    const dept = student.department;

    if (!departments[dept]) {
        departments[dept] = {
            students: 0,
            total: 0,
            highest: student.marks,
            passed: 0
        };
    }

    departments[dept].students++;
    departments[dept].total += student.marks;
    departments[dept].highest = Math.max(
        departments[dept].highest,
        student.marks
    );

    if (student.status === "PASS") {
        departments[dept].passed++;
    }
});

Object.keys(departments).forEach(dept => {
    departments[dept].average =
        departments[dept].total / departments[dept].students;

    delete departments[dept].total;
});

console.log("Department Statistics:", departments);

// D. Academic queries
console.log(
    "First student scoring above 85:",
    processed.find(s => s.marks > 85)
);

console.log(
    "Index of first failed student:",
    processed.findIndex(s => s.marks < 50)
);

console.log(
    "At least one failed:",
    processed.some(s => s.marks < 50)
);

console.log(
    "All marks valid:",
    processed.every(s =>
        Number.isFinite(s.marks) && s.marks >= 0 && s.marks <= 100
    )
);

const overallAverage = processed.reduce(
    (sum, s) => sum + s.marks, 0
) / processed.length;

console.log(
    "Above average:",
    processed.filter(s => s.marks > overallAverage)
);

console.log(
    "Top three students:",
    ranked.slice(0, 3).map(s => s.name)
);