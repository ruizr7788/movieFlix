export default class View {
  renderSpinner(parentEl) {
    const markup = `
        <div class="spinner"></div>
        `;

    parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}
