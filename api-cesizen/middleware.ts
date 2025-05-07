import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
};

export const config = {
  matcher: ['/api/:path*'],
};
