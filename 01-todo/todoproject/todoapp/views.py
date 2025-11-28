from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import TODO

def home(request):
    """
    Display all TODO items on the home page.
    Separates completed and pending tasks for better organization.
    """
    # Get all TODOs, ordered by creation date (newest first)
    todos = TODO.objects.all()
    
    # Pass the TODOs to the template for display
    context = {
        'todos': todos,
    }
    return render(request, 'todoapp/home.html', context)

def create_todo(request):
    """
    Handle creation of new TODO items.
    Only accepts POST requests with form data.
    """
    if request.method == 'POST':
        # Extract data from the submitted form
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date') or None
        
        # Create and save the new TODO
        TODO.objects.create(
            title=title,
            description=description,
            due_date=due_date
        )
        
        # Redirect back to home page to see the new TODO
        return redirect('home')
    
    return redirect('home')

def toggle_todo(request, todo_id):
    """
    Toggle the resolved status of a TODO item.
    This lets users mark tasks as complete or incomplete.
    """
    todo = get_object_or_404(TODO, id=todo_id)
    # Flip the resolved status: True becomes False, False becomes True
    todo.resolved = not todo.resolved
    todo.save()
    return redirect('home')

def delete_todo(request, todo_id):
    """
    Delete a TODO item permanently.
    """
    todo = get_object_or_404(TODO, id=todo_id)
    todo.delete()
    return redirect('home')