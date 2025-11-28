"""
Django settings for eduretosv project.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# Detectar si estamos en PythonAnywhere (producción)
# Opción 1: Variable de entorno (más confiable - puedes establecerla en PythonAnywhere)
# Opción 2: Detectar por el hostname o variables de entorno de PythonAnywhere
ON_PYTHONANYWHERE = (
    os.environ.get('ON_PYTHONANYWHERE', 'False').lower() == 'true' or
    'PYTHONANYWHERE_DOMAIN' in os.environ or
    'pythonanywhere.com' in os.environ.get('HTTP_HOST', '') or
    'pythonanywhere.com' in os.environ.get('SERVER_NAME', '')
)

# SECURITY WARNING: keep the secret key used in production secret!
# Usar variable de entorno si está disponible, sino usar una clave por defecto
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-eduretosv-development-key-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG solo en desarrollo local
DEBUG = not ON_PYTHONANYWHERE

# ALLOWED_HOSTS: Configurar según el entorno
if ON_PYTHONANYWHERE:
    # En producción: agregar tu dominio y el dominio de PythonAnywhere
    ALLOWED_HOSTS = [
        'eduretosv.com',
        'www.eduretosv.com',
        '.pythonanywhere.com',  # Permite cualquier subdominio de PythonAnywhere
    ]
    # También agregar el dominio específico si está disponible
    pythonanywhere_domain = os.environ.get('PYTHONANYWHERE_DOMAIN', '')
    if pythonanywhere_domain:
        ALLOWED_HOSTS.append(pythonanywhere_domain)
else:
    # En desarrollo local
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Google OAuth Settings
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '855312988729-u3d0a2qu2due63nfe3r6808dkn88gcl5.apps.googleusercontent.com')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'mainapp',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'eduretosv.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'eduretosv.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Custom User Model
AUTH_USER_MODEL = 'mainapp.Usuario'

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 5,
        }
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'es-es'

TIME_ZONE = 'America/El_Salvador'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

# ESTA ES LA LÍNEA PARA PRODUCCIÓN (Donde se guardarán al final):
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Donde están tus archivos ahorita (Tu carpeta de desarrollo):
# Solo usar STATICFILES_DIRS en desarrollo, en producción se usa STATIC_ROOT
if DEBUG:
    STATICFILES_DIRS = [
        os.path.join(BASE_DIR, 'static'),
    ]
else:
    STATICFILES_DIRS = []

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuraciones de seguridad adicionales para producción
if not DEBUG:
    # Seguridad HTTPS
    SECURE_SSL_REDIRECT = False  # PythonAnywhere maneja esto, no lo actives aquí
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    # Configuración de sesiones
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True


