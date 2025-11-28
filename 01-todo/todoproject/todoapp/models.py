from django.db import models

class TODO(models.Model):
    # The title of the TODO item - required field with max 200 characters
    title = models.CharField(max_length=200)
    
    # Detailed description - optional field that can be left blank
    description = models.TextField(blank=True)
    
    # When this task is due - optional field
    due_date = models.DateField(null=True, blank=True)
    
    # Whether the task has been completed - defaults to False
    resolved = models.BooleanField(default=False)
    
    # Automatically records when the TODO was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        # This makes the TODO display nicely in the admin interface
        return self.title
    
    class Meta:
        # Orders TODOs by creation date, newest first
        ordering = ['-created_at']