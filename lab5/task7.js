function getStudent(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id !== 101) {
                reject(new Error("Student not found"));
            } else {
                resolve({ id: 101, name: "Ali" });
            }
        }, 200);
    });
}

function getCourse(code) {
    return Promise.resolve({
        code,
        prerequisite: "CS301",
        seats: 5
    });
}

function checkPrerequisites(student, course) {
    return Promise.resolve({
        student,
        course,
        prerequisitePassed: true
    });
}

function checkSeats(data) {
    if (data.course.seats <= 0) {
        return Promise.reject(new Error("Course is full"));
    }

    return Promise.resolve(data);
}

function registerStudent(data) {
    return Promise.resolve({
        studentId: data.student.id,
        course: data.course.code,
        status: "REGISTERED"
    });
}

// Post-registration services
function sendEmail() {
    return Promise.resolve("Email sent");
}

function sendSMS() {
    return Promise.reject(new Error("SMS service failed"));
}

function writeAuditLog() {
    return Promise.resolve("Audit log saved");
}

function runPostServices() {
    const services = [
        { name: "Email", promise: sendEmail() },
        { name: "SMS", promise: sendSMS() },
        { name: "Audit", promise: writeAuditLog() }
    ];

    return Promise.allSettled(
        services.map(service => service.promise)
    ).then(results => {
        return results.map((result, index) => ({
            service: services[index].name,
            status: result.status
        }));
    });
}

// Part A: Registration chain
getStudent(101)
    .then(student => {
        return getCourse("CS401").then(course => ({
            student,
            course
        }));
    })
    .then(data => checkPrerequisites(data.student, data.course))
    .then(data => checkSeats(data))
    .then(data => registerStudent(data))
    .then(result => {
        console.log("Registration:", result);

        // Part B: Start independent services after registration
        return runPostServices();
    })
    .then(report => {
        console.log("Service Report:", report);
    })
    .catch(error => {
        console.log("Error:", error.message);
    })
    .finally(() => {
        console.log("Registration workflow finished.");
    });

// Part C: First successful server response
function serverOne() {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Server one failed")), 200);
    });
}

function serverTwo() {
    return new Promise(resolve => {
        setTimeout(() => resolve({ course: "CS401" }), 400);
    });
}

Promise.any([serverOne(), serverTwo()])
    .then(result => console.log("First successful result:", result))
    .catch(error => console.log("All servers failed:", error.message));