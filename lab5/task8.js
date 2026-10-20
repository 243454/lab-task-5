// Fake API data
const apiData = {
    "/users": [
        { id: 1, name: "Ali", department: "CS" },
        { id: 2, name: "Sara", department: "CS" },
        { id: 3, name: "Usman", department: "SE" }
    ],
    "/courses": [
        { code: "CS301", name: "Programming" },
        { code: "CS401", name: "Advanced JavaScript" }
    ],
    "/results": [
        { studentId: 1, name: "Ali", department: "CS", marks: 82 },
        { studentId: 2, name: "Sara", department: "CS", marks: 91 },
        { studentId: 3, name: "Usman", department: "SE", marks: 42 }
    ]
};

// Fake fetch implementation
function fakeFetch(url, options = {}) {
    const signal = options.signal;

    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(new Error("Request aborted"));
        }

        let delay = url === "/slow" ? 2000 : 200;
        let timer;

        const finish = () => {
            if (signal?.aborted) {
                return reject(new Error("Request aborted"));
            }

            if (url === "/network-error") {
                return reject(new TypeError("Network failure"));
            }

            if (url === "/invalid-json") {
                return resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.reject(
                        new SyntaxError("Invalid JSON")
                    )
                });
            }

            if (url === "/404" || url === "/500") {
                return resolve({
                    ok: false,
                    status: url === "/404" ? 404 : 500,
                    json: async () => ({})
                });
            }

            if (url === "/slow") {
                // A successful response after a long delay
                return resolve({
                    ok: true,
                    status: 200,
                    json: async () => ({ message: "Slow response" })
                });
            }

            resolve({
                ok: true,
                status: 200,
                json: async () => apiData[url] || {}
            });
        };

        timer = setTimeout(finish, delay);

        if (signal) {
            signal.addEventListener("abort", () => {
                clearTimeout(timer);
                reject(new Error("Request aborted"));
            }, { once: true });
        }
    });
}

// Part A: Safely fetch and parse JSON
async function getJSON(url, fetchImplementation = fakeFetch) {
    const response = await fetchImplementation(url);

    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
    }

    return await response.json();
}

// Part B: Load all three services concurrently
async function loadDashboard() {
    const [users, courses, results] = await Promise.all([
        getJSON("/users"),
        getJSON("/courses"),
        getJSON("/results")
    ]);

    const average = results.length > 0
        ? results.reduce((sum, r) => sum + r.marks, 0)
            / results.length
        : 0;

    const ranked = [...results].sort(
        (a, b) => b.marks - a.marks
    );

    const departments = {};

    results.forEach(r => {
        if (!departments[r.department]) {
            departments[r.department] = {
                students: 0,
                totalMarks: 0,
                passed: 0
            };
        }

        departments[r.department].students++;
        departments[r.department].totalMarks += r.marks;

        if (r.marks >= 50) {
            departments[r.department].passed++;
        }
    });

    Object.keys(departments).forEach(dept => {
        departments[dept].average =
            departments[dept].totalMarks /
            departments[dept].students;

        delete departments[dept].totalMarks;
    });

    return {
        totalStudents: users.length,
        totalCourses: courses.length,
        overallAverage: Number(average.toFixed(2)),
        highestPerformingStudent: ranked[0] || null,
        failedStudents: results.filter(r => r.marks < 50).length,
        departments
    };
}

// Part C: Fetch with timeout
async function fetchWithTimeout(
    url,
    milliseconds,
    fetchImplementation = fakeFetch
) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, milliseconds);

    try {
        return await getJSON(url, (requestUrl) =>
            fetchImplementation(requestUrl, {
                signal: controller.signal
            })
        );
    } finally {
        clearTimeout(timer);
    }
}

// Test dashboard
loadDashboard()
    .then(report => console.log("Dashboard:", report))
    .catch(error => console.log("Dashboard error:", error.message));

// Test invalid HTTP response
getJSON("/404")
    .catch(error => console.log("404 test:", error.message));

// Test network failure
getJSON("/network-error")
    .catch(error => console.log("Network test:", error.message));

// Test invalid JSON
getJSON("/invalid-json")
    .catch(error => console.log("JSON test:", error.message));

// Test timeout
fetchWithTimeout("/slow", 300)
    .then(data => console.log("Slow request:", data))
    .catch(error => console.log("Timeout test:", error.message));