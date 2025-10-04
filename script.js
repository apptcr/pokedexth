async function loadPokedex() {
  const response = await fetch("pokedex.json");
  const pokemons = await response.json();

  const pokedex = document.getElementById("pokedex");
  const search = document.getElementById("search");

  function displayPokemon(list) {
    pokedex.innerHTML = "";
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.id}. ${p.name} (${p.thai})</h3>
        <div>${p.type.map(t => `<span class="type ${t}">${t}</span>`).join("")}</div>
      `;
      pokedex.appendChild(card);
    });
  }

  displayPokemon(pokemons);

  search.addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = pokemons.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.thai.includes(keyword)
    );
    displayPokemon(filtered);
  });
}

loadPokedex();