#include "person.h"
#include <iostream>
#include <sstream>

void Person::display() const {
    std::cout << "[" << role() << "] #" << id
              << " | " << name
              << " | age " << age
              << " | " << phone << "\n";
}

std::string Person::serialize() const {
    std::ostringstream os;
    os << id << "|" << name << "|" << age << "|" << phone;
    return os.str();
}
