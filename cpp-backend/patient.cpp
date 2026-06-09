#include "patient.h"
#include <iostream>
#include <sstream>
#include <vector>

void Patient::display() const {
    std::cout << "[Patient] #" << getId() << " | " << getName()
              << " | " << gender << " | " << bloodGroup
              << " | " << getPhone() << " | " << address << "\n";
}

std::string Patient::serialize() const {
    std::ostringstream os;
    os << "PATIENT|" << getId() << "|" << getName() << "|" << getAge() << "|"
       << getPhone() << "|" << gender << "|" << bloodGroup << "|" << address;
    return os.str();
}

Patient Patient::deserialize(const std::string& line) {
    std::stringstream ss(line);
    std::string tok; std::vector<std::string> f;
    while (std::getline(ss, tok, '|')) f.push_back(tok);
    if (f.size() < 8) throw std::runtime_error("Bad patient record");
    return Patient(std::stoi(f[1]), f[2], std::stoi(f[3]), f[4], f[5], f[6], f[7]);
}
