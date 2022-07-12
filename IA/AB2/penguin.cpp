#ifndef PENGUIN_CPP
#define PENGUIN_CPP
#include <cmath>
#include <string>

class Penguin
{
public:
    std::string species;
    std::string island;
    double culmen_length_mm;
    double culmen_depth_mm;
    int flipper_length_mm;
    int body_mass_g;
    short sex; // 0 - male; 1 - female; 2 - n/a

    Penguin(
        std::string species,
        std::string island,
        double culmen_length_mm,
        double culmen_depth_mm,
        int flipper_length_mm,
        int body_mass_g,
        std::string sex) : species(species),
                           island(island),
                           culmen_length_mm(culmen_length_mm),
                           culmen_depth_mm(culmen_depth_mm),
                           flipper_length_mm(flipper_length_mm),
                           body_mass_g(body_mass_g)
    {
        if (sex[0] == 'M')
        {
            this->sex = 0;
        }
        else if (sex[0] == 'F')
        {
            this->sex = 1;
        }
        else
        {
            this->sex = 2;
        }
    }
};
#endif
