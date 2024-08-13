let container = document.querySelector(".countries-container");
let searchBox = document.querySelector("input");
let selectedFilter = document.querySelector("select");
let searchCountry = "";
let filteredRegion = "";

let apiCall = async () => {
  let loaderContainer = document.createElement("div");
  loaderContainer.className = "loader";
  container.appendChild(loaderContainer);

  try {
    let apiData = await fetch("https://restcountries.com/v3.1/all");
    let countryDetails = await apiData.json();
    localStorage.setItem("countryDetails", JSON.stringify(countryDetails));
    renderCards(countryDetails);
  } catch (e) {
    container.textContent = "OOPS! No data found";
  }
};

let renderCards = (countryDetails) => {
  if (!countryDetails.length) {
    container.textContent = "OOPS! No data found";
    return;
  }

  container.textContent = "";
  countryDetails.forEach((country) => {
    let card = document.createElement("div");
    card.style.width = "18rem";
    card.className = "card shadow";

    let image = document.createElement("img");
    image.className = "card-img-top";
    image.setAttribute("src", country.flags.png);
    image.style.height = "12rem";

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `<h4 class="card-title fw-bold">${country.name.common}</h4>
                      <p class="card-text">
                          <span class="fw-semibold">Population: </span>${country.population}
                          <br>
                          <span class="fw-semibold">Region: </span>${country.region}
                          <br>
                          <span class="fw-semibold">Capital: </span>${country.capital}
                      </p>`;

    card.appendChild(image);
    card.appendChild(cardBody);

    container.appendChild(card);
  });
};

let filteredData = () => {
  let countryDetails = JSON.parse(localStorage.getItem("countryDetails"));

  if (searchCountry && filteredRegion) {
    let filteredDataByRegionAndCountry = countryDetails.filter(
      (country) =>
        country.region.toLowerCase() === filteredRegion &&
        country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
    );
    renderCards(filteredDataByRegionAndCountry);

    return;
  }

  if (searchCountry && !filteredRegion) {
    let filterDataByCountry = countryDetails.filter((country) =>
      country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
    );

    renderCards(filterDataByCountry);

    return;
  }

  if (!searchCountry && filteredRegion) {
    let filteredDataByRegion = countryDetails.filter(
      (country) => country.region.toLowerCase() === filteredRegion
    );
    renderCards(filteredDataByRegion);
    return;
  }

  renderCards(countryDetails);
};

apiCall();

searchBox.addEventListener("keyup", (e) => {
  searchCountry = e.target.value;
  filteredData();
});

selectedFilter.addEventListener("change", (e) => {
  filteredRegion = e.target.value;
  filteredData();
});

let toggleMode = document.querySelector(".mode");

toggleMode.addEventListener("click", () => {
  console.log("clicked!");

  let body = document.querySelector("body");
  let lightEle = document.querySelectorAll(".light-elements");
  let select = document.querySelector("select");
  let card = document.querySelectorAll(".card");
  let input = document.querySelector("input");

  if (body.classList.contains("dark-mode")) {
    lightEle.forEach((item) => {
      item.classList.remove("dark-elements");
    });
    body.classList.remove("dark-mode");
    select.classList.remove("dark-mode");
    card.forEach((item) => {
      item.classList.remove("dark-elements");
      item.classList.remove("dark-text");
    });

    input.classList.remove("dark-elements");
    input.classList.remove("dark-text");
  } else {
    lightEle.forEach((item) => {
      item.classList.add("dark-elements");
    });
    body.classList.add("dark-mode");
    select.classList.add("dark-mode");
    card.forEach((item) => {
      item.classList.add("dark-elements");
      item.classList.add("dark-text");
    });
    input.classList.add("dark-elements");
    input.classList.add("dark-text");
  }
});
