import axios from 'axios';
import { AUTH_KEY, BASE_URL } from './constants-api';

class ImageFinderApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    // console.log(this);
    const searchConfig = {
      params: {
        key: AUTH_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: 40,
      },
    };

    try {
      const { data } = await axios.get(BASE_URL, searchConfig).then();
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
export default new ImageFinderApi();
