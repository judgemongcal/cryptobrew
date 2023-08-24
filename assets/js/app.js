const indexNewsSlide = document.querySelector('.swiper-wrapper');
const newsPageContainer = document.querySelector('.news-container');
const newsNewestBtn = document.querySelector('.newest');
const newsOldestBtn = document.querySelector('.oldest');
const newsNextBtn = document.querySelector('.next');
const newsPrevBtn = document.querySelector('.previous');
const today = new Date();

const global = {
  currentPath: window.location.pathname,
  currentPage: 0,
  sorting: 'newest',
  startDate: '2022-01-01', 
  endDate: today.toISOString().split('T')[0],
  newsApi: {
    apiKey: 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'
  }
};





console.log(today);
// Fetch News API
const newsAPIkey = 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'; /* NY Times API */

const getNews = async () => {
  const data = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=crypto-currency&sort=${global.sorting}&api-key=${global.newsApi.apiKey}&begin_date=${global.startDate}&end_date=${global.endDate}&page=${global.currentPage}`);
  const result = await data.json();
  console.log(result);
  return result;
};


// Display News

const displayNews = async (result) => {
  const res = await result;
  console.log(res);
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
        <div class="news-details">
          <h2 class="news-title">${source[i].headline.main}</h2>
          <p id="news-date" class="heavy">${finalDate}</p>
          <p id="news-date" class="heavy">${source[i].source}</p>
          <p id="news-summary">${source[i].abstract}</p>
      </div>
        `;
    
        indexNewsSlide.appendChild(div);
        break;

      case '/news.html':
        div.classList.add('news-card', 'shadow-1');
        div.innerHTML = `
          <div class="news-details">
              ${source[i].multimedia[22]? `<img src="https://www.nytimes.com/${source[i].multimedia[22].url}" alt="">` :
          `<img src="./assets/images/image_pholder.webp" alt="">`}
              <h2 class="news-title">${source[i].headline.main}</h2>
              <p id="news-date" class="heavy">${finalDate}</p>
              <p id="news-date" class="heavy">${source[i].source}</p>
              <p id="news-summary">${source[i].abstract}</p>
          </div>
        `;
        newsPageContainer.appendChild(div);
        break;
    };

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
  resetNews();
  displayNews(res);
}

const oldestFirst = async () => {
  global.sorting = 'oldest';
  const res = await getNews();
  resetNews();
  displayNews(res);
}

// Pagination

const showNextNews = async () => {
  global.currentPage++;
  const res = await getNews();
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
  if(global.currentPage <= 0){
    newsPrevBtn.disabled = true;
    newsPrevBtn.style.pointerEvents = 'none';
    } else if (global.currentPage > 0) {
      newsPrevBtn.disabled = false;
      newsPrevBtn.style.pointerEvents = 'auto';
    }
  return;
}


  


// Router
const init = () => {
  console.log(global.currentPath);
  switch(global.currentPath) {
    case '/news.html': 
      displayNews(getNews());
      newsNewestBtn.addEventListener('click', newestFirst);
      newsOldestBtn.addEventListener('click', oldestFirst);
      newsNextBtn.addEventListener('click', showNextNews);
      newsPrevBtn.addEventListener('click', showPrevNews);
      checkButtons();
      break;
    case '/index.html': 
      displayNews(getNews());
      break;
  }
}









init();






// SwiperJS

var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
  // loop: true
});

