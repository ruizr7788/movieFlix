class PaginationView {
  _parentElement = document.getElementById("pagination__container");
  #previousBTN = document.getElementById("prev");
  #nextBTN = document.getElementById("next");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      handler();
    });
  }
}
export default new PaginationView();
