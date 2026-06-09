#ifndef APPOINTMENT_H
#define APPOINTMENT_H
#include <string>

class Appointment {
private:
    int         id;
    int         patientId;
    int         doctorId;
    std::string date;   // YYYY-MM-DD
    std::string time;   // HH:MM
    std::string status; // scheduled/confirmed/completed/cancelled
    std::string reason;

public:
    Appointment() : id(0), patientId(0), doctorId(0),
                    date(""), time(""), status("scheduled"), reason("") {}
    Appointment(int id_, int pid, int did, std::string date_,
                std::string time_, std::string reason_)
        : id(id_), patientId(pid), doctorId(did), date(std::move(date_)),
          time(std::move(time_)), status("scheduled"), reason(std::move(reason_)) {}

    int getId()        const { return id; }
    int getPatientId() const { return patientId; }
    int getDoctorId()  const { return doctorId; }
    std::string getDate()   const { return date; }
    std::string getTime()   const { return time; }
    std::string getStatus() const { return status; }
    std::string getReason() const { return reason; }
    void setStatus(const std::string& s) { status = s; }

    void display() const;
    std::string serialize() const;
    static Appointment deserialize(const std::string& line);
};

#endif
