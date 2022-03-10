import { async } from "regenerator-runtime";
import * as helper from "./helpers";
// import * as configs from "./config";

const progress = document.getElementById("progress");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const circles = document.querySelectorAll(".circle");
let mediaState;
let mediaType;
let currentPage = 1;

export const state = {
  page: 1,
  movie: {
    topMovies: [],
    searchedMedia: [],
    resultsPerPage: 8,
    query: "",
    mediaData: {
      title: "",
      directors: [],
      duration: "4h 30m",
      releaseYear: "1999",
      posterPath: "link",
      genres: ["action", "action", "action"],
      description: "a good movie",
      whereToWatch: ["Hulu", "Hulu", "Hulu"],
      actors: [],
    },
  },
  show: {
    searchedMedia: [],
    resultsPerPage: 8,
    query: "",
    mediaData: {
      title: "",
      creator: "",
      duration: "4h 30m",
      releaseYear: "1999",
      posterPath: "link",
      genres: ["action", "action", "action"],
      description: "a good movie",
      whereToWatch: ["Hulu", "Hulu", "Hulu"],
      actors: [],
    },
  },
  watchlist: [],
};

export const setTopMovies = async function () {
  const topMovies = await helper.getJSONFixedUrl(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=0a7f9d58833ce9dec435ed7e2632983c`
  );
  state.movie.topMovies = topMovies;
};

// /////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
export const setSearchedMedia = async function (query, year, type) {
  mediaState = type === "movies" ? state.movie : state.show;
  mediaType = type === "movies" ? "movie" : "show";
  currentPage = 1;
  const searchPage1URL =
    type === "movies"
      ? helper.MOVIE_SEARCH_URL_PAGE1(query, year)
      : helper.SHOW_SEARCH_URL_PAGE1(query, year);

  const searchPage2URL =
    type === "movies"
      ? helper.MOVIE_SEARCH_URL_PAGE2(query, year)
      : helper.SHOW_SEARCH_URL_PAGE2(query, year);

  const page1 = await helper.getJSON(searchPage1URL, query);
  const page2 = await helper.getJSON(searchPage2URL, query);

  mediaState.query = query;
  mediaState.searchedMedia = [...page1.results, ...page2.results];
};

export const getSearchResultsPage = function (page = state.page, type) {
  state.page = page;

  const start = (page - 1) * 8; // 0;
  const end = page * mediaState.resultsPerPage; // 10;

  // currentPage = 1;
  updatePagination();
  return mediaState.searchedMedia.slice(start, end);
};

// ----- SET MEDIA DATA -------------------------------------

export const setMediaData = async function (mediaID) {
  // movie data ----------------------------
  const mediaData = await helper.getMediaData(mediaID, mediaType);
  // IF POSTER PATH IS NULL DO NOT SHOW IN RESULTS

  // watch provider list ------------------
  const watchProvidersData = await helper.getWatchProviders(mediaID, mediaType);

  // movie credits -------------------------
  //  https://image.tmdb.org/t/p/original
  const mediaCredits = await helper.getMediaCredits(mediaID, mediaType);

  let watchProviders = [];
  const currenteYear = new Date().getFullYear();
  let mediaReleaseDate;

  const topActors = mediaCredits.cast.slice(0, 6);

  if (mediaType === "movie") {
    mediaState.mediaData.title = mediaData.original_title;
    mediaCredits.crew.map((person) => {
      if (person.known_for_department === "Directing") {
        mediaState.mediaData.directors.push(person.name);
      }
    });
    mediaState.mediaData.releaseYear = mediaData.release_date.slice(0, 4);
    mediaReleaseDate = mediaData.release_date.slice(0, 4);
    mediaState.mediaData.duration = `${Math.floor(mediaData.runtime / 60)}h ${
      mediaData.runtime % 60
    }m`;
  } else if (mediaType === "show") {
    mediaState.mediaData.title = mediaData.name;
    mediaState.mediaData.creator = mediaData.created_by[0]?.name || "";
    mediaState.mediaData.releaseYear = mediaData.first_air_date.slice(0, 4);
    mediaReleaseDate = mediaData.first_air_date.slice(0, 4);
    mediaState.mediaData.duration = `${mediaData.episode_run_time}m`;
  }
  if (mediaType === "movie") {
    if (watchProvidersData.results.US) {
      watchProviders = watchProvidersData.results.US.rent
        .map((result) => result.provider_name)
        .slice(0, 4);
    } else if (currenteYear - mediaReleaseDate < 2) {
      watchProviders = "Only in theatres";
    } else {
      watchProviders = "Not on streaming platforms";
    }
  }
  if (mediaType === "show") {
    if (watchProvidersData.results.US && watchProvidersData.results.US.buy) {
      watchProviders = watchProvidersData.results.US.buy
        .map((result) => result.provider_name)
        .slice(0, 4);
    } else if (currenteYear - mediaReleaseDate < 2) {
      watchProviders = "Tv providers";
    } else {
      watchProviders = "Not on streaming platform";
    }
  }

  mediaState.mediaData.posterPath = `https://image.tmdb.org/t/p/original${mediaData.poster_path}`;
  mediaState.mediaData.description = mediaData.overview;
  mediaState.mediaData.actors = topActors;
  mediaState.mediaData.genres = mediaData.genres;
  mediaState.mediaData.whereToWatch = watchProviders;
};

// //////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////
// ----- pagination -----
updatePagination();

next.addEventListener("click", () => {
  currentPage++;
  if (currentPage > circles.length) {
    currentPage = circles.length;
  }
  updatePagination();
});

prev.addEventListener("click", () => {
  currentPage--;
  if (currentPage < 1) {
    currentPage = 1;
  }
  updatePagination();
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

  const numOfPages = Math.ceil(mediaState?.searchedMedia.length / 8);
  if (currentPage + 1 > numOfPages) {
    next.disabled = true;
  } else {
    next.disabled = false;
  }
}
