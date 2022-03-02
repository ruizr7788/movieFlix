import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import topMoviesView from "./views/topMoviesView";
import resultsView from "./views/resultsView";
import * as model from "./model";
import responsiveCardView from "./views/responsiveCardView";
import paginationView from "./views/paginationView";
import modalView from "./views/modalView";

let mediaState;

const controlTopMovies = async function () {
  await model.setTopMovies();
  topMoviesView.renderTopMovies(model.state.movie.topMovies);
};

const controlSearchResults = async function (query, year, type) {
  try {
    mediaState = type === "movies" ? model.state.movie : model.state.show;

    //   if(!query && year && genre) View.renderError()
    console.log(query, year, type);

    if (type === "movies") {
      await model.setSearchedMedia(query, year, type);
      console.log(mediaState);
      // throw error
      if (!mediaState.searchedMedia || mediaState.searchedMedia.length === 0)
        throw new Error("No results");

      // render media
      const size = window.innerWidth > 1200 ? "desktop" : "mobile";
      resultsView.renderResults(
        model.getSearchResultsPage(1),
        size,
        mediaState,

        model.state
      );
    } else if (type === "shows") {
      await model.setSearchedMedia(query, year, type);
      // throw error
      if (!mediaState.searchedMedia || mediaState.searchedMedia.length === 0)
        throw new Error("No results");

      // render shows
      const size = window.innerWidth > 1200 ? "desktop" : "mobile";
      resultsView.renderResults(
        model.getSearchResultsPage(1),
        size,
        mediaState,
        model.state
      );
    }
  } catch (err) {
    resultsView.renderError(query);
  }
};

const controlWindow = function (currentSize, newSize) {
  // this function will listen for the window and if it passes above 1200 then movie cards will change else if it passes below it will also change to mobile movie cards
  //   if (currentSize === newSize) return;

  if (!mediaState.searchedMedia || mediaState.searchedMedia.length === 0)
    return;

  if (currentSize === newSize) {
    resultsView.renderResults(
      model.getSearchResultsPage(mediaState.page),
      newSize,
      mediaState,
      model.state
    );
  }

  if (currentSize !== newSize) {
    resultsView.renderResults(
      model.getSearchResultsPage(mediaState.page),
      newSize,
      mediaState,
      model.state
    );
  }
};

const controlPagination = function () {
  // render new media
  const size = window.innerWidth > 1200 ? "desktop" : "mobile";
  resultsView.renderResults(
    model.getSearchResultsPage(model.state.page),
    size,
    mediaState,
    model.state
  );
};

const controlModalView = async function (mediaID) {
  await model.setMediaData(mediaID);
  modalView.openModal(mediaState);
};

const init = function () {
  controlTopMovies();
  resultsView.addHandlerRender(controlSearchResults);
  responsiveCardView.addHandlerRender(controlWindow);
  paginationView.addHandlerClick(controlPagination);
  modalView.addHandlerRender(controlModalView);
};
init();
