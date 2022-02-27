class ResponsiveCardsView {
  addHandlerRender(handler) {
    const currentSize = window.innerWidth > 1200 ? "desktop" : "mobile";
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1200) {
        const newSize = "mobile";
        handler(currentSize, newSize);
      }
      if (window.innerWidth > 1200) {
        const newSize = "desktop";
        handler(currentSize, newSize);
      }
    });
  }
}

export default new ResponsiveCardsView();
