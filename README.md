#### whereivebeen
# Where I've Been Application

This project is a full-stack web application that allows users to select and manage U.S. counties using an interactive map. The backend is built with FastAPI and utilizes a PostGIS database for geospatial operations, while the frontend is developed using React and Leaflet for map interactions.

## Features

- Interactive map to view and select U.S. counties.
- User authentication to manage sessions and personalize experiences.
- Dashboard for users to view their selected counties.
- Responsive design for desktop and mobile users.

## Technology Stack

- **Backend**: FastAPI, PostgreSQL with PostGIS extension
- **Frontend**: React, Leaflet for mapping
- **Database**: PostgreSQL
- **Deployment**: Docker

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose (optional for managing multi-container setups)
### Installing

1. **Clone the repository**
   ```bash
   git clone https://github.com/sempervent/whereivebeen.git
   cd whereivebeen
   ```
2. **Set up the Backend**
    Navigate to the backend directory and build the Docker container:
    ```bash
   cd backend
   docker build -t backend .
   ```
3. **Run the Docker container**
    ```bash
   docker run -p 8000:8000 backend
   ```
4. **Set up the Frontend**
   Navigate to the frontend directory and build the Docker container:
   ```bash
   cd ../frontend
   docker build -t frontend .
   ```
   For some reason I've had to build outside of the Docker image to get it to work.  I'm not sure why.
5. **Run the Docker container**
   ```bash
   docker run -p 5000:5000 frontend
   ```
### Usage

After both containers are running, visit http://localhost:5000 in your web browser to access the application. Use the interactive map to select and view counties.
You can also use the following command to run the stack:
```bash
   cd app/ && npm run build
   docker compose up -d --build
```
Or very simply with `docker-compose up -d` for the first time trying it out.

### Development
#### Backend

The backend API can be accessed at http://localhost:8000/docs for Swagger documentation, which provides a detailed view of the API routes and their specifications.
#### Frontend

Modify components under the src/components and src/pages directories to update the frontend.
### Testing

Explain how to run the automated tests for this system.
### Deployment

Additional notes about how to deploy this on a live system.
### Contributing
* [ ] Add CONTRIBUTING.md
* [ ] Add CODE_OF_CONDUCT.md
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.
### Authors
* Joshua N. Grant

### License

This project is licensed under the MIT License - see the LICENSE.md file for details.
### Acknowledgments

