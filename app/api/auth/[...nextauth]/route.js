import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { app, auth, db } from '../../../../firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          if (!userCredential.user) {
            throw new Error("User not found");
          }
          const uid = userCredential.user.uid;
          return userCredential.user;

        } catch (error) {
          console.log("Error logging in:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
  
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    }
  }
});

export { handler as GET, handler as POST };
