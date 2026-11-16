window.SLIDE_CATALOG = window.SLIDE_CATALOG || {};
window.SLIDE_CATALOG.palettes = (function () {
  const groups = [
    ["紙感與瑞士經典", [
      ["Swiss Vermilion", "#f3f1ea", "#ffffff", "#111111", "#5a5852", "#e64815"],
      ["Zurich Cobalt", "#f5f6f8", "#ffffff", "#0f172a", "#475569", "#1d4ed8"],
      ["Basel Crimson", "#f4f2ed", "#ffffff", "#141414", "#57534e", "#dc2626"],
      ["Geneva Forest", "#f2f4ef", "#ffffff", "#132018", "#4d5d53", "#15803d"],
      ["Editorial Bone", "#edeae0", "#faf8f3", "#1c1917", "#6b655c", "#b45309"],
      ["Gallery Chalk", "#fafafa", "#ffffff", "#09090b", "#71717a", "#ef4444"],
      ["Archival Cream", "#f7f3e8", "#fffdf7", "#231f20", "#6e655f", "#0f766e"],
      ["Print Newspaper", "#ecebe6", "#f6f5f0", "#18181b", "#52525b", "#c2410c"],
      ["Warm Ivory", "#faf6ee", "#ffffff", "#1f2421", "#5c6660", "#9a3412"],
      ["Clean Monograph", "#f1f3f5", "#ffffff", "#111827", "#4b5563", "#2563eb"]
    ]],
    ["暗房與戰術黑", [
      ["Acid Darkroom", "#0a0b0e", "#13161d", "#eceef2", "#8c93a3", "#c8ff3d"],
      ["Obsidian Amber", "#0c0b09", "#171512", "#f5f2eb", "#9c9488", "#f59e0b"],
      ["Midnight Cyan", "#090d16", "#111827", "#f8fafc", "#94a3b8", "#38bdf8"],
      ["Carbon Vermilion", "#111113", "#1a1a1f", "#f4f4f5", "#a1a1aa", "#ff4d2e"],
      ["Linear Slate", "#0b0c10", "#14161f", "#eef0f6", "#8a91a8", "#6366f1"],
      ["Cinema Noir", "#080808", "#141414", "#f2f0ea", "#8c8982", "#e11d48"],
      ["Graphite Mint", "#121516", "#1b2022", "#edf2f0", "#8e9e99", "#34d399"],
      ["CRT Phosphor", "#07110a", "#0c1c11", "#5cff8d", "#2ca352", "#a7f3d0"],
      ["Amber Terminal", "#120d05", "#1c1408", "#ffb649", "#a6752d", "#fde047"],
      ["Deep Charcoal Gold", "#141413", "#1e1d1b", "#e8e4dc", "#999387", "#d4af37"]
    ]],
    ["孔版印刷雙色", [
      ["Riso Forest Coral", "#faf5eb", "#fffdf8", "#163329", "#556b62", "#ff4f40"],
      ["Riso Cobalt Peach", "#fdf6ee", "#ffffff", "#17327a", "#5c6c99", "#ff7a59"],
      ["Riso Plum Mint", "#f7f3fa", "#ffffff", "#4a154b", "#7c5c80", "#00b894"],
      ["Riso Teal Mustard", "#f8f5e6", "#fffdf5", "#0f4c5c", "#527882", "#e09f3e"],
      ["Riso Burgundy Sky", "#faf2f0", "#ffffff", "#6b1d2f", "#8c5662", "#2b7de9"],
      ["Riso Navy Lime", "#f5f7ef", "#ffffff", "#14213d", "#556078", "#84cc16"],
      ["Riso Indigo Orange", "#f4f4f9", "#ffffff", "#2e1065", "#6b5a8e", "#f97316"],
      ["Riso Pine Rose", "#f4f6f3", "#ffffff", "#1b4332", "#5a7669", "#fb7185"],
      ["Riso Espresso Cyan", "#f7f1ea", "#fffaf5", "#3d261c", "#7a6156", "#06b6d4"],
      ["Riso Charcoal Pink", "#f5f4f2", "#ffffff", "#222222", "#666666", "#ec4899"]
    ]],
    ["包浩斯與原色", [
      ["Bauhaus Classic", "#f6efe2", "#efe6d5", "#161616", "#57534a", "#d62828"],
      ["Mondrian Grid", "#ffffff", "#f4f4f0", "#0d0d0d", "#555555", "#1d4ed8"],
      ["Constructivist Red", "#f2ece1", "#e8dfd1", "#141414", "#5c574f", "#c1121f"],
      ["Kandinsky Ochre", "#f5efe0", "#ebe1cc", "#1b1b1e", "#635f57", "#e09f3e"],
      ["Primary Pop", "#fffdf7", "#f3f0e6", "#111111", "#555555", "#2563eb"],
      ["Studio Yellow", "#18181b", "#27272a", "#fafafa", "#a1a1aa", "#facc15"],
      ["Poster Signal", "#facc15", "#fef08a", "#111111", "#423a0b", "#dc2626"],
      ["Signal Blue", "#1e3a8a", "#172554", "#f8fafc", "#bfdbfe", "#facc15"],
      ["Signal Red", "#dc2626", "#b91c1c", "#ffffff", "#fecaca", "#111111"],
      ["Bauhaus Night", "#161616", "#222222", "#f6efe2", "#a8a296", "#ef4444"]
    ]],
    ["建築藍圖與工程", [
      ["Prussian Blueprint", "#0b2545", "#13315c", "#f0f6ff", "#9ec5eb", "#64dfdf"],
      ["Cyanotype Paper", "#0d3b66", "#14497a", "#faf0ca", "#b8d0e6", "#f4d35e"],
      ["CAD Dark Slate", "#182026", "#202b33", "#f5f8fa", "#a7b6c2", "#48aff0"],
      ["Concrete Brutal", "#d6d5d0", "#e4e3df", "#141414", "#52524e", "#ff4500"],
      ["Steel Drafting", "#e5e9ec", "#f2f5f7", "#1e293b", "#64748b", "#0284c7"],
      ["Subway Tile", "#f8fafc", "#ffffff", "#0f172a", "#475569", "#16a34a"],
      ["Transit Signal", "#18181b", "#27272a", "#ffffff", "#a1a1aa", "#f97316"],
      ["Aero Engineering", "#0f172a", "#1e293b", "#e2e8f0", "#94a3b8", "#22d3ee"],
      ["Lab Cleanroom", "#f0f4f8", "#ffffff", "#102a43", "#627d98", "#0d9488"],
      ["Industrial Hazard", "#1c1917", "#292524", "#fafaf9", "#a8a29e", "#eab308"]
    ]],
    ["東方與大地礦物", [
      ["Wabi Sabi Linen", "#ece7dc", "#f5f1e8", "#23201c", "#6c6458", "#9c6644"],
      ["Kyoto Matcha", "#eff2eb", "#f8faf5", "#1f2b1d", "#5f6e5b", "#4f772d"],
      ["Sumi Ink & Seal", "#f5f2eb", "#ffffff", "#1a1917", "#69645c", "#b91c1c"],
      ["Dunhuang Terracotta", "#f3eae0", "#faf4ed", "#33221b", "#7d6357", "#bc4749"],
      ["Stone & Moss", "#e6e4de", "#f2f0eb", "#242622", "#676b62", "#588157"],
      ["Kiln Ceramic", "#262320", "#332f2b", "#f2ede4", "#a8a095", "#d97706"],
      ["Tea House Cedar", "#2b2118", "#3b2e22", "#f5ebe0", "#b8a696", "#d4a373"],
      ["Indigo Dye Aizome", "#14213d", "#1d2d50", "#f1f5f9", "#94a3b8", "#e07a5f"],
      ["Sandstone Desert", "#f4ece1", "#fcf8f2", "#3d2c1e", "#876f5c", "#c8553d"],
      ["Volcanic Basalt", "#1f2022", "#2a2c2f", "#eae8e3", "#9c9992", "#e07a5f"]
    ]],
    ["北歐冷調與極簡", [
      ["Nordic Mist", "#e8ecef", "#f5f7f9", "#1c252c", "#5e6c77", "#2b59c3"],
      ["Glacier Slate", "#edf2f7", "#ffffff", "#1a202c", "#4a5568", "#0ea5e9"],
      ["Copenhagen Clay", "#ebe7e4", "#f7f5f3", "#262322", "#706a67", "#b45309"],
      ["Stockholm Fog", "#e2e6e9", "#eef1f3", "#1e2428", "#656f77", "#334155"],
      ["Birch Paper", "#f5f3ef", "#ffffff", "#252422", "#73706a", "#3f6212"],
      ["Fjord Deep", "#132029", "#1b2c38", "#eef3f6", "#8ea0ad", "#38bdf8"],
      ["Arctic Night", "#0f172a", "#17223b", "#f1f5f9", "#94a3b8", "#818cf8"],
      ["Soft Pewter", "#e5e7eb", "#f3f4f6", "#111827", "#6b7280", "#4f46e5"],
      ["Oslo Minimal", "#ffffff", "#f8fafc", "#0f172a", "#64748b", "#0f172a"],
      ["Muted Sage", "#e9edea", "#f4f7f5", "#1f2923", "#606e65", "#2d6a4f"]
    ]],
    ["膠片與電影視覺", [
      ["Kodak Portra Warm", "#f7f1e5", "#fffcf5", "#29221d", "#786b60", "#d95d39"],
      ["Cine Teal & Orange", "#0d1b22", "#142833", "#f1f5f9", "#90a8b5", "#f97316"],
      ["Wes Pastel Rose", "#f9e8e6", "#fff6f5", "#2d1e22", "#7d5e66", "#d6336c"],
      ["Wes Mustard Sky", "#e6f0f5", "#f5fafc", "#1e2a30", "#5f7580", "#eab308"],
      ["Wong Kar-wai Green", "#0a1c17", "#122b24", "#f2ead3", "#8da69c", "#f59e0b"],
      ["Blade Runner Dusk", "#16111a", "#221a29", "#f4effa", "#9c8fad", "#fb7185"],
      ["Silver Gelatin BW", "#181818", "#242424", "#f5f5f5", "#a3a3a3", "#ffffff"],
      ["Sepia Archive", "#efe5d5", "#f8f2e8", "#3b2b1d", "#7d6854", "#9a3412"],
      ["VHS Retro", "#120d26", "#1d163b", "#f5f3ff", "#a59ec9", "#22d3ee"],
      ["Dune Ochre", "#e8d5b7", "#f5ead8", "#2b1d0e", "#735a3e", "#c2410c"]
    ]],
    ["精品、裝飾與夜間", [
      ["Deco Champagne", "#101012", "#18181b", "#f5f0e6", "#9c9486", "#d4af37"],
      ["Emerald Velvet", "#092118", "#0f3023", "#f4f0e8", "#8ca69b", "#e9c46a"],
      ["Burgundy Luxe", "#240d13", "#36141d", "#f8f0f2", "#b38d96", "#f4a261"],
      ["Sapphire Salon", "#0d182e", "#162647", "#f2f5fa", "#8e9eb8", "#fbbf24"],
      ["Porcelain & Brass", "#f8f6f2", "#ffffff", "#1e1b18", "#6e685f", "#b48a3e"],
      ["Onyx & Rosegold", "#151314", "#211d1f", "#f7f2f4", "#a39398", "#e5989b"],
      ["Ivory Gallery", "#fbfaf7", "#ffffff", "#1c1c1c", "#6e6e6e", "#8b5cf6"],
      ["Bronze Museum", "#1f1a17", "#2b2420", "#f0e9e1", "#a19589", "#cd7f32"],
      ["Noir Platinum", "#0c0d0e", "#16181a", "#f4f6f8", "#8b9299", "#38bdf8"],
      ["Velvet Plum", "#1c1124", "#291a36", "#f6f0fa", "#a492b3", "#f472b6"]
    ]],
    ["現代 SaaS 與實驗霓虹", [
      ["Vercel Stark", "#000000", "#0f0f10", "#ffffff", "#888888", "#0070f3"],
      ["Stripe Indigo", "#f6f9fc", "#ffffff", "#0a2540", "#425466", "#635bff"],
      ["RayCast Coral", "#0d0d10", "#17171c", "#ffffff", "#9898a6", "#ff6363"],
      ["Supabase Mint", "#11181c", "#182228", "#ededef", "#8b949e", "#3ecf8e"],
      ["Figma Pop", "#ffffff", "#f5f5f5", "#1e1e1e", "#666666", "#0d99ff"],
      ["Notion Paper", "#ffffff", "#f7f6f3", "#37352f", "#787774", "#eb5757"],
      ["Hyper Lime", "#111111", "#1c1c1c", "#ffffff", "#999999", "#a3e635"],
      ["Electric Violet", "#0d081a", "#170f2e", "#f5f3ff", "#a799cc", "#a855f7"],
      ["Cyber Sunset", "#140b18", "#211226", "#fff1f2", "#c49aa6", "#fb7185"],
      ["Bio Tech Teal", "#061a1c", "#0c292c", "#ecfeff", "#7da3a8", "#2dd4bf"]
    ]]
  ];
  const out = [];
  let i = 1;
  groups.forEach(([cat, items]) => {
    items.forEach(([name, bg, surface, fg, muted, accent]) => {
      out.push({ id: `P-${String(i).padStart(3, "0")}`, cat, name, bg, surface, fg, muted, accent });
      i++;
    });
  });
  return out;
})();
