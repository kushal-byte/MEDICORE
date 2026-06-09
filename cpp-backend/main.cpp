#include "hospital.h"
#include <iostream>

// Console demo of the C++ OOP backend.
// Build:  make    Run: ./hms
int main() {
    Hospital h("MediCore General Hospital");
    std::cout << "=== MediCore C++ Backend Demo ===\n";

    try {
        // --- Create (CRUD) ---
        h.addDoctor(Doctor(1, "Dr. Anil Mehta", 48, "+91 90000 11111", "Cardiologist", "Cardiology", 800));
        h.addDoctor(Doctor(2, "Dr. Sunita Rao", 41, "+91 90000 22222", "Neurologist", "Neurology", 900));

        h.addPatient(Patient(101, "Ravi Kumar", 34, "+91 80000 11111", "male", "O+", "Pune"));
        h.addPatient(Patient(102, "Priya Sharma", 29, "+91 80000 22222", "female", "A+", "Mumbai"));

        h.bookAppointment(Appointment(5001, 101, 1, "2026-06-10", "10:00", "Chest pain"));
        h.bookAppointment(Appointment(5002, 102, 2, "2026-06-10", "11:30", "Migraine"));

        Prescription rx(9001, 101, 1, "Stable angina", "Avoid heavy exertion");
        rx.addMedicine({"Aspirin 75mg", "1 tab", "1x daily", "30 days"});
        rx.addMedicine({"Atorvastatin 10mg", "1 tab", "night", "30 days"});
        h.addPrescription(rx);

        // --- Read ---
        h.listDoctors();
        h.listPatients();
        h.listAppointments();
        h.listPrescriptions();

        // --- Update ---
        h.updateDoctorFee(1, 850);
        h.updateAppointmentStatus(5001, "confirmed");
        std::cout << "\nAfter updates:\n";
        h.findDoctor(1).display();
        h.listAppointments();

        // --- Polymorphism: same call, different behavior ---
        std::cout << "\n=== Polymorphism (Person&) ===\n";
        Doctor  d = h.findDoctor(2);
        Patient p = h.findPatient(102);
        Hospital::describe(d);
        Hospital::describe(p);

        // --- File handling ---
        h.saveToFile("hospital_data.txt");

        // --- Delete (CRUD) ---
        h.removePatient(102);
        std::cout << "\nAfter delete patient 102:\n";
        h.listPatients();

        // --- Exception handling demo ---
        std::cout << "\n=== Exception demo ===\n";
        h.findDoctor(999);  // throws

    } catch (const NotFoundException& e) {
        std::cout << "Handled NotFoundException: " << e.what() << "\n";
    } catch (const std::exception& e) {
        std::cout << "Handled exception: " << e.what() << "\n";
    }

    std::cout << "\nTotals -> doctors:" << h.doctorCount()
              << " patients:" << h.patientCount()
              << " appts:" << h.appointmentCount() << "\n";
    std::cout << "=== Demo complete ===\n";
    return 0;
}
