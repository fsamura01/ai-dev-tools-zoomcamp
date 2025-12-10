import { fireEvent, render, screen } from "@testing-library/react";
import WatchingPanel from "../components/WatchingPanel";
import { mockApi } from "../services/api";

// Mock the API service
jest.mock("../services/api");

describe("WatchingPanel Component", () => {
  const mockWatchingPlayers = [
    { id: 1, username: "spectator1", watching: "pro_player", isLive: true },
    { id: 2, username: "spectator2", watching: "snake_master", isLive: false },
    { id: 3, username: "spectator3", watching: "beginner123", isLive: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock API responses
    mockApi.startWatching.mockResolvedValue({
      id: 2,
      username: "spectator2",
      watching: "snake_master",
      isLive: true,
    });

    mockApi.stopWatching.mockResolvedValue({
      id: 1,
      username: "spectator1",
      watching: "pro_player",
      isLive: false,
    });
  });

  test("renders watching panel title", () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    expect(screen.getByText(/Watch Players/i)).toBeInTheDocument();
  });

  test("displays all players in the watching list", () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    // Check if all players are displayed
    mockWatchingPlayers.forEach((player) => {
      expect(screen.getByText(player.username)).toBeInTheDocument();
      expect(
        screen.getByText(`Watching: ${player.watching}`)
      ).toBeInTheDocument();
    });
  });

  test("shows correct status indicators for players", () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    // Check live players
    const livePlayers = mockWatchingPlayers.filter((p) => p.isLive);
    livePlayers.forEach((player) => {
      const playerElement = screen
        .getByText(player.username)
        .closest(".watching-item");
      const statusIndicator = playerElement.querySelector(".status-indicator");
      expect(statusIndicator).toHaveClass("live");
      expect(statusIndicator).toHaveTextContent("LIVE");
    });

    // Check offline players
    const offlinePlayers = mockWatchingPlayers.filter((p) => !p.isLive);
    offlinePlayers.forEach((player) => {
      const playerElement = screen
        .getByText(player.username)
        .closest(".watching-item");
      const statusIndicator = playerElement.querySelector(".status-indicator");
      expect(statusIndicator).toHaveClass("offline");
      expect(statusIndicator).toHaveTextContent("OFFLINE");
    });
  });

  test("shows correct button text based on player status", () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    // Check "Stop" buttons for live players
    const livePlayers = mockWatchingPlayers.filter((p) => p.isLive);
    livePlayers.forEach((player) => {
      const playerElement = screen
        .getByText(player.username)
        .closest(".watching-item");
      const watchButton = playerElement.querySelector(".watch-button");
      expect(watchButton).toHaveClass("stop");
      expect(watchButton).toHaveTextContent("Stop");
    });

    // Check "Watch" buttons for offline players
    const offlinePlayers = mockWatchingPlayers.filter((p) => !p.isLive);
    offlinePlayers.forEach((player) => {
      const playerElement = screen
        .getByText(player.username)
        .closest(".watching-item");
      const watchButton = playerElement.querySelector(".watch-button");
      expect(watchButton).toHaveClass("start");
      expect(watchButton).toHaveTextContent("Watch");
    });
  });

  test("calls startWatching API when Watch button is clicked for offline player", async () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    // Find the "Watch" button for an offline player
    const watchButton = screen
      .getByText("spectator2")
      .closest(".watching-item")
      .querySelector(".watch-button.start");

    // Click the button
    fireEvent.click(watchButton);

    // Verify API was called
    expect(mockApi.startWatching).toHaveBeenCalledWith(2);
  });

  test("calls stopWatching API when Stop button is clicked for live player", async () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    // Find the "Stop" button for a live player
    const stopButton = screen
      .getByText("spectator1")
      .closest(".watching-item")
      .querySelector(".watch-button.stop");

    // Click the button
    fireEvent.click(stopButton);

    // Verify API was called
    expect(mockApi.stopWatching).toHaveBeenCalledWith(1);
  });

  test("shows no data message when watching list is empty", () => {
    render(<WatchingPanel players={[]} />);

    expect(screen.getByText(/No players to watch/i)).toBeInTheDocument();
  });

  test("shows note about simulation", () => {
    render(<WatchingPanel players={mockWatchingPlayers} />);

    expect(
      screen.getByText(/In this demo, other players are simulated/i)
    ).toBeInTheDocument();
  });
});
