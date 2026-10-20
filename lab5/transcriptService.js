import Student from "./student.js";
import {
    calculateAverage,
    calculateGPA,
    calculateGrade as grade
} from "./gradeUtils.js";

export function processTranscript(rawData) {
    let data;

    // Safely parse JSON
    try {
        data = JSON.parse(rawData);
    } catch (error) {
        throw new SyntaxError("Invalid JSON data");
    }

    if (!Array.isArray(data)) {
        throw new TypeError("Transcript must be an array");
    }

    const ids = new Set();

    const report = data.map(item => {
        if (item.id === undefined || item.id === null) {
            throw new TypeError("Student ID is required");
        }

        if (ids.has(item.id)) {
            throw new Error("Duplicate student ID: " + item.id);
        }

        ids.add(item.id);

        if (!Array.isArray(item.courses)) {
            throw new TypeError("Courses must be an array");
        }

        item.courses.forEach(course => {
            if (!course.code || typeof course.code !== "string") {
                throw new TypeError("Course code is required");
            }

            if (typeof course.marks !== "number" ||
                !Number.isFinite(course.marks)) {
                throw new TypeError("Course marks must be numeric");
            }

            if (course.marks < 0 || course.marks > 100) {
                throw new RangeError("Marks must be between 0 and 100");
            }
        });

        const student = new Student(
            item.id,
            item.name || "Unknown",
            item.courses
        );

        const marks = student.courses.map(course => course.marks);

        return {
            id: student.id,
            name: student.name,
            courses: student.courses.map(course => ({
                code: course.code,
                marks: course.marks,
                grade: grade(course.marks)
            })),
            average: Number(calculateAverage(marks).toFixed(2)),
            GPA: calculateGPA(marks)
        };
    });

    return report;
}