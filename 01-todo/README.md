# Django TODO Application

## Project Overview

This is a fully functional TODO list application built with Django, a powerful Python web framework. The application allows you to manage your daily tasks through a clean web interface where you can create new tasks, mark them as complete, and delete them when they're no longer needed. This project demonstrates fundamental Django concepts including models for database structure, views for handling user interactions, templates for the user interface, and comprehensive tests to ensure everything works correctly.

## Features

The application provides several core features that make task management straightforward and efficient. You can create new TODO items with a title, an optional description for additional details, and an optional due date to track deadlines. Each task can be marked as complete or incomplete with a simple button click, allowing you to toggle the status as needed. When tasks are no longer relevant, you can permanently delete them from your list. The interface automatically separates completed tasks from pending ones, making it easy to see what still needs your attention. All tasks are displayed in reverse chronological order, with the newest tasks appearing first.

## Technology Stack

This project is built entirely with Django version 5.x or higher, which provides the web framework foundation. Python 3.8 or higher serves as the programming language, offering modern syntax and features. SQLite is used as the database system, which comes built into Python and requires no additional setup. The frontend uses standard HTML5 and CSS3 for structure and styling, with Django's template language enabling dynamic content rendering.

## Project Structure

Understanding the project structure helps you navigate the codebase and understand how Django organizes applications. The main project directory is called todoproject, which contains the overall configuration files including settings.py for project configuration, urls.py for routing web addresses to views, and wsgi.py for deployment configuration. Within this project, the todoapp directory houses all the TODO-specific functionality. This includes models.py where the database structure is defined, views.py containing the logic for handling user requests, urls.py mapping URLs to specific views, and tests.py with automated tests verifying functionality. The templates subdirectory within todoapp contains the HTML files that define how pages look, with base.html providing the common structure and home.html displaying the actual TODO list.

## Installation and Setup

Getting this application running on your local machine involves several straightforward steps. First, ensure you have Python installed on your system by checking your version with the command "python --version" or "python3 --version". You should see version 3.8 or higher for everything to work properly.

Begin by cloning or downloading this repository to your local machine. Open your terminal and navigate to the project directory where you saved the code. Before installing Django, it's good practice to create a virtual environment, which keeps your project dependencies isolated from other Python projects. You can create one using "python -m venv venv" and then activate it with "source venv/bin/activate" on Mac or Linux, or "venv\Scripts\activate" on Windows.

Next, install Django using pip, Python's package installer, by running "pip install django". This downloads and installs Django along with its dependencies. With Django installed, you need to set up the database. Django uses migrations to create database tables based on your models. Run "python manage.py makemigrations" to create migration files, followed by "python manage.py migrate" to actually create the database tables.

To start using the application, launch the development server with "python manage.py runserver". This starts a lightweight web server on your local machine. Open your web browser and navigate to "<http://localhost:8000>" or "<http://127.0.0.1:8000>" to see your TODO application in action.

## Usage Guide

Using the application is intuitive and requires no technical knowledge. When you first visit the application, you'll see a form at the top of the page for adding new TODO items. Enter a title for your task in the first field, which is required. If you want to add more context, you can fill in the description field with additional details about what needs to be done. If your task has a deadline, click the due date field and select a date from the calendar picker. Once you've filled in the information, click the "Add TODO" button and your task will appear in the list below.

Each TODO item in your list displays with its title prominently shown, along with the description and due date if you provided them. Next to each task, you'll find two buttons. The "Complete" button (or "Undo" if the task is already marked complete) lets you toggle the completion status. When you mark a task as complete, it becomes grayed out and crossed through, giving you visual feedback that it's done. The "Delete" button permanently removes the task from your list when you no longer need to track it.

## Running Tests

This application includes comprehensive automated tests that verify all functionality works as expected. Testing is an important practice in software development because it catches bugs early and ensures that new changes don't break existing features. To run the test suite, simply execute "python manage.py test" from the project directory. Django will automatically discover all test files, run each test, and display the results. You should see output indicating how many tests were run and whether they all passed. If any tests fail, Django provides detailed information about what went wrong, helping you identify and fix issues quickly.

The test suite covers several important scenarios. It verifies that TODO items can be created with all their fields populated correctly. It checks that the home page loads successfully and displays the expected content. It confirms that you can create TODOs through the web interface by submitting the form. It ensures the toggle functionality works in both directions, marking tasks complete and then incomplete. Finally, it validates that the delete functionality actually removes TODOs from the database.

## Database Schema

Understanding the database structure helps you grasp how information is stored and organized. The application uses a single model called TODO, which represents a task in your list. This model has several fields that capture different aspects of each task. The title field is a character field limited to 200 characters and is required for every TODO. The description field is a text field that can hold longer content and is optional, allowing you to add as much detail as you want or leave it empty for simple tasks. The due_date field stores a date value and is optional, letting you track deadlines when they matter. The resolved field is a boolean that defaults to false, indicating whether a task has been completed. Finally, there's a created_at timestamp field that automatically records when each TODO was created, which the application uses to sort tasks with the newest ones first.

## Development Notes

If you're interested in extending or modifying this application, there are several important points to understand. The application follows Django's standard Model-View-Template architecture, which separates data structure from business logic and presentation. This separation makes the code easier to understand and modify because each component has a clear, focused responsibility.

The views use Django's built-in shortcuts like "get_object_or_404" which handles common patterns elegantly. For instance, when toggling or deleting a TODO, this function automatically returns a 404 error if the requested TODO doesn't exist, which is exactly the behavior you want. All forms use Django's CSRF protection through the "{% csrf_token %}" template tag, which prevents cross-site request forgery attacks by ensuring that form submissions actually come from your application.

The templates extend from a base template using Django's template inheritance system. This means common elements like the page structure and styling are defined once in base.html, and specific pages like home.html only need to define their unique content. This approach keeps your code DRY (Don't Repeat Yourself) and makes site-wide changes easy to implement.

## Future Enhancement Ideas

While this application is fully functional, there are many ways you could extend it to add more features. You could add user authentication so that each person has their own private TODO list. You could implement categories or tags to organize tasks by project or context. Adding priority levels would let users indicate which tasks are most urgent. You could create search and filter functionality to find specific tasks quickly when your list grows long. Email reminders for upcoming due dates would help users stay on top of deadlines. A REST API would allow mobile apps or other services to interact with your TODO list programmatically.

## Troubleshooting Common Issues

If you encounter problems getting the application running, here are solutions to common issues. If you see "command not found" when trying to run Django commands, make sure you've activated your virtual environment and installed Django. If the server won't start due to port conflicts, you can specify a different port by running "python manage.py runserver 8080" or any other available port number. If you see database-related errors, try deleting the db.sqlite3 file and running the migrations again from scratch. If templates aren't loading, verify that your todoapp is listed in INSTALLED_APPS in settings.py and that your templates are in the correct directory structure.

## Contributing

If you'd like to improve this application, contributions are welcome. You can fork the repository, create a new branch for your feature, make your changes with clear commit messages, ensure all tests pass and add new tests for new features, and then submit a pull request with a description of your changes.

## License

This project is created for educational purposes and is free to use, modify, and distribute. It demonstrates fundamental Django concepts and serves as a learning resource for those new to web development with Django.

## Contact and Support

If you have questions about this application or encounter issues, you can refer to the official Django documentation at docs.djangoproject.com, which provides comprehensive guides and references. The Django community is very helpful and active on forums and discussion boards if you need additional assistance with concepts or troubleshooting.
