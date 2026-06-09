#ifndef PERSON_H
#define PERSON_H
#include <string>
#include <stdexcept>

// Base class — demonstrates ENCAPSULATION + ABSTRACTION.
// Doctor and Patient INHERIT from Person.
class Person {
private:
    int         id;
    std::string name;
    int         age;
    std::string phone;

public:
    Person() : id(0), name(""), age(0), phone("") {}
    Person(int id_, std::string name_, int age_, std::string phone_)
        : id(id_), name(std::move(name_)), age(age_), phone(std::move(phone_)) {
        if (age_ < 0) throw std::invalid_argument("Age cannot be negative");
    }
    virtual ~Person() = default;

    // getters / setters (encapsulation)
    int         getId()    const { return id; }
    std::string getName()  const { return name; }
    int         getAge()   const { return age; }
    std::string getPhone() const { return phone; }

    void setId(int v)              { id = v; }
    void setName(const std::string& v)  { name = v; }
    void setAge(int v)             { if (v < 0) throw std::invalid_argument("Age cannot be negative"); age = v; }
    void setPhone(const std::string& v) { phone = v; }

    // POLYMORPHISM — overridden by derived classes
    virtual std::string role() const { return "Person"; }
    virtual void display() const;                 // defined in person.cpp
    virtual std::string serialize() const;        // for FILE HANDLING
};

#endif
