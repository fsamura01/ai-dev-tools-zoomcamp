import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mockApi } from "../services/api";
import "./GameBoard.css";

const GAME_SPEED = 150;
const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const GameBoard = ({ gameMode }) => {
  const { currentUser } = useAuth();
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameId, setGameId] = useState(null);
  const directionRef = useRef(direction);
  const gameLoopRef = useRef();

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Generate random food position
  const generateFood = useCallback((snakeBody) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      snakeBody.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    return newFood;
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== DIRECTIONS.DOWN) {
            setDirection(DIRECTIONS.UP);
          }
          break;
        case "ArrowDown":
          if (directionRef.current !== DIRECTIONS.UP) {
            setDirection(DIRECTIONS.DOWN);
          }
          break;
        case "ArrowLeft":
          if (directionRef.current !== DIRECTIONS.RIGHT) {
            setDirection(DIRECTIONS.LEFT);
          }
          break;
        case "ArrowRight":
          if (directionRef.current !== DIRECTIONS.LEFT) {
            setDirection(DIRECTIONS.RIGHT);
          }
          break;
        case " ":
          if (gameOver) {
            resetGame();
          } else {
            setIsPlaying(!isPlaying);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        const head = { ...currentSnake[0] };
        const dir = directionRef.current;

        // Move head
        head.x += dir.x;
        head.y += dir.y;

        // Check wall collision (only for walls mode)
        if (gameMode === "walls") {
          if (
            head.x < 0 ||
            head.x >= BOARD_SIZE ||
            head.y < 0 ||
            head.y >= BOARD_SIZE
          ) {
            setGameOver(true);
            endGame();
            return currentSnake;
          }
        } else {
          // Pass-through mode - wrap around
          if (head.x < 0) head.x = BOARD_SIZE - 1;
          if (head.x >= BOARD_SIZE) head.x = 0;
          if (head.y < 0) head.y = BOARD_SIZE - 1;
          if (head.y >= BOARD_SIZE) head.y = 0;
        }

        // Check self collision
        if (
          currentSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          endGame();
          return currentSnake;
        }

        const newSnake = [head, ...currentSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          // Increase score
          setScore((prevScore) => prevScore + 10);
          // Generate new food
          setFood(generateFood(newSnake));
        } else {
          // Remove tail if no food eaten
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, food, gameMode, generateFood]);

  // Start a new game
  const startGame = async () => {
    try {
      const gameResponse = await mockApi.startGame(gameMode);
      setGameId(gameResponse.gameId);
      setIsPlaying(true);
      setGameOver(false);
      setScore(0);
      setSnake(INITIAL_SNAKE);
      setFood(INITIAL_FOOD);
      setDirection(DIRECTIONS.RIGHT);
      directionRef.current = DIRECTIONS.RIGHT;
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  // Reset game
  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(DIRECTIONS.RIGHT);
    directionRef.current = DIRECTIONS.RIGHT;
  };

  // End game and submit score
  const endGame = async () => {
    if (!currentUser) return;

    try {
      await mockApi.submitScore({
        userId: currentUser.id,
        gameId,
        score,
        gameMode,
        endedAt: new Date().toISOString(),
      });

      // Update leaderboard
      await mockApi.updateLeaderboard({ userId: currentUser.id, score });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  // Render game cell
  const renderCell = (x, y) => {
    // Check if cell is snake head
    if (snake[0].x === x && snake[0].y === y) {
      return <div className="snake-head" />;
    }

    // Check if cell is snake body
    if (snake.slice(1).some((segment) => segment.x === x && segment.y === y)) {
      return <div className="snake-body" />;
    }

    // Check if cell is food
    if (food.x === x && food.y === y) {
      return <div className="food" />;
    }

    return null;
  };

  return (
    <div className="game-board-container">
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="mode">
          Mode: {gameMode === "pass-through" ? "Pass-through" : "Walls"}{" "}
        </div>
        {currentUser && (
          <div className="player">Player: {currentUser.username}</div>
        )}
      </div>

      <div
        className="game-board"
        role="grid"
        aria-label=""
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
          const x = index % BOARD_SIZE;
          const y = Math.floor(index / BOARD_SIZE);
          return (
            <div key={index} className="cell" role="gridcell">
              {renderCell(x, y)}
            </div>
          );
        })}
      </div>

      <div className="game-controls">
        {!isPlaying && !gameOver && (
          <button onClick={startGame}>Start Game</button>
        )}
        {isPlaying && (
          <button onClick={() => setIsPlaying(false)}>Pause</button>
        )}
        {!isPlaying && gameOver && (
          <button onClick={resetGame}>Play Again</button>
        )}
        <div className="instructions">
          <p>Use arrow keys to control the snake</p>
          <p>Press SPACE to pause/resume</p>
        </div>
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
