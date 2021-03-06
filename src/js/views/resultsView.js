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

  renderResults(mediaArr, size, mediaState, state) {
    const markup = this.generateMarkup(mediaArr, size, state);
    const resultsMessageMarkup = this.generateResultMessage(
      mediaState.query,
      mediaState,
      state
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

  generateResultMessage(query, mediaState, state) {
    const numOfPages = Math.ceil(mediaState.searchedMedia.length / 8);
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

  generateMarkup(mediaArr, size, state) {
    return mediaArr
      .map((media) => {
        const isInWatchlist = state.watchlist.has(media.id);
        if (!media.poster_path) return;
        if (size === "desktop") {
          return `
          <div class="movie--card" data-id="${media.id}">
              <img class="movie--card-img" src="${`https://image.tmdb.org/t/p/original${media.poster_path}`}" alt="" />
              <div class="card--footer">
                  <div class="card--footer-title">
                      <h4>${media.title ? media.title : media.name} (${
            media.release_date
              ? media.release_date?.slice(0, 4) ?? ""
              : media.first_air_date?.slice(0, 4) ?? ""
          })</h4>
                  </div>
                  <div class="card--footer-btn">
                      <button type="button" data-media-id="${
                        media.id
                      }" class="${
            isInWatchlist ? "remove" : "add"
          } watchlist--btn">+</button>
                  </div>
              </div>
          </div>
        `;
        } else {
          return `
          <div class="movie--card" data-id="${media.id}">
              <img class="movie--card-img" src="${`https://image.tmdb.org/t/p/original${media.poster_path}`}" alt="" />
              <div class="add--to-watchlist-btn">
                  <button type="button" data-media-id="${media.id}" class="${
            isInWatchlist ? "remove" : "add"
          } watchlist--btn mobile">+</button>
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
