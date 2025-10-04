async function loadPokedex() {
  const res = await fetch("pokedex.json");
  const pokemons = await res.json();

  const pokedex = document.getElementById("pokedex");
  const search = document.getElementById("search");

  function display(list) {
    pokedex.innerHTML = "";
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.thai}</h3>
        <p style="font-family: 'Poppins', sans-serif; font-size:0.9em;">(${p.name})</p>
        <div>${p.type.map(t => `<span class='type ${t}'>${t}</span>`).join("")}</div>
      `;
      card.onclick = () => showPopup(p);
      pokedex.appendChild(card);
    });
  }

  function showPopup(p) {
    const popup = document.getElementById("popup");
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

  document.getElementById("close").onclick = () => document.getElementById("popup").classList.add("hidden");
  document.getElementById("popup").onclick = e => { if (e.target.id === "popup") document.getElementById("popup").classList.add("hidden"); };

  display(pokemons);

  search.addEventListener("input", e => {
    const keyword = e.target.value.toLowerCase();
    const filtered = pokemons.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.thai.includes(keyword)
    );
    display(filtered);
  });
}
loadPokedex();