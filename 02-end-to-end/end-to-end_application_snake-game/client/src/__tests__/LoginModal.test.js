import { fireEvent, render, screen } from "@testing-library/react";
import LoginModal from "../components/LoginModal";

// Mock functions
const mockOnClose = jest.fn();
const mockOnLogin = jest.fn();
const mockOnSignup = jest.fn();

const renderLoginModal = (props = {}) => {
  const defaultProps = {
    onClose: mockOnClose,
    onLogin: mockOnLogin,
    onSignup: mockOnSignup,
    ...props,
  };

  return render(<LoginModal {...defaultProps} />);
};

describe("LoginModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form by default", () => {
    renderLoginModal();

    // Check if modal header is correct
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();

    // Check if login fields are present
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();

    // Check if signup fields are not present
    expect(screen.queryByLabelText(/Username/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Confirm Password/i)
    ).not.toBeInTheDocument();
  });

  test("switches to signup form when Sign Up button is clicked", () => {
    renderLoginModal();

    // Click the signup toggle
    const toggleButton = screen.getByText(/Sign Up/i);
    fireEvent.click(toggleButton);

    // Check if modal header changed
    expect(screen.getByRole('heading', { name: /Sign Up/i })).toBeInTheDocument();

    // Check if signup fields are now present
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test("switches back to login form when Login button is clicked", () => {
    renderLoginModal();

    // Switch to signup
    const signUpToggle = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpToggle);

    // Switch back to login
    const loginToggle = screen.getByText(/Login/i);
    fireEvent.click(loginToggle);

    // Check if we're back to login form
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Username/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Confirm Password/i)
    ).not.toBeInTheDocument();
  });

  test("calls onLogin when login form is submitted", async () => {
    renderLoginModal();

    // Fill in login form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });

    // Submit form
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    // Verify onLogin was called with correct data
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows error when login form is submitted with missing fields", async () => {
    renderLoginModal();

    // Submit empty form
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    // Check for error message
    expect(
      await screen.findByText(/Please fill in all fields/i)
    ).toBeInTheDocument();
  });

  test("calls onSignup when signup form is submitted with valid data", async () => {
    renderLoginModal();

    // Switch to signup
    const toggleButton = screen.getByText(/Sign Up/i);
    fireEvent.click(toggleButton);

    // Fill in signup form
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    // Submit form
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);

    // Verify onSignup was called with correct data
    expect(mockOnSignup).toHaveBeenCalledWith({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
  });

  test("shows error when passwords do not match during signup", async () => {
    renderLoginModal();

    // Switch to signup
    const toggleButton = screen.getByText(/Sign Up/i);
    fireEvent.click(toggleButton);

    // Fill in signup form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "differentpassword" },
    });

    // Submit form
    const signupButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(signupButton);

    // Check for error message
    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    renderLoginModal();

    // Click close button
    const closeButton = screen.getByText(/×/i);
    fireEvent.click(closeButton);

    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onClose when clicking outside modal", () => {
    renderLoginModal();

    // Click on overlay (outside modal)
    const overlay = screen.getByRole("dialog").parentElement;
    fireEvent.click(overlay);

    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
