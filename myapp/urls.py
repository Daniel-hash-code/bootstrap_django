# myapp/urls.py
# ============================================================
# URL configuration for the myapp application.
# Each URL pattern maps a web address to a view function.
# The views simply render HTML templates — no backend logic.
# ============================================================

from django.urls import path
from . import views

# The 'app_name' lets us use namespaced URLs in templates,
# e.g. {% url 'myapp:dashboard' %}
app_name = 'myapp'

urlpatterns = [
    # Dashboard — the main landing page
    path('', views.dashboard, name='dashboard'),

    # Study Planner — organise and track study activities
    path('planner/', views.planner, name='planner'),

    # Personal Schedule — daily and weekly schedule view
    path('schedule/', views.schedule, name='schedule'),

    # Digital Journal — personal diary and reflection space
    path('journal/', views.journal, name='journal'),

    # Goals & Progress — track academic and personal goals
    path('goals/', views.goals, name='goals'),
]
