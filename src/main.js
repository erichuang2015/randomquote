function randomColor (){
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  let color = `rgb(${r},${g},${b})`;
  document.body.style.backgroundColor = color;
  color = `rgb(${r - 80},${g - 80},${b - 80})`;
  document.querySelectorAll('.links a').forEach(item => item.style.color = color);
  document.querySelectorAll('button').forEach(item => item.style.backgroundColor = color);
  document.querySelector('h1').style.color = color;
}

if (navigator.onLine){
  const options = {
    headers: {
      'X-Mashape-Key': '4sBmTfPz5cmshjhMBw9CubpqE5UMp1xDnzTjsnFYcZ7tGyhUQj',
      'Accept': 'application/json'
    }
  };
  const url = 'https://andruxnet-random-famous-quotes.p.mashape.com/';
  Promise.all([
    fetch(url + '?cat=famous',options),
    fetch(url + '?cat=famous',options),
    fetch(url + '?cat=famous',options),
    fetch(url + '?cat=famous',options),
    fetch(url + '?cat=famous',options),
    fetch(url + '?cat=movies',options),
    fetch(url + '?cat=movies',options),
    fetch(url + '?cat=movies',options),
    fetch(url + '?cat=movies',options),
    fetch(url + '?cat=movies',options)
  ])
    .then(response => Promise.all(response.map(res => res.json())))
    .then(json => {
      const quotes = json.map(item => item[0]);
      localStorage.setItem('quotes', JSON.stringify(quotes));
    });
  
  const localQuoteOfTheDay = JSON.parse(localStorage.getItem('quoteOfTheDay'));
  if (!localQuoteOfTheDay || 
      new Date(localQuoteOfTheDay.date).toDateString() !== new Date().toDateString() ){
    fetch('https://quotes.rest/qod')
      .then(response => {
        if (response.status === 200) return response.json();
      }).then(json => {
        const quote = json.contents.quotes[0];
        quote.date = new Date().toLocaleDateString();
        localStorage.setItem('quoteOfTheDay', JSON.stringify(quote));
      });
  }
}

getQuoteOfTheDay();

document.getElementById('random').addEventListener('click',()=>{
  const category = document.getElementById('category').value;
  getRandomQuote(category); 
});
document.getElementById('quoteOfTheDay').addEventListener('click', () => {
  getQuoteOfTheDay();
});
document.getElementById('shareTwitter').addEventListener('click', () => {
  const quote = document.getElementById('text').innerHTML;
  const author = document.getElementById('author').innerHTML;
  window.open(`https://twitter.com/intent/tweet?text=${quote + ' ' + author}`);
});
document.getElementById('shareMail').addEventListener('click', () => {
  const quote = document.getElementById('text').innerHTML;
  const author = document.getElementById('author').innerHTML;
  let url = `mailto:?subject=Random Quote&body=${quote + ' ' + author}`;
  url = url.replace(/,|;/g,'%2c');
  location.href = url;
});
document.getElementById('copy').addEventListener('click', () =>{
  const quote = document.getElementById('text').innerHTML;
  const author = document.getElementById('author').innerHTML;
  if (!navigator.clipboard){
    alert('Update browser');
  } else {
    navigator.clipboard.writeText(quote + ' ' + author);
  }
});

function getQuoteOfTheDay (){
  const localQuoteOfTheDay = JSON.parse(localStorage.getItem('quoteOfTheDay'));
  if (localQuoteOfTheDay && 
      new Date(localQuoteOfTheDay.date).toDateString() === new Date().toDateString() ){
    randomColor();
    setQuote({
      author: localQuoteOfTheDay.author,
      quote: localQuoteOfTheDay.quote
    });
    return;
  }
  document.getElementById('text').innerHTML = '<div class="loader"></div>';
  document.getElementById('text').style.overflow = 'hidden';
  document.getElementById('author').innerHTML = '';
  fetch('https://quotes.rest/qod')
    .then(response => {
      if (response.status !== 200){
        setQuote({
          author: '',
          quote: 'check connection'
        });
      } else return response.json(); 
    })
    .then(json => {
      const quote = json.contents.quotes[0];
      setQuote({
        author: quote.author,
        quote: quote.quote
      });
      randomColor();
    })
    .catch(() => {
      randomColor();
      const quote = JSON.parse(localStorage.getItem('quoteOfTheDay'));
      if (quote){
        setQuote({
          author: quote.author,
          quote: quote.quote
        });
      } else {
        setQuote({
          author: '',
          quote: 'check connection'
        });
      }
    });
}
function getRandomQuote (category){
  document.getElementById('text').innerHTML = '<div class="loader"></div>';
  document.getElementById('text').style.overflow = 'hidden';
  document.getElementById('author').innerHTML = '';
  let url;
  if (category && category !== 'Choose category...') {
    url = `https://andruxnet-random-famous-quotes.p.mashape.com/?cat=${category}`;
  } else {
    url = 'https://andruxnet-random-famous-quotes.p.mashape.com/';
  }
  fetch(url,{
    headers: {
      'X-Mashape-Key': '4sBmTfPz5cmshjhMBw9CubpqE5UMp1xDnzTjsnFYcZ7tGyhUQj',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.status !== 200){
        setQuote({
          author: '',
          quote: 'check connection'
        });
      } else return response.json();
    })
    .then(json => {
      randomColor();
      setQuote(json[0]);
    })
    .catch(() => {
      randomColor();
      let quotes = JSON.parse(localStorage.getItem('quotes'));
      if (quotes){
        if (category && category !== 'Choose category...') {
          quotes = quotes.filter(item => item.category.toLowerCase() === category);
        }
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        if (quote) {
          setQuote({
            author: quote.author,
            quote: quote.quote
          });
        } else {
          setQuote({
            author: '',
            quote: 'check connection'
          });  
        }
      } else {
        setQuote({
          author: '',
          quote: 'check connection'
        });
      }
    });
}

function setQuote (quote){
  document.getElementById('text').innerHTML = quote.quote;
  document.getElementById('text').style.overflow = 'auto';
  document.getElementById('author').innerHTML = '- ' + quote.author;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
