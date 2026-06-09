#include "appointment.h"
#include <iostream>
#include <sstream>
#include <vector>
#include <stdexcept>

void Appointment::display() const {
    std::cout << "[Appt] #" << id << " | patient " << patientId
              << " -> doctor " << doctorId << " | " << date << " " << time
              << " | " << status << " | " << reason << "\n";
}

std::string Appointment::serialize() const {
    std::ostringstream os;
    os << "APPT|" << id << "|" << patientId << "|" << doctorId << "|"
       << date << "|" << time << "|" << status << "|" << reason;
    return os.str();
}

Appointment Appointment::deserialize(const std::string& line) {
    std::stringstream ss(line);
    std::string tok; std::vector<std::string> f;
    while (std::getline(ss, tok, '|')) f.push_back(tok);
    if (f.size() < 8) throw std::runtime_error("Bad appointment record");
    Appointment a(std::stoi(f[1]), std::stoi(f[2]), std::stoi(f[3]), f[4], f[5], f[7]);
    a.setStatus(f[6]);
    return a;
}
