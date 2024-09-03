import { nextAuthOptions } from "@/lib/next-auth-options";
import NextAuth from "next-auth";
// import { authHandler } from "@/auth";

const handler = NextAuth(nextAuthOptions);
export { handler as GET, handler as POST}; 


//export { authHandler as GET, authHandler as POST};

// import { handlers } from "@/auth";
// export { handlers as GET, handlers as POST}; 

