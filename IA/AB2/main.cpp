#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <set>

#include "penguin.cpp"
#include "KNN.cpp"

using namespace std;

int main(int argc, char **argv)
{
    if (argc < 4)
    {
        printf("Use \"%s [arquivo.txt] [teste.txt] [valor de K]\" roda o programa com uma base de teste.\n\n"
               "Mais informações no README\n",
               argv[0]);
        return 1;
    }

    vector<Penguin> penguins;
    set<string> species;

    //#region read file
    ifstream inputfile(argv[1]);
    while (!inputfile.eof() && inputfile.good())
    {
        string _species;
        string island;
        double culmen_length_mm;
        double culmen_depth_mm;
        int flipper_length_mm;
        int body_mass_g;
        string sex;

        inputfile >> _species >> island >> culmen_length_mm >> culmen_depth_mm >> flipper_length_mm >> body_mass_g >> sex;
        penguins.push_back(Penguin(_species, island, culmen_length_mm, culmen_depth_mm, flipper_length_mm, body_mass_g, sex));
        species.insert(_species);
    }
    inputfile.close();
    //#endregion read file

    KNN knn(penguins, species);

    int acertos = 0;
    int total = 0;

    ifstream testfile(argv[2]);
    while (!testfile.eof() && testfile.good())
    {
        string _species;
        string island;
        double culmen_length_mm;
        double culmen_depth_mm;
        int flipper_length_mm;
        int body_mass_g;
        string sex;

        testfile >> _species >> island >> culmen_length_mm >> culmen_depth_mm >> flipper_length_mm >> body_mass_g >> sex;
        Penguin p(_species, island, culmen_length_mm, culmen_depth_mm, flipper_length_mm, body_mass_g, sex);

        string classe = knn.classificarAmostra(p, stoi(argv[3]));

        std::cout << "Esperado: " << _species << "\t Obteve: " << classe << endl;

        if (classe == _species)
        {
            acertos++;
        }

        total++;
    }
    testfile.close();

    std::cout << "Acertou " << acertos << " de " << total << " amostras";

    return 0;
}
