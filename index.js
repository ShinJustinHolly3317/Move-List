const BASE_URL = 'https://movie-list.alphacamp.io'
const MOVIE_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const MOVIES_PER_PAGE = 12
const movies = []
let filteredMovies = []
let page = 1

const moviesElement = document.querySelector('#movieList')
const searchBarElement = document.querySelector('#searchForm')
const searchInput = document.querySelector('#searchInput')
const paginatorElement = document.querySelector('ul.paginator')
const textListElement = document.querySelector('#listDisplay')
const cardListElement = document.querySelector('#cardDisplay')


/*Main function*/
// Get movies data & render movie list
axios.get(MOVIE_URL).then(
  (reponse) => {
    movies.push(...reponse.data.results)
    renderMovieList(getMoviesByPage(page))
    renderPaginator(movies.length)
  }
).catch((err) => console.log(err))


/*Listener*/
// Listener: show more detail of this movie / add to Favorite movie
moviesElement.addEventListener('click', function onMoviesListClick(e) {
  let target = e.target
  if (target.matches(".btnShowMovie")) {
    showMovieModal(Number(target.dataset.bsId))
  } else if (target.matches(".btnAddFavorite")) {
    addToFavorites(Number(target.dataset.bsId))
  }
})

// Search Bar Listener
searchBarElement.addEventListener('submit', function onclickSearchBar(e) {
  e.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  // console.log(keyword.length); // check keyword
  if (!keyword.trim().length || !filteredMovies.length) {
    // if user entered a invalid input
    alert('Please enter a valid movie name!')
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)
    searchInput.value = '' // clear search bar
  } else {
    renderMovieList(getMoviesByPage(1))
    renderPaginator(filteredMovies.length)
  }

})

// Paginator Listener
paginatorElement.addEventListener('click', function onclickPaginator(e) {
  let target = e.target
  if (!target.matches('a')) return
  page = Number(target.dataset.bsPage)
  renderMovieList(getMoviesByPage(page))
  renderPaginator(movies.length)
})

// Text List switch
textListElement.addEventListener('click', function onclickTextListDisplay() {
  renderMovieTexList(getMoviesByPage(page))
})
// Card List switch
cardListElement.addEventListener('click', function onclickCardList() {
  renderMovieList(getMoviesByPage(page))
})




/*Functions*/
// Render movies in card display mode
function renderMovieList(movies) {
  let rawHTML = ''
  movies.forEach(movie => {
    rawHTML += `
    <div class="card col-3" style="width: 18rem;">
      <img class="card-img-top"
        src="${POSTER_URL + movie.image}"
        alt="Moive Poster">
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
      </div>
      <div class="card-footer">
        <button href="#" class="btn btn-primary btnShowMovie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-bs-id="${movie.id}">More</button>
        <button href="#" class="btn btn-info btnAddFavorite" data-bs-id="${movie.id}">+</button>
      </div>
    </div>
    `
  })
  moviesElement.innerHTML = rawHTML
}

// Render movies in list display mode
function renderMovieTexList(movies) {
  let rawHTML = `<div class="textList" style=""><ul class="list-group list-group-flush">`
  movies.forEach(movie => {
    rawHTML += `<li class="list-group-item">
      <div style="display: flex; flex-flow: row nowrap; align-items: center;" id="text">
        <h4 style="width: 82%">${movie.title}</h4>
        <button href="#" class="btn btn-primary btnShowMovie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-bs-id="${movie.id}" style="">More</button>
        <button href="#" class="btn btn-info btnAddFavorite" data-bs-id="${movie.id}" style="margin: 0 1rem;">+</button>
      </div>
    </li>
    
    `
  })
  rawHTML += `</ul></div>`
  moviesElement.innerHTML = rawHTML
}

// add to Favorites
function addToFavorites(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (favoriteList.some(cmovie => cmovie.id === id)) {
    alert('This movie has already been in your favorite list!!')
    console.log(favoriteList)
  } else {
    favoriteList.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
    alert('This movie is added to favorite successfully!!')
    console.log('Favorite movie added!')
  }

}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  // axios.get(MOVIE_URL + id).then(response => {
  //   const dataContent = response.data.results
  //   modalTitle.innerText = dataContent.title
  //   modalImage.firstElementChild.src = POSTER_URL + dataContent.image
  //   modalDate.innerText = 'Release Date: ' + dataContent.release_date
  //   modalDescription.innerText = dataContent.description
  // })
  const dataContent = movies.find(movie => movie.id === id)
  console.log(dataContent)
  modalTitle.innerText = dataContent.title
  modalImage.firstElementChild.src = POSTER_URL + dataContent.image
  modalDate.innerText = 'Release Date: ' + dataContent.release_date
  modalDescription.innerText = dataContent.description
}

function getMoviesByPage(page) {
  // check if user serached, if searched, go to filteredMovies
  const movieData = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movieData.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(totalAmount) {
  let pages = Math.ceil(totalAmount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let npage = 1; npage <= pages; npage++) {
    if (npage === page) {
      console.log(npage)
      rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-bs-page="${npage}" style="background: #deeafc;">${npage}</a></li>
    `
    } else {
      rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-bs-page="${npage}">${npage}</a></li>
    `
    }
  }
  paginatorElement.innerHTML = rawHTML
}