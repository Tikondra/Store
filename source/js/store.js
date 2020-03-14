'use strict';

(function () {
  const available = [true, false];
  const productCount = 15;
  const debounceInterval = 500;
  const dataCount = 3000;
  let currentPage = 1;
  let arrayProducts = []; /** тестовый массив **/
  let productList = document.querySelector('.products__list');
  let templateProduct = document.querySelector('#product')
      .content
      .querySelector('.products__item');
  let paginationButtons = document.querySelectorAll('.pagination__link');
  let templateBasketItem = document.querySelector('#basket-item')
    .content
    .querySelector('.basket__item');
  let basketList = document.querySelector('.basket__list');
  let lastPag = document.querySelector('.pagination__link--last');
  let pagPrev = document.querySelector('.pagination__btn--prev');
  let pagNext = document.querySelector('.pagination__btn--next');

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, debounceInterval);
    };
  };
  /** счетчик **/
  function makeCounter() {
    let count = 1;

    return function() {
      return count++;
    };
  }
  /** созание массива данных для демострации работы **/
  for (let i = 1; i <= dataCount; i++) {
    arrayProducts.push(
      {
        id: i,
        title: 'Стул_' + i,
        image: 'https://d37kg2ecsrm74.cloudfront.net/web/ikea4/images/382/0238233_PE377690_S5.jpg',
        descr: 'Супер стул',
        price: 300,
        available: available[Math.floor(Math.random() * 2)]
      }
    )
  }
  let lastPagValue = arrayProducts.length / productCount;
  lastPag.textContent = lastPagValue;
  /**  удаление карточек товара **/
  function delProductList() {
    let product = document.querySelectorAll('.products__item');
    product.forEach(function (item) {
      item.remove();
    })
  }
  /** отрисовка карточек товара **/
  function renderProductList(dataProduct, page) {
    let fragment = document.createDocumentFragment();
    let rangeProduct = productCount * (page - 1);

    for (let i = rangeProduct; i < rangeProduct + productCount; i++) {
      let product = templateProduct.cloneNode(true);
      product.querySelector('img').src = dataProduct[i].image;
      product.querySelector('img').alt = dataProduct[i].descr;
      product.querySelector('.products__title').textContent = dataProduct[i].title;
      product.querySelector('.products__price').textContent = dataProduct[i].price + ' рублей';
      product.querySelector('.products__text').textContent = dataProduct[i].descr;
      fragment.append(product);
    }
    delProductList();
    productList.append(fragment);
    makeEventAdd();
  }
  /**  пагинация **/
  function pagination() {
    function setupPagination (pageNum) {
      paginationButtons.forEach(function (btn) {
        btn.classList.remove('pagination__link--active');
      });
      if (pageNum > 2 && pageNum < lastPagValue - 1) {
        for (let i = 0; i < 3; i++) {
          paginationButtons[i].textContent = (pageNum + i) - 1;
          paginationButtons[1].classList.add('pagination__link--active');
        }
      } else if (pageNum === lastPagValue) {
        for (let i = 0; i < 3; i++) {
          paginationButtons[i].textContent = (pageNum + i) - 3;
          lastPag.classList.add('pagination__link--active');
        }
      } else if (pageNum === lastPagValue - 1) {
        for (let i = 0; i < 3; i++) {
          paginationButtons[2].classList.add('pagination__link--active');
        }
      } else {
        for (let i = 0; i < 3; i++) {
          paginationButtons[i].textContent = i + 1;
          paginationButtons[pageNum - 1].classList.add('pagination__link--active');
        }
      }
    }
    function onPrevPag() {
      paginationButtons.forEach(function (btn) {
        if (btn.classList.contains('pagination__link--active')) {
          currentPage = btn.textContent;
        }
      });
      if (currentPage > 1) {
        currentPage--;
        renderProductList(arrayProducts, currentPage);
        setupPagination(currentPage);
      }
    }
    function onNextPag() {
      paginationButtons.forEach(function (btn) {
        if (btn.classList.contains('pagination__link--active')) {
          currentPage = btn.textContent;
        }
      });
      if (currentPage < lastPagValue) {
        currentPage++;
        renderProductList(arrayProducts, currentPage);
        setupPagination(currentPage);
      }
    }
    function onPagination (evt) {
      evt.preventDefault();
      let pageCount = Number(evt.target.textContent);
      if (!evt.target.classList.contains('pagination__link--active')) {
        renderProductList(arrayProducts, pageCount);
        setupPagination(pageCount);
      }
    }
    paginationButtons.forEach(function (btn) {
      btn.addEventListener('click', onPagination);
    });
    pagPrev.addEventListener('click', onPrevPag);
    pagNext.addEventListener('click', onNextPag);
  }
  /** добавление товара в корзину **/
  function onAddBasket (evt, count) {
    let target = evt.target;
    let productItem = evt.currentTarget;
    let productImg = productItem.querySelector('img').src;
    let productName = productItem.querySelector('.products__title').textContent;
    let addMessage = productItem.querySelector('.add__message');
    let addMessageCount = addMessage.querySelector('.add__message--count');

    if (target.classList.contains('add__btn')) {
      let basketItem = templateBasketItem.cloneNode(true);
      basketItem.querySelector('img').src = productImg;
      basketItem.querySelector('.basket__title').textContent = productName;
      basketList.append(basketItem);
      addMessageCount.textContent = count + ' товаров';
      addMessage.classList.add('add__message--active');
    }
  }
  /** обработчик на добавление в корзину **/
  function makeEventAdd () {
    let cards = document.querySelectorAll('.products__item');

    cards.forEach(function (btn) {
      let counter = makeCounter();
      btn.addEventListener('click', function (evt) {
        let count = counter();
        onAddBasket(evt, count);
      });
    })
  }

  renderProductList(arrayProducts, currentPage);
  pagination();
})();
