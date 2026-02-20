# Backend API (FastAPI)

This folder contains the mock API server for the dashboard project.

## Prerequisites

- Python 3.8+
- pip

## Setup

1.  Navigate to this directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    # If 'python' command doesn't work, use 'py'
    py -m venv venv
    .\venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Start the development server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, visit:

-   **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Endpoints

-   `GET /health`: System health and model status
-   `GET /api/dashboard/stats`: KPI metrics
-   `GET /api/dashboard/predictions-over-time`: Chart data
-   `GET /api/dashboard/request-stats`: Request success/fail rates
-   `GET /api/dashboard/contact-requests`: Contact form submissions
-   `GET /api/dashboard/dataset-requests`: Dataset sharing requests
-   `GET /api/dashboard/nanoparticle-types`: Common nanoparticle types
