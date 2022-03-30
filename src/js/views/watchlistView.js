class watchlistView {
  #movieContainer = document.getElementById("movies__container");
  #openWatchlistBtn = document.getElementById("open__watchlist");
  #watchlistModal = document.getElementById("watchlist__container--modal");
  #closeWatchlistBtn = document.getElementById("watchlist__modal--exit-button");
  #watchlistHeaderInfo = document.querySelector(".watchlist--header-inf");
  #watchlist = document.getElementById("watchlist");
  #overlay = document.querySelector(".overlay");
  _movieButton = [];

  addHandlerRender(handler, data) {
    const thisKey = this;
    this.#movieContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".watchlist--btn");
      if (!btn) return;
      thisKey._movieButton.push(btn);
      const mediaID = btn.dataset.mediaId;
      handler(+mediaID, btn.classList[0], btn);
    });

    this.#openWatchlistBtn.addEventListener("click", function (e) {
      thisKey.openWatchlist(data);
    });

    this.#closeWatchlistBtn.addEventListener("click", function (e) {
      thisKey.closeWatchlist();
    });
  }

  addStyle(btn) {
    btn.classList.replace("remove", "add");
    btn.textContent = "+";
  }

  removeStyle(btn) {
    btn.classList.replace("add", "remove");
    btn.textContent = "-";
  }

  renderWatchlistModal(data) {
    this.#watchlist.innerHTML = "";

    this.#watchlistHeaderInfo.textContent = `${data.size} items`;

    const html = this.generateModalHTML(data);
    this.#watchlist.insertAdjacentHTML("afterbegin", html);
  }

  generateModalHTML(data) {
    const watchlist = Array.from(data.values());
    return watchlist
      .map((movieData) => {
        return `
      <li class="watchlist--item">
            <div class="watchlist--item-img">
              <img src=${movieData.posterImage} alt="" />
            </div>
            <div class="watchlist--item-info">
              <h3 class="watchlist--item-title">${movieData.title} (${movieData.releaseDate})</h3>
              <p class="watchlist--item-duration">${movieData.duration}</p>
            </div>
            <div class="watchlist--item-remove">
              <button class="watchlist--remove-btn" data-media-id=${movieData.movieID}>Remove</button>
            </div>
      </li>
    `;
      })
      .join("");
  }

  openWatchlist(data) {
    this.#overlay.classList.remove("hidden");
    this.#watchlistModal.classList.remove("hidden");
    document.body.style.maxHeight = "100vh";
    document.body.style.overflow = "hidden";
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    this.renderWatchlistModal(data);
  }

  closeWatchlist() {
    this.#overlay.classList.add("hidden");
    this.#watchlistModal.classList.add("hidden");
    document.body.style.maxHeight = "none";
    document.body.style.overflow = "auto";
  }

  removeFromWatchlist(handler) {
    const thisKey = this;
    this.#watchlist.addEventListener("click", function (e) {
      const btn = e.target.closest(".watchlist--remove-btn");
      btn.textContent = "removed";
      btn.style.backgroundColor = "lightgreen";
      btn.style.borderColor = "green";
      const mediaIDRemove = btn.dataset.mediaId;

      handler(+mediaIDRemove);
    });
  }
}

export default new watchlistView();
