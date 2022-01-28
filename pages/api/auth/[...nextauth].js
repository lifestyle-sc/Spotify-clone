import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

const refreshAccessToken = async (token) => {
  try {

    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body : refreshedToken } = await spotifyApi.refreshAccessToken()
    // console.log('REFRESHED TOKEN IS', refreshedToken)

    return{
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // expires in 3600 seconds
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    }

  } catch (error) {
    console.error(error) 

    return{
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {

      // check for initial sign in 
      if(account && user){
        // console.log({
        //   account,
        //   user
        // })
        return{
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000 // handling expiry time in milliseconds 
        }
      }

      // returning previous token if it hasn't expired 
      if(Date.now() < token.accessTokenExpires){
        // console.log('EXISTING ACCESS IS VALID' + token)
        return token;
      }

        // access token has expired so it needs refreshing
        // console.log('ACCESS TOKEN EXPIRED, REFRESHING...')
      return await refreshAccessToken(token)
      


    },

    async session({ session, token }) {
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
        session.user.username = token.username

        // console.log(session)

      return session
    }
  } 
})