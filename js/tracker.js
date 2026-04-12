(function () {
    var SUPABASE_URL = 'https://spitmhwqqfyyqmkpnumb.supabase.co';
    var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaXRtaHdxcWZ5eXFta3BudW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NzE0MjIsImV4cCI6MjA5MTA0NzQyMn0.v5eGbcBvYnwUopxSdiysy90l7-vPQZ9cTNp2mTQv1mY';

    // 봇 감지
    if (navigator.webdriver) return;
    if (/bot|crawler|spider|crawling|facebookexternalhit|WhatsApp|Slackbot|Twitterbot|LinkedInBot|Googlebot|Bingbot|Yeti|Daum|PetalBot|AhrefsBot|SemrushBot|MJ12bot|DotBot|Bytespider|GPTBot|ChatGPT/i.test(navigator.userAgent)) return;

    // 세션당 1회만 수집
    try {
        if (sessionStorage.getItem('_wl_tracked')) return;
        sessionStorage.setItem('_wl_tracked', '1');
    } catch (e) {}

    var ua = navigator.userAgent;

    // 브라우저 판별
    function parseBrowser() {
        if (/Edg\//.test(ua)) return 'Edge';
        if (/OPR\/|Opera/.test(ua)) return 'Opera';
        if (/SamsungBrowser\//.test(ua)) return 'Samsung Browser';
        if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return 'Chrome';
        if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
        if (/Firefox\//.test(ua)) return 'Firefox';
        return 'Other';
    }

    // OS 판별
    function parseOS() {
        if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
        // iPadOS는 macOS로 보고하므로 터치 포인트로 구분
        if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'iOS';
        if (/Android/.test(ua)) return 'Android';
        if (/Windows/.test(ua)) return 'Windows';
        if (/Macintosh|Mac OS/.test(ua)) return 'macOS';
        if (/Linux/.test(ua)) return 'Linux';
        return 'Other';
    }

    // 기기 유형 판별
    function parseDevice() {
        if (/iPad|Tablet/.test(ua)) return 'Tablet';
        if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'Tablet';
        if (/Mobi|iPhone|Android/.test(ua) && !/Tablet/.test(ua)) return 'Mobile';
        return 'Desktop';
    }

    function getReferrerDomain() {
        if (!document.referrer) return location.hostname;
        try {
            return new URL(document.referrer).hostname;
        } catch (e) {
            return location.hostname;
        }
    }

    var data = JSON.stringify({
        domain: getReferrerDomain(),
        page_path: location.pathname,
        browser: parseBrowser(),
        os: parseOS(),
        device_type: parseDevice()
    });

    var url = SUPABASE_URL + '/rest/v1/visitors';
    var headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    };

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: data,
        keepalive: true
    }).catch(function () {});
})();
