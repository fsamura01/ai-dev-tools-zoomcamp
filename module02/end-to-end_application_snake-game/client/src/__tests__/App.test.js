import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import { mockApi } from "../services/api";

// Mock the API service
jest.mock("../services/api");

// Mock child components
jest.mock("../components/GameBoard", () => () => (
  <div data-testid="game-board">Game Board</div>
));
jest.mock(
  "../components/LoginModal",
  () =>
    ({ onClose, onLogin, onSignup }) =>
      (
        <div data-testid="login-modal">
          <button onClick={onClose}>Close Modal</button>
          <button
            onClick={() =>
              onLogin({ email: "test@example.com", password: "password" })
            }
          >
            Test Login
          </button>
          <button
            onClick={() =>
              onSignup({
                username: "testuser",
                email: "test@example.com",
                password: "password",
              })
            }
          >
            Test Signup
          </button>
        </div>
      )
);
jest.mock("../components/Leaderboard", () => ({ data }) => (
  <div data-testid="leaderboard">
    Leaderboard ({data ? data.length : 0} players)
  </div>
));
jest.mock("../components/WatchingPanel", () => ({ players }) => (
  <div data-testid="watching-panel">
    Watching Panel ({players ? players.length : 0} players)
  </div>
));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock API responses
    mockApi.getLeaderboard.mockResolvedValue([
      { id: 1, username: "pro_player", score: 1250, gamesPlayed: 42 },
      { id: 2, username: "snake_master", score: 1120, gamesPlayed: 38 },
    ]);

    mockApi.getWatchingPlayers.mockResolvedValue([
      { id: 1, username: "spectator1", watching: "pro_player", isLive: true },
      {
        id: 2,
        username: "spectator2",
        watching: "snake_master",
        isLive: false,
      },
    ]);

    mockApi.login.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });

    mockApi.signup.mockResolvedValue({
      id: 2,
      username: "newuser",
      email: "newuser@example.com",
    });
  });

  test("renders main app components", async () => {
    render(<App />);

    // Check if header is rendered
    expect(screen.getByText(/Multiplayer Snake Game/i)).toBeInTheDocument();

    // Check if game section is rendered
    expect(screen.getByText(/Game Board/i)).toBeInTheDocument();

    // Check if side panels are rendered
    expect(await screen.findByText(/Leaderboard \(2 players\)/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Watching Panel \(2 players\)/i)
    ).toBeInTheDocument();
  });

  test("shows login/signup button when user is not logged in", () => {
    render(<App />);

    expect(screen.getByText(/Login \/ Signup/i)).toBeInTheDocument();
  });

  test("opens login modal when login/signup button is clicked", () => {
    render(<App />);

    // Click login button
    const loginButton = screen.getByText(/Login \/ Signup/i);
    fireEvent.click(loginButton);

    // Check if modal is displayed
    expect(screen.getByTestId(/login-modal/i)).toBeInTheDocument();
  });

  test("closes login modal when close button is clicked", () => {
    render(<App />);

    // Open modal
    const loginButton = screen.getByText(/Login \/ Signup/i);
    fireEvent.click(loginButton);

    // Close modal
    const closeButton = screen.getByText(/Close Modal/i);
    fireEvent.click(closeButton);

    // Check if modal is closed
    expect(screen.queryByTestId(/login-modal/i)).not.toBeInTheDocument();
  });

  test("logs in user successfully", async () => {
    render(<App />);

    // Open modal
    const loginButton = screen.getByText(/Login \/ Signup/i);
    fireEvent.click(loginButton);

    // Perform login
    const testLoginButton = screen.getByText(/Test Login/i);
    fireEvent.click(testLoginButton);

    // Check if user is logged in
    expect(await screen.findByText(/Welcome, testuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("signs up user successfully", async () => {
    render(<App />);

    // Open modal
    const loginButton = screen.getByText(/Login \/ Signup/i);
    fireEvent.click(loginButton);

    // Switch to signup - REMOVED as mock exposes button directly
    // const signupToggle = screen.getByText(/Sign Up/i);
    // fireEvent.click(signupToggle);

    // Perform signup
    const testSignupButton = screen.getByText(/Test Signup/i);
    fireEvent.click(testSignupButton);

    // Check if user is logged in
    expect(await screen.findByText(/Welcome, newuser!/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test("logs out user when logout button is clicked", async () => {
    render(<App />);

    // First login
    const loginButton = screen.getByText(/Login \/ Signup/i);
    fireEvent.click(loginButton);

    const testLoginButton = screen.getByText(/Test Login/i);
    fireEvent.click(testLoginButton);

    // Wait for login to complete
    expect(await screen.findByText(/Welcome, testuser!/i)).toBeInTheDocument();

    // Logout
    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    // Check if user is logged out
    expect(screen.getByText(/Login \/ Signup/i)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome, testuser!/i)).not.toBeInTheDocument();
  });

  test("switches game mode when button is clicked", () => {
    render(<App />);

    // Initially should show "Switch to Walls Mode"
    expect(screen.getByText(/Switch to Walls Mode/i)).toBeInTheDocument();

    // Click the button
    const switchButton = screen.getByText(/Switch to Walls Mode/i);
    fireEvent.click(switchButton);

    // Should now show "Switch to Pass-through Mode"
    expect(
      screen.getByText(/Switch to Pass-through Mode/i)
    ).toBeInTheDocument();
  });
});
