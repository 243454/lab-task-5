export function calculateGrade(marks) {
    if (marks >= 85) return "A";
    if (marks >= 80) return "A-";
    if (marks >= 75) return "B+";
    if (marks >= 70) return "B";
    if (marks >= 65) return "B-";
    if (marks >= 60) return "C+";
    if (marks >= 50) return "C";
    return "F";
}

export function calculateAverage(marks) {
    if (marks.length === 0) return 0;

    return marks.reduce((sum, mark) => sum + mark, 0)
        / marks.length;
}

export function calculateGPA(marks) {
    if (marks.length === 0) return 0;

    const points = marks.map(mark => {
        if (mark >= 85) return 4.0;
        if (mark >= 80) return 3.7;
        if (mark >= 75) return 3.3;
        if (mark >= 70) return 3.0;
        if (mark >= 65) return 2.7;
        if (mark >= 60) return 2.3;
        if (mark >= 50) return 2.0;
        return 0;
    });

    return Number(calculateAverage(points).toFixed(2));
}