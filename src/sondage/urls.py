from django.contrib import admin
from django.urls import path, include
from .views import accueil

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('user_auth.urls')),
    path('accueil/', accueil),
    path('vote/', include('vote.urls')),
    path('questionnaire/', include('questionnaire.urls')),
]
