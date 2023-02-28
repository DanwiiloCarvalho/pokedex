const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=151";

/*Função que realiza o fetch para os 151 primeiros pokémons e mapea apenas os principais dados, retornando uma promise*/
async function fetchPokemon(url) {
    const response = await fetch(url);
    const pokemons = await response.json();
    
    const promisesAll = pokemons.results.map(value => {
        return pokemonData(value);
    });
    return Promise.all(promisesAll);
}