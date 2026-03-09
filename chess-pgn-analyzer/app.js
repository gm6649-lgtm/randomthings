/**
 * Chess PGN Analyzer
 * Analyzes chess games using Stockfish (depth 16) and classifies each move
 * in the style of chess.com (brilliant / great / best / excellent / good /
 * inaccuracy / mistake / blunder).
 */
'use strict';

/* ============================================================
   CONSTANTS
   ============================================================ */

const ANALYSIS_DEPTH = 16;
const NUM_LINES      = 3;   // MultiPV – how many top continuations to retrieve
const PIECE_BASE_URL = 'https://lichess1.org/assets/piece/cburnett/';

/** Stockfish source URLs tried in order. */
const STOCKFISH_URLS = [
  'https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish-16-single.js',
  'https://cdn.jsdelivr.net/npm/stockfish@10.0.0/stockfish.js',
];

/**
 * Centipawn-loss thresholds for move classification.
 * evalLoss = bestEvalForMover − playedEvalForMover  (always ≥ 0)
 */
const CP_THRESHOLDS = {
  EXCELLENT:  10,   // ≤ 0.10 pawns
  GOOD:       50,   // ≤ 0.50 pawns
  INACCURACY: 100,  // ≤ 1.00 pawn
  MISTAKE:    200,  // ≤ 2.00 pawns
  // > MISTAKE → blunder
};

/** Display metadata for each classification. */
const CLASSIFY = {
  brilliant:  { label: 'Brilliant',   symbol: '!!', icon: '💎', color: '#1baca6' },
  great:      { label: 'Great Move',  symbol: '!',  icon: '!',  color: '#5c8a3c' },
  best:       { label: 'Best',        symbol: '⊕',  icon: '⊕',  color: '#5c8a3c' },
  excellent:  { label: 'Excellent',   symbol: '!',  icon: '!',  color: '#96bc4b' },
  good:       { label: 'Good',        symbol: '',   icon: '●',  color: '#96bc4b' },
  inaccuracy: { label: 'Inaccuracy',  symbol: '?!', icon: '?!', color: '#f6b427' },
  mistake:    { label: 'Mistake',     symbol: '?',  icon: '?',  color: '#e87b18' },
  blunder:    { label: 'Blunder',     symbol: '??', icon: '??', color: '#ca3431' },
  forced:     { label: 'Forced',      symbol: '',   icon: '↦',  color: '#888888' },
  book:       { label: 'Book',        symbol: '',   icon: '📖', color: '#888888' },
};

/* ============================================================
   STOCKFISH ENGINE WRAPPER
   ============================================================ */

class StockfishEngine {
  constructor() {
    this.worker   = null;
    this.ready    = false;
    this._lines   = [];
    this._resolve = null;
    this._reject  = null;
    this._timer   = null;
  }

  /** Load and initialise the Stockfish worker. */
  async init(onStatus) {
    onStatus?.('Loading Stockfish engine…');

    for (const url of STOCKFISH_URLS) {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) continue;
        const blob    = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        this.worker   = new Worker(blobUrl);
        break;
      } catch (_) { /* try next */ }
    }

    if (!this.worker) {
      throw new Error(
        'Could not load Stockfish. Check your internet connection and try again.'
      );
    }

    this.worker.onerror = (e) => {
      console.error('Stockfish error:', e);
      this._reject?.(new Error('Stockfish worker error'));
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Stockfish initialisation timed out')), 15000
      );

      this.worker.onmessage = ({ data }) => {
        const msg = typeof data === 'string' ? data : String(data ?? '');
        if (msg === 'uciok') {
          this.worker.postMessage(`setoption name MultiPV value ${NUM_LINES}`);
          this.worker.postMessage('isready');
          onStatus?.('Engine initialising…');
        }
        if (msg === 'readyok') {
          clearTimeout(timeout);
          this.ready              = true;
          this.worker.onmessage   = ({ data: d }) => this._onMessage(d);
          onStatus?.('Engine ready');
          resolve();
        }
      };

      this.worker.postMessage('uci');
    });
  }

  _onMessage(data) {
    const msg = typeof data === 'string' ? data : String(data ?? '');

    /* ── Collect "info" lines (PV updates) ── */
    if (msg.startsWith('info') && msg.includes(' pv ')) {
      const info = this._parseInfo(msg);
      if (info) {
        const idx = this._lines.findIndex(l => l.multipv === info.multipv);
        if (idx >= 0) {
          this._lines[idx] = info;
        } else {
          this._lines.push(info);
          this._lines.sort((a, b) => a.multipv - b.multipv);
        }
      }
    }

    /* ── "bestmove" means search is finished ── */
    if (msg.startsWith('bestmove')) {
      if (this._timer) { clearTimeout(this._timer); this._timer = null; }
      const parts    = msg.split(' ');
      const bestMove = (parts[1] === '(none)' || !parts[1]) ? null : parts[1];
      const result   = { bestMove, lines: [...this._lines] };
      const fn       = this._resolve;
      this._resolve  = null;
      this._reject   = null;
      fn?.(result);
    }
  }

  _parseInfo(msg) {
    try {
      const multipv    = parseInt(msg.match(/\bmultipv (\d+)/)?.[1]  ?? '1', 10);
      const depth      = parseInt(msg.match(/\bdepth (\d+)/)?.[1]    ?? '0', 10);
      const scoreM     = msg.match(/\bscore (cp|mate) (-?\d+)/);
      const pvM        = msg.match(/\bpv ([\w\s]+?)(?=\s+(?:bmc|hashfull|tbhits|time\b|nodes\b|nps\b|seldepth\b)|$)/);
      if (!scoreM || !pvM) return null;

      const scoreType  = scoreM[1];
      const scoreVal   = parseInt(scoreM[2], 10);
      const pv         = pvM[1].trim().split(/\s+/);

      const evalCP = scoreType === 'mate'
        ? (scoreVal > 0 ? 99999 - scoreVal * 10 : -99999 - scoreVal * 10)
        : scoreVal;

      return {
        multipv,
        depth,
        evalCP,
        isMate:  scoreType === 'mate',
        mateIn:  scoreType === 'mate' ? scoreVal : null,
        move:    pv[0],
        pv,
      };
    } catch (_) { return null; }
  }

  /**
   * Analyse a FEN position at ANALYSIS_DEPTH.
   * Resolves with { bestMove, lines[] }.
   */
  analyze(fen) {
    if (!this.ready) return Promise.reject(new Error('Engine not ready'));
    this._lines = [];

    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject  = reject;

      /* safety timeout – 45 s per position */
      this._timer = setTimeout(() => {
        this.worker.postMessage('stop');
      }, 45000);

      this.worker.postMessage('stop');
      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${ANALYSIS_DEPTH}`);
    });
  }

  stop()      { this.worker?.postMessage('stop'); }
  terminate() { this.worker?.terminate(); this.worker = null; this.ready = false; }
}

/* ============================================================
   MOVE CLASSIFIER
   ============================================================ */

/**
 * Classify a played move.
 *
 * @param {Array}  beforeLines  – engine lines for position BEFORE the move
 * @param {Array}  afterLines   – engine lines for position AFTER the move
 * @param {string} playedUCI    – played move in UCI format (e.g. "e2e4")
 * @param {string} fenBefore    – FEN of the position before the move
 * @returns {string} classification key
 */
function classifyMove(beforeLines, afterLines, playedUCI, fenBefore) {
  if (!beforeLines?.length) return 'good';

  const chess      = new Chess(fenBefore);
  const legalMoves = chess.moves();
  if (legalMoves.length === 0) return 'forced';
  if (legalMoves.length === 1) return 'forced';

  const bestLine    = beforeLines[0];
  const bestEvalCP  = bestLine.evalCP;

  /* The score after the played move is from the OPPONENT's perspective.
     Negate to express it from the mover's perspective. */
  const afterEvalCP        = afterLines?.[0]?.evalCP ?? 0;
  const playedEvalForMover = -afterEvalCP;
  const evalLoss           = bestEvalCP - playedEvalForMover;

  /* ── Brilliant: near-best AND a genuine sacrifice ── */
  if (evalLoss <= CP_THRESHOLDS.EXCELLENT) {
    if (isSacrifice(chess, playedUCI, bestEvalCP, afterEvalCP)) {
      return 'brilliant';
    }
  }

  /* ── Great: best move AND the next-best alternative is significantly worse ── */
  if (evalLoss <= 0 && beforeLines.length >= 2) {
    const secondEvalCP = beforeLines[1].evalCP;
    const gap          = bestEvalCP - secondEvalCP;
    /* gap ≥ 1.5 pawns means this was effectively the only good move */
    if (gap >= 150 && Math.abs(bestEvalCP) < 800) {
      return 'great';
    }
  }

  /* ── Standard centipawn-loss classification ── */
  if (evalLoss <= 0)                             return 'best';
  if (evalLoss <= CP_THRESHOLDS.EXCELLENT)       return 'excellent';
  if (evalLoss <= CP_THRESHOLDS.GOOD)            return 'good';
  if (evalLoss <= CP_THRESHOLDS.INACCURACY)      return 'inaccuracy';
  if (evalLoss <= CP_THRESHOLDS.MISTAKE)         return 'mistake';
  return 'blunder';
}

/**
 * Detect whether a UCI move is a "sacrifice":
 *   – moves a piece (N/B/R/Q) to a square where the opponent can capture it,
 *   – without capturing something of equal or greater value,
 *   – and the position nevertheless improves for the mover.
 */
function isSacrifice(chess, uciMove, evalBeforeCP, afterOpponentEvalCP) {
  if (!uciMove || uciMove.length < 4) return false;

  const from  = uciMove.slice(0, 2);
  const to    = uciMove.slice(2, 4);
  const promo = uciMove.length > 4 ? uciMove[4] : undefined;

  const piece = chess.get(from);
  if (!piece)          return false;
  if (piece.type === 'p') return false;  // pawn moves are not "sacrifices" here

  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  /* If we are capturing something of equal or higher value it is an exchange,
     not a sacrifice. */
  const captured = chess.get(to);
  if (captured && pieceValues[captured.type] >= pieceValues[piece.type]) {
    return false;
  }

  /* Make the move on a scratch board. */
  const boardAfter = new Chess(chess.fen());
  const moveResult = boardAfter.move({ from, to, promotion: promo });
  if (!moveResult) return false;

  /* Opponent must be able to capture the moved piece. */
  const opponentMoves = boardAfter.moves({ verbose: true });
  const canCapture    = opponentMoves.some(m => m.to === to);
  if (!canCapture) return false;

  /* Position must have improved for the mover despite the apparent material loss.
     afterOpponentEvalCP > 0  ⇒  opponent is winning  ⇒  mover is losing.
     We want  -afterOpponentEvalCP  (mover's score after)  >  evalBeforeCP  (mover's score before). */
  const moverScoreAfter = -afterOpponentEvalCP;
  return moverScoreAfter > evalBeforeCP - 20;  // improved or nearly the same
}

/* ============================================================
   EVALUATION HELPERS
   ============================================================ */

/**
 * Convert a UCI engine score (relative to side to move) to an
 * absolute centipawn value from White's perspective.
 *
 * @param {number}  evalCP      – engine score (relative to side to move)
 * @param {string}  colorToMove – 'w' or 'b'
 */
function toAbsoluteCP(evalCP, colorToMove) {
  return colorToMove === 'w' ? evalCP : -evalCP;
}

/** Format an absolute centipawn value for display. */
function formatEvalAbsolute(absCP, isMate, mateInAbsolute) {
  if (isMate) {
    return mateInAbsolute > 0 ? `M${mateInAbsolute}` : `-M${Math.abs(mateInAbsolute)}`;
  }
  const pawns = absCP / 100;
  return pawns >= 0 ? `+${pawns.toFixed(2)}` : pawns.toFixed(2);
}

/** Format a line eval (engine-relative, not absolute). */
function formatLineEval(line) {
  if (!line) return '';
  if (line.isMate) {
    return line.mateIn > 0 ? `M${line.mateIn}` : `-M${Math.abs(line.mateIn)}`;
  }
  const p = line.evalCP / 100;
  return p >= 0 ? `+${p.toFixed(2)}` : p.toFixed(2);
}

/**
 * Convert a UCI move string to SAN in a given position.
 * Returns the UCI string unchanged if conversion fails.
 */
function uciToSan(uci, fen) {
  if (!uci) return '';
  try {
    const c = new Chess(fen);
    const m = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    return m ? m.san : uci;
  } catch (_) { return uci; }
}

/* ============================================================
   EVAL BAR
   ============================================================ */

/**
 * Update the vertical evaluation bar.
 * @param {number} absCP – evaluation from White's perspective (cp). Mate ≥ 99000.
 */
function updateEvalBar(absCP) {
  const bar        = document.getElementById('eval-bar');
  const labelEl    = document.getElementById('eval-label');
  if (!bar || !labelEl) return;

  let whitePct, labelText;

  if (Math.abs(absCP) >= 99000) {
    whitePct  = absCP > 0 ? 99 : 1;
    const n   = Math.round((99999 - Math.abs(absCP)) / 10);
    labelText = absCP > 0 ? `M${n}` : `-M${n}`;
  } else {
    /* logistic-like mapping so ±5 pawns fills ~90 % of the bar */
    const k  = 0.003;
    whitePct = 50 + 50 * Math.tanh(absCP * k);
    whitePct = Math.max(1, Math.min(99, whitePct));
    const p  = absCP / 100;
    labelText = p >= 0 ? `+${p.toFixed(1)}` : p.toFixed(1);
  }

  const blackSection = bar.querySelector('.eval-black-section');
  const whiteSection = bar.querySelector('.eval-white-section');
  if (blackSection) blackSection.style.height = `${100 - whitePct}%`;
  if (whiteSection) whiteSection.style.height = `${whitePct}%`;
  labelEl.textContent = labelText;
}

/* ============================================================
   BOARD RENDERER
   ============================================================ */

class BoardRenderer {
  constructor(container) {
    this.container = container;
    this._grid     = null;
    this._build();
  }

  _build() {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'board-grid';

    for (let rankIdx = 7; rankIdx >= 0; rankIdx--) {
      for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
        const sq    = document.createElement('div');
        const isLight = (rankIdx + fileIdx) % 2 !== 0;
        sq.className  = `sq ${isLight ? 'sq-light' : 'sq-dark'}`;
        sq.dataset.sq = String.fromCharCode(97 + fileIdx) + (rankIdx + 1);

        /* rank labels on the left edge */
        if (fileIdx === 0) {
          const lbl = document.createElement('span');
          lbl.className   = 'lbl-rank';
          lbl.textContent = rankIdx + 1;
          sq.appendChild(lbl);
        }
        /* file labels on the bottom edge */
        if (rankIdx === 0) {
          const lbl = document.createElement('span');
          lbl.className   = 'lbl-file';
          lbl.textContent = String.fromCharCode(97 + fileIdx);
          sq.appendChild(lbl);
        }

        grid.appendChild(sq);
      }
    }

    this.container.appendChild(grid);
    this._grid = grid;
  }

  /**
   * Render a FEN position, optionally highlighting the last move and best move.
   *
   * @param {string}      fen       – FEN to render
   * @param {object|null} lastMove  – { from, to } for highlighting
   * @param {string|null} bestMove  – UCI best move (shown in blue when differs from lastMove)
   */
  render(fen, lastMove = null, bestMove = null) {
    const chess = new Chess(fen);
    const board = chess.board();   // 8×8 array [rank8..rank1][file a..h]

    /* clear all highlights and existing pieces */
    this._grid.querySelectorAll('.sq').forEach(sq => {
      sq.classList.remove('sq-hl-last', 'sq-hl-best');
      const p = sq.querySelector('.piece');
      if (p) p.remove();
    });

    /* place pieces */
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[7 - rank][file];
        if (!piece) continue;
        const sqName = String.fromCharCode(97 + file) + (rank + 1);
        const sqEl   = this._grid.querySelector(`[data-sq="${sqName}"]`);
        if (!sqEl) continue;
        const img       = document.createElement('img');
        img.className   = 'piece';
        img.src         = `${PIECE_BASE_URL}${piece.color}${piece.type.toUpperCase()}.svg`;
        img.alt         = piece.color + piece.type;
        img.draggable   = false;
        sqEl.appendChild(img);
      }
    }

    /* highlight last move */
    if (lastMove?.from) {
      this._highlight(lastMove.from, 'sq-hl-last');
      this._highlight(lastMove.to,   'sq-hl-last');
    }

    /* highlight best move (when it differs from played) */
    if (bestMove && lastMove) {
      const bFrom = bestMove.slice(0, 2);
      const bTo   = bestMove.slice(2, 4);
      if (bFrom !== lastMove.from || bTo !== lastMove.to) {
        this._highlight(bFrom, 'sq-hl-best');
        this._highlight(bTo,   'sq-hl-best');
      }
    }
  }

  _highlight(sqName, cls) {
    const el = this._grid.querySelector(`[data-sq="${sqName}"]`);
    if (el) el.classList.add(cls);
  }
}

/* ============================================================
   PGN PARSING HELPERS
   ============================================================ */

/**
 * Split a string containing one or more PGN games into individual game texts.
 */
function splitPGNGames(raw) {
  /* Each game starts with a PGN tag section (lines beginning with '[') */
  return raw
    .split(/\n(?=\[)/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Parse a single PGN text into { headers, moves, positions }.
 * Returns null if parsing fails.
 */
function parseSinglePGN(pgnText) {
  const chess = new Chess();
  if (!chess.load_pgn(pgnText, { sloppy: true })) return null;

  const headers = chess.header();
  const moves   = chess.history({ verbose: true });

  /* replay from the start (respecting a [FEN "..."] header) */
  chess.reset();
  if (headers['FEN']) {
    chess.load(headers['FEN']);
  }

  const positions = [{ fen: chess.fen(), move: null }];
  for (const mv of moves) {
    chess.move(mv);
    positions.push({ fen: chess.fen(), move: mv });
  }

  return { headers, moves, positions };
}

/* ============================================================
   MAIN APPLICATION CONTROLLER
   ============================================================ */

class ChessAnalyzerApp {
  constructor() {
    this.engine       = null;
    this.board        = null;
    this.gameResult   = null;   // analysis result for the currently viewed game
    this.currentIdx   = -1;     // index into moveAnalysis array (1-based)
    this.analysisRunning = false;
    this._cancelFlag  = false;

    this._initBoard();
    this._bindEvents();
    updateEvalBar(0);
  }

  /* ── UI setup ── */

  _initBoard() {
    this.board = new BoardRenderer(document.getElementById('board-container'));
    this.board.render(new Chess().fen());
  }

  _bindEvents() {
    document.getElementById('btn-analyze').addEventListener('click', () => this._startAnalysis());
    document.getElementById('btn-sample').addEventListener('click', () => {
      document.getElementById('pgn-input').value = SAMPLE_PGN;
    });
    document.getElementById('btn-new').addEventListener('click',   () => this._showInput());
    document.getElementById('btn-back').addEventListener('click',  () => this._showInput());
    document.getElementById('btn-cancel').addEventListener('click',   () => this._cancel());
    document.getElementById('btn-cancel-2').addEventListener('click', () => this._cancel());
    document.getElementById('btn-prev').addEventListener('click',  () => this._navigate(-1));
    document.getElementById('btn-next').addEventListener('click',  () => this._navigate(+1));
    document.getElementById('btn-first').addEventListener('click', () => this._navigateTo(0));
    document.getElementById('btn-last').addEventListener('click',  () => {
      if (this.gameResult) {
        this._navigateTo(this.gameResult.moveAnalysis.length - 1);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft')  this._navigate(-1);
      if (e.key === 'ArrowRight') this._navigate(+1);
    });
  }

  /* ── Analysis flow ── */

  async _startAnalysis() {
    const pgn = document.getElementById('pgn-input').value.trim();
    if (!pgn) { this._showError('Please paste a PGN to analyze.'); return; }

    this._cancelFlag     = false;
    this.analysisRunning = true;
    this._setButtons(true);
    this._setProgress(0, 'Initialising engine…');

    try {
      /* Load engine once */
      if (!this.engine?.ready) {
        this.engine = new StockfishEngine();
        await this.engine.init(msg => this._setStatus(msg));
      }

      /* Parse PGN */
      const gameTexts = splitPGNGames(pgn);
      if (!gameTexts.length) throw new Error('No valid PGN found.');

      const game = parseSinglePGN(gameTexts[0]);
      if (!game) throw new Error('Failed to parse PGN. Check the format and try again.');

      /* Analyse */
      const result = await this._analyzeGame(game);
      if (!this._cancelFlag) {
        this.gameResult = result;
        /* Switch to analysis view, then populate */
        this._showSection('analysis');
        document.getElementById('progress-analysis').style.display = 'none';
        this._renderResults(result);
        this._navigateTo(0);
        this._setProgress(100, 'Analysis complete ✓');
      }
    } catch (err) {
      this._showError(err.message);
      console.error(err);
    } finally {
      this.analysisRunning = false;
      this._setButtons(false);
    }
  }

  async _analyzeGame(game) {
    const { positions, headers } = game;
    const total    = positions.length;
    const rawData  = [];          // one entry per position (including start)

    for (let i = 0; i < total; i++) {
      if (this._cancelFlag) break;

      const pct = Math.round((i / total) * 100);
      this._setProgress(pct, `Analysing position ${i + 1} / ${total}…`);

      const { fen } = positions[i];
      const res     = await this.engine.analyze(fen);
      rawData.push({ fen, move: positions[i].move, ...res });
    }

    /* Build per-move analysis entries */
    const moveAnalysis = [];
    for (let i = 1; i < rawData.length; i++) {
      const before     = rawData[i - 1];
      const after      = rawData[i];
      const playedMove = positions[i].move;
      if (!playedMove) continue;

      const uci = playedMove.from + playedMove.to + (playedMove.promotion || '');

      /* Classify */
      const classification = classifyMove(before.lines, after.lines, uci, before.fen);

      /* Absolute eval AFTER the move (from White's perspective) */
      const afterRelCP  = after.lines[0]?.evalCP ?? 0;
      const colorToMove = after.fen.split(' ')[1];          // who moves AFTER the played move
      const absCP       = toAbsoluteCP(afterRelCP, colorToMove);

      moveAnalysis.push({
        index:          i,
        moveNumber:     Math.ceil(i / 2),
        color:          playedMove.color,
        san:            playedMove.san,
        uci,
        classification,
        fen:            before.fen,
        fenAfter:       after.fen,
        lastMove:       { from: playedMove.from, to: playedMove.to },
        bestMove:       before.bestMove,          // UCI
        bestLines:      before.lines,
        afterLines:     after.lines,
        absCP,
        afterLine0:     after.lines[0] ?? null,
      });
    }

    return { headers, moveAnalysis, positions, rawData };
  }

  /* ── Result rendering ── */

  _renderResults(result) {
    const { headers, moveAnalysis } = result;

    /* game info bar */
    document.getElementById('game-white').textContent = headers['White'] || 'White';
    document.getElementById('game-black').textContent = headers['Black'] || 'Black';
    document.getElementById('game-event').textContent = headers['Event'] || '';
    document.getElementById('game-date').textContent  = headers['Date']  || '';

    /* move list */
    const listEl = document.getElementById('move-list');
    listEl.innerHTML = '';

    let lastMoveNumEl = null;

    for (const ma of moveAnalysis) {
      const cfg  = CLASSIFY[ma.classification] ?? CLASSIFY.good;

      /* move number label (for white moves) */
      if (ma.color === 'w') {
        const row = document.createElement('div');
        row.className     = 'movelist-row';

        const numSpan = document.createElement('span');
        numSpan.className = 'move-num';
        numSpan.textContent = `${ma.moveNumber}.`;
        row.appendChild(numSpan);

        listEl.appendChild(row);
        lastMoveNumEl = row;
      }

      const item = document.createElement('div');
      item.className  = `move-item move-${ma.classification}`;
      item.dataset.idx = ma.index;

      const text  = document.createElement('span');
      text.className = 'move-text';
      text.textContent = ma.san;

      const badge = document.createElement('span');
      badge.className   = `move-badge badge-${ma.classification}`;
      badge.textContent = cfg.symbol;
      badge.title       = cfg.label;

      const evalSp = document.createElement('span');
      evalSp.className = 'move-eval';
      if (ma.afterLine0?.isMate) {
        const mateAbsolute = ma.color === 'w'
          ? -(ma.afterLine0.mateIn ?? 0)
          :  (ma.afterLine0.mateIn ?? 0);
        evalSp.textContent = mateAbsolute > 0 ? `M${mateAbsolute}` : `-M${Math.abs(mateAbsolute)}`;
      } else {
        const p = ma.absCP / 100;
        evalSp.textContent = p >= 0 ? `+${p.toFixed(1)}` : p.toFixed(1);
      }

      item.appendChild(text);
      item.appendChild(badge);
      item.appendChild(evalSp);
      item.addEventListener('click', () => this._selectMove(ma.index));

      /* append white & black items side-by-side in the same row */
      if (ma.color === 'w' && lastMoveNumEl) {
        lastMoveNumEl.appendChild(item);
      } else if (ma.color === 'b' && lastMoveNumEl) {
        lastMoveNumEl.appendChild(item);
      } else {
        listEl.appendChild(item);
      }
    }

    /* statistics */
    this._renderStats(moveAnalysis);
  }

  _renderStats(moveAnalysis) {
    const counts = {};
    for (const ma of moveAnalysis) {
      counts[ma.classification] = (counts[ma.classification] ?? 0) + 1;
    }
    const order = ['brilliant','great','best','excellent','good','inaccuracy','mistake','blunder'];
    const statsEl = document.getElementById('game-stats');
    statsEl.innerHTML = '';
    for (const key of order) {
      if (!counts[key]) continue;
      const cfg  = CLASSIFY[key];
      const item = document.createElement('div');
      item.className = 'stat-item';
      item.style.borderColor = cfg.color;
      item.style.color       = cfg.color;
      item.innerHTML = `
        <span class="stat-icon">${cfg.icon}</span>
        <span class="stat-count">${counts[key]}</span>
        <span class="stat-label">${cfg.label}</span>
      `;
      statsEl.appendChild(item);
    }
  }

  /* ── Move navigation ── */

  _selectMove(idx) {
    this.currentIdx = idx;
    const result    = this.gameResult;
    if (!result) return;

    const ma = result.moveAnalysis.find(m => m.index === idx);
    if (!ma) {
      /* show starting position */
      this.board.render(result.positions[0].fen);
      updateEvalBar(0);
      return;
    }

    /* render board */
    const showBest =
      ma.classification !== 'best' &&
      ma.classification !== 'brilliant' &&
      ma.classification !== 'great' &&
      ma.classification !== 'forced';

    this.board.render(
      ma.fenAfter,
      ma.lastMove,
      showBest ? ma.bestMove : null
    );

    /* update eval bar */
    updateEvalBar(ma.absCP);

    /* update move detail panel */
    this._updateDetail(ma);

    /* highlight active item in move list */
    document.querySelectorAll('.move-item').forEach(el => el.classList.remove('active'));
    const active = document.querySelector(`.move-item[data-idx="${idx}"]`);
    if (active) {
      active.classList.add('active');
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  _navigate(direction) {
    if (!this.gameResult) return;
    const { moveAnalysis } = this.gameResult;
    if (!moveAnalysis.length) return;

    const min    = moveAnalysis[0].index;
    const max    = moveAnalysis[moveAnalysis.length - 1].index;
    const newIdx = Math.max(min, Math.min(max, this.currentIdx + direction));
    if (newIdx !== this.currentIdx) this._selectMove(newIdx);
  }

  _navigateTo(offset) {
    if (!this.gameResult) return;
    const { moveAnalysis } = this.gameResult;
    if (!moveAnalysis.length) return;
    const ma = moveAnalysis[Math.max(0, Math.min(offset, moveAnalysis.length - 1))];
    this._selectMove(ma.index);
  }

  /* ── Detail panel ── */

  _updateDetail(ma) {
    const panel = document.getElementById('move-detail');
    if (!panel) return;

    const cfg      = CLASSIFY[ma.classification] ?? CLASSIFY.good;
    const moveStr  = ma.color === 'w'
      ? `${ma.moveNumber}. ${ma.san}`
      : `${ma.moveNumber}… ${ma.san}`;

    const isMate   = ma.afterLine0?.isMate ?? false;
    const mateAbs  = isMate
      ? (ma.color === 'w' ? -(ma.afterLine0.mateIn ?? 0) : (ma.afterLine0.mateIn ?? 0))
      : null;
    const evalStr  = formatEvalAbsolute(ma.absCP, isMate, mateAbs);

    const bestSAN  = (ma.bestMove && ma.bestMove !== ma.uci)
      ? uciToSan(ma.bestMove, ma.fen)
      : null;

    /* top engine lines */
    const linesHTML = (ma.bestLines ?? []).slice(0, 3).map((line, i) => {
      const ev    = formatLineEval(line);
      const evCls = line.evalCP > 20 ? 'pos' : line.evalCP < -20 ? 'neg' : 'eq';
      const pvSAN = lineToPGNSnippet(line.pv ?? [], ma.fen, 5);
      return `
        <div class="detail-line">
          <span class="line-rank">${i + 1}.</span>
          <span class="line-eval ${evCls}">${ev}</span>
          <span class="line-pv">${pvSAN}</span>
        </div>`;
    }).join('');

    panel.innerHTML = `
      <div class="detail-move">${moveStr}</div>
      <div class="detail-classification" style="color:${cfg.color}">
        ${cfg.icon} ${cfg.label}
      </div>
      <div class="detail-eval">Evaluation: <strong>${evalStr}</strong></div>
      ${bestSAN ? `
        <div class="detail-best-label">Best move</div>
        <div class="detail-best-move">${bestSAN}</div>
      ` : ''}
      ${linesHTML ? `
        <div class="detail-lines-label">Engine lines</div>
        ${linesHTML}
      ` : ''}
    `;
  }

  /* ── UI state helpers ── */

  _showSection(which) {
    const inputSec    = document.getElementById('input-section');
    const analysisSec = document.getElementById('analysis-section');
    if (which === 'analysis') {
      inputSec.style.display    = 'none';
      analysisSec.style.display = 'flex';
    } else {
      inputSec.style.display    = 'flex';
      analysisSec.style.display = 'none';
    }
  }

  _showInput() {
    this._cancel();
    this._showSection('input');
  }

  _cancel() {
    this._cancelFlag = true;
    this.engine?.stop();
    this._setButtons(false);
    this._setStatus('Cancelled.');
    document.getElementById('progress-analysis').style.display = 'none';
  }

  _setButtons(isAnalyzing) {
    document.getElementById('btn-analyze').style.display  = isAnalyzing ? 'none'  : 'inline-flex';
    document.getElementById('btn-cancel').style.display   = isAnalyzing ? 'inline-flex' : 'none';
    document.getElementById('progress-area').style.display = isAnalyzing ? 'block' : 'none';
  }

  _setProgress(pct, msg) {
    document.getElementById('progress-bar').style.width = `${pct}%`;
    this._setStatus(msg);
  }

  _setStatus(msg) {
    document.getElementById('status-text').textContent = msg;
  }

  _showError(msg) {
    const el = document.getElementById('error-msg');
    if (!el) { alert(msg); return; }
    el.textContent    = msg;
    el.style.display  = 'block';
    clearTimeout(this._errTimer);
    this._errTimer = setTimeout(() => { el.style.display = 'none'; }, 7000);
  }
}

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Convert an array of UCI moves into a short SAN snippet starting from a FEN.
 * Returns a string like "Nf3 e5 Bc4" (at most `maxMoves` half-moves).
 */
function lineToPGNSnippet(pvUCI, fen, maxMoves = 5) {
  try {
    const c   = new Chess(fen);
    const san = [];
    for (let i = 0; i < Math.min(pvUCI.length, maxMoves); i++) {
      const m = c.move({ from: pvUCI[i].slice(0, 2), to: pvUCI[i].slice(2, 4), promotion: pvUCI[i][4] });
      if (!m) break;
      san.push(m.san);
    }
    return san.join(' ');
  } catch (_) { return pvUCI.slice(0, maxMoves).join(' '); }
}

/* ============================================================
   SAMPLE PGN  (Immortal Game, Anderssen – Kieseritzky 1851)
   ============================================================ */

const SAMPLE_PGN = `[Event "London casual game"]
[White "Anderssen, A"]
[Black "Kieseritzky, L"]
[Date "1851.06.21"]
[Result "1-0"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6
7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6
13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2
18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6
23. Be7# 1-0`;

/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  window.chessApp = new ChessAnalyzerApp();
});
