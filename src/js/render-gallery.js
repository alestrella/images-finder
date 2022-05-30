import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

class MarkupGallery {
  drawCard(data) {
    const imgCards = data
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <div class="photo-card">
          <a class="photo-card-link" href="${largeImageURL}">
            <img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
              <p class="info-item"><b>Likes</b><span class ="info-num">${likes}</span></p>
              <p class="info-item"><b>Views</b><span class ="info-num">${views}</span></p>
              <p class="info-item"><b>Comments</b><span class ="info-num">${comments}</span></p>
              <p class="info-item"><b>Downloads</b><span class ="info-num">${downloads}</span></p>
            </div>
      </div>`,
      )
      .join('');

    refs.galleryBox.insertAdjacentHTML('beforeend', imgCards);
    lightbox.refresh();
  }

  clear() {
    refs.galleryBox.innerHTML = '';
  }

  showPreloader() {
    refs.preloader.classList.remove('js-hidden');
  }

  hidePreloader() {
    refs.preloader.classList.add('js-hidden');
  }
}

export default new MarkupGallery();
