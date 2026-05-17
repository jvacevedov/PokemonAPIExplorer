const imgElement = document.getElementById("pokemonSprite");
let pokemonActual=null;
// Buscador
function buscarPokemon(){
    /* limpiar div */
    imgElement.style.display="none";
    document.getElementById("mensajeError").textContent = "";
    /* hacer fecht */
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
    buscarPokemonAPI(pokemonName)
    .then(datosPokemon => {
            capturarInformacionPokemon(datosPokemon);
            mostrarPokemon(datosPokemon);
        })
        .catch(() => mostrarError());
}
function buscarPokemonAPI(pokemonName){
    const urlApi =`https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    return fetch(urlApi)
    .then(response => {
            if (!response.ok) throw new Error("No encontrado");
            return response.json();
        });
}
function capturarInformacionPokemon(datosPokemon){
    pokemonActual = datosPokemon;    
}

function mostrarPokemon(datosPokemon){
    pokemonActual = datosPokemon;
    const pokemonSprite =datosPokemon.sprites.front_default
    imgElement.src=pokemonSprite;
    imgElement.style.display="block";
    console.log(datosPokemon.name);
}
function mostrarError(){
    console.error("Pokemon no encontrado")
    document.getElementById("mensajeError").textContent = "Pokémon no encontrado";
}
// Atrapar
function atraparPokemon(){
    if (!pokemonActual) {
        document.getElementById("mensajeError").textContent = "Primero busca un Pokémon";
        console.warn("Primero busca un Pokémon");
        return;
    }
    console.log("Atrapado" +pokemonActual.id);
    guardarPokemonLocalStorage();
}
function guardarPokemonLocalStorage(){
    let listaPokemon = localStorage.getItem("listaPokemon");
    listaPokemon = listaPokemon ? JSON.parse(listaPokemon) : [];
    listaPokemon.push({id:pokemonActual.id});
    localStorage.setItem("listaPokemon", JSON.stringify(listaPokemon));
}
function mostrarPokemonCapturado(){
    const listaPokemonFront = document.getElementById("listaPokemonFront");
    listaPokemonFront.innerHTML = '';
    let listaPokemon = localStorage.getItem("listaPokemon");
    listaPokemon = listaPokemon ? JSON.parse(listaPokemon) : [];
    if (listaPokemon.length === 0) {
        listaPokemonFront.textContent = "Primero captura un Pokémon";
        return;
    }
    listaPokemon.forEach(pokemon => {
        buscarPokemonAPI(pokemon.id)
        .then(datosPokemon => {
            const li = document.createElement('li');
            li.innerHTML=`
                <img src="${datosPokemon.sprites.front_default}" alt="${datosPokemon.name}">
                <span>${datosPokemon.name} (id: ${datosPokemon.id})</span>
            `;
            listaPokemonFront.appendChild(li);
        })
        .catch(() => console.error(`Error cargando pokemon id: ${pokemon.id}`));
        
    });
}