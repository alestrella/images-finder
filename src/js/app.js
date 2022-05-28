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
  const response = await imageFinderApi.fetchImages();
  generateMarkupPage(response);
}

async function handleLoadMore() {
  renderGallery.hideLoadBtn();
  renderGallery.showPreloader();

  const nextImgSet = await imageFinderApi.fetchImages();
  renderGallery.generateMarkupGallery(nextImgSet);

  checkEndDataSet(nextImgSet);
  makeSmothScrollDown();
}

function checkEndDataSet(dataSet) {
  if (imageFinderApi.page - 1 > dataSet.totalHits / 40) {
    const textWarning = document.createElement('p');
    textWarning.classList.add('end-gallery');
    textWarning.innerText = "We're sorry, but you've reached the end of search results.";
    refs.contentBottom.append(textWarning);

    renderGallery.hideLoadBtn();
  }
}

function makeSmothScrollDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}

function makeSmothScrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function generateMarkupPage(data) {
  imageFinderApi.resetPage();
  renderGallery.clearContent();
  renderGallery.hidePreloader();
  makeSmothScrollTop();

  console.log('result', data);

  if (data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  if (imageFinderApi.query === '') {
    return Notify.warning('Please, enter your request');
  }
  if (data.total >= 1) {
    Notify.success(`Hooray! We found ${data.total} images.`);
  }

  renderGallery.generateMarkupGallery(data);
}
