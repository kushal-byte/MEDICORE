#include "hospital.h"
#include <iostream>
#include <fstream>
#include <algorithm>

// ---------- Doctors ----------
void Hospital::addDoctor(const Doctor& d) { doctors.push_back(d); }

Doctor& Hospital::findDoctor(int id) {
    auto it = std::find_if(doctors.begin(), doctors.end(),
                           [id](const Doctor& d){ return d.getId() == id; });
    if (it == doctors.end()) throw NotFoundException("Doctor not found: " + std::to_string(id));
    return *it;
}

void Hospital::updateDoctorFee(int id, double fee) { findDoctor(id).setFee(fee); }

void Hospital::removeDoctor(int id) {
    auto before = doctors.size();
    doctors.erase(std::remove_if(doctors.begin(), doctors.end(),
                  [id](const Doctor& d){ return d.getId() == id; }), doctors.end());
    if (doctors.size() == before) throw NotFoundException("Doctor not found: " + std::to_string(id));
}

// ---------- Patients ----------
void Hospital::addPatient(const Patient& p) { patients.push_back(p); }

Patient& Hospital::findPatient(int id) {
    auto it = std::find_if(patients.begin(), patients.end(),
                           [id](const Patient& p){ return p.getId() == id; });
    if (it == patients.end()) throw NotFoundException("Patient not found: " + std::to_string(id));
    return *it;
}

void Hospital::removePatient(int id) {
    auto before = patients.size();
    patients.erase(std::remove_if(patients.begin(), patients.end(),
                   [id](const Patient& p){ return p.getId() == id; }), patients.end());
    if (patients.size() == before) throw NotFoundException("Patient not found: " + std::to_string(id));
}

// ---------- Appointments ----------
void Hospital::bookAppointment(const Appointment& a) {
    // validate references exist (throws if missing)
    findPatient(a.getPatientId());
    findDoctor(a.getDoctorId());
    appointments.push_back(a);
}

void Hospital::updateAppointmentStatus(int id, const std::string& status) {
    auto it = std::find_if(appointments.begin(), appointments.end(),
                           [id](const Appointment& a){ return a.getId() == id; });
    if (it == appointments.end()) throw NotFoundException("Appointment not found: " + std::to_string(id));
    it->setStatus(status);
}

void Hospital::cancelAppointment(int id) { updateAppointmentStatus(id, "cancelled"); }

// ---------- Prescriptions ----------
void Hospital::addPrescription(const Prescription& rx) { prescriptions.push_back(rx); }

// ---------- Reads ----------
void Hospital::listDoctors() const {
    std::cout << "\n=== Doctors (" << doctors.size() << ") ===\n";
    for (const auto& d : doctors) d.display();
}
void Hospital::listPatients() const {
    std::cout << "\n=== Patients (" << patients.size() << ") ===\n";
    for (const auto& p : patients) p.display();
}
void Hospital::listAppointments() const {
    std::cout << "\n=== Appointments (" << appointments.size() << ") ===\n";
    for (const auto& a : appointments) a.display();
}
void Hospital::listPrescriptions() const {
    std::cout << "\n=== Prescriptions (" << prescriptions.size() << ") ===\n";
    for (const auto& rx : prescriptions) rx.display();
}

// ---------- File handling ----------
void Hospital::saveToFile(const std::string& path) const {
    std::ofstream out(path);
    if (!out) throw std::runtime_error("Cannot open file for write: " + path);
    for (const auto& d  : doctors)       out << d.serialize()  << "\n";
    for (const auto& p  : patients)      out << p.serialize()  << "\n";
    for (const auto& a  : appointments)  out << a.serialize()  << "\n";
    for (const auto& rx : prescriptions) out << rx.serialize() << "\n";
    out.close();
    std::cout << "Saved data to " << path << "\n";
}

void Hospital::loadFromFile(const std::string& path) {
    std::ifstream in(path);
    if (!in) throw std::runtime_error("Cannot open file for read: " + path);
    std::string line;
    while (std::getline(in, line)) {
        if (line.empty()) continue;
        try {
            if (line.rfind("DOCTOR|", 0) == 0)      doctors.push_back(Doctor::deserialize(line));
            else if (line.rfind("PATIENT|", 0) == 0) patients.push_back(Patient::deserialize(line));
            else if (line.rfind("APPT|", 0) == 0)    appointments.push_back(Appointment::deserialize(line));
        } catch (const std::exception& e) {
            std::cerr << "Skipping bad record: " << e.what() << "\n";
        }
    }
    std::cout << "Loaded data from " << path << "\n";
}
