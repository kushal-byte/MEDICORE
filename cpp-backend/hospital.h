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
    std::vector<Doctor>       doctors;
    std::vector<Patient>      patients;
    std::vector<Appointment>  appointments;
    std::vector<Prescription> prescriptions;
    int nextId = 1;

public:
    explicit Hospital(std::string name_ = "MediCore") : name(std::move(name_)) {}

    int generateId() { return nextId++; }

    // CRUD: Doctors
    void addDoctor(const Doctor& d);
    Doctor& findDoctor(int id);
    void updateDoctorFee(int id, double fee);
    void removeDoctor(int id);

    // CRUD: Patients
    void addPatient(const Patient& p);
    Patient& findPatient(int id);
    void removePatient(int id);

    // CRUD: Appointments
    void bookAppointment(const Appointment& a);
    void updateAppointmentStatus(int id, const std::string& status);
    void cancelAppointment(int id);

    // CRUD: Prescriptions
    void addPrescription(const Prescription& rx);

    // Reads / reports
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
