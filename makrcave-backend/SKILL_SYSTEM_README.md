# 🔧 MakrCave Backend - Skill Management System

## Overview

This document covers the backend implementation of the MakrCave Skill Management and Equipment Access Control system.

## 🏗️ Architecture

### Database Schema

```sql
-- Core skill definitions
CREATE TABLE skills (
    id VARCHAR PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level skill_level_enum NOT NULL,  -- beginner, intermediate, advanced, expert
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    makerspace_id VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- User skill certifications
CREATE TABLE user_skills (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    skill_id VARCHAR REFERENCES skills(id),
    status skill_status_enum NOT NULL,  -- pending, certified, expired, revoked
    certified_at TIMESTAMP,
    expires_at TIMESTAMP,
    certified_by VARCHAR,
    notes TEXT,
    quiz_score VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Skill certification requests
CREATE TABLE skill_requests (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    skill_id VARCHAR REFERENCES skills(id),
    status request_status_enum NOT NULL,  -- pending, approved, rejected
    reason TEXT,
    notes TEXT,
    reviewed_by VARCHAR,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Audit trail for all skill changes
CREATE TABLE skill_audit_logs (
    id VARCHAR PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    user_id VARCHAR NOT NULL,
    skill_id VARCHAR REFERENCES skills(id),
    performed_by VARCHAR,
    reason TEXT,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Many-to-many: Skill prerequisites
CREATE TABLE skill_prerequisites (
    skill_id VARCHAR REFERENCES skills(id),
    prerequisite_id VARCHAR REFERENCES skills(id),
    PRIMARY KEY (skill_id, prerequisite_id)
);

-- Many-to-many: Equipment skill requirements
CREATE TABLE skill_equipment (
    skill_id VARCHAR REFERENCES skills(id),
    equipment_id VARCHAR REFERENCES equipment(id),
    PRIMARY KEY (skill_id, equipment_id)
);
```

## 🚀 API Endpoints

### Skill Management

#### Create Skill
```http
POST /api/v1/skills/
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "name": "CNC Operation",
    "category": "Machining",
    "level": "advanced",
    "description": "Safe operation of CNC milling machines",
    "makerspace_id": "ms-1",
    "prerequisite_ids": ["skill-safety-101"],
    "equipment_ids": ["eq-cnc-001", "eq-cnc-002"]
}
```

#### Get Skills
```http
GET /api/v1/skills/?makerspace_id=ms-1&category=Machining&level=advanced&status=active
Authorization: Bearer <token>
```

#### Update Skill
```http
PUT /api/v1/skills/{skill_id}
Authorization: Bearer <admin_token>

{
    "description": "Updated description",
    "status": "active"
}
```

### User Skill Management

#### Grant Skill to User
```http
POST /api/v1/skills/user-skills
Authorization: Bearer <admin_token>

{
    "user_id": "user-123",
    "skill_id": "skill-cnc-operation",
    "status": "certified",
    "notes": "Passed practical exam",
    "quiz_score": "95%"
}
```

#### Get User Skills
```http
GET /api/v1/skills/user-skills?user_id=user-123&status=certified
Authorization: Bearer <token>
```

#### Revoke User Skill
```http
POST /api/v1/skills/user-skills/{user_skill_id}/revoke?reason=Safety%20violation
Authorization: Bearer <admin_token>
```

### Skill Requests

#### Request Skill Certification
```http
POST /api/v1/skills/requests
Authorization: Bearer <user_token>

{
    "skill_id": "skill-laser-cutting",
    "reason": "Need to complete project prototype",
    "notes": "Available for assessment next week"
}
```

#### Approve/Reject Skill Request
```http
PUT /api/v1/skills/requests/{request_id}
Authorization: Bearer <admin_token>

{
    "status": "approved",
    "notes": "Skill demonstration successful"
}
```

### Equipment Access Control

#### Check Equipment Access
```http
GET /api/v1/skills/access/equipment/eq-laser-001?user_id=user-123
Authorization: Bearer <token>

# Response:
{
    "equipment_id": "eq-laser-001",
    "equipment_name": "Epilog Helix Laser",
    "can_access": false,
    "missing_skills": ["Laser Safety Certification"],
    "reason": "Missing required skills: Laser Safety Certification"
}
```

#### Bulk Equipment Access Check
```http
GET /api/v1/skills/access/equipment?user_id=user-123&makerspace_id=ms-1
Authorization: Bearer <token>

# Response:
{
    "user_id": "user-123",
    "equipment_access": [
        {
            "equipment_id": "eq-001",
            "can_access": true,
            "user_skills": ["3D Printer Operation"]
        },
        {
            "equipment_id": "eq-002", 
            "can_access": false,
            "missing_skills": ["Laser Safety"]
        }
    ],
    "summary": {
        "total_equipment": 12,
        "accessible_equipment": 8,
        "access_percentage": 66.7
    }
}
```

#### Get Equipment Skill Requirements
```http
GET /api/v1/skills/equipment-requirements?makerspace_id=ms-1
Authorization: Bearer <token>

# Response:
[
    {
        "equipment_id": "eq-laser-001",
        "equipment_name": "Epilog Helix Laser",
        "required_skills": [
            {
                "skill_id": "skill-laser-safety",
                "skill_name": "Laser Safety Certification",
                "skill_level": "beginner",
                "required_level": "beginner",
                "category": "Safety",
                "is_required": true
            }
        ]
    }
]
```

## 🔧 Implementation

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd makrcave-backend

# Install Python dependencies
pip install -r requirements.txt

# Install additional skill system dependencies
pip install sqlalchemy-utils python-multipart
```

### 2. Database Migration

```bash
# Run the skill system migration
python migrations/create_skill_tables.py

# Verify tables were created
python -c "
from sqlalchemy import inspect
from database import engine
inspector = inspect(engine)
tables = inspector.get_table_names()
skill_tables = [t for t in tables if 'skill' in t]
print(f'Created tables: {skill_tables}')
"
```

### 3. Environment Configuration

Add to `.env`:

```env
# Skill System Configuration
SKILL_CERTIFICATION_EXPIRY_DAYS=365
SKILL_REQUEST_AUTO_APPROVE=false
SKILL_AUDIT_RETENTION_DAYS=1825
EQUIPMENT_SKILL_ENFORCEMENT=true
EQUIPMENT_EMERGENCY_OVERRIDE=false

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/makrcave
REDIS_URL=redis://localhost:6379/0  # For caching

# Authentication
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Start Backend Server

```bash
# Development mode
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🧪 Testing

### Unit Tests

```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run all skill-related tests
pytest tests/test_skill_*.py -v

# Run specific test categories
pytest tests/test_skill_crud.py::test_create_skill -v
pytest tests/test_skill_api.py::test_equipment_access -v
```

### Integration Tests

```bash
# Test skill-equipment integration
pytest tests/test_equipment_access.py -v

# Test complete skill workflow
pytest tests/test_skill_workflow.py -v
```

### API Testing with curl

```bash
# Test skill creation
curl -X POST "http://localhost:8000/api/v1/skills/" \
     -H "Authorization: Bearer ${ADMIN_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Skill",
       "category": "Testing",
       "level": "beginner",
       "description": "Test skill for API validation",
       "makerspace_id": "ms-1"
     }'

# Test equipment access check
curl -X GET "http://localhost:8000/api/v1/skills/access/equipment/eq-001?user_id=user-123" \
     -H "Authorization: Bearer ${USER_TOKEN}"
```

## 🔍 Monitoring & Logging

### Audit Logging

All skill operations are automatically logged:

```python
# Example audit log entry
{
    "id": "log-123",
    "action": "skill_granted",
    "user_id": "user-123", 
    "skill_id": "skill-cnc",
    "performed_by": "admin-456",
    "reason": "Passed practical assessment",
    "metadata": {
        "quiz_score": "95%",
        "assessment_date": "2024-01-15",
        "equipment_authorized": ["eq-cnc-001", "eq-cnc-002"]
    },
    "created_at": "2024-01-15T10:30:00Z"
}
```

### Performance Monitoring

```python
# Add to main.py for monitoring
import time
from fastapi import Request

@app.middleware("http")
async def monitor_skill_requests(request: Request, call_next):
    if "/skills/" in str(request.url):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log slow skill operations
        if process_time > 1.0:
            logger.warning(f"Slow skill operation: {request.url} took {process_time:.2f}s")
        
        return response
    return await call_next(request)
```

## 🚨 Error Handling

### Common Error Responses

```json
// Skill not found
{
    "detail": "Skill not found",
    "status_code": 404,
    "error_type": "skill_not_found"
}

// Insufficient permissions
{
    "detail": "Missing required skills: Laser Safety, Material Handling",
    "status_code": 403,
    "error_type": "insufficient_skills",
    "missing_skills": ["Laser Safety", "Material Handling"]
}

// Skill request already exists
{
    "detail": "Skill request already pending for this user",
    "status_code": 409,
    "error_type": "request_conflict",
    "existing_request_id": "req-123"
}
```

### Error Recovery

```python
# Automatic retry for skill verification
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))
async def verify_equipment_access(user_id: str, equipment_id: str):
    try:
        return await check_equipment_access(db, user_id, equipment_id)
    except Exception as e:
        logger.error(f"Equipment access check failed: {e}")
        raise
```

## 🔒 Security Considerations

### Input Validation

```python
# All inputs are validated using Pydantic schemas
class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, regex="^[a-zA-Z0-9\\s-]+$")
    category: str = Field(..., min_length=1, max_length=50)
    level: SkillLevel  # Enum validation
    description: Optional[str] = Field(None, max_length=1000)
```

### Authorization Checks

```python
# Role-based access control
def require_skill_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["super_admin", "makerspace_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Equipment access verification
def verify_equipment_access(equipment_id: str, user_id: str, db: Session):
    access_check = check_equipment_access(db, user_id, equipment_id)
    if not access_check.can_access:
        raise HTTPException(
            status_code=403, 
            detail=f"Equipment access denied: {access_check.reason}"
        )
```

### Data Protection

- All skill data is encrypted in transit (HTTPS)
- Sensitive skill information is not logged
- Audit logs exclude personal details
- Database connections use SSL encryption
- API keys are rotated regularly

## 📊 Performance Optimization

### Database Indexing

```sql
-- Critical indexes for skill system performance
CREATE INDEX idx_user_skills_user_status ON user_skills(user_id, status);
CREATE INDEX idx_user_skills_skill_status ON user_skills(skill_id, status);
CREATE INDEX idx_skill_requests_status ON skill_requests(status, created_at);
CREATE INDEX idx_skill_equipment_equipment ON skill_equipment(equipment_id);
CREATE INDEX idx_skill_audit_logs_date ON skill_audit_logs(created_at);
```

### Caching Strategy

```python
# Redis caching for frequently accessed data
from redis import Redis

redis_client = Redis.from_url(os.getenv("REDIS_URL"))

async def get_user_skills_cached(user_id: str):
    cache_key = f"user_skills:{user_id}"
    cached = redis_client.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    skills = get_user_skills(db, user_id=user_id, status=SkillStatus.CERTIFIED)
    
    # Cache for 5 minutes
    redis_client.setex(cache_key, 300, json.dumps(skills))
    return skills
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Run migrations on startup
CMD ["sh", "-c", "python migrations/create_skill_tables.py && python -m uvicorn main:app --host 0.0.0.0 --port 8000"]
```

### Production Deployment

```bash
# Build and deploy
docker build -t makrcave-backend:latest .

# Run with environment variables
docker run -d \
  --name makrcave-backend \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e SKILL_CERTIFICATION_EXPIRY_DAYS=365 \
  makrcave-backend:latest

# Health check
curl http://localhost:8000/health
```

### Load Balancing

```nginx
# nginx configuration for load balancing
upstream makrcave_backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    location /api/v1/skills/ {
        proxy_pass http://makrcave_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

This backend implementation provides a **complete, scalable, and secure** skill management system that can handle production workloads while maintaining data integrity and performance.
