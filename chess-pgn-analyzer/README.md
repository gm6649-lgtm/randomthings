# Chess PGN Analyzer

A browser-based chess game analyzer that uses the **Stockfish** engine at
**depth 16** to classify every move in a game — exactly like chess.com, with
**brilliant**, great, best, excellent, good, inaccuracy, mistake, and blunder
classifications.

## Features

| Feature | Details |
|---|---|
| Engine | Stockfish 16 (loaded via CDN, runs in a Web Worker) |
| Analysis depth | 16 half-moves |
| Move classifications | Brilliant 💎 · Great ! · Best ⊕ · Excellent ! · Good ● · Inaccuracy ?! · Mistake ? · Blunder ?? · Forced |
| Brilliant move detection | Piece sacrifice where the opponent can recapture but the position improves |
| Best-move highlighting | Blue squares show the engine's top choice when it differs from what was played |
| Evaluation bar | Vertical bar showing White / Black advantage, logistic-scaled |
| Engine lines | Top 3 continuations shown per move |
| Multi-game PGN | Paste any PGN — multiple games are split automatically (first game is analysed) |
| Board style | Classic tournament colours — light `#f0d9b5` / dark `#b58863` with cburnett pieces |
| Keyboard navigation | ← → arrow keys to step through moves |

## Quickstart

Because Stockfish is loaded as a Web Worker from a CDN, the page must be
served over **HTTP** (not opened directly as a `file://` URL).

### Option A — Python (no install needed)

```bash
cd chess-pgn-analyzer
python3 -m http.server 8080
# open http://localhost:8080 in your browser
```

### Option B — Node.js `serve`

```bash
npx serve chess-pgn-analyzer
```

### Option C — VS Code Live Server

Install the "Live Server" extension, right-click `index.html` → **Open with
Live Server**.

## How to Use

1. Open the app in your browser.
2. Paste a PGN into the text area (or click **Load sample game** to try the
   Immortal Game).
3. Click **Analyze**.  
   The engine loads once (≈ 1–3 s) and then analyses each position sequentially.
   A progress bar shows the current position being evaluated.
4. Once complete, the analysis view appears:
   - **Left panel** — clickable move list with classification symbols and
     evaluations.
   - **Centre** — chess board. The last move is highlighted in green; the
     engine's best move (when different) is shown in blue.
   - **Eval bar** — vertical bar on the left of the board; white section grows
     as White's advantage increases.
   - **Right panel** — classification detail, best move, and top 3 engine
     continuations for the selected move.
   - **Game Summary** — count of each classification type across the game.
5. Use the ← → navigation buttons (or keyboard arrow keys) to step through
   moves.
6. Click **New Analysis** / **← Back** to analyse another game.

## Move Classification Logic

| Classification | Centipawn loss from best | Additional condition |
|---|---|---|
| Brilliant 💎 | ≤ 0.10 | Piece sacrifice (can be captured) that improves position |
| Great ! | ≤ 0 (best move) | Next-best alternative ≥ 1.5 pawns worse |
| Best ⊕ | ≤ 0 | — |
| Excellent ! | ≤ 0.10 | — |
| Good ● | ≤ 0.50 | — |
| Inaccuracy ?! | ≤ 1.00 | — |
| Mistake ? | ≤ 2.00 | — |
| Blunder ?? | > 2.00 | — |
| Forced | — | Only one legal move available |

## Technical Notes

- Chess logic (PGN parsing, move generation) uses
  [chess.js 0.10.3](https://github.com/jhlywa/chess.js) loaded from a CDN.
- Stockfish is fetched from jsDelivr and turned into a Blob URL so it can run
  as a same-origin Web Worker without any build step.
- Piece graphics come from the
  [Lichess cburnett piece set](https://github.com/ornicar/lila/tree/master/public/piece/cburnett)
  via the Lichess CDN.
- No frameworks, no build step, no npm install required.
