CXX      = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O2
SRC      = person.cpp doctor.cpp patient.cpp appointment.cpp prescription.cpp hospital.cpp main.cpp
OBJ      = $(SRC:.cpp=.o)
TARGET   = hms

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJ)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

run: all
	./$(TARGET)

clean:
	rm -f $(OBJ) $(TARGET) hospital_data.txt
