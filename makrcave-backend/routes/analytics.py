from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime, timedelta

from database import get_db
from dependencies import get_current_user, get_current_makerspace
from crud.analytics import AnalyticsCRUD
from schemas.analytics import (
    UsageEventCreate, UsageEventResponse, AnalyticsOverviewResponse,
    UsageStatsResponse, InventoryInsightsResponse, EquipmentMetricsResponse,
    ProjectAnalyticsResponse, RevenueAnalyticsResponse, ReportRequestCreate,
    ReportRequestResponse, AnalyticsFilters, AnalyticsDashboardResponse,
    EquipmentUsageLogCreate, InventoryAnalyticsCreate, ProjectAnalyticsCreate,
    RevenueAnalyticsCreate, TimePeriodEnum, ChartData, DashboardSection
)
from dependencies import require_role

router = APIRouter(prefix="/analytics", tags=["analytics"])

def get_analytics_crud(db: Session = Depends(get_db)) -> AnalyticsCRUD:
    return AnalyticsCRUD(db)

@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_analytics_overview(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get comprehensive analytics overview for the dashboard"""
    require_role(current_user, ["admin", "super_admin"])
    
    overview_data = analytics_crud.get_analytics_overview(str(makerspace.id))
    return AnalyticsOverviewResponse(**overview_data)

@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get complete dashboard data with all sections"""
    require_role(current_user, ["admin", "super_admin"])
    
    # Get overview data
    overview = analytics_crud.get_analytics_overview(str(makerspace.id))
    
    # Get usage stats
    usage_stats = analytics_crud.get_usage_stats(str(makerspace.id), TimePeriodEnum.WEEKLY)
    
    # Get inventory insights
    inventory_insights = analytics_crud.get_inventory_insights(str(makerspace.id))
    
    # Get equipment metrics
    equipment_metrics = analytics_crud.get_equipment_metrics(str(makerspace.id))
    
    # Get project analytics
    project_analytics = analytics_crud.get_project_analytics(str(makerspace.id))
    
    # Get revenue analytics
    revenue_analytics = analytics_crud.get_revenue_analytics(str(makerspace.id))
    
    # Build dashboard sections
    sections = [
        DashboardSection(
            section_id="usage",
            title="Usage Analytics",
            charts=[
                ChartData(
                    title="Weekly Activity",
                    data=[
                        {"label": "Logins", "value": usage_stats["logins"]},
                        {"label": "New Members", "value": usage_stats["new_members"]},
                        {"label": "Projects", "value": usage_stats["project_creations"]}
                    ],
                    chart_type="bar",
                    x_axis_label="Activity Type",
                    y_axis_label="Count"
                )
            ],
            summary_stats=usage_stats,
            last_updated=datetime.now()
        ),
        DashboardSection(
            section_id="inventory",
            title="Inventory Insights",
            charts=[
                ChartData(
                    title="Top Consumed Items",
                    data=[
                        {"label": f"Item {i+1}", "value": item["total_consumed"]}
                        for i, item in enumerate(inventory_insights["top_consumed_items"][:5])
                    ],
                    chart_type="pie"
                )
            ],
            summary_stats={"efficiency_score": inventory_insights["efficiency_score"]},
            last_updated=datetime.now()
        ),
        DashboardSection(
            section_id="revenue",
            title="Revenue Analytics",
            charts=[
                ChartData(
                    title="Revenue by Source",
                    data=[
                        {"label": source, "value": amount}
                        for source, amount in revenue_analytics["revenue_by_source"].items()
                    ],
                    chart_type="pie"
                )
            ],
            summary_stats={"total_revenue": revenue_analytics["total_revenue"]},
            last_updated=datetime.now()
        )
    ]
    
    return AnalyticsDashboardResponse(
        overview=AnalyticsOverviewResponse(**overview),
        sections=sections,
        generated_at=datetime.now(),
        cache_expires_at=datetime.now()
    )

@router.get("/usage", response_model=UsageStatsResponse)
async def get_usage_analytics(
    period: TimePeriodEnum = TimePeriodEnum.DAILY,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get user activity and usage statistics"""
    require_role(current_user, ["admin", "super_admin"])
    
    usage_stats = analytics_crud.get_usage_stats(str(makerspace.id), period)
    return UsageStatsResponse(**usage_stats)

@router.get("/inventory", response_model=InventoryInsightsResponse)
async def get_inventory_insights(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get inventory consumption and efficiency insights"""
    require_role(current_user, ["admin", "super_admin"])
    
    insights = analytics_crud.get_inventory_insights(str(makerspace.id))
    return InventoryInsightsResponse(**insights)

@router.get("/equipment", response_model=List[EquipmentMetricsResponse])
async def get_equipment_metrics(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get equipment usage, uptime, and maintenance metrics"""
    require_role(current_user, ["admin", "super_admin"])
    
    metrics = analytics_crud.get_equipment_metrics(str(makerspace.id))
    return [EquipmentMetricsResponse(**metric) for metric in metrics]

@router.get("/projects", response_model=ProjectAnalyticsResponse)
async def get_project_analytics(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get project and BOM analytics"""
    require_role(current_user, ["admin", "super_admin"])
    
    analytics = analytics_crud.get_project_analytics(str(makerspace.id))
    return ProjectAnalyticsResponse(**analytics)

@router.get("/revenue", response_model=RevenueAnalyticsResponse)
async def get_revenue_analytics(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get revenue and payment analytics"""
    require_role(current_user, ["admin", "super_admin"])
    
    revenue = analytics_crud.get_revenue_analytics(str(makerspace.id))
    return RevenueAnalyticsResponse(**revenue)

@router.get("/events", response_model=List[UsageEventResponse])
async def get_usage_events(
    start_date: Optional[date] = Query(None, description="Filter events from this date"),
    end_date: Optional[date] = Query(None, description="Filter events until this date"),
    event_types: Optional[List[str]] = Query(None, description="Filter by event types"),
    user_id: Optional[str] = Query(None, description="Filter by specific user"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get filtered usage events"""
    require_role(current_user, ["admin", "super_admin"])
    
    filters = AnalyticsFilters(
        start_date=start_date,
        end_date=end_date,
        event_types=event_types,
        user_id=user_id
    )
    
    events = analytics_crud.get_usage_events(str(makerspace.id), filters, skip, limit)
    return [UsageEventResponse.from_orm(event) for event in events]

@router.post("/events", response_model=UsageEventResponse)
async def create_usage_event(
    event_data: UsageEventCreate,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Record a new usage event"""
    # Auto-set user_id if not provided
    if not event_data.user_id:
        event_data.user_id = current_user.id
    
    event = analytics_crud.create_usage_event(str(makerspace.id), event_data)
    return UsageEventResponse.from_orm(event)

@router.post("/equipment-usage", response_model=dict)
async def record_equipment_usage(
    usage_data: EquipmentUsageLogCreate,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Record equipment usage session"""
    usage_log = analytics_crud.record_equipment_usage(str(makerspace.id), usage_data)
    return {"id": str(usage_log.id), "message": "Equipment usage recorded successfully"}

@router.post("/inventory-analytics", response_model=dict)
async def record_inventory_analytics(
    analytics_data: InventoryAnalyticsCreate,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Record inventory consumption analytics"""
    require_role(current_user, ["admin", "super_admin"])
    
    analytics = analytics_crud.record_inventory_analytics(str(makerspace.id), analytics_data)
    return {"id": str(analytics.id), "message": "Inventory analytics recorded successfully"}

@router.post("/project-analytics", response_model=dict)
async def record_project_analytics(
    analytics_data: ProjectAnalyticsCreate,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Record project analytics"""
    analytics = analytics_crud.record_project_analytics(str(makerspace.id), analytics_data)
    return {"id": str(analytics.id), "message": "Project analytics recorded successfully"}

@router.post("/revenue-analytics", response_model=dict)
async def record_revenue_analytics(
    revenue_data: RevenueAnalyticsCreate,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Record revenue transaction"""
    require_role(current_user, ["admin", "super_admin"])
    
    revenue = analytics_crud.record_revenue_analytics(str(makerspace.id), revenue_data)
    return {"id": str(revenue.id), "message": "Revenue analytics recorded successfully"}

@router.post("/reports/request", response_model=ReportRequestResponse)
async def request_report(
    report_data: ReportRequestCreate,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Request a downloadable report"""
    require_role(current_user, ["admin", "super_admin"])
    
    # Create report request
    report_request = analytics_crud.create_report_request(
        str(makerspace.id), 
        str(current_user.id), 
        report_data
    )
    
    # Add background task to generate report
    background_tasks.add_task(generate_report, str(report_request.id), analytics_crud)
    
    return ReportRequestResponse.from_orm(report_request)

@router.get("/reports", response_model=List[ReportRequestResponse])
async def get_report_requests(
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Get user's report requests"""
    require_role(current_user, ["admin", "super_admin"])
    
    requests = analytics_crud.get_report_requests(str(makerspace.id), str(current_user.id))
    return [ReportRequestResponse.from_orm(req) for req in requests]

@router.get("/reports/{request_id}/download")
async def download_report(
    request_id: str,
    current_user=Depends(get_current_user),
    makerspace=Depends(get_current_makerspace),
    analytics_crud: AnalyticsCRUD = Depends(get_analytics_crud)
):
    """Download generated report file"""
    require_role(current_user, ["admin", "super_admin"])
    
    # Get report request
    report_request = analytics_crud.db.query(analytics_crud.ReportRequest).filter(
        analytics_crud.ReportRequest.id == request_id,
        analytics_crud.ReportRequest.makerspace_id == makerspace.id,
        analytics_crud.ReportRequest.requested_by == current_user.id
    ).first()
    
    if not report_request:
        raise HTTPException(status_code=404, detail="Report request not found")
    
    if report_request.status != "completed":
        raise HTTPException(status_code=400, detail="Report is not ready for download")
    
    if not report_request.file_url:
        raise HTTPException(status_code=404, detail="Report file not found")
    
    # Return file URL or redirect to file
    return {"download_url": report_request.file_url}

async def generate_report(request_id: str, analytics_crud: AnalyticsCRUD):
    """Background task to generate report files"""
    try:
        # Update status to processing
        analytics_crud.update_report_status(request_id, "processing")
        
        # Get the request details
        report_request = analytics_crud.db.query(analytics_crud.ReportRequest).filter(
            analytics_crud.ReportRequest.id == request_id
        ).first()
        
        if not report_request:
            return
        
        # Generate report based on type
        if report_request.report_type == "usage":
            file_url = await generate_usage_report(report_request, analytics_crud)
        elif report_request.report_type == "inventory":
            file_url = await generate_inventory_report(report_request, analytics_crud)
        elif report_request.report_type == "revenue":
            file_url = await generate_revenue_report(report_request, analytics_crud)
        elif report_request.report_type == "equipment":
            file_url = await generate_equipment_report(report_request, analytics_crud)
        else:
            raise ValueError(f"Unsupported report type: {report_request.report_type}")
        
        # Update status to completed
        analytics_crud.update_report_status(request_id, "completed", file_url)
        
    except Exception as e:
        # Update status to failed
        analytics_crud.update_report_status(request_id, "failed", error_message=str(e))

async def generate_usage_report(report_request, analytics_crud: AnalyticsCRUD) -> str:
    """Generate usage analytics report"""
    from utils.report_generator import ReportGenerator

    generator = ReportGenerator(analytics_crud.db)
    start_date = report_request.filters.get('start_date') if report_request.filters else None
    end_date = report_request.filters.get('end_date') if report_request.filters else None

    # Default to last 30 days if no dates provided
    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).date()
    if not end_date:
        end_date = datetime.now().date()

    filepath = generator.generate_usage_report_csv(
        str(report_request.makerspace_id),
        start_date,
        end_date
    )
    return filepath

async def generate_inventory_report(report_request, analytics_crud: AnalyticsCRUD) -> str:
    """Generate inventory analytics report"""
    from utils.report_generator import ReportGenerator

    generator = ReportGenerator(analytics_crud.db)
    start_date = report_request.filters.get('start_date') if report_request.filters else None
    end_date = report_request.filters.get('end_date') if report_request.filters else None

    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).date()
    if not end_date:
        end_date = datetime.now().date()

    filepath = generator.generate_inventory_report_xlsx(
        str(report_request.makerspace_id),
        start_date,
        end_date
    )
    return filepath

async def generate_revenue_report(report_request, analytics_crud: AnalyticsCRUD) -> str:
    """Generate revenue analytics report"""
    from utils.report_generator import ReportGenerator

    generator = ReportGenerator(analytics_crud.db)
    start_date = report_request.filters.get('start_date') if report_request.filters else None
    end_date = report_request.filters.get('end_date') if report_request.filters else None

    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).date()
    if not end_date:
        end_date = datetime.now().date()

    filepath = generator.generate_revenue_report_pdf(
        str(report_request.makerspace_id),
        start_date,
        end_date
    )
    return filepath

async def generate_equipment_report(report_request, analytics_crud: AnalyticsCRUD) -> str:
    """Generate equipment analytics report"""
    from utils.report_generator import ReportGenerator

    generator = ReportGenerator(analytics_crud.db)
    start_date = report_request.filters.get('start_date') if report_request.filters else None
    end_date = report_request.filters.get('end_date') if report_request.filters else None

    if not start_date:
        start_date = (datetime.now() - timedelta(days=30)).date()
    if not end_date:
        end_date = datetime.now().date()

    filepath = generator.generate_equipment_report_xlsx(
        str(report_request.makerspace_id),
        start_date,
        end_date
    )
    return filepath
