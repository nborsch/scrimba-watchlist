const API_KEY = '1682b865'
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector("#search")
const mainContainer = document.querySelector('main')
let watchlist = []

searchForm.addEventListener('submit', searchMovie)

async function searchMovie(e){
    e.preventDefault()
    const searchQuery = searchInput.value 
    const responseSearch = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`)
    const dataSearch = await responseSearch.json()
    // found search results
    if (dataSearch.Search) {
        const moviesIds = dataSearch.Search.map(movie => movie.imdbID)
        const moviesResponses = await getMovies(moviesIds)
        const moviesArr = await Promise.all(moviesResponses.map(movieData => movieData.json()))
        const movieObjs = getMovieObjs(moviesArr)
        renderMovies(movieObjs)
    // no search results found
    } else {
        mainContainer.classList.add('no-data')
        mainContainer.classList.remove('initial')
        mainContainer.innerHTML = "<p>Unable to find what you’re looking for.<br>Please try another search.</p>"
    }
}

async function getMovies(moviesIds) {
    const moviesPromises = moviesIds.map(async movieId => {
        return await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`)
    })
    return Promise.all(moviesPromises)
}

function getMovieObjs(moviesArr){
    let movieObjs = moviesArr.map(movieData => {
        return {
            title: movieData.Title,
            id: movieData.imdbID,
            cover: movieData.Poster,
            rating: movieData.Ratings[0].Value.split('/')[0],
            duration: movieData.Runtime,
            genre: movieData.Genre,
            description: movieData.Plot
        }
    })
    return movieObjs
}

function renderMovies(movieObjs){
    let moviesHtml = ''
    for (let movieObj of movieObjs){
        moviesHtml += `
            <div class="movie">
                <img class="movie-cover" src="${movieObj.cover}" alt="">
                <div class="movie-info">
                    <div class="movie-title">
                        <span class="movie-title-name">${movieObj.title}</span>
                        <img src="./img/star-icon.png" alt="">
                        <span class="movie-rating fz12">${movieObj.rating}</span>
                    </div><!-- movie-title-->
                    <span class="movie-duration fz12">${movieObj.duration}</span>
                    <span class="movie-genre fz12">${movieObj.genre}</span>
                    <div class="movie-add-watchlist">
                        <a href="#">
                        <img data-movieid="${movieObj.id}" src="./img/add-watchlist-icon.png" alt="">
                        <span data-movieid="${movieObj.id}" class="fz12">Watchlist</span>
                        </a>
                    </div>
                    <p class="movie-description">${movieObj.description}</p>
                </div><!-- movie-info -->
            </div><!-- movie -->
            `
    }
    mainContainer.classList.remove('initial')
    mainContainer.classList.remove('no-data')
    mainContainer.innerHTML = moviesHtml

    setupAddToWatchlist()
}

function setupAddToWatchlist() {
    document.querySelectorAll('.movie-add-watchlist a').forEach(movieLink => {
    // add event listeners only to each movie "add to watchlist" link
    // then push movieid to watchlist array
    movieLink.addEventListener('click', e => {
            let movieid = e.target.dataset.movieid
            if (!watchlist.includes(movieid)) addToWatchlist(movieid)
        })
    })
}

function addToWatchlist(movieid){

}