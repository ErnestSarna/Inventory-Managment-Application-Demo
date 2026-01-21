# Inventory-Managment-Application

A full-stack React + Django REST Framework application for managing projects, inventory items, purchase orders, vendors, and locations.
Designed for internal project tracking with session-based authentication, inline table editing, and a clean, practical UI.

To run:
Execute "docker-compose up --build" from the main project directory.

If Docker back-end can't find entrypoint.sh change End of Line sequence in entrypoint.sh to LF. Github automatically changes it to CRLF which can cause issues on Windows machines.
