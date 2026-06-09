#ifndef PRESCRIPTION_H
#define PRESCRIPTION_H
#include <string>
#include <vector>

struct Medicine {
    std::string name;
    std::string dosage;
    std::string frequency;
    std::string duration;
};

class Prescription {
private:
    int         id;
    int         patientId;
    int         doctorId;
    std::string diagnosis;
    std::vector<Medicine> medicines;   // STL container
    std::string advice;

public:
    Prescription() : id(0), patientId(0), doctorId(0), diagnosis(""), advice("") {}
    Prescription(int id_, int pid, int did, std::string diag_, std::string advice_)
        : id(id_), patientId(pid), doctorId(did),
          diagnosis(std::move(diag_)), advice(std::move(advice_)) {}

    int getId()        const { return id; }
    int getPatientId() const { return patientId; }
    int getDoctorId()  const { return doctorId; }
    std::string getDiagnosis() const { return diagnosis; }
    std::string getAdvice()    const { return advice; }
    const std::vector<Medicine>& getMedicines() const { return medicines; }

    void addMedicine(const Medicine& m) { medicines.push_back(m); }

    void display() const;
    std::string serialize() const;
};

#endif
