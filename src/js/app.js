import imageFinder from './api-service';
import { refs } from './refs';
import renderGallery from './render-gallery';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
  position: 'left-top',
  closeButton: false,
});

document.addEventListener('DOMContentLoaded', () => {
  refs.searchForm.addEventListener('submit', handleImageSearch);

  const observer = new IntersectionObserver(handleEntry, { rootMargin: '200px' });
  observer.observe(refs.sentinel);
});

async function handleImageSearch(evt) {
  evt.preventDefault();

  imageFinder.resetPage();
  renderGallery.clear();
  window.scrollTo({ top: 0 });
  renderGallery.showPreloader();
  imageFinder.query = evt.currentTarget.elements.searchQuery.value;

  if (imageFinder.query === '') {
    return Notify.warning('Please, enter your request');
  }

  try {
    const response = await imageFinder.fetchImages();
    const { hits, totalHits } = response;

    if (!hits.length) {
      throw 'Sorry, there are no images matching your search query. Please try again.';
    }

    renderGallery.showPreloader();
    renderGallery.drawCard(hits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    Notify.failure(error);
  } finally {
    renderGallery.hidePreloader();
  }
}

function makeSmothScroll() {
  if (imageFinder.page - 1 > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.75,
      behavior: 'smooth',
    });
  }
}

function handleEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imageFinder.query !== '') {
      imageFinder
        .fetchImages()
        .then(response => response.hits)
        .then(renderGallery.drawCard);
      makeSmothScroll();
    }
  });
}
