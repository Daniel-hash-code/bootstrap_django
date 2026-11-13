# bootstrapdjango/urls.py
# ============================================================
# Root URL configuration for the entire Django project.
#
# We include myapp's URLs so that all StudyFlow pages
# are accessible from the root of the website.
# ============================================================

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin — available but not used for app features
    path('admin/', admin.site.urls),

    # Include all myapp URLs at the site root
    # e.g. '/'  -> dashboard
    #      '/planner/' -> planner
    #      '/journal/' -> journal
    path('', include('myapp.urls', namespace='myapp')),
]
