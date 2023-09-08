const indexNewsSlide = document.querySelector('.swiper-wrapper');
const newsPageContainer = document.querySelector('.news-container');
const newsNewestBtn = document.querySelector('.newest');
const newsOldestBtn = document.querySelector('.oldest');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.previous');
const modalEl = document.querySelector('.news-modal');
const trendingContainer = document.querySelector('.trending-container');
const marketContainer = document.querySelector('.market-container');
const marketResultContainer = document.querySelector('.market-result');
const sortArrow = document.querySelector('.market-rank');
const sortIcon = document.querySelector('#arrow-sort');
const search = document.querySelector('#search-query');
const pagination = document.querySelector('.pagination');
// let global.market_archive = [];
const today = new Date();

const global = {
  currentPath: window.location.pathname,
  currentPage: 0,
  news_id: '',
  sorting: 'newest',
  startDate: '2022-01-01', 
  isLastPage: false,
  endDate: today.toISOString().split('T')[0],
  newsApi: {
    apiKey: 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'
  },
  market_currency: 'usd',
  market_order: 'desc',
  market_page: 1,
  market_sort: 'desc',
  market_isLastPage: 'false',
  market_isFirstPage: 'true',
  market_lastIndex: 0,
  market_btn_action: 'start',
  market_archive: []
};



// Fetch News API
const newsAPIkey = 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'; /* NY Times API */

const getNews = async () => {
  let data;
 if(global.news_id){
  data = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?&api-key=${global.newsApi.apiKey}&fq=_id:("${global.news_id}")`);

 } else{
  data = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=crypto-currency&sort=${global.sorting}&api-key=${global.newsApi.apiKey}&begin_date=${global.startDate}&end_date=${global.endDate}&page=${global.currentPage}`);

 }
  const result = await data.json();
  if(result.response.docs.length < 10){
    global.isLastPage = true;
  } else {
    global.isLastPage = false;
  }
  return result;
};


// Display News

const displayNews = async (result) => {
  const res = await result;
  for(let i = 0; i < res.response.docs.length; i++){
    const source = res.response.docs;
    const givenDate = source[i].pub_date;
    const date = new Date(givenDate);
    const dateOption = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour:'numeric',
      minute:'numeric'
    };
    const formater = new Intl.DateTimeFormat('en-US', dateOption);
    const finalDate = formater.format(date);

    const div = document.createElement('div');

    switch(global.currentPath){
      case '/index.html': 
    
          div.classList.add('swiper-slide');
          div.innerHTML = `
          <div class="swiper-slide">
          ${
            source[i].multimedia[22]? `<img src="https://www.nytimes.com/${source[i].multimedia[22].url}" alt="">` :
            `<img src="./assets/images/image_pholder.webp" alt="">`
          }
          <div class="news-details" id="${source[i].uri}">
            <h2 class="news-title">${source[i].headline.main}</h2>
            <p id="news-date" class="heavy">${finalDate}</p>
            <p id="news-source" class="heavy">${source[i].source}</p>
            <p id="news-summary">${source[i].abstract}</p>
        </div>
          `;
      
        indexNewsSlide.appendChild(div);
        break;

      case '/news.html':
          div.classList.add('news-card', 'shadow-1');
        div.innerHTML = `
          <div class="news-details" id="${source[i].uri}">
              ${source[i].multimedia[22]? `<img src="https://www.nytimes.com/${source[i].multimedia[22].url}" alt="">` :
          `<img src="./assets/images/image_pholder.webp" alt="">`}
              <h2 class="news-title">${source[i].headline.main}</h2>
              <p id="news-date" class="heavy">${finalDate}</p>
              <p id="news-source" class="heavy">${source[i].source}</p>
              <p id="news-summary">${source[i].abstract}</p>
          </div>
        `;
        newsPageContainer.appendChild(div);
        break;
    };
        

  }
};


const displayNewsModal = (res) => {
  
  for(let i = 0; i < res.response.docs.length; i++){
    const source = res.response.docs;
    const givenDate = source[i].pub_date;
    const date = new Date(givenDate);
    const dateOption = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour:'numeric',
      minute:'numeric'
    };
    const formater = new Intl.DateTimeFormat('en-US', dateOption);
    const finalDate = formater.format(date);

    const div = document.createElement('div');

    if(global.currentPage === '/news.html'){
      div.classList.add('modal-content');
            div.innerHTML = `
            <button class="exit-modal shadow-1 exit">
                  <svg class="exit" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                      <path class ="exit" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>
              </button>
              <div class="modal-news-content">
              <h1 class="news-title">${source[i].headline.main}</h1>
              ${source[i].multimedia[22]? `<img src="https://www.nytimes.com/${source[i].multimedia[22].url}" alt="">` :
              `<img src="./assets/images/image_pholder.webp" alt="">`}
                  
                  <p id="news-date" class="heavy">${finalDate}</p>
                  <p id="news-source" class="heavy">${source[i].source}</p>
                  <p id="news-summary">${source[i].snippet}</p>
                  <button class="view-source-btn heavy shadow-1 primary-btn">
                      <a href="${source[i].web_url}" target="_blank">VIEW SOURCE</a>
                  </button>
              </div>
            `;
            modalEl.appendChild(div);
    } else {
      div.classList.add('modal-content');
      div.innerHTML = `
      <button class="exit-modal shadow-1 exit">
            <svg class="exit" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path class ="exit" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
        </button>
        <div class="modal-news-content">
        <h1 class="news-title">${source[i].headline.main}</h1>
        ${source[i].multimedia[22]? `<img src="https://www.nytimes.com/${source[i].multimedia[22].url}" alt="">` :
        `<img src="./assets/images/image_pholder.webp" alt="">`}
            
            <p id="news-date" class="heavy">${finalDate}</p>
            <p id="news-source" class="heavy">${source[i].source}</p>
            <p id="news-summary">${source[i].snippet}</p>
            <button class="view-source-btn heavy shadow-1 primary-btn">
                <a href="${source[i].web_url}" target="_blank">VIEW SOURCE</a>
            </button>
        </div>
      `;
      modalEl.appendChild(div);

    }
  }
};

// Reset News Page Content

const resetNews = () => {
  newsPageContainer.innerHTML = '';
}

// Filter News
const newestFirst = async () => {
  global.sorting = 'newest';
  const res = await getNews();
  global.currentPage = 0;
  resetNews();
  displayNews(res);
}

const oldestFirst = async () => {
  global.sorting = 'oldest';
  const res = await getNews();
  global.currentPage = 0;
  resetNews();
  displayNews(res);
}

// Pagination

const showNextNews = async () => {
  global.currentPage++;
  const res = await getNews();
  if(res.response.docs.length === 0) return;
  resetNews();
  displayNews(res);
  checkButtons();
  
}

const showPrevNews = async () => {
  global.currentPage--;
  if(global.currentPage < 0) return;
  const res = await getNews();
  resetNews();
  displayNews(res);
  checkButtons();
}

const checkButtons = () => {
  switch(global.currentPath){
    case '/news.html':
      // Prev Button
    if(global.currentPage === 0){
    prevBtn.disabled = true;
    prevBtn.style.pointerEvents = 'none';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.pointerEvents = 'auto';
    }
  
    // Next Button
    if(global.isLastPage){
      nextBtn.disabled = true;
      nextBtn.style.pointerEvents = 'none';
    } else{
      nextBtn.disabled = false;
      nextBtn.style.pointerEvents = 'auto';
    };
    break;


    case '/market.html':
     // Prev Button
    if(global.market_isFirstPage){
    prevBtn.disabled = true;
    prevBtn.style.pointerEvents = 'none';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.pointerEvents = 'auto';
    }
  
     // Next Button
    if(global.market_isLastPage === true){
      nextBtn.disabled = true;
      nextBtn.style.pointerEvents = 'none';
    } else{
      nextBtn.disabled = false;
      nextBtn.style.pointerEvents = 'auto';
    };
    break;
  }
  
  

};

// Modal

// Initialize Modals

const initIndexModal = () => {
  document.addEventListener('click', function (e) {
    if(e.target.parentElement.classList.contains('swiper-slide')){
      const newsDiv = e.target.parentElement.querySelector('.news-details');
      showModal(newsDiv);
    } 
});
}

const showModal = async (e) => {
  switch(global.currentPath){
    case '/index.html':
      global.news_id = e.id;
      break;

    case '/news.html':
      e.target.id.includes('nyt')? global.news_id = e.target.id :
      global.news_id = e.target.parentElement.id;
      break;
  }
  modalEl.innerHTML = '';
  const res = await getNews();
  modalEl.style.display = 'flex';
  displayNewsModal(res);
  
}

const initModalExit = () => {
  document.addEventListener('click', (e) => {
    if(e.target.classList.contains('exit')) exitModal();
  });
}

const exitModal = () => {
  modalEl.style.display = 'none';
};




// Trending and Market View Feature

// Get Trending Coins and BTC price from Coingecko API
const getCoins = async () => {
  let marketCoins = '', marketRes ='';
    switch(global.currentPath){
      case '/index.html':
        const trendingData = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const trendingRes = await trendingData.json();
    
        const btcPrice = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const price = await btcPrice.json();
    
        marketCoins = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${global.market_currency}&order=market_cap_${global.market_order}&per_page=10&page=${global.market_page}`);
        marketRes = await marketCoins.json();

        displayTrending(trendingRes, price);
        displayMarket(marketRes);
        break;

      case '/market.html':
        if(global.market_archive.length === 0){
          marketCoins = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${global.market_currency}&order=market_cap_${global.market_order}&per_page=500`);
          marketRes = await marketCoins.json();
          global.market_archive = marketRes;
          displayMarket(marketRes);
        }
        else{
          displayMarket(global.market_archive);
        }
    }
 
}

// Display Trending Coins to DOM
const displayTrending = (trending, btc) => {
  const btcPrice = btc.bitcoin.usd;
  
  for(let i = 0; i < trending.coins.length; i++){
    const div = document.createElement('div');
    div.classList.add(`grid-card`,`grid-${i+1}`, `shadow-1`);
    div.innerHTML = `
    <h1 class="rank">#${i + 1}</h1>
    <div class="coin-img">
      <img src="${trending.coins[i].item.small}" alt="">
    </div>
    <div class="coin-details">
      <h2>${trending.coins[i].item.name} (${trending.coins[i].item.symbol})</h2>
      <p class="heavy">$${trending.coins[i].item.price_btc * btcPrice < 10? (trending.coins[i].item.price_btc * btcPrice).toFixed(4)
            : parseInt((trending.coins[i].item.price_btc * btcPrice).toFixed(2)).toLocaleString()
            }</p>
      <p>Market Cap Rank: ${trending.coins[i].item.market_cap_rank}</p>
    </div>
    `
    trendingContainer.appendChild(div);
  }
}

// Display Market View to DOM
const displayMarket = (market) => { 
  
  let marketLength = market.length;
  if(global.currentPath === '/market.html'){
    switch(global.market_btn_action){
      case 'next':
        marketLength = global.market_lastIndex + 10;
        break;
      case 'prev':
        marketLength = global.market_lastIndex - 10;
        global.market_lastIndex -= 20;
        break;
      default: 
        marketLength = 10;
        global.market_lastIndex = 0;
        break;
    }
   
  }

    for(let i = global.market_lastIndex; i < marketLength; i++){
      const div = document.createElement('div');
      const change24H = market[i].price_change_percentage_24h? parseInt(market[i].price_change_percentage_24h) : 'N/A';
      div.classList.add('coin-market-div', 'shadow-1');
      div.setAttribute("id", `${market[i].id}`);
      div.innerHTML = `
      <p class="market-rank">${market[i].market_cap_rank != null? market[i].market_cap_rank : 'N/A' }</p>
      <div class="coin-market-details">
          <div class = "coin-market-img"> 
          <img src=${market[i].image} alt="">
          </div>
          <div class = "coin-market-names"> 
          <p class="coin-market-name heavy">${market[i].name}</p>
           <p class="coin-market-ticker">${market[i].symbol.toUpperCase()}</p>
          </div>
      </div>
      <p class="current-price">${market[i].current_price? '$' + market[i].current_price.toLocaleString() : 'N/A'}</p>
      <p class="price-change-pct ${change24H > 0? 'positive' : 'negative'}">${market[i].price_change_percentage_24h? market[i].price_change_percentage_24h.toFixed(2)+ '%': 'N/A' }</p>
      <p class="24h-high hide-coin-detail positive">${market[i].high_24h? '$' + market[i].high_24h.toLocaleString() : 'N/A'}</p>
      <p class="24h-low hide-coin-detail negative">${market[i].low_24h? '$' + market[i].high_24h.toLocaleString() : 'N/A'}</p>
      <p class="market-cap hide-coin-detail-xl">${market[i].market_cap? '$' + market[i].market_cap.toLocaleString() : '0'}</p>
  
  </div>
      `
      marketResultContainer.appendChild(div);
      global.market_lastIndex++;
    };
    if(marketLength == global.market_archive.length){
      global.market_isLastPage = true;
    } else if(marketLength <= 10){
      global.market_isFirstPage = true;
    }
}


// Get Filtered Results (Market Cap)

const sortMarket = () => {
  global.market_btn_action = 'start';
  global.market_order === 'desc'? global.market_order = 'asc' : global.market_order = 'desc';
  global.market_page = 1;
  global.market_isLastPage = false;
  global.market_isFirstPage = true;
  global.market_btn_action = 'sort';
  global.market_archive.reverse();
  resetMarket();
  rotateSortBtn();
  getCoins();
  checkButtons();
  updatePagination();

  
  
}

// Reset Market View
const resetMarket = () => {
  marketResultContainer.innerHTML = '';

}

// Rotate Sort Button
const rotateSortBtn = () => {
  if(sortIcon.style.transform === 'rotate(180deg)') {
    sortIcon.style.transform = 'rotate(360deg)';
  } else{
    sortIcon.style.transform = 'rotate(180deg)';
  }
}

// Get Next Page of Market View
const showNextMarketPage = () => {
  global.market_page++;
  if(global.market_lastIndex == global.market_archive.length){
    return;
  } else{
    global.market_btn_action = 'next';
    global.market_isFirstPage = false;
    resetMarket();
    getCoins();
    checkButtons();
    updatePagination();
  }
  
  
}

// Get Prev Page of Market View
const showPrevMarketPage = () => {
  global.market_page--;
  if(global.market_lastIndex <= 10){
    global.market_isFirstPage = true;
    return;
  } else{
    global.market_btn_action = 'prev';
    resetMarket();
    getCoins();
    checkButtons();
    updatePagination();
  }
  
}

// Search Market
const searchMarket = (e) => {
  const coins = document.querySelectorAll('.coin-market-div');
  const query = e.toLowerCase();
  coins.forEach(coin => {
    const id = coin.id;
  if(id.indexOf(query) !== -1){
      coin.style.display = 'grid';
    } else{
      coin.style.display = 'none';
    }
  })
};

const updatePagination = () => {
  pagination.innerHTML = `
  <p>Showing <strong>${global.market_page}</strong> out of 25 pages</p>
  `
}



// Router
const init = () => {
  switch(global.currentPath) {

    // Index Page
    case '/index.html': 
      displayNews(getNews());
      getCoins();
      initIndexModal();
      initModalExit();

      break;

    // News Page
    case '/news.html': 
      displayNews(getNews());
      newsNewestBtn.addEventListener('click', newestFirst);
      newsOldestBtn.addEventListener('click', oldestFirst);
      nextBtn.addEventListener('click', showNextNews);
      prevBtn.addEventListener('click', showPrevNews);
      newsPageContainer.addEventListener('click', showModal);
      checkButtons();
      initModalExit();
      break;

      // Market Page
      case '/market.html':
      getCoins();
      sortArrow.addEventListener('click', sortMarket);
      nextBtn.addEventListener('click', showNextMarketPage);
      prevBtn.addEventListener('click', showPrevMarketPage);
      search.addEventListener('keyup', function(e){
        searchMarket(e.target.value);
      });
      checkButtons();
      updatePagination();

      break;
  }
}





document.addEventListener('DOMContentLoaded', init);






// SwiperJS

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    650: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    980: {
      slidesPerView: 3,
      spaceBetween: 30
    }

  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
 
  });



