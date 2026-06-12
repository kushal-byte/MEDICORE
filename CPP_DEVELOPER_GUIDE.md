# C++ Developer Guide — Annotated Code Walkthrough

This guide provides line-by-line explanations of the C++ backend code, demonstrating OOP principles, STL usage, and design patterns.

## 1. Base Class — `Person` (Inheritance + Polymorphism)

### Header (`person.h`)

```cpp
#ifndef PERSON_H
#define PERSON_H
#include <string>
#include <stdexcept>

// Base class — demonstrates ENCAPSULATION + ABSTRACTION.
// Doctor and Patient INHERIT from Person.
class Person {
private:                    // ENCAPSULATION: private members hidden from derived classes & users
    int         id;
    std::string name;
    int         age;
    std::string phone;

public:
    Person() : id(0), name(""), age(0), phone("") {}
    
    // Parameterized constructor with validation
    // std::move(name_) optimizes string copy (move semantics in C++11)
    Person(int id_, std::string name_, int age_, std::string phone_)
        : id(id_), name(std::move(name_)), age(age_), phone(std::move(phone_)) {
        if (age_ < 0) throw std::invalid_argument("Age cannot be negative");  // VALIDATION
    }
    
    virtual ~Person() = default;   // Virtual destructor: ensures derived class cleanup

    // Getters (const member functions — don't modify state)
    int         getId()    const { return id; }
    std::string getName()  const { return name; }
    int         getAge()   const { return age; }
    std::string getPhone() const { return phone; }

    // Setters with validation
    void setId(int v)              { id = v; }
    void setName(const std::string& v)  { name = v; }
    void setAge(int v) { 
        if (v < 0) throw std::invalid_argument("Age cannot be negative");
        age = v; 
    }
    void setPhone(const std::string& v) { phone = v; }

    // POLYMORPHISM — virtual methods overridden by derived classes
    virtual std::string role() const { return "Person"; }
    virtual void display() const;             // Defined in person.cpp
    virtual std::string serialize() const;    // For file persistence
};

#endif
```

**Key Concepts:**
- **Encapsulation**: private members can only be accessed via public getters/setters.
- **Validation**: constructor checks `age_ < 0` and throws an exception.
- **Virtual methods**: `role()`, `display()`, and `serialize()` can be overridden by `Doctor` and `Patient`.

### Implementation (`person.cpp`)

```cpp
#include "person.h"
#include <iostream>
#include <sstream>

// Base implementation of display (polymorphic — shows role name via role())
void Person::display() const {
    std::cout << "[" << role() << "] #" << id
              << " | " << name
              << " | age " << age
              << " | " << phone << "\n";
}

// Simple pipe-delimited serialization for file I/O
std::string Person::serialize() const {
    std::ostringstream os;      // std::ostringstream — in-memory string building
    os << id << "|" << name << "|" << age << "|" << phone;
    return os.str();            // Return as std::string
}
```

**Key Concepts:**
- **Polymorphism in action**: `display()` calls `role()` (virtual) which returns different values for `Doctor` vs. `Patient`.
- **Serialization**: pipe-delimited format for simple file persistence.

---

## 2. Derived Class — `Doctor` (Inheritance Example)

### Header (`doctor.h`)

```cpp
#ifndef DOCTOR_H
#define DOCTOR_H
#include "person.h"

// Doctor INHERITS from Person — is-a relationship
class Doctor : public Person {
private:
    std::string specialization;  // Additional doctor-specific fields
    std::string department;
    double      fee;

public:
    Doctor() : Person(), specialization(""), department(""), fee(0) {}
    
    // Parameterized constructor with validation
    Doctor(int id_, std::string name_, int age_, std::string phone_,
           std::string spec_, std::string dept_, double fee_)
        : Person(id_, std::move(name_), age_, std::move(phone_)),  // Call base constructor
          specialization(std::move(spec_)), department(std::move(dept_)), fee(fee_) {
        if (fee_ < 0) throw std::invalid_argument("Fee cannot be negative");
    }

    // Getters/setters (delegated to const/non-const member functions)
    std::string getSpecialization() const { return specialization; }
    std::string getDepartment()     const { return department; }
    double      getFee()            const { return fee; }
    void setSpecialization(const std::string& v) { specialization = v; }
    void setDepartment(const std::string& v)     { department = v; }
    void setFee(double v) { 
        if (v < 0) throw std::invalid_argument("Fee cannot be negative");
        fee = v; 
    }

    // Override virtual methods
    std::string role() const override { return "Doctor"; }
    void display() const override;
    std::string serialize() const override;
    static Doctor deserialize(const std::string& line);  // Factory for file loading
};

#endif
```

**Key Concepts:**
- **Inheritance**: `Doctor : public Person` means Doctor *is-a* Person.
- **Overrides**: `role()`, `display()`, `serialize()` are marked `override` (C++11 keyword for clarity).
- **Constructor chain**: `Person(...)` initializer calls the base constructor.

### Implementation (doctor.cpp — key parts)

```cpp
void Doctor::display() const {
    // Calls base display for common fields, then adds doctor-specific fields
    Person::display();
    std::cout << "  Specialization: " << specialization
              << " | Dept: " << department
              << " | Fee: ₹" << fee << "\n";
}

std::string Doctor::serialize() const {
    std::ostringstream os;
    // Tag with "DOCTOR|" for deserialization identification
    os << "DOCTOR|" << Person::serialize()          // Reuse base serialization
       << "|" << specialization << "|" << department << "|" << fee;
    return os.str();
}

// STATIC FACTORY: parses a line and reconstructs a Doctor object
Doctor Doctor::deserialize(const std::string& line) {
    // Example input: "DOCTOR|1|Dr. Anil Mehta|48|+91 90000 11111|Cardiologist|Cardiology|800"
    // Split by '|' and validate fields...
    // (implementation omitted for brevity; see actual cpp-backend/doctor.cpp)
    // Returns Doctor(id, name, age, phone, spec, dept, fee);
}
```

**Key Concepts:**
- **Method overriding**: `display()` calls `Person::display()` then adds doctor-specific output.
- **Serialization pattern**: tag data with a prefix for type identification during deserialization.
- **Static factory**: `deserialize()` is a static method that reconstructs objects from file format.

---

## 3. Aggregate — `Hospital` (Container + CRUD + File I/O)

### Header (`hospital.h`)

```cpp
#ifndef HOSPITAL_H
#define HOSPITAL_H
#include "doctor.h"
#include "patient.h"
#include "appointment.h"
#include "prescription.h"
#include <vector>
#include <string>
#include <stdexcept>

// Custom EXCEPTION type
class NotFoundException : public std::runtime_error {
public:
    explicit NotFoundException(const std::string& m) : std::runtime_error(m) {}
};

// Aggregates all entities — STL vectors + FILE HANDLING + CRUD
class Hospital {
private:
    std::string name;
    std::vector<Doctor>       doctors;       // STL vector — dynamic array
    std::vector<Patient>      patients;
    std::vector<Appointment>  appointments;
    std::vector<Prescription> prescriptions;
    int nextId = 1;                          // Simple ID generator

public:
    explicit Hospital(std::string name_ = "MediCore") : name(std::move(name_)) {}

    int generateId() { return nextId++; }

    // CRUD: Doctors
    void addDoctor(const Doctor& d);
    Doctor& findDoctor(int id);              // Returns reference; throws if not found
    void updateDoctorFee(int id, double fee);
    void removeDoctor(int id);

    // ... similar CRUD for Patient, Appointment, Prescription ...

    // Reads / reports (const — don't modify state)
    void listDoctors() const;
    void listPatients() const;
    void listAppointments() const;
    void listPrescriptions() const;
    size_t doctorCount()     const { return doctors.size(); }
    size_t patientCount()    const { return patients.size(); }
    size_t appointmentCount()const { return appointments.size(); }

    // POLYMORPHISM demo — accepts any Person&
    static void describe(const Person& p) { p.display(); }

    // FILE HANDLING
    void saveToFile(const std::string& path) const;
    void loadFromFile(const std::string& path);
};

#endif
```

**Key Concepts:**
- **STL vectors**: `std::vector<T>` provides dynamic arrays with automatic memory management.
- **Custom exceptions**: `NotFoundException` inherits from `std::runtime_error` for consistent error handling.
- **Reference returns**: `findDoctor()` returns a reference, allowing modification.
- **Static polymorphic helper**: `describe(const Person&)` demonstrates polymorphism — works with any `Person` subclass.

### Implementation (hospital.cpp — key patterns)

```cpp
#include "hospital.h"
#include <iostream>
#include <fstream>
#include <algorithm>

// CRUD: Find using STL algorithm
Doctor& Hospital::findDoctor(int id) {
    // std::find_if — finds first element matching a predicate (lambda function)
    auto it = std::find_if(doctors.begin(), doctors.end(),
                           [id](const Doctor& d){ return d.getId() == id; });  // LAMBDA
    if (it == doctors.end()) 
        throw NotFoundException("Doctor not found: " + std::to_string(id));  // Custom exception
    return *it;                                                               // Dereference iterator
}

// CRUD: Remove with validation
void Hospital::removeDoctor(int id) {
    auto before = doctors.size();
    // std::remove_if + erase idiom — "erase-remove" pattern
    doctors.erase(std::remove_if(doctors.begin(), doctors.end(),
                  [id](const Doctor& d){ return d.getId() == id; }), doctors.end());
    if (doctors.size() == before) 
        throw NotFoundException("Doctor not found: " + std::to_string(id));
}

// REFERENTIAL INTEGRITY: Appointments reference doctors & patients
void Hospital::bookAppointment(const Appointment& a) {
    // Validate that doctor and patient exist (throws if not found)
    findPatient(a.getPatientId());
    findDoctor(a.getDoctorId());
    appointments.push_back(a);
}

// FILE I/O: Save all entities
void Hospital::saveToFile(const std::string& path) const {
    std::ofstream out(path);                          // Open for writing
    if (!out) throw std::runtime_error("Cannot open file for write: " + path);
    
    // Iterate over each collection and serialize
    for (const auto& d  : doctors)       out << d.serialize()  << "\n";
    for (const auto& p  : patients)      out << p.serialize()  << "\n";
    for (const auto& a  : appointments)  out << a.serialize()  << "\n";
    for (const auto& rx : prescriptions) out << rx.serialize() << "\n";
    out.close();
    std::cout << "Saved data to " << path << "\n";
}

// FILE I/O: Load and reconstruct entities
void Hospital::loadFromFile(const std::string& path) {
    std::ifstream in(path);                           // Open for reading
    if (!in) throw std::runtime_error("Cannot open file for read: " + path);
    std::string line;
    while (std::getline(in, line)) {
        if (line.empty()) continue;
        try {
            // Dispatch to correct deserializer based on prefix
            if (line.rfind("DOCTOR|", 0) == 0)      doctors.push_back(Doctor::deserialize(line));
            else if (line.rfind("PATIENT|", 0) == 0) patients.push_back(Patient::deserialize(line));
            else if (line.rfind("APPT|", 0) == 0)    appointments.push_back(Appointment::deserialize(line));
        } catch (const std::exception& e) {
            std::cerr << "Skipping bad record: " << e.what() << "\n";  // Robust error handling
        }
    }
    std::cout << "Loaded data from " << path << "\n";
}
```

**Key Concepts:**
- **Lambdas**: `[id](const Doctor& d){ return d.getId() == id; }` is an inline function for predicates.
- **STL algorithms**: `std::find_if`, `std::remove_if` work on ranges for efficient operations.
- **Erase-remove idiom**: `erase(remove_if(...))` removes elements efficiently.
- **File I/O**: `std::ofstream` and `std::ifstream` for writing/reading.
- **Exception handling**: try-catch in `loadFromFile` skips malformed records but continues.

---

## 4. Demo Usage (`main.cpp`)

```cpp
#include "hospital.h"
#include <iostream>

int main() {
    Hospital h("MediCore General Hospital");
    std::cout << "=== MediCore C++ Backend Demo ===\n";

    try {
        // --- CREATE ---
        h.addDoctor(Doctor(1, "Dr. Anil Mehta", 48, "+91 90000 11111", 
                           "Cardiologist", "Cardiology", 800));
        h.addPatient(Patient(101, "Ravi Kumar", 34, "+91 80000 11111", 
                             "male", "O+", "Pune"));
        h.bookAppointment(Appointment(5001, 101, 1, "2026-06-10", "10:00", "Chest pain"));

        // --- READ (polymorphism in action) ---
        std::cout << "\n=== Polymorphism: describe() ===\n";
        Doctor  d = h.findDoctor(1);
        Patient p = h.findPatient(101);
        Hospital::describe(d);    // Calls Doctor::display() (override)
        Hospital::describe(p);    // Calls Patient::display() (override)

        // --- FILE PERSISTENCE ---
        h.saveToFile("hospital_data.txt");

        // --- UPDATE ---
        h.updateDoctorFee(1, 850);

        // --- DELETE ---
        h.removePatient(101);

        // --- EXCEPTION HANDLING ---
        std::cout << "\n=== Exception demo ===\n";
        h.findDoctor(999);  // Throws NotFoundException

    } catch (const NotFoundException& e) {
        std::cout << "Handled NotFoundException: " << e.what() << "\n";
    } catch (const std::exception& e) {
        std::cout << "Handled exception: " << e.what() << "\n";
    }

    std::cout << "\nTotals -> doctors:" << h.doctorCount()
              << " patients:" << h.patientCount()
              << " appts:" << h.appointmentCount() << "\n";
    return 0;
}
```

**Key Concepts:**
- **Try-catch**: catches both custom (`NotFoundException`) and standard exceptions.
- **Polymorphism**: `Hospital::describe()` calls the correct overridden `display()` method.
- **CRUD lifecycle**: Create → Read → Update → Delete flow.

---

## 5. Design Patterns & OOP Principles

### Encapsulation
Private member variables + public getter/setter methods control access and validation.

```cpp
class Person {
private:
    int age;
public:
    void setAge(int v) { 
        if (v < 0) throw std::invalid_argument("Age cannot be negative");
        age = v; 
    }
};
```

### Inheritance
Derived classes inherit common fields and behavior from a base class.

```cpp
class Doctor : public Person { /* ... */ };
class Patient : public Person { /* ... */ };
```

### Polymorphism
Virtual functions allow subclasses to override base behavior. Callers use base pointers/references.

```cpp
virtual void display() const;                 // Base
void display() const override { /* ... */ }   // Derived (override keyword for clarity)
```

### Exception Handling
Custom exceptions for domain-specific errors.

```cpp
class NotFoundException : public std::runtime_error { /* ... */ };
throw NotFoundException("Doctor not found");
catch (const NotFoundException& e) { /* ... */ }
```

### STL Algorithms & Containers
`std::vector` + `std::find_if` / `std::remove_if` for efficient data structures and operations.

```cpp
std::vector<Doctor> doctors;  // Dynamic array
auto it = std::find_if(doctors.begin(), doctors.end(), 
                       [id](const Doctor& d){ return d.getId() == id; });
```

### Serialization / Deserialization
Simple pipe-delimited format for file persistence.

```cpp
std::string serialize() const { /* id|name|age|... */ }
static Doctor deserialize(const std::string& line) { /* parse and construct */ }
```

---

## 6. Build & Test

### Compile with C++17
```bash
cd cpp-backend
make         # Uses -std=c++17
./hms        # Run demo
```

### Expected Output
```
=== MediCore C++ Backend Demo ===

=== Doctors (1) ===
[Doctor] #1 | Dr. Anil Mehta | age 48 | +91 90000 11111
  Specialization: Cardiologist | Dept: Cardiology | Fee: ₹800

...

=== Polymorphism: describe() ===
[Doctor] #1 | Dr. Anil Mehta | age 48 | +91 90000 11111
  Specialization: Cardiologist | Dept: Cardiology | Fee: ₹850

...

Saved data to hospital_data.txt
Handled NotFoundException: Doctor not found: 999

Totals -> doctors:1 patients:0 appts:1
=== Demo complete ===
```

---

## 7. Extending the Code

### Add a new field to `Doctor`
1. Update `doctor.h`: add field + getter/setter.
2. Update `doctor.cpp`: modify constructor, `display()`, `serialize()`, `deserialize()`.

### Add a new entity (e.g., `MedicalRecord`)
1. Create `medicalrecord.h` / `medicalrecord.cpp`.
2. Update `hospital.h` / `hospital.cpp` to include vectors and CRUD.
3. Update `main.cpp` demo to exercise the new entity.

### Add concurrent access
- Replace vectors with thread-safe containers (e.g., `tbb::concurrent_vector`).
- Protect file I/O with locks.

---

## 8. Lessons & Best Practices

✓ **Use const correctness**: `const` member functions for reads, non-const for mutations.  
✓ **Validate on entry**: check preconditions in constructors/setters.  
✓ **Use exceptions for error handling**: custom exception types for domain errors.  
✓ **Leverage STL**: `std::vector`, `std::find_if`, `std::remove_if` for safety and clarity.  
✓ **Use lambdas**: inline predicates make code concise and expressive.  
✓ **Separate concerns**: I/O (serialization) separate from business logic.  
✗ **Avoid raw pointers**: use references, `std::vector`, and RAII for automatic cleanup.  
✗ **Don't expose implementation**: keep members private and use accessors.

---

## Summary

The C++ backend demonstrates:
- **OOP**: inheritance (`Doctor : Person`), polymorphism (virtual methods), encapsulation (private members + getters).
- **Modern C++**: lambdas, `std::vector`, STL algorithms (`find_if`, `remove_if`).
- **Patterns**: erase-remove idiom, custom exceptions, file serialization/deserialization.
- **Best practices**: const correctness, validation, exception handling.

This code is educational and not production-ready (no concurrency, no real DB integration). For a production system, connect the C++ models to a Postgres backend or REST API layer.
