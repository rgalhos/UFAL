#ifndef KNN_CPP
#define KNN_CPP

#include <cstddef>
#include <iostream>
#include <vector>
#include <utility>
#include <iterator>
#include <algorithm>
#include <set>
#include "penguin.cpp"

using namespace std;

class KNN
{
private:
    vector<Penguin> penguins;
    vector<string> species;

public:
    KNN(vector<Penguin> penguins, set<string> species) : penguins(penguins)
    {
        this->species = vector<string>(species.begin(), species.end());
    }

    string classificarAmostra(Penguin amostra, unsigned int k)
    {
        // Assegura que k seja ímpar decrementando 1
        if (~k & 1)
            --k;

        vector<pair<int, double>> distanceList;

        for (int i = 0; i < this->penguins.size(); i++)
        {
            Penguin &p = this->penguins[i];
            double distance = KNN::distance(amostra, p);
            distanceList.push_back(pair<int, double>(i, distance));
            // cout << p.species << " from " << p.island << " weighing " << p.body_mass_g << 'g' << endl;
        }

        sort(distanceList.begin(), distanceList.end(), [](auto &left, auto &right)
             { return left.second < right.second; });

        vector<int> classes(this->species.size());

        for (pair<int, double> element : distanceList)
        {
            double d = element.second;
            Penguin &p = this->penguins[element.first];

            vector<string>::iterator it = find(this->species.begin(), this->species.end(), p.species);
            ptrdiff_t i = it - this->species.begin();

            classes[i]++;

            if (--k <= 0)
            {
                break;
            }
        }

        int maior = -1e5, maiorIndice = -1;
        for (int i = 0; i < classes.size(); i++)
        {
            // cout << this->species[i] << " - " << classes[i] << endl;
            if (classes[i] > maior)
            {
                maior = classes[i];
                maiorIndice = i;
            }
        }

        return this->species[maiorIndice];
    }

    static inline double distance(Penguin a, Penguin b)
    {
        return sqrt(
            pow(b.culmen_length_mm - a.culmen_length_mm, 2) +
            pow(b.culmen_depth_mm - a.culmen_depth_mm, 2) +
            pow(b.flipper_length_mm - a.flipper_length_mm, 2) +
            pow(b.body_mass_g - a.body_mass_g, 2));
    }
};
#endif
