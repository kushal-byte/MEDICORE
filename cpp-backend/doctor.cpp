#include "doctor.h"
#include <iostream>
#include <sstream>
#include <vector>

void Doctor::display() const {
    std::cout << "[Doctor] #" << getId() << " | " << getName()
              << " | " << specialization << " (" << department << ")"
              << " | fee " << fee << " | " << getPhone() << "\n";
}

std::string Doctor::serialize() const {
    std::ostringstream os;
    os << "DOCTOR|" << getId() << "|" << getName() << "|" << getAge() << "|"
       << getPhone() << "|" << specialization << "|" << department << "|" << fee;
    return os.str();
}

Doctor Doctor::deserialize(const std::string& line) {
    std::stringstream ss(line);
    std::string tok; std::vector<std::string> f;
    while (std::getline(ss, tok, '|')) f.push_back(tok);
    if (f.size() < 8) throw std::runtime_error("Bad doctor record");
    return Doctor(std::stoi(f[1]), f[2], std::stoi(f[3]), f[4], f[5], f[6], std::stod(f[7]));
}
