# Project Setup Guide

This guide will help you set up the Portfolio project on your local machine, including creating the project structure from scratch.

## Prerequisites

- Python 3.x
- pip (Python package manager)
- Git
- PostgreSQL (recommended for production)

## Complete Project Creation from Scratch

1. **Install Django and Create Project Structure**
   ```bash
   # Install Django
   pip install django

   # Create the main project
   django-admin startproject portfolio
   cd portfolio

   # Create the main application
   python manage.py startapp main
   ```

2. **Create Required Directories**
   ```bash
   # Create static and template directories
   mkdir -p main/static/css
   mkdir -p main/static/js
   mkdir -p main/static/images
   mkdir -p main/static/fonts
   mkdir -p main/templates/main/sections
   mkdir -p main/templates/main/partials
   mkdir -p main/templates/main/modals
   ```

3. **Initial Project Files Setup**
   ```bash
   # Create necessary files
   touch main/__init__.py
   touch main/urls.py
   touch main/forms.py
   touch main/admin.py
   touch main/models.py
   touch main/views.py
   touch main/signals.py
   touch main/middleware.py
   ```

4. **Register the App**
   Add 'main' to INSTALLED_APPS in portfolio/settings.py:
   ```python
   INSTALLED_APPS = [
       'django.contrib.admin',
       'django.contrib.auth',
       'django.contrib.contenttypes',
       'django.contrib.sessions',
       'django.contrib.messages',
       'django.contrib.staticfiles',
       'main',  # Add this line
   ]
   ```

## Setup Steps for Existing Project

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   
   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   ENVIRONMENT=development
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=your_database_url  # For PostgreSQL
   
   # Cloudinary configuration (if using Cloudinary for media storage)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Database Setup**
   ```bash
   # Create database migrations
   python manage.py makemigrations
   
   # Apply migrations
   python manage.py migrate
   ```

6. **Create a Superuser (Admin)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run the Development Server**
   ```bash
   python manage.py runserver
   ```
   The application will be available at `http://127.0.0.1:8000/`

## Project Structure
```
Portfolio/
├── main/                  # Main application directory
│   ├── static/           # Static files (CSS, JS, images)
│   ├── templates/        # HTML templates
│   ├── models.py         # Database models
│   ├── views.py         # View functions
│   └── urls.py          # URL configurations
├── portfolio/            # Project settings directory
├── manage.py            # Django management script
└── requirements.txt     # Project dependencies
```

## Additional Configuration

### Initial Requirements Setup
Create a `requirements.txt` file in your project root:
```txt
# Essential dependencies
Django==5.1.3
django-environ==0.11.2
dj-database-url==2.3.0
supabase==2.14.0
psycopg2-binary==2.9.10
python-dotenv==1.0.1
whitenoise==6.8.2
sqlparse==0.5.2

# Optional dependencies
pillow==11.0.0
cloudinary==1.41.0

# For making async HTTP requests
httpx==0.28.1
aiosignal==1.3.2

# Django storage
django-storages==1.14.2
boto3==1.34.0
python-decouple==3.8
```

### Production Deployment
For production deployment:
1. Set `ENVIRONMENT=production` in your `.env` file
2. Configure your `ALLOWED_HOSTS` in settings.py
3. Set up a proper PostgreSQL database
4. Configure your static files storage (Cloudinary/AWS S3)
5. Use a proper web server (like Nginx) and WSGI server (like Gunicorn)

### Database Configuration
The project uses PostgreSQL by default in production. Make sure to:
1. Install PostgreSQL on your system
2. Create a new database
3. Update the `DATABASE_URL` in your `.env` file

### Media Storage
The project uses Cloudinary for media storage. Ensure you:
1. Have a Cloudinary account
2. Set up the Cloudinary environment variables
3. Configure your media storage settings in settings.py

## Common Issues and Solutions

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check your static files configuration
   - Verify your web server configuration

3. **Migration Issues**
   - Try `python manage.py migrate --run-syncdb`
   - Check for any pending migrations
   - Clear migration files and start fresh if needed

## Support and Contributing

For support:
1. Check the existing documentation
2. Create an issue in the repository
3. Contact the repository maintainers

When contributing:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

[Add your license information here]