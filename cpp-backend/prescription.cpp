#include "prescription.h"
#include <iostream>
#include <sstream>

void Prescription::display() const {
    std::cout << "[Rx] #" << id << " | patient " << patientId
              << " | dr " << doctorId << " | dx: " << diagnosis << "\n";
    for (const auto& m : medicines)        // STL iteration
        std::cout << "      - " << m.name << " | " << m.dosage
                  << " | " << m.frequency << " | " << m.duration << "\n";
    if (!advice.empty()) std::cout << "      advice: " << advice << "\n";
}

std::string Prescription::serialize() const {
    std::ostringstream os;
    os << "RX|" << id << "|" << patientId << "|" << doctorId << "|" << diagnosis;
    for (const auto& m : medicines)
        os << "|" << m.name << "~" << m.dosage << "~" << m.frequency << "~" << m.duration;
    os << "||" << advice;
    return os.str();
}
