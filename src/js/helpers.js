export const getJSONFixedUrl = function (url, errorMsg = "No results") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`No results`);
    return response.json();
  });
};
export const getJSON = function (url, query, errorMsg = "No results") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`No results for ${query}`);
    return response.json();
  });
};

export const MOVIE_SEARCH_URL_PAGE1 = function (query, year) {
  return `https://api.themoviedb.org/3/search/movie?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&query=${query}&page=1&region=US&include_adult=false&year=${year}`;
};

export const SHOW_SEARCH_URL_PAGE1 = function (query, year) {
  return `https://api.themoviedb.org/3/search/tv?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&page=1&query=${query}&include_adult=false&first_air_date_year=${year}`;
};

export const MOVIE_SEARCH_URL_PAGE2 = function (query, year) {
  return `https://api.themoviedb.org/3/search/movie?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&query=${query}&page=2&region=US&include_adult=false&year=${year}`;
};

export const SHOW_SEARCH_URL_PAGE2 = function (query, year) {
  return `https://api.themoviedb.org/3/search/tv?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US&page=2&query=${query}&include_adult=false&first_air_date_year=${year}`;
};
export const getMediaData = async function (mediaID) {
  return await getJSON(`https://api.themoviedb.org/3/movie/${mediaID}?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US
  `);
};

export const getWatchProviders = async function (mediaID) {
  return await getJSON(
    `https://api.themoviedb.org/3/tv/${mediaID}/watch/providers?api_key=0a7f9d58833ce9dec435ed7e2632983c&region=US`
  );
};

export const getMediaCredits = async function (mediaID) {
  return await getJSON(
    `https://api.themoviedb.org/3/tv/${mediaID}/credits?api_key=0a7f9d58833ce9dec435ed7e2632983c&language=en-US`
  );
};
