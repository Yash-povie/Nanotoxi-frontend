from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Data Models ---

class HealthStatus(BaseModel):
    status: str
    uptime: str
    model_loaded: bool
    api_version: str

class Stats(BaseModel):
    total_predictions: int
    avg_response_time_ms: float
    accuracy: float

class PredictionDataPoint(BaseModel):
    date: str
    count: int

class RequestStats(BaseModel):
    total_requests: int
    successful_requests: int
    failed_requests: int

class ContactRequest(BaseModel):
    id: int
    name: str
    email: str
    message: str
    submitted_at: str

class DatasetRequest(BaseModel):
    id: int
    institution_name: str
    email: str
    dataset_type: str
    purpose: str
    submitted_at: str

class NanoparticleType(BaseModel):
    type: str
    count: int

# --- Helper Functions for Mock Data ---

def generate_time_series_data(days=30):
    data = []
    base_date = datetime.now()
    for i in range(days):
        date = (base_date - timedelta(days=i)).strftime("%Y-%m-%d")
        count = random.randint(50, 200)
        data.append({"date": date, "count": count})
    return list(reversed(data))

# --- API Endpoints ---

@app.get("/health", response_model=HealthStatus)
def get_health():
    """
    Returns API uptime and health status.
    Also returns model load status.
    """
    return {
        "status": "healthy",
        "uptime": "5 days, 14 hours",
        "model_loaded": True,
        "api_version": "1.0.0"
    }

@app.get("/api/dashboard/stats", response_model=Stats)
def get_dashboard_stats():
    """
    Returns KPI metrics:
    - Total Predictions run
    - Average response time
    """
    return {
        "total_predictions": 12453,
        "avg_response_time_ms": 142.5,  # ms
        "accuracy": 94.2 # percent
    }

@app.get("/api/dashboard/predictions-over-time", response_model=List[PredictionDataPoint])
def get_predictions_over_time():
    """
    Returns data for Line/Bar chart showing predictions over time.
    """
    return generate_time_series_data(30)

@app.get("/api/dashboard/request-stats", response_model=RequestStats)
def get_request_stats():
    """
    Returns data for Pie/Donut chart showing Failed vs Successful requests.
    """
    total = 5000
    failed = 125
    return {
        "total_requests": total,
        "successful_requests": total - failed,
        "failed_requests": failed
    }

@app.get("/api/dashboard/contact-requests", response_model=List[ContactRequest])
def get_contact_requests():
    """
    Returns a list of contact form submissions (Table data).
    """
    return [
        {
            "id": 1,
            "name": "Alice Johnson",
            "email": "alice.j@university.edu",
            "message": "Interested in collaboration on nanoparticle research.",
            "submitted_at": "2023-10-25T10:30:00Z"
        },
        {
            "id": 2,
            "name": "Dr. Bob Smith",
            "email": "bsmith@research-lab.org",
            "message": "Question about the model accuracy for gold nanoparticles.",
            "submitted_at": "2023-10-24T14:15:00Z"
        },
        {
            "id": 3,
            "name": "Carol Williams",
            "email": "cwilliams@tech-corp.com",
            "message": "Is there an API access available for commercial use?",
            "submitted_at": "2023-10-23T09:00:00Z"
        }
    ]

@app.get("/api/dashboard/dataset-requests", response_model=List[DatasetRequest])
def get_dataset_requests():
    """
    Returns a list of dataset share submissions (Table data).
    """
    return [
        {
            "id": 101,
            "institution_name": "MIT",
            "email": "researcher@mit.edu",
            "dataset_type": "Silver Nanoparticles",
            "purpose": "Validation of new synthesis method",
            "submitted_at": "2023-10-26T11:20:00Z"
        },
        {
            "id": 102,
            "institution_name": "Stanford University",
            "email": "grad_student@stanford.edu",
            "dataset_type": "Gold Nanorods",
            "purpose": "Machine learning model training comparison",
            "submitted_at": "2023-10-25T16:45:00Z"
        },
         {
            "id": 103,
            "institution_name": "Imperial College London",
            "email": "contact@imperial.ac.uk",
            "dataset_type": "Carbon Dots",
            "purpose": "To study optical properties",
            "submitted_at": "2023-10-24T08:30:00Z"
        }
    ]

@app.get("/api/dashboard/nanoparticle-types", response_model=List[NanoparticleType])
def get_nanoparticle_types():
    """
    Returns data for Bar Chart showing most common nanoparticle types.
    """
    return [
        {"type": "Gold (Au)", "count": 450},
        {"type": "Silver (Ag)", "count": 320},
        {"type": "Iron Oxide (Fe3O4)", "count": 210},
        {"type": "Titanium Dioxide (TiO2)", "count": 150},
        {"type": "Zinc Oxide (ZnO)", "count": 120}
    ]

if __name__ == "__main__":
    import uvicorn
    # Run server
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Dashboard API. Visit /docs for API documentation."}

# --- Authentication ---
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

# Secret key (in real app, use env var)
SECRET_KEY = "super-secret-key-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock User DB
users_db = {
    "admin": {
        "username": "admin",
        "full_name": "Admin User",
        "email": "admin@example.com",
        "hashed_password": pwd_context.hash("password123"),
        "disabled": False,
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_db.get(username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

