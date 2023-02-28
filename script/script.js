const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=151";

/* Função que pega todos os detalhes de um pokémon e seleciona apenas os necessários(id, nome, sprites e tipo) e retorna uma promise */
async function pokemonData(pokemon) {
    try {
        const response = await fetch(pokemon.url);
        const pokemonJson = await response.json();
        let pokemonTypes = [];
        for (const pokemonType of pokemonJson.types) {
            pokemonTypes.push(pokemonType.type.name);
        }
        const pokemonData = {
            sprites: pokemonJson.sprites.front_default,
            id: pokemonJson.id,
            name: pokemonJson.name,
            types: pokemonTypes
        }
        return pokemonData;
    } catch (error) {
        console.log(error);
    }
}

/*Função que realiza o fetch para os 151 primeiros pokémons e mapea apenas os principais dados, retornando uma promise*/
async function fetchPokemon(url) {
    const response = await fetch(url);
    const pokemons = await response.json();
    
    const promisesAll = pokemons.results.map(value => {
        return pokemonData(value);
    });
    return Promise.all(promisesAll);
}

/*Função que pega a promise gerada pelo fetchPokémon, gera um arrays de objetos com dados de cada pokémon e ao final gera todos os cards*/
async function cardsGenerator() {
    const pokemonsInfo = await fetchPokemon(apiUrl);
    const cards = pokemonsInfo.reduce((acumulator, currentValue) => {
        acumulator += `
        <li class="card ${currentValue.types[0]}">
            <div class="circle">
                <img src="${currentValue.sprites}" alt="">
            </div>
            <div class="name-type">
                <h2>${currentValue.id}. <span>${currentValue.name}</span></h2>
                <p>${currentValue.types.join(" | ")}</p>
            </div>
        </li>
        `;
        return acumulator;
    }, "");
    const pokemonList = document.querySelector("ul.pokemon-list");
    pokemonList.innerHTML = cards;
}

cardsGenerator();