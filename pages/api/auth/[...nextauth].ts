import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add your own logic here to find the user from your database
        // This is just an example
        if (credentials?.username === "user" && credentials?.password === "password") {
          return { id: 1, name: "J Smith", email: "jsmith@example.com" }
        }
        return null
      }
    })
  ],
  // Add any additional configuration options here
})
