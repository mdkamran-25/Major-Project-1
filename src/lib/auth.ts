import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role?: string;
    };
  }
}

// GraphQL mutation for Google authentication
const GOOGLE_AUTH_MUTATION = `
  mutation GoogleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
      token
      refreshToken
      user {
        id
        email
        name
        avatar
        role
      }
      expiresIn
    }
  }
`;

// GraphQL mutation for token refresh
const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      user {
        id
        email
        name
        avatar
        role
      }
      expiresIn
    }
  }
`;

// Helper function to call GraphQL API
async function callGraphQLAPI(query: string, variables: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || 'GraphQL API error');
  }

  return data.data;
}

// Refresh access token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      throw new Error('No refresh token available');
    }

    const data = await callGraphQLAPI(REFRESH_TOKEN_MUTATION, {
      refreshToken: token.refreshToken,
    });

    const { refreshToken: newRefreshToken } = data;

    return {
      ...token,
      accessToken: newRefreshToken.token,
      refreshToken: newRefreshToken.refreshToken,
      accessTokenExpires: Date.now() + newRefreshToken.expiresIn * 1000,
      user: {
        id: newRefreshToken.user.id,
        email: newRefreshToken.user.email,
        name: newRefreshToken.user.name,
        image: newRefreshToken.user.avatar,
        role: newRefreshToken.user.role,
      },
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && account.id_token) {
          // Authenticate with our GraphQL backend
          const data = await callGraphQLAPI(GOOGLE_AUTH_MUTATION, {
            input: {
              idToken: account.id_token,
            },
          });

          const { googleAuth } = data;

          // Store the backend tokens in the user object
          user.id = googleAuth.user.id;
          user.email = googleAuth.user.email;
          user.name = googleAuth.user.name;
          user.image = googleAuth.user.avatar;
          user.role = googleAuth.user.role;
          user.accessToken = googleAuth.token;
          user.refreshToken = googleAuth.refreshToken;

          return true;
        }
        return false;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.error) {
        // Force sign out if token refresh failed
        return {
          ...session,
          error: token.error,
        };
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          name: token.user.name,
          image: token.user.image,
          role: token.user.role,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  events: {
    async signOut(message) {
      // Optional: Call backend logout endpoint
      try {
        if (message.token?.accessToken) {
          await fetch(
            process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${message.token.accessToken}`,
              },
              body: JSON.stringify({
                query: `
                  mutation Logout {
                    logout
                  }
                `,
              }),
            }
          );
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
