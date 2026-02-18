"use server";

import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
) {
  if (!email || !password || !displayName) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  try {
    // Call backend to create user with plain password
    // Backend will hash it with bcrypt
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") +
        "/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password, // Send plain password, backend will hash it
          display_name: displayName,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  try {
    const response = await fetch(
      (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") +
        "/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
