const students = [
    { id: 101, name: "Ali", completed: ["CS301"] }
];

const course = {
    code: "CS401",
    prerequisite: "CS301",
    seats: 2,
    registered: []
};

function loadStudent(id, callback) {
    setTimeout(() => {
        const student = students.find(s => s.id === id);

        if (!student) {
            return callback(new Error("Student does not exist"));
        }

        callback(null, student);
    }, 300);
}

function checkPrerequisites(student, course, callback) {
    setTimeout(() => {
        if (!student.completed.includes(course.prerequisite)) {
            return callback(new Error("Prerequisite not completed"));
        }

        callback(null, student);
    }, 300);
}

function checkSeats(course, callback) {
    setTimeout(() => {
        if (course.registered.length >= course.seats) {
            return callback(new Error("Course is full"));
        }

        callback(null, course);
    }, 300);
}

function registerCourse(student, course, callback) {
    setTimeout(() => {
        if (course.registered.includes(student.id)) {
            return callback(new Error("Already registered"));
        }

        course.registered.push(student.id);

        callback(null, {
            studentId: student.id,
            course: course.code,
            status: "REGISTERED"
        });
    }, 300);
}

// Dependent asynchronous workflow
function registrationService(studentId, course, callback) {
    loadStudent(studentId, (error, student) => {
        if (error) return callback(error);

        checkPrerequisites(student, course, (error) => {
            if (error) return callback(error);

            checkSeats(course, (error) => {
                if (error) return callback(error);

                registerCourse(student, course, (error, result) => {
                    if (error) return callback(error);

                    callback(null, result);
                });
            });
        });
    });
}

registrationService(101, course, (error, result) => {
    if (error) {
        console.log("Registration failed:", error.message);
    } else {
        console.log("Registration successful:", result);
    }
});