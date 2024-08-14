let container = document.querySelector(".countries-container");
let searchBox = document.querySelector("input");
let selectedFilter = document.querySelector("select");
let searchCountry = "";
let filteredRegion = "";
let filteredSubRegion = "";
let regionsAndSubRegions = {};
let countriesDataArray = [];
let filteredArea = false;
let filteredPopulation = false;
let areaFlag = true;
let populationFlag = true;

let apiCall = async () => {
  let loaderContainer = document.createElement("div");
  loaderContainer.className = "loader";
  container.appendChild(loaderContainer);

  try {
    setTimeout(async () => {
      let apiData = await fetch("https://restcountries.com/v3.1/all");
      let countryDetails = await apiData.json();
      countriesDataArray = [...countryDetails];
      localStorage.setItem("countryDetails", JSON.stringify(countryDetails));
      mapRegionWithSubRegion(countryDetails);
      renderCards(countryDetails);
    }, 2000);
  } catch (e) {
    container.textContent = "OOPS! No data found";
  }
};

let mapRegionWithSubRegion = (countriesData) => {
  countriesData.forEach((country) => {
    let region = country.region.toLowerCase();
    if (regionsAndSubRegions[region]) {
      let regionSet = regionsAndSubRegions[region];
      regionSet.add(country.subregion);
    } else {
      let regionSet = new Set();
      regionSet.add(country.subregion);
      regionsAndSubRegions[region] = regionSet;
    }
  });
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
  let countryDetails = [...countriesDataArray];

  if (!searchCountry && !filteredRegion && !filteredSubRegion) {
    localStorage.setItem("countryDetails", JSON.stringify(countryDetails));
    renderCards(countryDetails);
  }

  if (searchCountry && filteredRegion) {
    let filteredDataByRegionAndCountry = countryDetails.filter(
      (country) =>
        country.region.toLowerCase() === filteredRegion &&
        country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
    );
    localStorage.setItem(
      "countryDetails",
      JSON.stringify(filteredDataByRegionAndCountry)
    );
    renderCards(filteredDataByRegionAndCountry);
  } else if (searchCountry && !filteredRegion) {
    let filterDataByCountry = countryDetails.filter((country) =>
      country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
    );
    localStorage.setItem("countryDetails", JSON.stringify(filterDataByCountry));
    renderCards(filterDataByCountry);
  } else if (!searchCountry && filteredRegion) {
    let filteredDataByRegion = countryDetails.filter(
      (country) => country.region.toLowerCase() === filteredRegion
    );
    localStorage.setItem(
      "countryDetails",
      JSON.stringify(filteredDataByRegion)
    );
    renderCards(filteredDataByRegion);
  }

  if (filteredSubRegion) {
    countryDetails = JSON.parse(localStorage.getItem("countryDetails"));
    let filterDataBySubRegion = countryDetails.filter(
      (country) => country.subregion === filteredSubRegion
    );
    localStorage.setItem(
      "countryDetails",
      JSON.stringify(filterDataBySubRegion)
    );
    renderCards(countryDetails);
  }

  if (filteredArea) {
    countryDetails = JSON.parse(localStorage.getItem("countryDetails"));
    if (areaFlag) {
      countryDetails.sort((a, b) => {
        if (a.area > b.area) {
          return -1;
        } else {
          return 1;
        }
      });
    } else {
      countryDetails.sort((a, b) => {
        if (a.area > b.area) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    localStorage.setItem("countryDetails", JSON.stringify(countryDetails));
    renderCards(countryDetails);
  }

  if (filteredPopulation) {
    countryDetails = JSON.parse(localStorage.getItem("countryDetails"));
    if (populationFlag) {
      countryDetails.sort((a, b) => {
        if (a.population > b.population) {
          return -1;
        } else {
          return 1;
        }
      });
    } else {
      countryDetails.sort((a, b) => {
        if (a.population > b.population) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    localStorage.setItem("countryDetails", JSON.stringify(countryDetails));
    renderCards(countryDetails);
  }

  // renderCards(countryDetails);
};

const renderSubRegion = (subregions) => {
  let subRegionElement = document.querySelector(".sub-region-filter");

  subregions.forEach((subregion) => {
    if (subregion) {
      let option = document.createElement("option");
      option.textContent = subregion;
      option.setAttribute("value", subregion);
      subRegionElement.appendChild(option);
    }
  });
};

const setSubRegion = (region) => {
  const subRegionSet = regionsAndSubRegions[region];
  const subRegionArr = Array.from(subRegionSet);
  renderSubRegion(subRegionArr);
};

apiCall();

searchBox.addEventListener("keyup", (e) => {
  searchCountry = e.target.value;
  filteredData();
});

selectedFilter.addEventListener("change", (e) => {
  filteredRegion = e.target.value;
  filteredData();
  setSubRegion(filteredRegion);
});

let toggleMode = document.querySelector(".mode");

toggleMode.addEventListener("click", () => {
  let body = document.querySelector("body");
  let lightEle = document.querySelectorAll(".light-elements");
  let select = document.querySelector("select");
  let card = document.querySelectorAll(".card");
  let input = document.querySelector("input");
  let subRegionSelect = document.querySelector(".sub-region-filter");

  if (body.classList.contains("dark-mode")) {
    lightEle.forEach((item) => {
      item.classList.remove("dark-elements");
    });
    body.classList.remove("dark-mode");
    select.classList.remove("dark-mode");
    subRegionSelect.classList.remove("dark-mode");
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
    subRegionSelect.classList.add("dark-mode");
    card.forEach((item) => {
      item.classList.add("dark-elements");
      item.classList.add("dark-text");
    });
    input.classList.add("dark-elements");
    input.classList.add("dark-text");
  }
});

let subRegionElement = document.querySelector(".sub-region-filter");
subRegionElement.addEventListener("change", (e) => {
  filteredSubRegion = e.target.value;
  filteredData();
});

let areaFilter = document.querySelector(".area-filter");
areaFilter.addEventListener("click", () => {
  filteredArea = true;
  filteredPopulation = false;
  areaFlag = !areaFlag;
  filteredData();
});

let populationFilter = document.querySelector(".pop-filter");
populationFilter.addEventListener("click", () => {
  filteredPopulation = true;
  filteredArea = false;
  populationFlag = !populationFlag;
  filteredData();
});
