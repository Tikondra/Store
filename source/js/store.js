'use strict';

(function () {
  const available = [true, false];
  const productCount = 2;
  const debounceInterval = 500;
  const dataCount = 3000;
  let currentPage = 1;
  let arrayProducts = []; /** тестовый массив **/
  let templateProduct = document.querySelector('#product')
      .content
      .querySelector('.products__item');
  let paginationButtons = document.querySelectorAll('.pagination__link');
  let templateBasketItem = document.querySelector('#basket-item')
    .content
    .querySelector('.basket__item');
  let productList = document.querySelector('.products__list');
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
        descr: 'Супер стул № ' + i,
        price: Math.floor(Math.random() * 1000),
        available: available[Math.floor(Math.random() * 2)]
      }
    )
  }
  let lastPagValue = arrayProducts.length / productCount;
  lastPag.textContent = lastPagValue;
  /**  скрытие карточек товара **/
  function hideProductList() {
    let product = document.querySelectorAll('.products__item');
    product.forEach(function (item) {
      item.classList.add('products__item--hide');
    })
  }
  /** показ карточек товара **/
  function showProductList (page) {
    let product = document.querySelectorAll('.products__item--hide');
    let rangeProduct = productCount * (page - 1);

    for (let i = rangeProduct; i < rangeProduct + productCount; i++) {
      product[i].classList.remove('products__item--hide');
    }
  }
  /** Добавление счетчика **/
  function addCounter (item) {
    let counter = makeCounter();

    function onAddCounter (evt) {
      if (evt.target.classList.contains('add__btn')) {
        let count = counter();
        window.basket.onAddBasket(evt, count);
      }
    }
    item.onclick = onAddCounter;
  }
  /** отрисовка карточек товара **/
  function renderProductList(dataProduct, page) {
    let rangeProduct = productCount * (page - 1);
    if (productList.querySelector('[data-num="' + (rangeProduct + 1) + '"]')) {
      hideProductList();
      showProductList(page);
    } else {
      let fragment = document.createDocumentFragment();

      for (let i = rangeProduct; i < rangeProduct + productCount; i++) {
        let product = templateProduct.cloneNode(true);
        product.querySelector('img').src = dataProduct[i].image;
        product.querySelector('img').alt = dataProduct[i].descr;
        product.querySelector('.products__title').textContent = dataProduct[i].title;
        product.querySelector('.products__price span').textContent = dataProduct[i].price;
        product.querySelector('.products__text').textContent = dataProduct[i].descr;
        product.setAttribute('data-id', dataProduct[i].id);
        product.setAttribute('data-num', i + 1);
        addCounter(product);

        fragment.append(product);
      }
      hideProductList();
      productList.append(fragment);
    }
  }
  /**  пагинация **/
  (function pagination() {
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
  })();
  /** корзина **/
  (function basket () {
    let basket = document.querySelector('.basket');
    let basketEmpty = basket.querySelector('.basket__empty');
    let basketSum = basket.querySelector('.basket__sum b');

    function getBasketSum (price, state, count) {
      let sumValue = Number(basketSum.textContent);
      if (state) {
        return sumValue + price;
      } else {
        return sumValue - price * count;
      }
    }
    /** добавление товара в корзину **/
    function addBasket (product, count) {
      let productImg = product.querySelector('img').src;
      let productName = product.querySelector('.products__title').textContent;
      let productId = product.dataset.id;

      let basketItem = templateBasketItem.cloneNode(true);
      basketItem.setAttribute('data-id', productId);
      basketItem.querySelector('img').src = productImg;
      basketItem.querySelector('.basket__title').textContent = productName;
      basketItem.querySelector('.basket__count').textContent = 'x' + count;
      basketItem.addEventListener('click', onDelBasketItem);
      basketList.append(basketItem);
    }
    function onAddBasket (evt, count) {
      let basketItems = basket.querySelectorAll('.basket__item');
      let productItem = evt.currentTarget;
      let productId = productItem.dataset.id;
      let productPrice = Number(productItem.querySelector('.products__price span').textContent);
      let addMessage = productItem.querySelector('.add__message');
      let addMessageCount = addMessage.querySelector('.add__message--count span');

      if (basketItems.length === 0) {
        addBasket(productItem, count);
      } else {

        if (basketList.querySelector('[data-id="' + productId + '"]')) {
          let updateItem = basketList.querySelector('[data-id="' + productId + '"]');
          updateItem.remove();
          addBasket(productItem, count);
        } else {
          addBasket(productItem, count);
        }
      }

      basketSum.textContent = getBasketSum(productPrice, true);
      addMessageCount.textContent = count;
      addMessage.classList.add('add__message--active');
      basketEmpty.classList.add('basket__empty--hide');
    }
    /** удаление позиции из корзины **/
    function onDelBasketItem (evt) {
      let basketItem = evt.currentTarget;
      let delBtn = basketItem.querySelector('.basket__item-del');
      let basketItemId = basketItem.dataset.id;
      let item = productList.querySelector('[data-id="' + basketItemId + '"]');
      let itemPrice = Number(item.querySelector('.products__price span').textContent);
      let itemCount = Number(item.querySelector('.add__message--count span').textContent);
      let addMessage = item.querySelector('.add__message');
      let addMessageCount = addMessage.querySelector('.add__message--count span');

      if (evt.target === delBtn) {
        basketItem.remove();
        basketSum.textContent = getBasketSum(itemPrice, false, itemCount);
        addMessageCount.textContent = 0;
        addMessage.classList.remove('add__message--active');
        addCounter(item);
      }
    }

    window.basket = {
      onAddBasket: onAddBasket
    }
  })();

  renderProductList(arrayProducts, currentPage);
})();
