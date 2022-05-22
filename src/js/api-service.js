const API_KEY = '27580766-69a6c32a164d53413dc53c022';
let BASE_URI = `https://pixabay.com/api/`;
const perPage = 40;

function fetchImages(searchQuery) {
  return fetch(
    `${BASE_URI}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`,
  ).then(response => response.json());
}
