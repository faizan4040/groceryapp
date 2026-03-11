import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/register", "/api/auth", "/favicon.ico", "/_next"];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for token
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url); // redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user
  return NextResponse.next();
}

// Optional: Match middleware to all pages except public routes
export const config = {
//   matcher: ["/((?!_next|favicon.ico|login|register|api/auth).*)"],
  matcher:`/((?!api|_next/static|_next/image|favicon.ico).*)`,
};














// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";


// export async function proxy(req:NextRequest){
    
//     const {pathname}=req.nextUrl
    
//     const publicRoutes=["/login","/register","/api/auth","favicons.ico", "/_next"]
//      if(publicRoutes.some((path)=>pathname.startsWith(path))){
//          return NextResponse.next()
//      }

//      const token = await getToken({req,secret:process.env.AUTH_SECRET})
//      console.log(token)
//      console.log(req.url)
//      if(!token){
//         const loginUrl=new URL("/login", req.url)
//         loginUrl.searchParams.set("callbackUrl",req.url)
//         return NextResponse.redirect(loginUrl)
//      }
//      return NextResponse.next()
// }




// // req-------middleware------server