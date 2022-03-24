class watchlistView {
  #movieContainer = document.getElementById("movies__container");
  #openWatchlistBtn = document.getElementById("open__watchlist");
  #watchlistModal = document.getElementById("watchlist__container--modal");
  #closeWatchlistBtn = document.getElementById("watchlist__modal--exit-button");

  addHandlerRender(handler) {
    const thisKey = this;
    this.#movieContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".watchlist--btn");
      if (!btn) return;
      const mediaID = btn.dataset.mediaId;
      handler(+mediaID, btn.classList[0], btn);
    });
    this.#openWatchlistBtn.addEventListener("click", function (e) {
      thisKey.#watchlistModal.classList.remove("hidden");
      document.body.style.maxHeight = "100vh";
      document.body.style.overflow = "hidden";
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    });
    this.#closeWatchlistBtn.addEventListener("click", function (e) {
      console.log("click");
      thisKey.#watchlistModal.classList.add("hidden");
      document.body.style.maxHeight = "none";
      document.body.style.overflow = "auto";
    });
  }

  addStyle(btn) {
    console.log("called", btn);
    btn.classList.replace("remove", "add");
    btn.textContent = "+";
  }

  removeStyle(btn) {
    btn.classList.replace("add", "remove");
    btn.textContent = "-";
  }
}

export default new watchlistView();
