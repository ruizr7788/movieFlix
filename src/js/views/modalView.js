class ModalView {
  #movieContainer = document.getElementById("movies__container");
  #modalContainer = document.getElementById("movie__modal--container");
  #modalImage = document.getElementById("modal__image");
  #yearRuntime = document.getElementById("year__runtime");
  #directors = document.getElementById("directors");
  #addToWatchlist = document.getElementById("modal__watchlist--button");
  #genresContainer = document.getElementById("genres__list");
  #description = document.getElementById("description");
  #castContainer = document.getElementById("cast__list");
  #closeModalBtn = document.getElementById("close__modal--btn");
  #whereToWatch = document.getElementById("where__to--watch");
  _overlay = document.querySelector(".overlay");

  addHandlerRender(handler) {
    const thisKey = this;
    this.#movieContainer.addEventListener("click", function (e) {
      const media = e.target.closest(".movie--card-img").parentNode;
      if (!media) return;
      const mediaID = media.dataset.id;
      handler(mediaID);
    });
  }

  openModal(mediaData) {
    const thisKey = this;
    //   https://image.tmdb.org/t/p/original
    this.#whereToWatch.textContent = mediaData.whereToWatch;
    this.#modalImage.setAttribute("src", mediaData.posterPath);
    this.#yearRuntime.textContent = `${mediaData.releaseYear}• ${mediaData.duration}`;
    this.#directors.textContent = `${mediaData.directors.join(",   ")}`;
    // this.#addToWatchlist.addEventListener('click', addToWatchlist)
    this.#genresContainer.innerHTML = this.generateGenreMarkup(
      mediaData.genres
    );
    this.#description.textContent = mediaData.description;
    this.#castContainer.innerHTML = this.generateCastMarkup(mediaData.actors);
    this.renderActorImage(mediaData.actors);

    this._overlay.classList.remove("hidden");

    this.#modalContainer.classList.remove("hidden");

    this.#closeModalBtn.addEventListener("click", () => {
      thisKey.closeModal(thisKey);
    });
    this._overlay.addEventListener("click", () => {
      thisKey.closeModal(thisKey);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        thisKey.closeModal(thisKey);
      }
    });
  }

  closeModal(thisKey) {
    thisKey._overlay.classList.add("hidden");
    thisKey.#modalContainer.classList.add("hidden");
  }

  generateGenreMarkup(genres) {
    return genres
      .map((genre) => {
        return `<li>${genre.name}</li>`;
      })
      .join("");
  }

  generateCastMarkup(cast) {
    return cast
      .map((person, i) => {
        return `
        <li>
           <div class="cast--img"></div>
           <div class="actor">
             ${person.original_name}
             <br />
             as ${person.character}
           </div>
        </li>`;
      })
      .join("");
  }

  renderActorImage(actors) {
    const castImages = document.querySelectorAll(".cast--img");
    actors.forEach((actor, i) => {
      castImages[
        i
      ].style.backgroundImage = `url(https://image.tmdb.org/t/p/original${actor.profile_path})`;
    });
  }
}

export default new ModalView();
