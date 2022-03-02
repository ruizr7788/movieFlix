import { mark } from "regenerator-runtime";
import View from "./view";

class ResultsView extends View {
  #submitBTN = document.querySelector(".submit--btn");
  #input = document.getElementById("query");
  #yearSelection = document.getElementById("yearSelection");
  #typeSelection = document.getElementById("typeSelection");
  #moviesContainer = document.getElementById("movies__container");

  addHandlerRender(handler) {
    const resultsViewThis = this;
    this.#submitBTN.addEventListener("click", function (e) {
      const searchParams = resultsViewThis.getParameters();
      handler(...searchParams);
      resultsViewThis.renderSpinner(resultsViewThis.#moviesContainer);
    });
  }

  getParameters() {
    const query = this.#input.value;
    const yearValue =
      this.#yearSelection.options[this.#yearSelection.selectedIndex].value;
    const typeSelected =
      this.#typeSelection.options[this.#typeSelection.selectedIndex].value;
    return [query, yearValue, typeSelected];
  }

  renderMovies(movies, size, movieState) {
    const markup = this.generateMarkup(movies, size);
    const resultsMessageMarkup = this.generateResultMessage(
      movieState.query,
      movieState
    );
    this.#moviesContainer.innerHTML = "";
    this.#moviesContainer.insertAdjacentHTML("afterbegin", markup);
    this.#moviesContainer.insertAdjacentHTML(
      "afterbegin",
      resultsMessageMarkup
    );
  }

  renderError(query) {
    const markup = `
        <div id="no__movies--error">
            <img src="https://i.pinimg.com/originals/7a/1c/f2/7a1cf2206c2a112f413888d20794c323.png" alt="" />
            <h1>Sorry no results for '${query}'</h1>
        </div>
      `;
    this.#moviesContainer.innerHTML = "";
    this.#moviesContainer.insertAdjacentHTML("afterbegin", markup);
  }

  generateResultMessage(query, movieState) {
    const numOfPages = Math.ceil(movieState.searchedMovie.length / 8);
    return `
    <div id="results__message--container">
      <div>
        <p id="results__message">
          Showing results for '${query}' Page ${movieState.page} of ${numOfPages}
        </p>
      </div>
    </div>
    `;
  }

  generateMarkup(movies, size) {
    return movies
      .map((movie) => {
        if (size === "desktop") {
          return `
          <div class="movie--card" data-id="${movie.id}">
              <img class="movie--card-img" src="${`https://image.tmdb.org/t/p/original${movie.poster_path}`}" alt="" />
              <div class="card--footer">
                  <div class="card--footer-title">
                      <h4>${movie.title}</h4>
                  </div>
                  <div class="card--footer-btn">
                      <button type="button" class="watchlist--btn">+</button>
                  </div>
              </div>
          </div>
        `;
        } else {
          return `
          <div class="movie--card" data-id="${movie.id}">
              <img class="movie--card-img" src="${`https://image.tmdb.org/t/p/original${movie.poster_path}`}" alt="" />
              <div class="add--to-watchlist-btn">
                  <button type="button" class="watchlist--btn">+</button>
              </div>
          </div>
          `;
        }
      })
      .join("");
  }
}
// if no year specified meaning select is set to 'year' set year parameter to 'all'
export default new ResultsView();
