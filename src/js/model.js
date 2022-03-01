import { async } from "regenerator-runtime";
import { getJSON, getJSONFixedUrl } from "./helpers";

const progress = document.getElementById("progress");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const circles = document.querySelectorAll(".circle");
let currentPage = 1;

export const state = {
  topMovies: [],
  searchedMovie: [],
  resultsPerPage: 8,
  page: 1,
  query: "",
  movieData: {
    directors: [],
    duration: "4h 30m",
    releaseYear: "1999",
    posterPath: "link",
    genres: ["action", "action", "action"],
    description: "a good movie",
    whereToWatch: ["Hulu", "Hulu", "Hulu"],
    actors: [],
  },
};

export const setTopMovies = async function () {
  const topMovies = await getJSONFixedUrl(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=0a7f9d58833ce9dec435ed7e2632983c`
  );
  state.topMovies = topMovies;
};

export const setSearchedMovie = async function (query, year) {
  currentPage = 1;
  const moviePage1 = await getJSON(
    `https://api.themoviedb.org/3/search/movie?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&query=${query}&page=1&region=US&include_adult=false&year=${year}
    `,
    query
  );
  const moviePage2 = await getJSON(
    `https://api.themoviedb.org/3/search/movie?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&query=${query}&page=2&region=US&include_adult=false&year=${year}
    `,
    query
  );
  state.query = query;
  state.searchedMovie = [...moviePage1.results, ...moviePage2.results];
};

export const getSearchResultsPage = function (page = state.page) {
  state.pageNumber = page;

  const start = (page - 1) * 8; // 0;
  const end = page * state.resultsPerPage; // 10;

  // currentPage = 1;
  updatePagination();
  return state.searchedMovie.slice(start, end);
};

// ----- set movie data -----

export const setMovieData = async function (movieID) {
  const movieData =
    await getJSON(`https://api.themoviedb.org/3/movie/${movieID}?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US
`);

  // watch provider list -----------

  const watchProviders = await getJSON(
    `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=0a7f9d58833ce9dec435ed7e2632983c&region=US`
  );
  const resultsUS = watchProviders.results?.US || "Only in theatres";

  // get movie credits ----------

  //  https://image.tmdb.org/t/p/original
  const movieCredits = await getJSON(
    `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US`
  );
  const topActors = movieCredits.cast.slice(0, 6);

  state.movieData.duration = `${Math.floor(movieData.runtime / 60)}h ${
    movieData.runtime % 60
  }m`;
  state.movieData.releaseYear = movieData.release_date.slice(0, 4);
  state.movieData.posterPath = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
  state.movieData.description = movieData.overview;
  state.movieData.actors = topActors;
  state.movieData.genres = movieData.genres;
  state.movieData.whereToWatch = resultsUS;
  const directors = movieCredits.crew.map((person) => {
    if (person.known_for_department === "Directing") {
      state.movieData.directors.push(person.name);
    }
  });
};

// ----- pagination -----
updatePagination();

next.addEventListener("click", () => {
  currentPage++;
  if (currentPage > circles.length) {
    currentPage = circles.length;
  }
  updatePagination();
  console.log(currentPage);
});

prev.addEventListener("click", () => {
  currentPage--;
  if (currentPage < 1) {
    currentPage = 1;
  }
  updatePagination();
  console.log(currentPage);
});

function updatePagination() {
  state.page = currentPage;
  circles.forEach((circle, i) => {
    if (i < currentPage) {
      circle.classList.add("active");
    } else {
      circle.classList.remove("active");
    }
  });
  const actives = document.querySelectorAll(".active");

  progress.style.width =
    ((actives.length - 1) / (circles.length - 1)) * 100 + "%";

  if (currentPage === 1) {
    prev.disabled = true;
  } else if (currentPage === circles.length) {
    next.disabled = true;
  } else {
    prev.disabled = false;
    next.disabled = false;
  }

  const numOfPages = Math.ceil(state.searchedMovie.length / 8);
  if (currentPage + 1 > numOfPages) {
    next.disabled = true;
  } else {
    next.disabled = false;
  }
}
