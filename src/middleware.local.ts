// No Funciona por el nombre del archivo
// Demostración


import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ['/protected'];


export const onRequest = defineMiddleware(async ({ url, request }, next) => {

    const authHeaders = request.headers.get('authorization') ?? '';

    if (privateRoutes.includes(url.pathname)) {
        return checkLocalAuth(authHeaders, next);
    }

    console.log('Public route');

    return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {

    if (authHeaders) {
        const authValue = authHeaders.split(' ')[1] ?? 'user:pass';
        const decodedValue = atob(authValue).split(':');
        const [user, password] = decodedValue;

        if (user === 'admin' || password === 'admin') {
            return next();
        }
    }

    return new Response('Unauthorized', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="User Visible Realm"'
        }
    });
}