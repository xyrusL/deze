import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add your allowed domains here
const ALLOWED_ORIGINS = [
    'https://rioanime.deze.me',
    'https://landing.deze.me',
    // Add more domains as needed, e.g.:
    // 'https://your-blogspot.blogspot.com',
];

export function middleware(request: NextRequest) {
    // Only apply restriction to /assets/rio/* paths
    if (request.nextUrl.pathname.startsWith('/assets/rio/')) {
        const origin = request.headers.get('origin') || '';
        const referer = request.headers.get('referer') || '';

        // Check if request comes from allowed origin or referer
        const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
        const isAllowedReferer = ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed));

        // Allow if no origin/referer (direct access) or if from allowed domain
        // Block only if there's an origin/referer and it's not in the allowed list
        if ((origin || referer) && !isAllowedOrigin && !isAllowedReferer) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        const response = NextResponse.next();

        // Add CORS headers for allowed origins
        if (isAllowedOrigin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        }

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/assets/rio/:path*',
};
