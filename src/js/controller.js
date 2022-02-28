import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import topMoviesView from "./views/topMoviesView";
import resultsView from "./resultsView";
import * as model from "./model";
import responsiveCardView from "./views/responsiveCardView";
import paginationView from "./views/paginationView";

const controlTopMovies = async function () {
  await model.setTopMovies();
  topMoviesView.renderTopMovies(model.state.topMovies);
};

const controlSearchResults = async function (query, year, genre) {
  try {
    //   if(!query && year && genre) View.renderError()
    await model.setSearchedMovie(query, year);

    // throw error
    if (!model.state.searchedMovie || model.state.searchedMovie.length === 0)
      throw new Error("No results");

    // render movies
    const size = window.innerWidth > 1200 ? "desktop" : "mobile";
    resultsView.renderMovies(model.getSearchResultsPage(1), size);
  } catch (err) {
    resultsView.renderError(query);
  }
};

const controlWindow = function (currentSize, newSize) {
  // this function will listen for the window and if it passes above 1200 then movie cards will change else if it passes below it will also change to mobile movie cards
  //   if (currentSize === newSize) return;

  if (!model.state.searchedMovie || model.state.searchedMovie.length === 0)
    return;

  if (currentSize === newSize) {
    resultsView.renderMovies(
      model.getSearchResultsPage(model.state.page),
      newSize
    );
  }

  if (currentSize !== newSize) {
    resultsView.renderMovies(
      model.getSearchResultsPage(model.state.page),
      newSize
    );
  }
};

const controlPagination = function () {
  // render new movies
  const size = window.innerWidth > 1200 ? "desktop" : "mobile";
  resultsView.renderMovies(model.getSearchResultsPage(model.state.page), size);
};

const init = function () {
  resultsView.addHandlerRender(controlSearchResults);
  controlTopMovies();
  responsiveCardView.addHandlerRender(controlWindow);
  paginationView.addHandlerClick(controlPagination);
};
init();
