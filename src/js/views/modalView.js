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
  #movieTitle = document.getElementById("modal__movie--title");
  _overlay = document.querySelector(".overlay");

  addHandlerRender(handler) {
    const thisKey = this;
    this.#movieContainer.addEventListener("click", function (e) {
      if (!e.target.closest(".movie--card-img")) return;
      const media = e.target.closest(".movie--card-img").parentNode;
      if (!media) return;
      const mediaID = media.dataset.id;
      handler(mediaID);
    });
  }

  openModal(mediaState) {
    const thisKey = this;
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    //   https://image.tmdb.org/t/p/original
    this.#movieTitle.textContent = mediaState.mediaData.title;
    this.#whereToWatch.textContent = mediaState.mediaData.whereToWatch;
    this.#modalImage.setAttribute("src", mediaState.mediaData.posterPath);
    this.#yearRuntime.textContent = `${mediaState.mediaData.releaseYear} • ${mediaState.mediaData.duration}`;

    this.#directors.textContent = `${
      mediaState.mediaData.directors
        ? mediaState.mediaData.directors?.join(",   ")
        : mediaState.mediaData.creator
    }`;
    // this.#addToWatchlist.addEventListener('click', addToWatchlist)
    this.#genresContainer.innerHTML = this.generateGenreMarkup(
      mediaState.mediaData.genres
    );
    this.#description.textContent = mediaState.mediaData.description;
    this.#castContainer.innerHTML = this.generateCastMarkup(
      mediaState.mediaData.actors
    );
    this.renderActorImage(mediaState.mediaData.actors);

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
      if (actor.profile_path) {
        castImages[
          i
        ].style.backgroundImage = `url(https://image.tmdb.org/t/p/original${actor.profile_path})`;
        castImages[i].style.backgroundSize = "contain";
        castImages[i].style.backgroundPosition = "center";
      } else {
        castImages[i].style.backgroundSize = "contain";
        castImages[i].style.backgroundPosition = "0em, 0em";
      }
    });
  }
}

export default new ModalView();
