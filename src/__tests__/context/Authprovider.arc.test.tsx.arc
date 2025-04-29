import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import * as authAxios from "../../axios/auth.axios";
import { AuthProvider, AuthContext } from "../../context/AuthProvider";
import { UserType, AuthItemType } from "../../context/types";
// import * as authAxios from '../axios/auth.axios';

import setAuthToken from "../../utilities/setAuthToken";

const fakeToken = "abc123";
const fakeUser: UserType = {
  _id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  date: new Date(),
  isValidated: true,
};

vi.mock("../axios/auth.axios", () => {
  return {
    loginAxios: vi.fn((user: string, password: string) => {
      return fakeToken;
    }),
    loadUserAxios: vi.fn((token: string) => {
      return fakeUser;
    }),
    // add others if needed
  };
});
// vi.mock("../axios/auth.axios");
vi.mock("../utilities/setAuthToken");

const TestComponent = () => {
  const context = React.useContext(AuthContext);
  return <div data-testid="auth-context">{JSON.stringify(context)}</div>;
};

describe("Testing authorisation provider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("provides default context values", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const ctxText = screen.getByTestId("auth-context").textContent!;
    const context = JSON.parse(ctxText) as AuthItemType;

    expect(context.token).toBe(null);
    expect(context.isAuthenticated).toBe(false);
    expect(context.user).toBe(null);
    expect(context.loading).toBe(true);
    expect(context.error).toBe(null);
  });

  it("logs in a user and sets token", async () => {
    // const spy = vi.spyOn(authAxios, "loadUserAxios");

    // vi.mocked(authAxios.loginAxios).mockResolvedValue({ token: fakeToken });
    // vi.mocked(authAxios.loadUserAxios).mockResolvedValue(fakeUser);

    const LoginComponent = () => {
      const { login, user, isAuthenticated } = React.useContext(AuthContext);

      React.useEffect(() => {
        login({ email: "jane@example.com", password: "password123" });
      }, []);

      return (
        <>
          <div data-testid="user">{JSON.stringify(user)}</div>
          <div data-testid="auth">{String(isAuthenticated)}</div>
        </>
      );
    };

    render(
      <AuthProvider>
        <LoginComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(fakeToken);
      expect(setAuthToken).toHaveBeenCalledWith(fakeToken);

      const userData = screen.getByTestId("user").textContent!;
      const authState = screen.getByTestId("auth").textContent;

      expect(userData).toContain("Jane Doe");
      expect(authState).toBe("true");
    });
  });

  it("logs out the user", async () => {
    const LogoutComponent = () => {
      const { logout, isAuthenticated } = React.useContext(AuthContext);

      React.useEffect(() => {
        logout();
      }, []);

      return <div data-testid="auth">{String(isAuthenticated)}</div>;
    };

    render(
      <AuthProvider>
        <LogoutComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const authState = screen.getByTestId("auth").textContent;
      expect(authState).toBe("false");
      expect(localStorage.getItem("token")).toBeNull();
    });
  });
});
