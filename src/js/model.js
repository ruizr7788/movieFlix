import { async } from "regenerator-runtime";
import { getJSON, getJSONFixedUrl } from "./helpers";

export const state = {
  topMovies: [],
  searchedMovie: "",
  resultsPerPage: [],
};

export const setTopMovies = async function () {
  const topMovies = await getJSONFixedUrl(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=0a7f9d58833ce9dec435ed7e2632983c`
  );
  state.topMovies = topMovies;
};

export const setSearchedMovie = async function (query, year) {
  const movie = await getJSON(
    `https://api.themoviedb.org/3/search/movie?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&query=${query}&page=1&include_adult=false&year=${year}
    `,
    query
  );
  state.searchedMovie = movie.results;
};
