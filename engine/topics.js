/* Load canonical content once for both the studio and the player. */
(() => {
  const base = new URL("../examples/", document.currentScript.src);
  window.SlideTopicsReady = (async () => {
    for (const file of ["solar-system.json", "moon-md-trial.json"]) {
      const response = await fetch(new URL(file, base));
      if (!response.ok) throw new Error(`無法讀取簡報資料 ${file}，請重新整理頁面。`);
      const topic = await response.json();
      window.SlideRenderer.registerCustomTopic(topic);
    }
  })();
})();
