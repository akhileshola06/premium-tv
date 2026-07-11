export default async (request, context) => {
    // 🛑 1. SECURITY CHECK (CORS PREFLIGHT) BYPASS
    if (request.method === "OPTIONS") {
        return new Response("OK", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        });
    }

    const url = new URL(request.url);
    let targetUrl = '';

    // 🔄 2. ROUTING LOGIC
    if (url.pathname.startsWith('/proxy/jiotv/')) {
        targetUrl = 'https://jiotvmblive.cdn.jio.com' + url.pathname.replace('/proxy/jiotv', '') + url.search;
    } else if (url.pathname.startsWith('/proxy/nw18/')) {
        targetUrl = 'https://nw18live.cdn.jio.com' + url.pathname.replace('/proxy/nw18', '') + url.search;
    } else if (url.pathname.startsWith('/proxy/times/')) {
        targetUrl = 'https://times-ott-live.akamaized.net' + url.pathname.replace('/proxy/times', '') + url.search;
    } else {
        return new Response("Invalid Proxy Route", { status: 404 });
    }

    try {
        // 🔐 3. FETCH WITH VIP HEADERS
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'plaYtv/7.0.8 (Linux;Android 11) ExoPlayerLib/2.11.4',
                'Origin': 'https://jiotv.com',
                'Referer': 'https://jiotv.com/',
                'Accept': '*/*'
            }
        });

        // 🔓 4. UNLOCK BROWSER SECURITY
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        headers.set('Access-Control-Allow-Headers', '*');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
        });
    } catch (err) {
        return new Response("Backend Fetch Error", { status: 500 });
    }
};
