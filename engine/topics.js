/* Load canonical content once for both the studio and the player. */
(() => {
  const base = new URL("../examples/", document.currentScript.src);
  window.SlideTopicsReady = (async () => {
    const response = await fetch(new URL("solar-system.json", base));
    if (!response.ok) throw new Error("無法讀取太陽系簡報資料，請重新整理頁面。");
    const topic = await response.json();
    window.SlideRenderer.registerCustomTopic(topic);
  })();
})();
