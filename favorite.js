// URL
const BASE_URL = 'https://movie-list.alphacamp.io'
const MOVIE_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// Basic data
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const MOVIES_PER_PAGE = 12
let page = 1

// HTML elements
const moviesElement = document.querySelector('#movieList')
const searchBarElement = document.querySelector('#searchForm')
const searchInput = document.querySelector('#searchInput')
const paginatorElement = document.querySelector('ul.paginator')


/*Main Funtions */
renderMovieList(getMoviesByPage(page))
renderPaginator(movies.length)



/*Functions */

function renderMovieList(movies) {
  // Get movies data & render movie list
  let rawHTML = ''
  if (movies.length === 0) {
    rawHTML = `
    <h5 style="text-align: center; line-height: 30rem; color: #527a7a;">There is no movie in the favorite list!</h5>
    `
  } else {
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
        <button href="#" class="btn btn-danger btnRemoveFavorite" data-bs-id="${movie.id}">X</button>
      </div>
    </div>
    `
    })
  }
  moviesElement.innerHTML = rawHTML
}

function showMovieModal(id) {
  // Show modvie details by Modal
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

function removeMovie(id) {
  // Remove this movie from favorite list
  if (!movies) return

  let moviesFavoriteList = JSON.parse(localStorage.getItem('favoriteMovies'))
  let indexMovie = moviesFavoriteList.findIndex((movie) => movie.id === id)

  if (indexMovie === -1) return
  moviesFavoriteList.splice(indexMovie, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(moviesFavoriteList))
  renderMovieList(moviesFavoriteList)
}

function renderPaginator(totalAmount) {
  // Render Paginator and with a dynamic nowPage color display
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

function getMoviesByPage(page) {
  // Check if user serached, if searched, go to filteredMovies
  const movieData = movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movieData.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}



/*Listeners */

moviesElement.addEventListener('click', function onMoviesListClick(e) {
  // Listener: show more detail of this movie, remove favorite movie
  let target = e.target
  if (target.matches(".btnShowMovie")) {
    // show modal detail
    showMovieModal(Number(target.dataset.bsId))
  } else if (target.matches(".btnRemoveFavorite")) {
    // remove movie
    let id = Number(target.dataset.bsId)
    removeMovie(id)
  }
})



paginatorElement.addEventListener('click', function onclickPaginator(e) {
  // Paginator Listener: flip to next page
  let target = e.target
  if (!target.matches('a')) return
  page = Number(target.dataset.bsPage)
  renderMovieList(getMoviesByPage(page))
  renderPaginator(movies.length)
})




