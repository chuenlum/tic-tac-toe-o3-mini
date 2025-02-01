// src/Game.tsx
import React, { useEffect, useState } from 'react';
import './Game.css';

// -------------------------
// Configurable via Props Defaults
// -------------------------
interface GameProps {
  numRows?: number;
  numCols?: number;
  winCondition?: number;
}

const DEFAULT_NUM_ROWS = 3;
const DEFAULT_NUM_COLS = 3;
const DEFAULT_WIN_CONDITION = 3;

// -------------------------
// Square Component
// -------------------------
interface SquareProps {
  value: string | null;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
  <button className="square" onClick={onClick}>
    {value}
  </button>
);

// -------------------------
// Board Component
// -------------------------
interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
  numRows: number;
  numCols: number;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, numRows, numCols }) => {
  const boardRows = [];
  for (let row = 0; row < numRows; row++) {
    const boardCols = [];
    for (let col = 0; col < numCols; col++) {
      const index = row * numCols + col;
      boardCols.push(
        <Square key={index} value={squares[index]} onClick={() => onClick(index)} />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardCols}
      </div>
    );
  }
  return <div>{boardRows}</div>;
};

// -------------------------
// Types for Game History
// -------------------------
interface HistoryEntry {
  squares: (string | null)[];
}

// -------------------------
// Game Component
// -------------------------
const Game: React.FC<GameProps> = ({
  numRows = DEFAULT_NUM_ROWS,
  numCols = DEFAULT_NUM_COLS,
  winCondition = DEFAULT_WIN_CONDITION,
}) => {
  // UI configuration state.
  const [rows, setRows] = useState<number>(numRows);
  const [cols, setCols] = useState<number>(numCols);
  const [winSeq, setWinSeq] = useState<number>(winCondition);

  // Mode: "single" for playing against the computer, "multi" for two players.
  const [mode, setMode] = useState<"single" | "multi">("multi");

  // Game state.
  const [history, setHistory] = useState<HistoryEntry[]>([
    { squares: Array(rows * cols).fill(null) },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [isPlayerXTurn, setIsPlayerXTurn] = useState<boolean>(true);

  const current = history[stepNumber];
  const isBoardFull = current.squares.every(cell => cell !== null);
  const winner = calculateWinner(current.squares, rows, cols, winSeq);
  const currentPlayer = isPlayerXTurn ? 'X' : 'O';

  // --- Validation ---
  const validationErrors: string[] = [];
  if (rows < 3) validationErrors.push("Rows must be at least 3.");
  if (cols < 3) validationErrors.push("Columns must be at least 3.");
  if (winSeq < 3) validationErrors.push("Winning sequence must be at least 3.");
  if (winSeq > rows || winSeq > cols)
    validationErrors.push("Winning sequence cannot exceed board dimensions.");

  // Reset the game with the current configuration.
  const resetGame = (): void => {
    setHistory([{ squares: Array(rows * cols).fill(null) }]);
    setStepNumber(0);
    setIsPlayerXTurn(true);
  };

  // Apply configuration if valid.
  const applyConfiguration = (): void => {
    if (validationErrors.length === 0) {
      resetGame();
    }
  };

  // Mode change handler.
  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMode = e.target.value as "single" | "multi";
    setMode(newMode);
    resetGame();
  };

  // Handle a human move.
  const handleClick = (i: number): void => {
    if (mode === "single" && !isPlayerXTurn) {
      return;
    }
    if (winner || current.squares[i]) {
      return;
    }
    const squares = current.squares.slice();
    squares[i] = currentPlayer;
    const newHistory = history.slice(0, stepNumber + 1).concat([{ squares }]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    if (mode === "single") {
      setIsPlayerXTurn(false);
    } else {
      setIsPlayerXTurn(!isPlayerXTurn);
    }
  };

  // Jump to a specific move.
  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setIsPlayerXTurn(step % 2 === 0);
  };

  // Computer move effect (only in single-player mode).
  useEffect(() => {
    if (
      mode === "single" &&
      !isPlayerXTurn &&
      !winner &&
      !isBoardFull
    ) {
      const timer = setTimeout(() => {
        setHistory(prevHistory => {
          const latestEntry = prevHistory[prevHistory.length - 1];
          const newSquares = latestEntry.squares.slice();
          const emptySquares = newSquares
            .map((cell, idx) => (cell === null ? idx : null))
            .filter((v): v is number => v !== null);
          if (emptySquares.length > 0) {
            const randomIndex =
              emptySquares[Math.floor(Math.random() * emptySquares.length)];
            newSquares[randomIndex] = 'O';
            return prevHistory.concat([{ squares: newSquares }]);
          }
          return prevHistory;
        });
        setStepNumber(prev => prev + 1);
        setIsPlayerXTurn(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mode, isPlayerXTurn, winner, isBoardFull]);

  return (
    <div className="game">
      <div className="game-controls">
        <div className="config">
          <label>
            Rows:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              min="3"
            />
          </label>
          <label>
            Columns:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              min="3"
            />
          </label>
          <label>
            Winning Sequence:
            <input
              type="number"
              value={winSeq}
              onChange={(e) => setWinSeq(Number(e.target.value))}
              min="3"
            />
          </label>
          <button onClick={applyConfiguration} disabled={validationErrors.length > 0}>
            Apply Configuration
          </button>
          {validationErrors.length > 0 && (
            <div className="config-errors">
              {validationErrors.map((error, index) => (
                <p key={index} className="error">{error}</p>
              ))}
            </div>
          )}
        </div>
        <div className="mode-select">
          <label>
            <input
              type="radio"
              value="multi"
              checked={mode === "multi"}
              onChange={handleModeChange}
            />
            Multiplayer
          </label>
          <label>
            <input
              type="radio"
              value="single"
              checked={mode === "single"}
              onChange={handleModeChange}
            />
            Single Player
          </label>
          <button onClick={resetGame}>Reset Game</button>
        </div>
      </div>
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
          numRows={rows}
          numCols={cols}
        />
      </div>
      <div className="game-info">
        <div className="status">
          {winner
            ? `Winner: ${winner}`
            : isBoardFull
            ? "It's a tie!"
            : mode === "single"
            ? isPlayerXTurn
              ? "Your turn (X)"
              : "Computer's turn (O)"
            : `Next player: ${currentPlayer}`}
        </div>
        <ol>
          {history.map((step, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? `Go to move #${move}` : 'Go to game start'}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="footer">
        <a href="https://github.com/chuenlum/tic-tac-toe-o3-mini" target="_blank" rel="noopener noreferrer">
          View Source on GitHub
        </a>
      </div>
    </div>
  );
};

// -------------------------
// Game Logic Helper Functions
// -------------------------
function checkDirection(
  squares: (string | null)[],
  row: number,
  col: number,
  dRow: number,
  dCol: number,
  winCondition: number,
  numRows: number,
  numCols: number,
  player: string
): boolean {
  for (let offset = 0; offset < winCondition; offset++) {
    const currentRow = row + offset * dRow;
    const currentCol = col + offset * dCol;
    if (
      currentRow < 0 ||
      currentRow >= numRows ||
      currentCol < 0 ||
      currentCol >= numCols
    ) {
      return false;
    }
    if (squares[currentRow * numCols + currentCol] !== player) {
      return false;
    }
  }
  return true;
}

function calculateWinner(
  squares: (string | null)[],
  numRows: number,
  numCols: number,
  winCondition: number
): string | null {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const player = squares[row * numCols + col];
      if (!player) continue;
      if (
        checkDirection(squares, row, col, 0, 1, winCondition, numRows, numCols, player) ||
        checkDirection(squares, row, col, 1, 0, winCondition, numRows, numCols, player) ||
        checkDirection(squares, row, col, 1, 1, winCondition, numRows, numCols, player) ||
        checkDirection(squares, row, col, 1, -1, winCondition, numRows, numCols, player)
      ) {
        return player;
      }
    }
  }
  return null;
}

export default Game;
