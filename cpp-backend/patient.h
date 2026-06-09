#ifndef PATIENT_H
#define PATIENT_H
#include "person.h"

class Patient : public Person {           // INHERITANCE
private:
    std::string gender;
    std::string bloodGroup;
    std::string address;

public:
    Patient() : Person(), gender(""), bloodGroup(""), address("") {}
    Patient(int id_, std::string name_, int age_, std::string phone_,
            std::string gender_, std::string blood_, std::string addr_)
        : Person(id_, std::move(name_), age_, std::move(phone_)),
          gender(std::move(gender_)), bloodGroup(std::move(blood_)), address(std::move(addr_)) {}

    std::string getGender()     const { return gender; }
    std::string getBloodGroup() const { return bloodGroup; }
    std::string getAddress()    const { return address; }
    void setGender(const std::string& v)     { gender = v; }
    void setBloodGroup(const std::string& v) { bloodGroup = v; }
    void setAddress(const std::string& v)    { address = v; }

    std::string role() const override { return "Patient"; }  // POLYMORPHISM
    void display() const override;
    std::string serialize() const override;
    static Patient deserialize(const std::string& line);
};

#endif
