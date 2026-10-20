import { processTranscript } from "./transcriptService.js";
import Student from "./student.js";

const rawData = `
[
    {
        "id": 101,
        "name": "Ali",
        "courses": [
            { "code": "CS301", "marks": 81 },
            { "code": "CS302", "marks": 74 }
        ]
    },
    {
        "id": 102,
        "name": "Sara",
        "courses": [
            { "code": "CS303", "marks": 91 }
        ]
    }
]
`;

try {
    const report = processTranscript(rawData);

    console.log("Transcript Report:");
    console.log(JSON.stringify(report, null, 2));

    const testStudent = new Student(103, "Ahmed", []);
    console.log("Default import:", testStudent.name);
} catch (error) {
    console.log(error.name + ":", error.message);
} finally {
    console.log("Transcript processing finished.");
}