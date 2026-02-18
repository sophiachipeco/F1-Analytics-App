import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Call your backend API to verify credentials
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/users/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await response.json();

          if (user && user.id) {
            return {
              id: user.id,
              email: user.email,
              name: user.display_name,
              image: user.avatar_url,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-in (Google)
      if (account?.provider === "google") {
        try {
          console.log("Starting OAuth sign-in for:", user.email);
          
          // Check if user exists, if not create them
          const response = await fetch(
            (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") +
              "/users/oauth-login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                display_name: user.name,
                avatar_url: user.image,
                provider: "google",
                provider_id: account.providerAccountId,
              }),
            }
          );

          console.log("OAuth backend response:", response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("OAuth login failed with status:", response.status, errorText);
            return false;
          }

          const userData = await response.json();
          console.log("OAuth login successful, user:", userData);
          console.log("Returning true from signIn callback");
          
          // Update the user object with backend data so it flows to JWT callback
          user.id = userData.id;
          user.email = userData.email;
          user.name = userData.display_name;
          user.image = userData.avatar_url;
          
          return true;
        } catch (error) {
          console.error("OAuth error:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);
      // Always redirect to home page after auth
      return baseUrl;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user, "token:", token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      console.log("JWT callback - returning token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - session:", session, "token:", token);
      if (session.user) {
        session.user.id = token.id as string || token.sub as string;
        session.user.email = token.email as string;
      }
      console.log("Session callback - returning:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
