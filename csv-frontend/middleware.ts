// middleware.js
import { NextResponse } from 'next/server';
import axios from './node_modules/axios/index';

export async function middleware(request:any) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { pathname } = request.nextUrl; // Get the pathname from the request URL
  // Get the token from cookies
  let userToken = request.cookies.get('utc')?.value;
  if (!userToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if(userToken && pathname.startsWith('/home')){
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/protected`, {
        headers: {
          Authorization: `Bearer ${userToken}` // Attach the token as a Bearer token
        }
      });

      if((response?.data?.user?.id)){
        return NextResponse.next();
      }else{
        NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
  }
    return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/home/:path*'], // Apply middleware to both admin and user routes
};
