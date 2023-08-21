// SwiperJS

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },
    loop: true
  });

  
  // News API (NY Times)
  const newsAPIkey = 'Mt0V4THOHF3RqwmodajlbaijTAdVUS2r';

  const getNews = async (newsAPIKey) => {
    const data = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=crypto&api-key=${newsAPIKey}`);
    const result = await data.json();
    console.log(result);
};

  getNews(newsAPIkey);