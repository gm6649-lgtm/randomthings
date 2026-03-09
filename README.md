# randomthings

## Sangeet - Indian Music Player 🎵

A mobile-friendly Progressive Web App (PWA) music player for Indian songs spanning from the 1970s to 2024. Supports both **MP3 audio** and **video** playback.

### Features

- **Audio (MP3) & Video Playback** — Play songs in both MP3 audio and video formats
- **Song Catalog** — Curated catalog of Indian songs from the 1970s through 2024
- **Browse by Decade** — Explore songs organized by decade (1970s, 1980s, 1990s, 2000s, 2010s, 2020s)
- **Search** — Search songs by title, artist, movie, genre, language, or year
- **Playlist** — Create and manage your personal playlist (saved to browser storage)
- **Music Videos** — Dedicated video section with a fullscreen video player
- **Mobile-First Design** — Responsive UI optimized for mobile devices
- **PWA Support** — Install as a standalone app on mobile devices

### How to Run

Serve the `music-player/` directory using any HTTP server:

```bash
# Using Python
cd music-player
python3 -m http.server 8080

# Using Node.js (npx)
npx serve music-player

# Using PHP
cd music-player
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

### Project Structure

```
music-player/
├── index.html          # Main app HTML
├── manifest.json       # PWA manifest
├── css/
│   └── styles.css      # App styles (mobile-first)
├── js/
│   ├── catalog.js      # Song catalog database
│   └── app.js          # App logic (playback, UI, search)
└── icons/
    └── icon.svg        # App icon
```

### Adding Music Files

The catalog in `js/catalog.js` contains song metadata. To play actual music, update the `src` field for each song entry with the path or URL to a properly licensed audio/video file:

```javascript
{ id: 1, title: "Song Title", ..., src: "path/to/song.mp3" }
```

> **Note:** Actual music files are not included in this repository due to copyright restrictions. You must obtain proper licenses before distributing any copyrighted music.