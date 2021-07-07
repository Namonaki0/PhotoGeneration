import { apiKey } from "./api.js";

const key = apiKey;
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector("#search-form");
const moreBtn = document.querySelector(".nav-btn");
let searchValue;
let fetchLink;
let page = 1;
let currentSearch;

//? EVENT LISTENERS /////////////////
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
  clear();
});

moreBtn.addEventListener("click", expandPage);
searchInput.addEventListener("input", inputValue);
//////////////////////////////?

//? FUNCTIONS /////////////////////
//* INPUT VALUE ASSIGNED TO GLOBAL VARIABLE - *searchValue*
function inputValue(e) {
  searchValue = e.target.value;
}

//* LAYOUT CREATED DYNAMICALLY - TEMPLATE
function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImage = document.createElement("div");
    galleryImage.innerHTML = `<img src=${photo.src.large}></img>
    <div class="gallery-info">
      <p><a href="${photo.photographer_url}" target="_blank">${photo.photographer}</a></p>
      <a href=${photo.src.original} target="_blank">download</a>
    </div>
    `;
    galleryImage.classList.add("gallery-layout");
    gallery.appendChild(galleryImage);
  });
}

function clear() {
  searchInput.value = "";
  gallery.innerHTML = "";
}
////////////////////////////////////?

//? ASYNC FUNCTIONS ////////////////
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: key,
    },
  });
  const data = await dataFetch.json();
  return data;
}

//* CURATED PHOTOS USED FOR INITIAL PAGE
async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
  const dataFetch = await fetchApi(fetchLink);
  generatePictures(dataFetch);
}

async function searchPhotos(search) {
  fetchLink = `https://api.pexels.com/v1/search?query=${search}+query&per_page=15&page=1`;
  const dataFetch = await fetchApi(fetchLink);
  generatePictures(dataFetch);
}

async function expandPage() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}
//////////////////////////////////////?

curatedPhotos();
