async function loadPokedex() {
  const res = await fetch("pokedex.json");
  const pokemons = await res.json();

  const pokedex = document.getElementById("pokedex");
  const search = document.getElementById("search");
  const toggleBtn = document.getElementById("toggle");
  const randomBtn = document.getElementById("random");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let showingFavorites = false;

  function display(list) {
    pokedex.innerHTML = "";
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.thai}</h3>
        <p style="font-family: 'Poppins', sans-serif;">(${p.name})</p>
        <div>${p.type.map(t => `<span class='type ${t}'>${t}</span>`).join("")}</div>
      `;
      card.onclick = () => showPopup(p);
      pokedex.appendChild(card);
    });
  }

  function showPopup(p) {
    const popup = document.getElementById("popup");
    const favBtn = document.getElementById("fav-btn");
    const isFav = favorites.some(f => f.id === p.id);

    favBtn.textContent = isFav ? "✅ อยู่ในรายการโปรด" : "⭐ เพิ่มในรายการโปรด";
    favBtn.classList.toggle("added", isFav);

    favBtn.onclick = () => toggleFavorite(p);

    document.getElementById("popup-img").src = p.image;
    document.getElementById("popup-thai").textContent = p.thai;
    document.getElementById("popup-eng").textContent = `(${p.name})`;
    document.getElementById("popup-type").innerHTML = "ประเภท: " + p.type.map(t => `<span class='type ${t}'>${t}</span>`).join(" ");
    document.getElementById("popup-desc").textContent = p.description;

    const statsContainer = document.getElementById("popup-stats");
    statsContainer.innerHTML = "";
    Object.entries(p.stats).forEach(([key, val]) => {
      const width = Math.min(val, 100);
      const color = key === 'HP' ? '#78C850' : key === 'Attack' ? '#F08030' : '#6890F0';
      statsContainer.innerHTML += `
        <div><strong>${key}:</strong></div>
        <div class='stat-bar'><div class='stat-fill' style='width:${width}%; background:${color}'>${val}</div></div>
      `;
    });

    popup.classList.remove("hidden");
  }

  function toggleFavorite(p) {
    const exists = favorites.find(f => f.id === p.id);
    if (exists) {
      favorites = favorites.filter(f => f.id !== p.id);
    } else {
      favorites.push(p);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showPopup(p);
    if (showingFavorites) display(favorites);
  }

  function toggleView() {
    showingFavorites = !showingFavorites;
    toggleBtn.textContent = showingFavorites ? "📖 ดูทั้งหมด" : "⭐ รายการโปรด";
    toggleBtn.classList.toggle("active", showingFavorites);
    display(showingFavorites ? favorites : pokemons);
  }

  function randomPokemon() {
    const list = showingFavorites ? favorites : pokemons;
    if (list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    showPopup(random);
  }

  document.getElementById("close").onclick = () => document.getElementById("popup").classList.add("hidden");
  document.getElementById("popup").onclick = e => { if (e.target.id === "popup") document.getElementById("popup").classList.add("hidden"); };
  toggleBtn.onclick = toggleView;
  randomBtn.onclick = randomPokemon;

  search.addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = (showingFavorites ? favorites : pokemons).filter(p =>
      p.name.toLowerCase().includes(keyword) || p.thai.includes(keyword)
    );
    display(filtered);
  });

  display(pokemons);
}
loadPokedex();