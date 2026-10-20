const applicants = [
    {
        id: "A101", name: "Sara Khan", age: "19",
        matricMarks: "91", intermediateMarks: "87",
        entryTest: "78", program: "BSCS", feePaid: "true"
    },
    {
        id: "A102", name: "Ahmed Ali", age: "twenty",
        matricMarks: "88", intermediateMarks: "",
        entryTest: "72", program: "BSSE", feePaid: "false"
    },
    {
        id: "A103", name: "Hassan", age: "18",
        matricMarks: "76", intermediateMarks: "83",
        entryTest: "91", program: "BSAI", feePaid: "true"
    }
];

const programs = ["BSCS", "BSSE", "BSAI"];

function processApplicant(applicant) {
    const age = Number(applicant.age);
    const matric = Number(applicant.matricMarks);
    const intermediate = Number(applicant.intermediateMarks);
    const entryTest = Number(applicant.entryTest);

    const errors = [];

    if (!applicant.id || !applicant.name.trim()) {
        errors.push("Missing ID or name");
    }

    if (applicant.age.trim() === "" || !Number.isFinite(age)) {
        errors.push("Invalid age");
    } else if (age < 17 || age > 30) {
        errors.push("Age must be 17 to 30");
    }

    const marks = [matric, intermediate, entryTest];
    const fields = ["Matric", "Intermediate", "Entry Test"];
    const rawMarks = [
        applicant.matricMarks,
        applicant.intermediateMarks,
        applicant.entryTest
    ];

    for (let i = 0; i < marks.length; i++) {
        if (rawMarks[i].trim() === "" ||
            !Number.isFinite(marks[i])) {
            errors.push("Invalid " + fields[i] + " marks");
        } else if (marks[i] < 0 || marks[i] > 100) {
            errors.push(fields[i] + " marks out of range");
        }
    }

    if (!programs.includes(applicant.program)) {
        errors.push("Unsupported program");
    }

    if (!["true", "false"].includes(applicant.feePaid)) {
        errors.push("Invalid fee status");
    }

    if (errors.length > 0) {
        return {
            id: applicant.id,
            name: applicant.name,
            status: "INVALID DATA",
            errors
        };
    }

    const merit = matric * 0.20 +
                  intermediate * 0.30 +
                  entryTest * 0.50;

    const eligible = merit >= 70 &&
                     entryTest >= 60 &&
                     intermediate >= 60;

    let status;

    if (!eligible) {
        status = "REJECTED";
    } else if (merit >= 80 && applicant.feePaid === "true") {
        status = "SELECTED";
    } else {
        status = "WAITING";
    }

    return {
        id: applicant.id,
        name: applicant.name,
        program: applicant.program,
        merit: Number(merit.toFixed(2)),
        eligible,
        feePaid: applicant.feePaid === "true",
        status
    };
}

const processed = applicants.map(processApplicant);

const valid = processed.filter(
    applicant => applicant.status !== "INVALID DATA"
);

const invalid = processed.filter(
    applicant => applicant.status === "INVALID DATA"
);

const ranked = valid.filter(
    applicant => applicant.merit !== undefined
).sort((a, b) => b.merit - a.merit);

const average = valid.length > 0
    ? valid.reduce((sum, a) => sum + a.merit, 0) / valid.length
    : 0;

const programCounts = {};

programs.forEach(program => {
    programCounts[program] = applicants.filter(
        a => a.program === program
    ).length;
});

console.log("Processed Applicants:", processed);
console.log("Valid Applicants:", valid.length);
console.log("Invalid Applicants:", invalid.length);
console.log("Highest Merit:", ranked[0] || "No valid applicants");
console.log(
    "Lowest Merit:",
    ranked.length ? ranked[ranked.length - 1].merit : "N/A"
);
console.log("Average Merit:", Number(average.toFixed(2)));
console.log("Program Counts:", programCounts);