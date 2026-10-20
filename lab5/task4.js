"use strict";

class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    introduce() {
        return `My name is ${this.name}. Email: ${this.email}`;
    }
}

class Student extends Person {
    constructor(name, email, rollNo, marks) {
        super(name, email);
        this.rollNo = rollNo;
        this.marks = marks;
    }

    introduce() {
        return super.introduce() +
            ` Roll No: ${this.rollNo}`;
    }

    getResult() {
        return this.marks >= 50 ? "PASS" : "FAIL";
    }
}

class FacultyMember extends Person {
    constructor(name, email, employeeId, department) {
        super(name, email);
        this.employeeId = employeeId;
        this.department = department;
    }

    introduce() {
        return super.introduce() +
            ` Department: ${this.department}`;
    }
}

const student1 = new Student(
    "Ali", "ali@university.edu", 101, 82
);

const student2 = new Student(
    "Sara", "sara@university.edu", 102, 45
);

const teacher1 = new FacultyMember(
    "Ahmed", "ahmed@university.edu", "F01", "CS"
);

const teacher2 = new FacultyMember(
    "Hina", "hina@university.edu", "F02", "AI"
);

// Runtime polymorphism
const users = [student1, student2, teacher1, teacher2];

users.forEach(user => console.log(user.introduce()));

console.log("Student result:", student1.getResult());
console.log("Second student result:", student2.getResult());

console.log(student1 instanceof Student); // true
console.log(student1 instanceof Person);  // true
console.log(teacher1 instanceof Student); // false

// call() example
const guest = {
    name: "Dr. Ahmed",
    email: "ahmed@example.com"
};

console.log(Person.prototype.introduce.call(guest));

// Detached method
const fn = student1.introduce;

try {
    console.log(fn());
} catch (error) {
    console.log("Detached method error:", error.message);
}

// bind() creates a safely bound method
const safeFunction = student1.introduce.bind(student1);

console.log(safeFunction());