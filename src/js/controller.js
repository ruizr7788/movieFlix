import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import topMoviesView from "./views/topMoviesView";
import resultsView from "./resultsView";
import View from "./views/view";
import * as model from "./model";

const controlTopMovies = async function () {
  await model.setTopMovies();
  topMoviesView.renderTopMovies(model.state.topMovies);
};

const controlSearchResults = async function (query, year, genre) {
  try {
    //   if(!query && year && genre) View.renderError()
    await model.setSearchedMovie(query, year);

    // render error
    if (!model.state.searchedMovie || model.state.searchedMovie.length === 0)
      throw new Error("No results");

    // render movies
    resultsView.renderMovies(model.state.searchedMovie);
  } catch (err) {
    resultsView.renderError(query);
  }
};

const controlWindow = function () {
  // this function will listen for the window and if it passes above 1200 then movie cards will change else if it passes below it will also change to mobile movie cards
};

const init = function () {
  resultsView.addHandlerRender(controlSearchResults);
  controlTopMovies();
};
init();
