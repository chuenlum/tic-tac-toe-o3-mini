// src/Game.tsx
import React, { useEffect, useState } from 'react';
import './Game.css';

// -------------------------
// Configurable via Props
// -------------------------
interface GameProps {
  numRows?: number;
  numCols?: number;
  winCondition?: number;
}

const DEFAULT_NUM_ROWS = 20;
const DEFAULT_NUM_COLS = 20;
const DEFAULT_WIN_CONDITION = 5;

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
  // "multi" for two players, "single" for playing against the computer.
  // In single-player mode, the human is always "X" and the computer is "O".
  const [mode, setMode] = useState<"single" | "multi">("multi");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { squares: Array(numRows * numCols).fill(null) },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [isPlayerXTurn, setIsPlayerXTurn] = useState<boolean>(true);
  const [isComputerThinking, setIsComputerThinking] = useState<boolean>(false);

  const current = history[stepNumber];
  const isBoardFull = current.squares.every(cell => cell !== null);
  const winner = calculateWinner(current.squares, numRows, numCols, winCondition);
  const currentPlayer = isPlayerXTurn ? 'X' : 'O';

  // -------------------------
  // Event Handlers & Helpers
  // -------------------------
  const resetGame = (): void => {
    setHistory([{ squares: Array(numRows * numCols).fill(null) }]);
    setStepNumber(0);
    setIsPlayerXTurn(true);
    setIsComputerThinking(false);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newMode = e.target.value as "single" | "multi";
    setMode(newMode);
    resetGame();
  };

  /**
   * Handles a move on the board.
   * The isComputerMove flag bypasses human-turn restrictions.
   */
  const handleClick = (i: number, isComputerMove: boolean = false): void => {
    // In single-player mode, ignore human clicks if it's not the human's turn or if the computer is thinking.
    if (!isComputerMove && mode === "single" && (!isPlayerXTurn || isComputerThinking)) {
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
    setIsPlayerXTurn(!isPlayerXTurn);
  };

  // Jump to a specific move in the history.
  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setIsPlayerXTurn(step % 2 === 0);
  };

  // -------------------------
  // Computer Move Effect
  // -------------------------
  useEffect(() => {
    if (
      mode === "single" &&
      !winner &&
      !isBoardFull &&
      !isPlayerXTurn &&
      !isComputerThinking
    ) {
      const emptySquares: number[] = current.squares
        .map((cell, idx) => (cell === null ? idx : null))
        .filter((v): v is number => v !== null);
      if (emptySquares.length > 0) {
        setIsComputerThinking(true);
        const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
        const timer = setTimeout(() => {
          handleClick(randomIndex, true);
          setIsComputerThinking(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [mode, winner, isBoardFull, isPlayerXTurn, current.squares, isComputerThinking]);

  // -------------------------
  // Render: Move History and Status
  // -------------------------
  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull) {
    status = "It's a tie!";
  } else {
    status =
      mode === "single"
        ? isPlayerXTurn
          ? "Your turn (X)"
          : "Computer's turn (O)"
        : `Next player: ${currentPlayer}`;
  }

  return (
    <div className="game">
      <div className="game-controls">
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
          numRows={numRows}
          numCols={numCols}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// -------------------------
// Game Logic Helper Functions
// (These can be moved to a separate file if desired)
// -------------------------

/**
 * Checks if there is a winning sequence starting from (row, col) in a given direction.
 */
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

/**
 * Determines the winner by checking all possible directions.
 */
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
