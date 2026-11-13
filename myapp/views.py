# myapp/views.py
# ============================================================
# View functions for the StudyFlow application.
#
# These are the simplest possible Django views — each one
# just receives a web request and returns a rendered HTML
# template. No database queries, no forms, no business logic.
#
# All interactivity and data handling is done entirely in
# JavaScript on the frontend.
# ============================================================

from django.shortcuts import render


def dashboard(request):
    """Render the main dashboard page."""
    return render(request, 'myapp/dashboard.html')


def planner(request):
    """Render the Study Planner page."""
    return render(request, 'myapp/planner.html')


def schedule(request):
    """Render the Personal Schedule page."""
    return render(request, 'myapp/schedule.html')


def journal(request):
    """Render the Digital Journal page."""
    return render(request, 'myapp/journal.html')


def goals(request):
    """Render the Goals and Progress page."""
    return render(request, 'myapp/goals.html')
