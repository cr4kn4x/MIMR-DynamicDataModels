import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Define public routes and static files
    const publicRoutes = [
        '/Login',
        '/Register',
        '/favicon.ico',
        '/api',
        '/_next',
        '/public',
    ];
    const isPublic = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    // If route is public, allow access
    if (isPublic) {
        // Wenn User eingeloggt ist und /Login oder /Register aufruft, redirect zu /DataModels
        if (user && (request.nextUrl.pathname.startsWith('/Login') || request.nextUrl.pathname.startsWith('/Register'))) {
            const url = request.nextUrl.clone();
            url.pathname = '/DataModels';
            const redirectResponse = NextResponse.redirect(url);
            supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
                redirectResponse.cookies.set(name, value);
            });
            return redirectResponse;
        }
        return supabaseResponse;
    }

    // If user is not logged in, redirect to /Login for protected routes
    if (!user) {
        const protectedRoutes = ['/DataModels', '/Workflows'];
        const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
        if (isProtected) {
            const url = request.nextUrl.clone();
            url.pathname = '/Login';
            const redirectResponse = NextResponse.redirect(url);
            supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
                redirectResponse.cookies.set(name, value);
            });
            return redirectResponse;
        }
        // For all other routes, redirect to /Login
        const url = request.nextUrl.clone();
        url.pathname = '/Login';
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
            redirectResponse.cookies.set(name, value);
        });
        return redirectResponse;
    }

    // If user is logged in, allow access to protected routes
    const protectedRoutes = ['/DataModels', '/Workflows'];
    const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
    if (isProtected) {
        return supabaseResponse;
    }

    // For all other routes, redirect to /DataModels
    const url = request.nextUrl.clone();
    url.pathname = '/DataModels';
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
        redirectResponse.cookies.set(name, value);
    });
    return redirectResponse;

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}