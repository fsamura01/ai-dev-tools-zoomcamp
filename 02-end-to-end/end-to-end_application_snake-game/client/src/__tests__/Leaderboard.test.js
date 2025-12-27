import { render, screen } from "@testing-library/react";
import Leaderboard from "../components/Leaderboard";

describe("Leaderboard Component", () => {
  const mockLeaderboardData = [
    { id: 1, username: "pro_player", score: 1250, gamesPlayed: 42 },
    { id: 2, username: "snake_master", score: 1120, gamesPlayed: 38 },
    { id: 3, username: "beginner123", score: 890, gamesPlayed: 25 },
    { id: 4, username: "speed_demon", score: 750, gamesPlayed: 20 },
    { id: 5, username: "casual_gamer", score: 620, gamesPlayed: 15 },
  ];

  test("renders leaderboard title", () => {
    render(<Leaderboard data={mockLeaderboardData} />);

    expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
  });

  test("displays all players in the leaderboard", () => {
    render(<Leaderboard data={mockLeaderboardData} />);

    // Check if all players are displayed
    mockLeaderboardData.forEach((player) => {
      expect(screen.getByText(player.username)).toBeInTheDocument();
      expect(screen.getByText(`Score: ${player.score}`)).toBeInTheDocument();
      expect(
        screen.getByText(`Games: ${player.gamesPlayed}`)
      ).toBeInTheDocument();
    });
  });

  test("shows special styling for top 3 players", () => {
    render(<Leaderboard data={mockLeaderboardData} />);

    // Check if first place player has rank-1 class
    const firstPlace = screen
      .getByText("pro_player")
      .closest(".leaderboard-item");
    expect(firstPlace).toHaveClass("rank-1");

    // Check if second place player has rank-2 class
    const secondPlace = screen
      .getByText("snake_master")
      .closest(".leaderboard-item");
    expect(secondPlace).toHaveClass("rank-2");

    // Check if third place player has rank-3 class
    const thirdPlace = screen
      .getByText("beginner123")
      .closest(".leaderboard-item");
    expect(thirdPlace).toHaveClass("rank-3");
  });

  test("shows player rankings correctly", () => {
    render(<Leaderboard data={mockLeaderboardData} />);

    // Check if rankings are displayed correctly
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("shows no data message when leaderboard is empty", () => {
    render(<Leaderboard data={[]} />);

    expect(
      screen.getByText(/No leaderboard data available/i)
    ).toBeInTheDocument();
  });

  test("shows no data message when no data is provided", () => {
    render(<Leaderboard />);

    expect(
      screen.getByText(/No leaderboard data available/i)
    ).toBeInTheDocument();
  });
});
