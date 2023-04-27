const apikey= "e8d3716aa9adb5729ce38d1a2ee0937c";
const apiBaseURL='https://api.themoviedb.org/3/';
const imageBaseURL="https://www.themoviedb.org/t/p/w600_and_h900_bestv2";


const moviesGrid=document.getElementById("movies-grid");
const searchInput=document.getElementById("search-input");
const searchForm=document.getElementById("search-form");
const categoryTitle=document.getElementById("category-title");
const favoritesBtn=document.getElementById("favorites-btn");
const favoritesGrid=document.getElementById("favorites-grid");

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchMoviesNowPlaying()
{   
    // await for the fetch of the data
    const response=await fetch(`${apiBaseURL}/movie/now_playing?api_key=${apikey}`);
    // await as it is being converted into a json File
    const jsonResponse=await response.json();
    const movies=jsonResponse.results;
    displayMovies(movies);
    // console.log(movies);

}

async function searchMovies(query)
{   
    // await for the fetch of the data
    const response=await fetch(`${apiBaseURL}/search/movie?api_key=${apikey}&query=${query}`);
    // await as it is being converted into a json File
    const jsonResponse=await response.json();
    const movies=jsonResponse.results;  
    displayMovies(movies);
    // console.log(movies);

}




function displayMovies(movies){
    moviesGrid.innerHTML=movies.map(movie=>
        `<div class="movie-card">
        <a href="#" class="movie-poster">
        <img  src="${imageBaseURL}${movie.poster_path}"/>
        </a>
        <p>⭐   ${movie.vote_average} </p>
        <h3>${movie.title}</h3>
        <button class="favorite-btn" data-id="${movie.id}">Add to Favorites</button>
        
        </div>
        
        `     
        ).join("");
 
        const favoriteBtns=document.querySelectorAll(".favorite-btn");
        favoriteBtns.forEach(btn => {
            btn.addEventListener("click", handleFavoriteBtnClick);
        });
        const moviePosters = document.querySelectorAll(".movie-poster");
  moviePosters.forEach(poster => {
    poster.addEventListener("click", async (event) => {
      event.preventDefault();
      const movieId = poster.closest(".movie-card").querySelector(".favorite-btn").dataset.id;
      const response = await fetch(`${apiBaseURL}/movie/${movieId}?api_key=${apikey}`);
      const movieDetails = await response.json();
      displayMovieDetails(movieDetails);
    });
});
}

function displayMovieDetails(movieDetails) {
    const popup = document.createElement("div");
    popup.classList.add("popup");
  
    const popupContent = `
      <div class="popup-inner">
        <div class="popup-poster">
          <img src="${imageBaseURL}${movieDetails.poster_path}" />
        </div>
        <div class="popup-details">
          <h2>${movieDetails.title} (${movieDetails.release_date.substring(0, 4)})</h2>
          <p>⭐   ${movieDetails.vote_average} </p>
          <p><strong>Genres:</strong> ${movieDetails.genres.map(genre => genre.name).join(", ")}</p>
          <p><strong>Overview:</strong> ${movieDetails.overview}</p>
        </div>
      </div>
    `;
  
    popup.innerHTML = popupContent;
  
    const closeButton = document.createElement("button");
    closeButton.classList.add("popup-close");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => {
      popup.remove();
    });
  
    popup.appendChild(closeButton);
  
    document.body.appendChild(popup);
  }
  

function handleFavoriteBtnClick(event) {
    const movieId = event.target.dataset.id;
    const movie = favorites.find(movie => movie.id == movieId);

    if (!movie) {
        const card = event.target.closest(".movie-card");
        const title = card.querySelector("h3").textContent;
        const posterPath = card.querySelector("img").getAttribute("src").replace(imageBaseURL, "");
        const voteAverage = card.querySelector("p").textContent.replace("⭐", "").trim();
        const newMovie = { id: movieId, title, posterPath, voteAverage };
        favorites.push(newMovie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function handleSearchFormSubmit(event){
    categoryTitle.innerHTML="Serch Results";
    event.preventDefault();
    const searchQuery=searchInput.value; 
    searchMovies(searchQuery);

} 



searchForm.addEventListener("submit",handleSearchFormSubmit);
fetchMoviesNowPlaying();


function displayFavorites() {
    favoritesGrid.innerHTML = favorites.map(movie =>
        `<div class="movie-card">
            <img src="${imageBaseURL}${movie.posterPath}"/>
            <p>⭐   ${movie.voteAverage} </p>
            <h3>${movie.title}</h3>
        </div>`
    ).join("");
}

favoritesBtn.addEventListener("click", () => {
    displayFavorites();
    moviesGrid.style.display = "none";
    favoritesGrid.style.display = "grid";
});