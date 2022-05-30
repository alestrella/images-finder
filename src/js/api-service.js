import axios from 'axios';

const AUTH_KEY = '27580766-69a6c32a164d53413dc53c022';

axios.defaults.baseURL = 'https://pixabay.com/api/';

class ImageFinder {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const searchConfig = new URLSearchParams({
      key: AUTH_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });
    const URL = `?${searchConfig}`;

    try {
      const { data } = await axios.get(URL);

      this.incrementPage();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
export default new ImageFinder();
