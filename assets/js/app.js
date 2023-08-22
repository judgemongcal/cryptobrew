const global = {
  currentPage: window.location.pathname,
  newsApi: {
    apiKey: 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'
  }
};


const newsSlide = document.querySelector('.swiper-wrapper');

// NEWS FEATURE
const newsAPIkey = 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r'; /* NY Times API */

const getNews = async () => {
  const data = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=crypto-currency&sort=newest&api-key=${global.newsApi.apiKey}`);
  const result = await data.json();
  console.log(result);
  return result;
};


const displayNews = async () => {
  const res = await getNews();
  console.log(res);
  for(let i = 0; i < 10; i++){
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

    newsSlide.appendChild(div);

  }
}

  displayNews();




















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

