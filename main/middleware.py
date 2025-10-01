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
        Skip admin, static files, favicon, etc.
        """
        path = request.path.lower()
        
        # Skip these paths
        skip_paths = [
            '/admin',
            '/static',
            '/media',
            '/favicon.ico',
            '/robots.txt',
            '/sitemap.xml',
            '/.well-known'
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