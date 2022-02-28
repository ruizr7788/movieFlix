import { mark } from "regenerator-runtime";
import View from "./views/view";

class ResultsView extends View {
  #submitBTN = document.querySelector(".submit--btn");
  #input = document.getElementById("query");
  #yearSelection = document.getElementById("yearSelection");
  #genreSelection = document.getElementById("genreSelection");
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
    const genreValue =
      this.#genreSelection.options[this.#genreSelection.selectedIndex].value;
    return [query, yearValue, genreValue];
  }

  renderMovies(movies, size, state) {
    const markup = this.generateMarkup(movies, size);
    const resultsMessageMarkup = this.generateResultMessage(state.query, state);
    console.log(resultsMessageMarkup);
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
            <img src="/noresults.e01aeb9b.png" alt="" />
            <h1>Sorry no results for '${query}'</h1>
        </div>
      `;
    this.#moviesContainer.innerHTML = "";
    this.#moviesContainer.insertAdjacentHTML("afterbegin", markup);
  }

  generateResultMessage(query, state) {
    const numOfPages = Math.ceil(state.searchedMovie.length / 8);
    console.log(numOfPages);
    return `
    <div id="results__message--container">
      <div>
        <p id="results__message">
          Showing results for '${query}' Page ${state.page} of ${numOfPages}
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
          <div class="movie--card">
              <img src="${`https://image.tmdb.org/t/p/original${movie.poster_path}`}" alt="" />
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
          <div class="movie--card">
              <img src="${`https://image.tmdb.org/t/p/original${movie.poster_path}`}" alt="" />
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
