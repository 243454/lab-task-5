const student = {
    id: 101,
    name: "Ali",
    marks: 0,
    scholarship: false,
    address: {
        city: "Islamabad",
        sector: "F-10"
    },
    contact: {
        email: "ali@university.edu"
    }
};

const update = {
    name: "Ali Khan",
    address: {
        city: "Rawalpindi"
    },
    contact: {
        phone: "03001234567"
    }
};

function updateStudent(student, update, ...otherUpdates) {
    // Object destructuring
    const { id, name: oldName, marks = 0 } = student;

    // Nested destructuring
    const { city, sector } = student.address;

    // Array destructuring
    const [firstMark, secondMark = 0] = [student.marks];

    // Object rest
    const { address, contact, ...otherFields } = update;

    // Build new nested objects
    const newAddress = {
        ...student.address,
        ...(address || {})
    };

    const newContact = {
        ...student.contact,
        ...(contact || {})
    };

    // Rest parameter: accept additional update objects
    const extraFields = Object.assign({}, ...otherUpdates);

    const updatedStudent = {
        ...student,
        ...otherFields,
        ...extraFields,
        address: newAddress,
        contact: newContact
    };

    // Optional chaining and nullish coalescing
    const cityName = updatedStudent.address?.city ?? "Unknown";

    // Property shorthand
    const summary = { id, oldName, marks, cityName };

    console.log("Summary:", summary);
    console.log("Nested values:", city, sector);
    console.log("Array values:", firstMark, secondMark);

    return updatedStudent;
}

const updated = updateStudent(student, update);

console.log("Updated Student:", updated);

// Reference comparison
console.log("Same main object:", student === updated);
console.log("Same address:", student.address === updated.address);
console.log("Same contact:", student.contact === updated.contact);

// Prove original is unchanged
console.log("Original Student:", student);

// Demonstrate preservation of 0, false and empty string
const testUpdate = {
    marks: 0,
    scholarship: false,
    name: ""
};

const testStudent = {
    ...student,
    ...testUpdate
};

console.log("Zero, false, and empty string:", testStudent);