// Training category image presets and fallback handlers

export const CATEGORY_PRESET_IMAGES = {
  "Web Development": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "Data Science": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "DSA": "https://images.unsplash.com/photo-1516116211227-bbc13c744ef5?auto=format&fit=crop&w=800&q=80",
  "Cloud": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
  "AI/ML": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
  "Soft Skills": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "Other": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
};

// SVG data URI fallback for Web Development if network fails
export const DEFAULT_WEB_DEV_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" fill="none"><rect width="800" height="400" fill="%230f172a"/><rect x="40" y="40" width="720" height="320" rx="16" fill="%231e293b" stroke="%23334155" stroke-width="2"/><circle cx="80" cy="75" r="7" fill="%23ef4444"/><circle cx="105" cy="75" r="7" fill="%23f59e0b"/><circle cx="130" cy="75" r="7" fill="%2310b981"/><path d="M100 180L160 230L100 280" stroke="%233b82f6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 280H340" stroke="%2338bdf8" stroke-width="8" stroke-linecap="round"/><text x="400" y="210" fill="%23f8fafc" font-family="system-ui, sans-serif" font-size="28" font-weight="bold">Web Development</text><text x="400" y="250" fill="%2394a3b8" font-family="system-ui, sans-serif" font-size="16">HTML • CSS • JavaScript • React</text></svg>`;

export const getDefaultTrainingImage = (category) => {
  if (category && CATEGORY_PRESET_IMAGES[category]) {
    return CATEGORY_PRESET_IMAGES[category];
  }
  if (category && category.toLowerCase().includes("web")) {
    return CATEGORY_PRESET_IMAGES["Web Development"];
  }
  return CATEGORY_PRESET_IMAGES["Web Development"] || DEFAULT_WEB_DEV_SVG;
};

export const getTrainingThumbnail = (training) => {
  if (!training) return CATEGORY_PRESET_IMAGES["Web Development"];
  if (training.thumbnail && training.thumbnail.trim() !== "") {
    return training.thumbnail;
  }
  return getDefaultTrainingImage(training.category);
};
