class TopMoviesView {
  #movieCard = document.querySelectorAll(".top--movie");

  renderTopMovies(data) {
    const topMovies = data.results;
    const movieCard = this.#movieCard;
    for (let i = 0; i < this.#movieCard.length; i++) {
      movieCard[i].querySelector(".movie--title").textContent =
        topMovies[i].title;

      movieCard[i]
        .getElementsByTagName("img")[0]
        .setAttribute(
          "src",
          `https://image.tmdb.org/t/p/original${topMovies[i].poster_path}`
        );
    }
  }
}

export default new TopMoviesView();
