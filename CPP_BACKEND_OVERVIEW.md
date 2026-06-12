# C++ Backend — Overview and Code Guide

This document explains the C++ backend included in this project (cpp-backend), the core classes and logic, how it integrates with the frontend, and instructions to build and run the demo.

## Purpose
The C++ backend is a self-contained OOP demo for hospital data management. It is not the production API — the frontend uses Supabase for live data — but the C++ module demonstrates:

- Inheritance and polymorphism (`Person` base class, `Doctor`/`Patient` subclasses)
- Encapsulation and class APIs for CRUD operations
- File persistence (`saveToFile` / `loadFromFile`) for offline demo
- Serialization/deserialization of domain objects to a simple text format
- Exception handling with a custom `NotFoundException`

Keep in mind: the C++ demo is educational and operates on local in-memory structures and a saved `hospital_data.txt` file.

## Location
Files are in the workspace at:

- `cpp-backend/` — C++ source and headers
  - `main.cpp` — demo runner
  - `hospital.*` — `Hospital` aggregate (manages collections)
  - `person.*` — `Person` base class
  - `doctor.*` — `Doctor` class
  - `patient.*` — `Patient` class
  - `appointment.*` — `Appointment` class
  - `prescription.*` — `Prescription` class
  - `Makefile` and Windows helper `windows-build-run.ps1`

(See the repo `cpp-backend` folder for exact filenames.)

## Key Classes & Responsibilities

- `Person` (base)
  - Common fields: id, full name, age, phone
  - Virtual methods: `describe()` and other polymorphic behavior

- `Doctor` (inherits `Person`)
  - Fields: specialization, department, fee
  - Methods: doctor-specific display and behavior

- `Patient` (inherits `Person`)
  - Fields: gender, blood group, address
  - Methods: patient-specific display

- `Appointment`
  - Fields: id, patient id, doctor id, date, time, reason, status
  - Used by `Hospital` to track scheduling

- `Prescription`
  - Fields: id, patient id, doctor id, diagnosis, medicines (list), advice
  - Simple API to add medicines

- `Hospital` (aggregate)
  - Holds vectors/collections of doctors, patients, appointments, prescriptions
  - CRUD operations: `addDoctor`, `addPatient`, `bookAppointment`, `addPrescription`, `removePatient`, etc.
  - Search/find helpers: `findDoctor(id)`, `findPatient(id)` that throw `NotFoundException` if missing
  - `saveToFile(filename)` / `loadFromFile(filename)` to persist demo state
  - `describe()` helper to display polymorphic `Person` objects

- `NotFoundException`
  - Custom exception class used when lookups fail; demonstrates exception handling

## Persistence / File Format
- `Hospital::saveToFile("hospital_data.txt")` writes a line-per-entity text file (simple serialized format) used by the demo to persist state between runs.
- `Hospital::loadFromFile(...)` parses the file to rebuild in-memory collections.
- The file is intended as a convenience for the local demo only.

## How It Runs (Demo)
- `main.cpp` creates a `Hospital` instance, populates it with sample doctors, patients, appointments and a prescription, demonstrates listing and CRUD operations, calls `saveToFile`, then performs deletes and exception demos.
- Typical demo flow:
  1. Create doctors & patients
  2. Book appointments
  3. Add prescription(s)
  4. List objects
  5. Update and delete objects
  6. Save to file and show persistence

## Build & Run
Requirements: a C++17-capable compiler (g++, clang, MSVC)

Linux / macOS (using Makefile):

```bash
cd cpp-backend
make
./hms
```

Windows (PowerShell helper provided):

```powershell
# from repo root
cd cpp-backend
# build and run via helper script (requires g++ in PATH)
.
# or run the included helper
powershell -ExecutionPolicy Bypass -File ./windows-build-run.ps1 run
```

The `Makefile` compiles sources with `-std=c++17` and links an executable named `hms`.

## Integration with Frontend
- The production frontend uses Supabase for authentication and persistent storage. The C++ backend is independent and not wired to Supabase.
- The C++ demo shows how the domain logic could be structured if a native backend were used. If you intend to integrate it with the frontend, consider:
  - Exposing the C++ service via a separate REST/gRPC wrapper (not included)
  - Replacing the file persistence with a real Postgres connection or RPC layer

## Testing & Extending
- To add test scenarios, edit `main.cpp` or add new demo functions that exercise edge cases (conflicting appointment times, removal while referenced, etc.).
- To extend models (e.g. add `insurance` to `Patient`), update the class header and serialization logic consistently.

## Safety & Production Notes
- The C++ module is for offline demo/education only. It lacks:
  - Concurrency control
  - Robust input validation and sanitization
  - Persistent DB integration and ACID guarantees
  - Authentication/authorization
- For production, rely on the Supabase-backed frontend or build a proper backend service that enforces RLS and authentication.

## Quick File Map (examples)

- `cpp-backend/main.cpp` — demo runner and sample usage
- `cpp-backend/hospital.h/.cpp` — `Hospital` aggregate, persistence helpers
- `cpp-backend/person.h/.cpp` — `Person` base class
- `cpp-backend/doctor.h/.cpp` — `Doctor` class
- `cpp-backend/patient.h/.cpp` — `Patient` class
- `cpp-backend/appointment.h/.cpp` — `Appointment`
- `cpp-backend/prescription.h/.cpp` — `Prescription`
- `cpp-backend/Makefile` — build script
- `cpp-backend/windows-build-run.ps1` — Windows build/run helper

## Next steps / Recommendations
- If you want the frontend to use the C++ backend rather than Supabase, implement an API layer (REST/gRPC) around the C++ module and add authentication.
- To make the C++ demo production-ready, replace file-based persistence with a Postgres connector or an ORM and add proper auth.
- Keep the demo code separate from production services; the current architecture uses Supabase for production data.

---

If you want, I can also generate a `CPP_DEVELOPER_GUIDE.md` with code snippets from specific files (`hospital.cpp`, `person.h`) annotated line-by-line. Which level of detail would you prefer next? (annotated code vs high-level overview)
