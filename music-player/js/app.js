/**
 * Sangeet - Indian Music Player
 * Main Application Logic
 */
(function () {
  "use strict";

  // === State ===
  var state = {
    currentSong: null,
    isPlaying: false,
    playlist: [],
    currentTab: "browse",
    currentDecade: null,
    searchQuery: "",
    currentIndex: -1,
    queue: [],
  };

  // === DOM Elements ===
  var elements = {
    audioPlayer: document.getElementById("audioPlayer"),
    videoPlayer: document.getElementById("videoPlayer"),
    searchToggleBtn: document.getElementById("searchToggleBtn"),
    searchBar: document.getElementById("searchBar"),
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    tabNav: document.getElementById("tabNav"),
    mainContent: document.getElementById("mainContent"),
    featuredList: document.getElementById("featuredList"),
    recentList: document.getElementById("recentList"),
    allSongsList: document.getElementById("allSongsList"),
    decadesGrid: document.getElementById("decadesGrid"),
    decadeSongsList: document.getElementById("decadeSongsList"),
    playlistSongsList: document.getElementById("playlistSongsList"),
    playlistCount: document.getElementById("playlistCount"),
    playlistEmpty: document.getElementById("playlistEmpty"),
    videoGrid: document.getElementById("videoGrid"),
    videoModal: document.getElementById("videoModal"),
    videoCloseBtn: document.getElementById("videoCloseBtn"),
    videoTitle: document.getElementById("videoTitle"),
    videoArtist: document.getElementById("videoArtist"),
    searchResults: document.getElementById("searchResults"),
    searchResultsList: document.getElementById("searchResultsList"),
    resultCount: document.getElementById("resultCount"),
    searchEmpty: document.getElementById("searchEmpty"),
    playerBar: document.getElementById("playerBar"),
    playerProgressBar: document.getElementById("playerProgressBar"),
    playerProgress: document.getElementById("playerProgress"),
    playerArtwork: document.getElementById("playerArtwork"),
    playerSongTitle: document.getElementById("playerSongTitle"),
    playerSongArtist: document.getElementById("playerSongArtist"),
    playPauseBtn: document.getElementById("playPauseBtn"),
    playIcon: document.getElementById("playIcon"),
    pauseIcon: document.getElementById("pauseIcon"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
  };

  // === Utilities ===
  function escapeHTML(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("visible");
    });

    setTimeout(function () {
      toast.classList.remove("visible");
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 2000);
  }

  // === Song Card Rendering ===
  function createSongElement(song) {
    var item = document.createElement("div");
    item.className = "song-item";
    item.dataset.id = song.id;

    if (state.currentSong && state.currentSong.id === song.id) {
      item.classList.add("playing");
    }

    var isInPlaylist = state.playlist.some(function (s) {
      return s.id === song.id;
    });

    item.innerHTML =
      '<div class="song-artwork">' +
      '<div class="artwork-color" style="background:' +
      escapeHTML(song.color) +
      '">' +
      '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill="rgba(255,255,255,0.6)"/></svg>' +
      "</div>" +
      '<div class="playing-indicator">' +
      '<div class="playing-bars"><span></span><span></span><span></span></div>' +
      "</div>" +
      "</div>" +
      '<div class="song-details">' +
      '<div class="song-title">' +
      escapeHTML(song.title) +
      "</div>" +
      '<div class="song-meta">' +
      '<span class="song-artist">' +
      escapeHTML(song.artist) +
      "</span>" +
      '<span class="song-type-badge ' +
      escapeHTML(song.type) +
      '">' +
      escapeHTML(song.type) +
      "</span>" +
      "</div>" +
      "</div>" +
      '<span class="song-duration">' +
      escapeHTML(song.duration) +
      "</span>" +
      '<div class="song-actions">' +
      '<button class="song-action-btn add-playlist-btn' +
      (isInPlaylist ? " in-playlist" : "") +
      '" data-id="' +
      song.id +
      '" aria-label="' +
      (isInPlaylist ? "Remove from playlist" : "Add to playlist") +
      '">' +
      (isInPlaylist
        ? '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>') +
      "</button>" +
      "</div>";

    // Play on click (on song item, not action buttons)
    item.addEventListener("click", function (e) {
      if (e.target.closest(".song-action-btn")) return;
      playSong(song);
    });

    // Playlist button
    var playlistBtn = item.querySelector(".add-playlist-btn");
    playlistBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      togglePlaylist(song);
    });

    return item;
  }

  // === Video Card Rendering ===
  function createVideoCard(song) {
    var card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML =
      '<div class="video-thumbnail" style="background:' +
      escapeHTML(song.color) +
      '">' +
      '<div class="play-overlay">' +
      '<svg viewBox="0 0 24 24" width="36" height="36"><polygon points="8,5 19,12 8,19" fill="currentColor"/></svg>' +
      "</div>" +
      "</div>" +
      '<div class="video-card-info">' +
      '<div class="video-card-title">' +
      escapeHTML(song.title) +
      "</div>" +
      '<div class="video-card-artist">' +
      escapeHTML(song.artist) +
      " • " +
      escapeHTML(String(song.year)) +
      "</div>" +
      "</div>";

    card.addEventListener("click", function () {
      playVideo(song);
    });

    return card;
  }

  // === Decades Card Rendering ===
  function createDecadeCard(decade, count, emoji) {
    var card = document.createElement("div");
    card.className = "decade-card";
    if (state.currentDecade === decade) card.classList.add("active");

    card.innerHTML =
      '<div class="decade-emoji">' +
      emoji +
      "</div>" +
      '<div class="decade-label">' +
      escapeHTML(decade) +
      "</div>" +
      '<div class="decade-count">' +
      count +
      " songs</div>";

    card.addEventListener("click", function () {
      state.currentDecade = state.currentDecade === decade ? null : decade;
      renderDecadesTab();
    });

    return card;
  }

  // === Rendering Functions ===
  function renderBrowseTab() {
    // Featured: random selection of 5
    var shuffled = songCatalog.slice().sort(function () {
      return 0.5 - Math.random();
    });
    var featured = shuffled.slice(0, 5);

    elements.featuredList.innerHTML = "";
    featured.forEach(function (song) {
      elements.featuredList.appendChild(createSongElement(song));
    });

    // Recent: latest by year
    var recent = songCatalog
      .slice()
      .sort(function (a, b) {
        return b.year - a.year;
      })
      .slice(0, 8);
    elements.recentList.innerHTML = "";
    recent.forEach(function (song) {
      elements.recentList.appendChild(createSongElement(song));
    });

    // All songs
    elements.allSongsList.innerHTML = "";
    songCatalog.forEach(function (song) {
      elements.allSongsList.appendChild(createSongElement(song));
    });
  }

  function renderDecadesTab() {
    var decades = ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
    var emojis = ["🎵", "🕺", "🎶", "🎤", "🎧", "🔥"];

    elements.decadesGrid.innerHTML = "";
    decades.forEach(function (decade, i) {
      var count = songCatalog.filter(function (s) {
        return s.decade === decade;
      }).length;
      elements.decadesGrid.appendChild(
        createDecadeCard(decade, count, emojis[i])
      );
    });

    // Show songs for selected decade
    elements.decadeSongsList.innerHTML = "";
    if (state.currentDecade) {
      var songs = songCatalog.filter(function (s) {
        return s.decade === state.currentDecade;
      });
      songs.forEach(function (song) {
        elements.decadeSongsList.appendChild(createSongElement(song));
      });
    }
  }

  function renderPlaylistTab() {
    elements.playlistSongsList.innerHTML = "";
    if (state.playlist.length === 0) {
      elements.playlistEmpty.classList.add("visible");
      elements.playlistCount.textContent = "0 songs";
    } else {
      elements.playlistEmpty.classList.remove("visible");
      elements.playlistCount.textContent =
        state.playlist.length +
        " song" +
        (state.playlist.length !== 1 ? "s" : "");
      state.playlist.forEach(function (song) {
        elements.playlistSongsList.appendChild(createSongElement(song));
      });
    }
  }

  function renderVideoTab() {
    var videos = songCatalog.filter(function (s) {
      return s.type === "video";
    });

    elements.videoGrid.innerHTML = "";
    videos.forEach(function (song) {
      elements.videoGrid.appendChild(createVideoCard(song));
    });
  }

  function renderSearchResults(query) {
    var q = query.toLowerCase().trim();
    if (!q) {
      hideSearchResults();
      return;
    }

    var results = songCatalog.filter(function (s) {
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.movie.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.decade.includes(q) ||
        String(s.year).includes(q) ||
        s.language.toLowerCase().includes(q)
      );
    });

    showTab("searchResults");
    elements.searchResultsList.innerHTML = "";

    if (results.length === 0) {
      elements.searchEmpty.classList.add("visible");
      elements.resultCount.textContent = "";
    } else {
      elements.searchEmpty.classList.remove("visible");
      elements.resultCount.textContent = results.length + " found";
      results.forEach(function (song) {
        elements.searchResultsList.appendChild(createSongElement(song));
      });
    }
  }

  function hideSearchResults() {
    showTab(state.currentTab);
  }

  // === Tab Navigation ===
  function showTab(tabId) {
    // Hide all tab contents
    var contents = document.querySelectorAll(".tab-content");
    contents.forEach(function (c) {
      c.classList.remove("active");
    });

    // Show target
    var target = document.getElementById(
      tabId === "searchResults" ? "searchResults" : tabId + "Tab"
    );
    if (target) target.classList.add("active");

    // Update nav buttons (don't update for search)
    if (tabId !== "searchResults") {
      state.currentTab = tabId;
      var buttons = elements.tabNav.querySelectorAll(".tab-btn");
      buttons.forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.tab === tabId);
      });
    }

    // Render content
    switch (tabId) {
      case "browse":
        renderBrowseTab();
        break;
      case "decades":
        renderDecadesTab();
        break;
      case "playlist":
        renderPlaylistTab();
        break;
      case "video":
        renderVideoTab();
        break;
    }
  }

  // === Playback ===
  function playSong(song) {
    if (song.type === "video") {
      playVideo(song);
      return;
    }

    state.currentSong = song;

    // Build queue from current view
    var songList = getCurrentSongList();
    state.queue = songList.length > 0 ? songList : [song];
    state.currentIndex = state.queue.findIndex(function (s) {
      return s.id === song.id;
    });
    if (state.currentIndex === -1) {
      state.queue.push(song);
      state.currentIndex = state.queue.length - 1;
    }

    // Update audio
    if (song.src) {
      elements.audioPlayer.src = song.src;
      elements.audioPlayer.play().catch(function () {
        // Autoplay may be blocked
      });
      state.isPlaying = true;
    } else {
      // Demo mode: simulate playback
      state.isPlaying = true;
      simulatePlayback(song);
    }

    updatePlayerUI();
    updatePlayingState();
    showToast("Now playing: " + song.title);
  }

  function playVideo(song) {
    state.currentSong = song;
    elements.videoTitle.textContent = song.title;
    elements.videoArtist.textContent = song.artist + " • " + song.movie + " (" + song.year + ")";

    if (song.src) {
      elements.videoPlayer.src = song.src;
      elements.videoPlayer.play().catch(function () {});
    }

    elements.videoModal.classList.add("active");

    // Pause audio if playing
    elements.audioPlayer.pause();
    updatePlayerUI();
  }

  function closeVideo() {
    elements.videoModal.classList.remove("active");
    elements.videoPlayer.pause();
    elements.videoPlayer.removeAttribute("src");
  }

  function togglePlayPause() {
    if (!state.currentSong) return;

    if (state.isPlaying) {
      elements.audioPlayer.pause();
      state.isPlaying = false;
      cancelSimulation();
    } else {
      if (state.currentSong.src) {
        elements.audioPlayer.play().catch(function () {});
      } else {
        simulatePlayback(state.currentSong);
      }
      state.isPlaying = true;
    }
    updatePlayerUI();
  }

  function playNext() {
    if (state.queue.length === 0) return;
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    playSong(state.queue[state.currentIndex]);
  }

  function playPrev() {
    if (state.queue.length === 0) return;
    state.currentIndex =
      (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    playSong(state.queue[state.currentIndex]);
  }

  function getCurrentSongList() {
    var tab = state.currentTab;
    if (tab === "playlist") return state.playlist.slice();
    if (tab === "decades" && state.currentDecade) {
      return songCatalog.filter(function (s) {
        return s.decade === state.currentDecade && s.type === "mp3";
      });
    }
    return songCatalog.filter(function (s) {
      return s.type === "mp3";
    });
  }

  // === Playback Simulation (Demo Mode) ===
  var simulationTimer = null;
  var simulationProgress = 0;

  function simulatePlayback(song) {
    cancelSimulation();
    simulationProgress = 0;
    var duration = song.durationSec;

    function tick() {
      if (!state.isPlaying) return;
      simulationProgress += 1;
      var pct = Math.min((simulationProgress / duration) * 100, 100);
      elements.playerProgress.style.width = pct + "%";

      if (simulationProgress >= duration) {
        playNext();
        return;
      }
      simulationTimer = setTimeout(tick, 1000);
    }

    simulationTimer = setTimeout(tick, 1000);
  }

  function cancelSimulation() {
    if (simulationTimer) {
      clearTimeout(simulationTimer);
      simulationTimer = null;
    }
  }

  // === Player UI Updates ===
  function updatePlayerUI() {
    if (state.currentSong) {
      elements.playerSongTitle.textContent = state.currentSong.title;
      elements.playerSongArtist.textContent = state.currentSong.artist;

      // Update artwork color
      elements.playerArtwork.innerHTML =
        '<div class="artwork-color" style="background:' +
        escapeHTML(state.currentSong.color) +
        '">' +
        '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" fill="rgba(255,255,255,0.6)"/></svg>' +
        "</div>";
    }

    // Play/Pause icons
    if (state.isPlaying) {
      elements.playIcon.style.display = "none";
      elements.pauseIcon.style.display = "block";
    } else {
      elements.playIcon.style.display = "block";
      elements.pauseIcon.style.display = "none";
    }
  }

  function updatePlayingState() {
    // Update all song items
    var items = document.querySelectorAll(".song-item");
    items.forEach(function (item) {
      var id = parseInt(item.dataset.id, 10);
      item.classList.toggle(
        "playing",
        state.currentSong && state.currentSong.id === id
      );
    });
  }

  // === Playlist Management ===
  function togglePlaylist(song) {
    var idx = state.playlist.findIndex(function (s) {
      return s.id === song.id;
    });

    if (idx > -1) {
      state.playlist.splice(idx, 1);
      showToast("Removed from playlist");
    } else {
      state.playlist.push(song);
      showToast("Added to playlist");
    }

    savePlaylist();

    // Re-render current view to update button states
    showTab(state.currentTab);
  }

  function savePlaylist() {
    try {
      var ids = state.playlist.map(function (s) {
        return s.id;
      });
      localStorage.setItem("sangeet_playlist", JSON.stringify(ids));
    } catch (e) {
      // Storage not available
    }
  }

  function loadPlaylist() {
    try {
      var data = localStorage.getItem("sangeet_playlist");
      if (data) {
        var ids = JSON.parse(data);
        state.playlist = ids
          .map(function (id) {
            return songCatalog.find(function (s) {
              return s.id === id;
            });
          })
          .filter(Boolean);
      }
    } catch (e) {
      // Storage not available
    }
  }

  // === Audio Player Events ===
  elements.audioPlayer.addEventListener("timeupdate", function () {
    if (elements.audioPlayer.duration) {
      var pct =
        (elements.audioPlayer.currentTime / elements.audioPlayer.duration) *
        100;
      elements.playerProgress.style.width = pct + "%";
    }
  });

  elements.audioPlayer.addEventListener("ended", function () {
    playNext();
  });

  // === Progress Bar Seek ===
  elements.playerProgressBar.addEventListener("click", function (e) {
    if (!state.currentSong) return;
    var rect = elements.playerProgressBar.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;

    if (state.currentSong.src && elements.audioPlayer.duration) {
      elements.audioPlayer.currentTime =
        pct * elements.audioPlayer.duration;
    } else {
      // Simulation seek
      simulationProgress = Math.floor(
        pct * state.currentSong.durationSec
      );
      elements.playerProgress.style.width = pct * 100 + "%";
    }
  });

  // === Event Listeners ===
  // Search toggle
  elements.searchToggleBtn.addEventListener("click", function () {
    elements.searchBar.classList.toggle("active");
    if (elements.searchBar.classList.contains("active")) {
      elements.searchInput.focus();
    } else {
      elements.searchInput.value = "";
      elements.searchClearBtn.classList.remove("visible");
      hideSearchResults();
    }
  });

  // Search input
  var searchTimeout;
  elements.searchInput.addEventListener("input", function () {
    var val = elements.searchInput.value;
    elements.searchClearBtn.classList.toggle("visible", val.length > 0);

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      if (val.trim()) {
        renderSearchResults(val);
      } else {
        hideSearchResults();
      }
    }, 300);
  });

  // Search clear
  elements.searchClearBtn.addEventListener("click", function () {
    elements.searchInput.value = "";
    elements.searchClearBtn.classList.remove("visible");
    hideSearchResults();
    elements.searchInput.focus();
  });

  // Tab navigation
  elements.tabNav.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    showTab(btn.dataset.tab);
  });

  // Player controls
  elements.playPauseBtn.addEventListener("click", togglePlayPause);
  elements.nextBtn.addEventListener("click", playNext);
  elements.prevBtn.addEventListener("click", playPrev);

  // Video close
  elements.videoCloseBtn.addEventListener("click", closeVideo);

  // Close video on escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeVideo();
    }
  });

  // === Initialize ===
  function init() {
    loadPlaylist();
    showTab("browse");
  }

  init();
})();
