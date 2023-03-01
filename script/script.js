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

/**Requisição para detalhes do pokémon (Apenas um teste para ver se funciona ao realizar requisição em cardsGenerator)*/
async function showDetails(url) {
    const responseDetails = await fetch(url);
    const jsonDetails = await responseDetails.json();
    /* console.log(jsonDetails); */

    /**Renderização do filtro escuro do fundo*/
    const body = document.querySelector("body");
    const filter = document.createElement("div");
    filter.classList.add("filter");
    body.prepend(filter);

    /**Renderização do modal */
    const main = document.querySelector("main.container");
    const modal = document.createElement("section");
    modal.classList.add("modal");
    body.classList.add("hide");
    main.appendChild(modal);

    /**Correção do idioma da descrição */
    const englishDescription = jsonDetails.flavor_text_entries.filter(value => {
        if(value.language.name === 'en') return value;
    });
    

    //<img class="official-artwork" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${jsonDetails.id}.png">
    /* console.log(englishDescription); */
    const modalContent = `
        <h3>${jsonDetails.name}</h3>
        <span id="close" class="material-symbols-outlined">close</span>
        <p class="number">Nº ${jsonDetails.id}</p>
        <img class="official-artwork" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${jsonDetails.id}.svg">
        <p class="description">${englishDescription[0].flavor_text.replace("\n", " ").replace("\f", " ")}</p>
    `;
    modal.innerHTML = modalContent;

    /**Implementação do botão close do modal*/
    const closeButton = document.querySelector("section.modal > span#close");
    closeButton.addEventListener("click", () => {
        document.querySelector("main.container").removeChild(modal);
        body.removeChild(filter);
        body.classList.remove("hide");

        const pokemonCards = document.querySelectorAll("li.card");
        pokemonCards.forEach(element => element.classList.remove("inactive-card"));
    });
}

/*Função que pega a promise gerada pelo fetchPokémon, gera um arrays de objetos com dados de cada pokémon e ao final gera todos os cards*/
async function cardsGenerator() {
    const pokemonsInfo = await fetchPokemon(apiUrl);
    const cards = pokemonsInfo.reduce((acumulator, currentValue) => {
        acumulator += `
        <li id="${currentValue.id}" class="card ${currentValue.types[0]}">
            <div class="circle">
                <img src="${currentValue.sprites}" alt="">
            </div>
            <div class="name-type">
                <h2><span class="id">${currentValue.id}</span>. <span>${currentValue.name}</span></h2>
                <p>${currentValue.types.join(" | ")}</p>
            </div>
        </li>
        `;
        return acumulator;
    }, "");
    const pokemonList = document.querySelector("ul.pokemon-list");
    pokemonList.innerHTML = cards;
    
    //Capturando todos os cards de Pokémon
    const pokemonCards = document.querySelectorAll("li.card");
    pokemonCards.forEach(element => {
        element.addEventListener("click", () => {
            pokemonCards.forEach(element => element.classList.add("inactive-card"));
            const pokemonDetailsUrl = `https://pokeapi.co/api/v2/pokemon-species/${element.id}`;
            showDetails(pokemonDetailsUrl);
        });
    });
}

cardsGenerator();
/* const resultado = document.querySelectorAll("li.card");
console.log(resultado[0]); */