class watchlistView {
  #movieContainer = document.getElementById("movies__container");

  addHandlerRender(handler) {
    this.#movieContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".watchlist--btn");
      if (!btn) return;
      const mediaID = btn.dataset.mediaId;
      handler(mediaID);
    });
  }
}

export default new watchlistView();
