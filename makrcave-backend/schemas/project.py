from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.project import ProjectStatus, ProjectVisibility, CollaboratorRole, ActivityType

# Base schemas
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    visibility: ProjectVisibility = ProjectVisibility.PRIVATE
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    tags: Optional[List[str]] = []

class ProjectCreate(ProjectBase):
    project_id: str = Field(..., min_length=1, max_length=100)
    makerspace_id: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    visibility: Optional[ProjectVisibility] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    tags: Optional[List[str]] = None

# Response schemas
class ProjectCollaboratorResponse(BaseModel):
    id: int
    user_id: str
    role: CollaboratorRole
    invited_by: str
    invited_at: datetime
    accepted_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectBOMResponse(BaseModel):
    id: int
    item_type: str
    item_id: str
    item_name: str
    quantity: int
    unit_cost: Optional[float] = None
    total_cost: Optional[float] = None
    usage_notes: Optional[str] = None
    is_critical: bool = False
    procurement_status: str = "needed"
    added_by: str
    added_at: datetime

    class Config:
        from_attributes = True

class ProjectEquipmentReservationResponse(BaseModel):
    id: int
    equipment_id: str
    reservation_id: Optional[str] = None
    requested_start: datetime
    requested_end: datetime
    actual_start: Optional[datetime] = None
    actual_end: Optional[datetime] = None
    status: str = "requested"
    usage_notes: Optional[str] = None
    requested_by: str
    requested_at: datetime

    class Config:
        from_attributes = True

class ProjectFileResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    file_url: str
    description: Optional[str] = None
    is_public: bool = False
    version: str = "1.0"
    uploaded_by: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ProjectMilestoneResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    is_completed: bool = False
    priority: str = "medium"
    order_index: int = 0
    created_by: str
    created_at: datetime
    completed_by: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectActivityLogResponse(BaseModel):
    id: int
    activity_type: ActivityType
    title: str
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    user_id: str
    user_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    project_id: str
    name: str
    description: Optional[str] = None
    owner_id: str
    makerspace_id: Optional[str] = None
    visibility: ProjectVisibility
    status: ProjectStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    tags: Optional[List[str]] = []
    is_featured: bool = False
    is_approved: bool = True
    created_at: datetime
    updated_at: datetime
    
    # Related data
    collaborators: List[ProjectCollaboratorResponse] = []
    bom_items: List[ProjectBOMResponse] = []
    equipment_reservations: List[ProjectEquipmentReservationResponse] = []
    files: List[ProjectFileResponse] = []
    milestones: List[ProjectMilestoneResponse] = []
    activity_logs: List[ProjectActivityLogResponse] = []

    class Config:
        from_attributes = True

class ProjectSummaryResponse(BaseModel):
    project_id: str
    name: str
    description: Optional[str] = None
    owner_id: str
    visibility: ProjectVisibility
    status: ProjectStatus
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    tags: Optional[List[str]] = []
    is_featured: bool = False
    created_at: datetime
    updated_at: datetime
    
    # Summary counts
    collaborator_count: int = 0
    bom_items_count: int = 0
    files_count: int = 0
    milestones_count: int = 0
    completed_milestones_count: int = 0

    class Config:
        from_attributes = True

# Collaborator schemas
class CollaboratorAdd(BaseModel):
    user_id: str = Field(..., min_length=1)
    role: CollaboratorRole = CollaboratorRole.VIEWER

class CollaboratorUpdate(BaseModel):
    role: CollaboratorRole

# BOM schemas
class BOMItemCreate(BaseModel):
    item_type: str = Field(..., regex="^(inventory|makrx_store)$")
    item_id: str = Field(..., min_length=1)
    item_name: str = Field(..., min_length=1, max_length=200)
    quantity: int = Field(..., gt=0)
    unit_cost: Optional[float] = Field(None, ge=0)
    usage_notes: Optional[str] = None
    is_critical: bool = False

class BOMItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)
    unit_cost: Optional[float] = Field(None, ge=0)
    usage_notes: Optional[str] = None
    is_critical: Optional[bool] = None
    procurement_status: Optional[str] = None

# Equipment reservation schemas
class EquipmentReservationCreate(BaseModel):
    equipment_id: str = Field(..., min_length=1)
    requested_start: datetime
    requested_end: datetime
    usage_notes: Optional[str] = None

    @validator('requested_end')
    def end_after_start(cls, v, values):
        if 'requested_start' in values and v <= values['requested_start']:
            raise ValueError('End time must be after start time')
        return v

class EquipmentReservationUpdate(BaseModel):
    requested_start: Optional[datetime] = None
    requested_end: Optional[datetime] = None
    status: Optional[str] = None
    usage_notes: Optional[str] = None

# File schemas
class FileUpload(BaseModel):
    filename: str = Field(..., min_length=1, max_length=255)
    file_type: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_public: bool = False
    version: str = "1.0"

# Milestone schemas
class MilestoneCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: str = Field("medium", regex="^(low|medium|high|critical)$")

class MilestoneUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    target_date: Optional[datetime] = None
    priority: Optional[str] = Field(None, regex="^(low|medium|high|critical)$")
    is_completed: Optional[bool] = None
    order_index: Optional[int] = None

# Activity log schemas
class ActivityLogCreate(BaseModel):
    activity_type: ActivityType
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# Search and filter schemas
class ProjectFilter(BaseModel):
    status: Optional[List[ProjectStatus]] = None
    visibility: Optional[List[ProjectVisibility]] = None
    owner_id: Optional[str] = None
    makerspace_id: Optional[str] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    search: Optional[str] = None  # Search in name and description

class ProjectSort(BaseModel):
    field: str = Field("updated_at", regex="^(name|created_at|updated_at|start_date|end_date)$")
    direction: str = Field("desc", regex="^(asc|desc)$")

# Batch operation schemas
class ProjectStatusUpdate(BaseModel):
    status: ProjectStatus

class ProjectBulkDelete(BaseModel):
    project_ids: List[str] = Field(..., min_items=1)

# Analytics schemas
class ProjectStatistics(BaseModel):
    total_projects: int
    projects_by_status: Dict[str, int]
    projects_by_visibility: Dict[str, int]
    active_projects: int
    completed_projects: int
    average_project_duration: Optional[float] = None  # In days
    top_tags: List[Dict[str, Any]] = []

class UserProjectStatistics(BaseModel):
    owned_projects: int
    collaborated_projects: int
    completed_projects: int
    active_projects: int
    favorite_tags: List[str] = []
