#ifndef DOCTOR_H
#define DOCTOR_H
#include "person.h"

class Doctor : public Person {            // INHERITANCE
private:
    std::string specialization;
    std::string department;
    double      fee;

public:
    Doctor() : Person(), specialization(""), department(""), fee(0) {}
    Doctor(int id_, std::string name_, int age_, std::string phone_,
           std::string spec_, std::string dept_, double fee_)
        : Person(id_, std::move(name_), age_, std::move(phone_)),
          specialization(std::move(spec_)), department(std::move(dept_)), fee(fee_) {
        if (fee_ < 0) throw std::invalid_argument("Fee cannot be negative");
    }

    std::string getSpecialization() const { return specialization; }
    std::string getDepartment()     const { return department; }
    double      getFee()            const { return fee; }
    void setSpecialization(const std::string& v) { specialization = v; }
    void setDepartment(const std::string& v)     { department = v; }
    void setFee(double v) { if (v < 0) throw std::invalid_argument("Fee cannot be negative"); fee = v; }

    std::string role() const override { return "Doctor"; }   // POLYMORPHISM
    void display() const override;
    std::string serialize() const override;
    static Doctor deserialize(const std::string& line);
};

#endif
