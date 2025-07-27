from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey, Integer, Float, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base

class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in-progress"
    COMPLETE = "complete"
    ON_HOLD = "on-hold"
    CANCELLED = "cancelled"

class ProjectVisibility(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    TEAM_ONLY = "team-only"

class CollaboratorRole(str, enum.Enum):
    VIEWER = "viewer"
    EDITOR = "editor"
    OWNER = "owner"

class ActivityType(str, enum.Enum):
    PROJECT_CREATED = "project_created"
    PROJECT_UPDATED = "project_updated"
    MEMBER_ADDED = "member_added"
    MEMBER_REMOVED = "member_removed"
    MEMBER_ROLE_CHANGED = "member_role_changed"
    BOM_ITEM_ADDED = "bom_item_added"
    BOM_ITEM_REMOVED = "bom_item_removed"
    BOM_ITEM_UPDATED = "bom_item_updated"
    EQUIPMENT_RESERVED = "equipment_reserved"
    EQUIPMENT_UNRESERVED = "equipment_unreserved"
    FILE_UPLOADED = "file_uploaded"
    FILE_REMOVED = "file_removed"
    MILESTONE_ADDED = "milestone_added"
    MILESTONE_COMPLETED = "milestone_completed"
    STATUS_CHANGED = "status_changed"

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(String(100), primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    owner_id = Column(String(100), nullable=False, index=True)
    makerspace_id = Column(String(100), nullable=True, index=True)
    visibility = Column(Enum(ProjectVisibility), nullable=False, default=ProjectVisibility.PRIVATE)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.DRAFT)
    
    # Timeline fields
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    
    # GitHub Integration
    github_repo_url = Column(String(500), nullable=True)  # GitHub repository URL
    github_repo_name = Column(String(200), nullable=True)  # Repository name (owner/repo)
    github_access_token = Column(String(500), nullable=True)  # Encrypted access token for private repos
    github_webhook_secret = Column(String(200), nullable=True)  # Webhook secret for real-time updates
    github_integration_enabled = Column(Boolean, default=False)  # Whether GitHub integration is active
    github_default_branch = Column(String(100), default="main")  # Default branch to track

    # Metadata
    tags = Column(JSON, nullable=True, default=list)  # List of project tags
    is_featured = Column(Boolean, default=False)  # Admin can feature projects
    is_approved = Column(Boolean, default=True)  # Admin approval for public projects
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    collaborators = relationship("ProjectCollaborator", back_populates="project", cascade="all, delete-orphan")
    bom_items = relationship("ProjectBOM", back_populates="project", cascade="all, delete-orphan")
    equipment_reservations = relationship("ProjectEquipmentReservation", back_populates="project", cascade="all, delete-orphan")
    files = relationship("ProjectFile", back_populates="project", cascade="all, delete-orphan")
    activity_logs = relationship("ProjectActivityLog", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")

class ProjectCollaborator(Base):
    __tablename__ = "project_collaborators"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    user_id = Column(String(100), nullable=False, index=True)
    role = Column(Enum(CollaboratorRole), nullable=False, default=CollaboratorRole.VIEWER)
    invited_by = Column(String(100), nullable=False)
    invited_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="collaborators")

class ProjectBOM(Base):
    __tablename__ = "project_bom"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    
    # Item details
    item_type = Column(String(50), nullable=False)  # "inventory" or "makrx_store"
    item_id = Column(String(100), nullable=False)  # Reference to inventory or store item
    item_name = Column(String(200), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_cost = Column(Float, nullable=True)
    total_cost = Column(Float, nullable=True)
    
    # Usage details
    usage_notes = Column(Text, nullable=True)
    is_critical = Column(Boolean, default=False)  # Critical path item
    procurement_status = Column(String(50), default="needed")  # needed, ordered, received, reserved
    
    # Metadata
    added_by = Column(String(100), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="bom_items")

class ProjectEquipmentReservation(Base):
    __tablename__ = "project_equipment_reservations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    equipment_id = Column(String(100), nullable=False)  # Reference to equipment
    reservation_id = Column(String(100), nullable=True)  # Reference to actual reservation
    
    # Reservation details
    requested_start = Column(DateTime(timezone=True), nullable=False)
    requested_end = Column(DateTime(timezone=True), nullable=False)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    actual_end = Column(DateTime(timezone=True), nullable=True)
    
    # Status and notes
    status = Column(String(50), default="requested")  # requested, confirmed, in_use, completed, cancelled
    usage_notes = Column(Text, nullable=True)
    
    # Metadata
    requested_by = Column(String(100), nullable=False)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="equipment_reservations")

class ProjectFile(Base):
    __tablename__ = "project_files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    
    # File details
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)  # document, image, 3d_model, drawing, etc.
    file_size = Column(Integer, nullable=False)
    file_url = Column(String(500), nullable=False)  # URL or path to file
    
    # File metadata
    description = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)  # Whether file is publicly accessible
    version = Column(String(20), default="1.0")
    
    # Upload details
    uploaded_by = Column(String(100), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="files")

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    
    # Milestone details
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    
    # Status and priority
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="medium")  # low, medium, high, critical
    order_index = Column(Integer, default=0)  # For ordering milestones
    
    # Metadata
    created_by = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_by = Column(String(100), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="milestones")

class ProjectActivityLog(Base):
    __tablename__ = "project_activity_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(String(100), ForeignKey("projects.project_id"), nullable=False)
    
    # Activity details
    activity_type = Column(Enum(ActivityType), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    # Activity data (JSON for flexibility)
    metadata = Column(JSON, nullable=True)  # Store additional context about the activity
    
    # User and timing
    user_id = Column(String(100), nullable=False)
    user_name = Column(String(100), nullable=False)  # Cached for display
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="activity_logs")
