const API_KEY = '1682b865'
const searchInput = document.querySelector('#search-input')
const searchBtn = document.querySelector('#search-button')
const mainContainer = document.querySelector('main')

searchBtn.addEventListener('click', searchMovie)

async function searchMovie(){
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
        console.log('no results')
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
                        <img src="./img/add-watchlist-icon.png" alt="">
                        <span class="fz12">Watchlist</span>
                    </div>
                    <p class="movie-description">${movieObj.description}</p>
                </div><!-- movie-info -->
            </div><!-- movie -->
            `
    }
    mainContainer.classList.remove('initial')
    mainContainer.innerHTML = moviesHtml
}