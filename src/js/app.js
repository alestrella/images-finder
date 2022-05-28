import imageFinderApi from './api/api-service';
import { refs } from './refs';
import * as renderGallery from './render-gallery';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  width: '320px',
  position: 'left-top',
  closeButton: false,
});

refs.searchForm.addEventListener('submit', handleImageSearch);
refs.loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleImageSearch(evt) {
  evt.preventDefault();

  imageFinderApi.query = evt.currentTarget.elements.searchQuery.value;

  renderGallery.showPreloader();
  renderGallery.clearGallery();
  imageFinderApi.resetPage();

  const response = await imageFinderApi.fetchImages();
  renderGallery.hidePreloader();

  if (response.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  if (imageFinderApi.query === '') {
    return Notify.warning('Please, enter your request');
  }
  notifyTotalHits(response.totalHits);
  renderGallery.generateMarkupGallery(response);
}

async function handleLoadMore() {
  renderGallery.hideLoadBtn();
  renderGallery.showPreloader();

  const nextDataSet = await imageFinderApi.fetchImages();
  renderGallery.generateMarkupGallery(nextDataSet);

  checkEndDataSet(nextDataSet);
  makeSmothScroll();
}

function notifyTotalHits(totalHits) {
  return Notify.info(`Hooray! We found ${totalHits} images.`);
}

function makeSmothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function checkEndDataSet(dataSet) {
  if (imageFinderApi.page - 1 > dataSet.totalHits / 40) {
    const textWarning = document.createElement('p');
    textWarning.classList.add('end-gallery');
    textWarning.innerText = "We're sorry, but you've reached the end of search results.";
    refs.loadMoreBtn.insertAdjacentElement('beforebegin', textWarning);

    renderGallery.hideLoadBtn();
  }
}
