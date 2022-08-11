import imageFinder from './api-service';
import renderGallery from './render-gallery';
import { refs } from './refs';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
  position: 'left-top',
  closeButton: false,
});

let observer;

document.addEventListener('DOMContentLoaded', () => {
  refs.searchForm.addEventListener('submit', handleImageSearch);

  observer = new IntersectionObserver(handleEntry, { rootMargin: '0px 0px 200px 0px' });
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

    refs.introText.classList.add('js-hidden');
    renderGallery.showPreloader();
    renderGallery.drawCard(hits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    Notify.failure(error);
    if (refs.introText.classList.matches('js-hidden')) {
      refs.introText.classList.remove('js-hidden');
    }
    refs.introText.classList.add('js-hidden');
  } finally {
    renderGallery.hidePreloader();
  }
}

function checkEndGallery(totalHits) {
  const totalPage = Math.ceil(totalHits / 40);
  let textWarning;

  if (imageFinder.page - 1 > totalPage) {
    textWarning = document.createElement('p');
    textWarning.classList.add('end-gallery');
    textWarning.innerText = "We're sorry, but you've reached the end of search results.";
    refs.galleryBox.append(textWarning);
  }
  if (refs.galleryBox.contains(textWarning)) {
    observer.unobserve(refs.sentinel);
  }
}

function makeSmothScroll() {
  if (imageFinder.page - 1 > 1) {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
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
      checkEndGallery(totalHits);
    }
  }
}
