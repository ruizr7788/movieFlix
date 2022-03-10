class watchlistView {
  #movieContainer = document.getElementById("movies__container");

  addHandlerRender(handler) {
    this.#movieContainer.addEventListener("click", function (e) {
      const btn = e.target.closest(".watchlist--btn");
      if (!btn) return;
      const mediaID = btn.dataset.mediaId;
      handler(+mediaID, btn.classList[0], btn);
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
