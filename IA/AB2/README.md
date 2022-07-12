Os dados utilizados foram retirados do arquivo "penguins_size.csv", disponível em:

https://www.kaggle.com/datasets/parulpandey/palmer-archipelago-antarctica-penguin-data?select=penguins_size.csv

O seguinte comando foi rodado para deixar a entrada amigável para o programa:

```bash
sed -e 's/,/ /g' -e '1d' penguins_size.csv | grep -v 'NA NA' >> penguins_size_normal.txt
```

## Como rodar
Basta rodar `make` (requer g++), ou compilar o arquivo `main.cpp` com algum outro compilador.

`./main [arquivo.txt] [teste.txt] [valor de K]` roda o programa com uma base de teste.
