import imageFinder from './api-service';
import renderGallery from './render-gallery';
import { refs } from './refs';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
  position: 'left-top',
  closeButton: false,
});

document.addEventListener('DOMContentLoaded', () => {
  refs.searchForm.addEventListener('submit', handleImageSearch);

  const observer = new IntersectionObserver(handleEntry, { rootMargin: '0px 0px 200px 0px' });
  observer.observe(refs.sentinel);
});

async function handleImageSearch(evt) {
  evt.preventDefault();

  imageFinder.resetPage();
  renderGallery.clear();
  imageFinder.query = evt.currentTarget.elements.searchQuery.value;

  if (imageFinder.query === '') {
    return Notify.warning('Please, enter your request');
  }

  window.scrollTo({ top: 0 });
  renderGallery.showPreloader();

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
      top: cardHeight * 1.9,
      behavior: 'smooth',
    });
  }
}

async function handleEntry(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting && imageFinder.query !== '') {
      const response = await imageFinder.fetchImages();
      const { hits, totalHits } = response;
      renderGallery.drawCard(hits);
      makeSmothScroll();
      renderGallery.checkEndGallery(totalHits);
    }
  }
}
