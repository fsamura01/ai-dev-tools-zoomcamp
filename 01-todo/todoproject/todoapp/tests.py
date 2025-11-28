from django.test import TestCase, Client
from django.urls import reverse
from .models import TODO
from datetime import date

class TODOModelTest(TestCase):
    """Test the TODO model's functionality"""
    
    def test_create_todo(self):
        """Test that we can create a TODO item with all fields"""
        todo = TODO.objects.create(
            title="Test Task",
            description="This is a test",
            due_date=date.today(),
            resolved=False
        )
        # Verify the TODO was created correctly
        self.assertEqual(todo.title, "Test Task")
        self.assertEqual(todo.description, "This is a test")
        self.assertFalse(todo.resolved)
    
    def test_todo_string_representation(self):
        """Test that TODOs display their title when converted to string"""
        todo = TODO.objects.create(title="My Task")
        self.assertEqual(str(todo), "My Task")
    
    def test_todo_defaults(self):
        """Test that default values work correctly"""
        todo = TODO.objects.create(title="Minimal Task")
        # Description should be empty by default
        self.assertEqual(todo.description, "")
        # Resolved should be False by default
        self.assertFalse(todo.resolved)
        # Due date should be None by default
        self.assertIsNone(todo.due_date)

class TODOViewTest(TestCase):
    """Test the TODO views and user interactions"""
    
    def setUp(self):
        """Create a test client for making requests"""
        self.client = Client()
    
    def test_home_page_loads(self):
        """Test that the home page loads successfully"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "TODO Application")
    
    def test_create_todo_via_post(self):
        """Test that we can create a TODO through the web interface"""
        response = self.client.post(reverse('create_todo'), {
            'title': 'New Task',
            'description': 'Task description',
        })
        # Should redirect after creation
        self.assertEqual(response.status_code, 302)
        # Verify the TODO was created
        self.assertEqual(TODO.objects.count(), 1)
        self.assertEqual(TODO.objects.first().title, 'New Task')
    
    def test_toggle_todo_status(self):
        """Test that we can mark a TODO as complete and incomplete"""
        todo = TODO.objects.create(title="Test", resolved=False)
        # Toggle to complete
        self.client.post(reverse('toggle_todo', args=[todo.id]))
        todo.refresh_from_db()
        self.assertTrue(todo.resolved)
        # Toggle back to incomplete
        self.client.post(reverse('toggle_todo', args=[todo.id]))
        todo.refresh_from_db()
        self.assertFalse(todo.resolved)
    
    def test_delete_todo(self):
        """Test that we can delete a TODO"""
        todo = TODO.objects.create(title="To Delete")
        self.assertEqual(TODO.objects.count(), 1)
        # Delete the TODO
        self.client.post(reverse('delete_todo', args=[todo.id]))
        # Verify it's gone
        self.assertEqual(TODO.objects.count(), 0)