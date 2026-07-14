from .models import VisitorAnalytics
from django.utils.deprecation import MiddlewareMixin


class VisitorTrackingMiddleware(MiddlewareMixin):
    """
    Middleware to track website visitors and store analytics data.
    """
    
    def process_request(self, request):
        # Get visitor information
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        page_url = request.build_absolute_uri()
        referrer = request.META.get('HTTP_REFERER', '')
        session_key = request.session.session_key
        
        # Get user if authenticated
        user = request.user if request.user.is_authenticated else None
        
        # Skip tracking for admin, static files, and API endpoints
        if self.should_track_request(request):
            try:
                # Create visitor analytics record
                VisitorAnalytics.objects.create(
                    user=user,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    session_key=session_key,
                    page_url=page_url,
                    referrer=referrer
                )
            except Exception as e:
                # Silently fail to avoid breaking the site
                pass
        
        return None
    
    def get_client_ip(self, request):
        """
        Get the client's IP address from the request.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
        return ip
    
    def should_track_request(self, request):
        """
        Determine if the request should be tracked.
        Skip admin, static files, favicon, bots, etc.
        """
        path = request.path.lower()
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        
        # Skip bot requests based on User-Agent
        bot_patterns = [
            'uptimerobot',
            'uptime robot',
            'mozilla/5.0+(compatible; uptimerobot/',
            'pingdom',
            'googlebot',
            'bingbot',
            'yahoo! slurp',
            'facebookexternalhit',
            'twitterbot',
            'linkedinbot',
            'whatsapp',
            'crawler',
            'spider',
            'bot/',
            'monitoring',
            'check_http',
            'nagios',
            'zabbix',
            'pingability',
            'site24x7',
            'statuscake',
            'newrelic',
            'hetrixtools',
            'updown.io'
        ]
        
        # Check if User-Agent contains any bot patterns
        for bot_pattern in bot_patterns:
            if bot_pattern in user_agent:
                return False
        
        # Skip these paths
        skip_paths = [
            '/admin',
            '/static',
            '/media',
            '/favicon.ico',
            '/robots.txt',
            '/sitemap.xml',
            '/.well-known',
            '/health',
            '/status',
            '/ping'
        ]
        
        # Skip if path starts with any of the skip_paths
        for skip_path in skip_paths:
            if path.startswith(skip_path):
                return False
        
        # Skip certain file extensions
        skip_extensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf']
        for ext in skip_extensions:
            if path.endswith(ext):
                return False
        
        return True

from django.http import HttpResponse

class SimpleCorsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse()
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
            return response
        return None

    def process_response(self, request, response):
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        return response