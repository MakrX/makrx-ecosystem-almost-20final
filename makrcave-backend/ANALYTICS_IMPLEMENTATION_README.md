# 📊 Analytics & Reports Module - Server Implementation Guide

## Overview

The Analytics & Reports Module provides comprehensive analytics capabilities for MakrCave makerspaces, including real-time dashboard data, usage statistics, inventory insights, equipment metrics, project analytics, revenue tracking, and downloadable reports in multiple formats (CSV, Excel, PDF).

## 🏗️ Architecture

### Core Components

1. **Database Models** (`models/analytics.py`)
   - `UsageEvent`: Track user activities and interactions
   - `AnalyticsSnapshot`: Store aggregated analytics data
   - `ReportRequest`: Manage background report generation
   - `EquipmentUsageLog`: Detailed equipment usage tracking
   - `InventoryAnalytics`: Inventory consumption and efficiency
   - `ProjectAnalytics`: Project performance and BOM analytics
   - `RevenueAnalytics`: Financial transaction tracking

2. **API Routes** (`routes/analytics.py`)
   - Dashboard endpoints with complete analytics data
   - Individual analytics endpoints for each module
   - Report generation and download functionality
   - Real-time usage event recording

3. **CRUD Operations** (`crud/analytics.py`)
   - Database operations for all analytics models
   - Aggregation and calculation logic
   - Filtering and pagination support

4. **Report Generation** (`utils/report_generator.py`)
   - CSV, Excel, and PDF report generation
   - Background task processing with Celery
   - Configurable report templates

5. **Mock Data Generator** (`utils/analytics_mock_data.py`)
   - Realistic mock data for development and testing
   - Fallback when database is empty

## 🚀 Installation & Setup

### 1. Database Migration

Run the analytics database migration to create required tables:

```bash
cd makrcave-backend
python migrations/create_analytics_tables.py --sample
```

Available migration options:
- `--sample`: Create tables with sample data
- `--reset`: Drop and recreate all analytics tables
- `--drop`: Drop analytics tables only

### 2. Environment Configuration

Add analytics settings to your `.env` file:

```env
# Analytics Settings
ANALYTICS_CACHE_TTL=300
ANALYTICS_USE_MOCK_DATA=False
ANALYTICS_REPORT_STORAGE_DIR=./reports
ANALYTICS_MAX_REPORT_AGE_DAYS=30
ANALYTICS_BATCH_SIZE=1000

# Background Tasks (for report generation)
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/1
CELERY_TASK_SERIALIZER=json
CELERY_RESULT_SERIALIZER=json
```

### 3. Dependencies

All required dependencies are already included in `requirements.txt`:
- `pandas`: Data processing and CSV/Excel generation
- `openpyxl`: Excel file creation
- `reportlab`: PDF report generation
- `sqlalchemy`: Database ORM
- `fastapi`: API framework

### 4. Directory Structure

Create required directories:

```bash
mkdir -p reports
mkdir -p logs
```

## 📡 API Endpoints

### Dashboard & Overview

```http
GET /api/v1/analytics/dashboard
```
Complete dashboard data with all sections and charts.

```http
GET /api/v1/analytics/overview
```
High-level analytics overview for dashboard cards.

### Detailed Analytics

```http
GET /api/v1/analytics/usage?period=daily|weekly|monthly
```
User activity and usage statistics.

```http
GET /api/v1/analytics/inventory
```
Inventory consumption and efficiency insights.

```http
GET /api/v1/analytics/equipment
```
Equipment usage, uptime, and maintenance metrics.

```http
GET /api/v1/analytics/projects
```
Project and BOM analytics.

```http
GET /api/v1/analytics/revenue
```
Revenue and payment analytics.

### Event Tracking

```http
POST /api/v1/analytics/events
Content-Type: application/json

{
  "event_type": "login",
  "event_category": "authentication",
  "metadata": {
    "login_method": "email",
    "device": "desktop"
  }
}
```

```http
GET /api/v1/analytics/events?start_date=2024-01-01&end_date=2024-01-31
```

### Report Generation

```http
POST /api/v1/analytics/reports/request
Content-Type: application/json

{
  "report_type": "usage|inventory|equipment|revenue",
  "format": "csv|xlsx|pdf",
  "filters": {
    "start_date": "2024-01-01",
    "end_date": "2024-01-31"
  }
}
```

```http
GET /api/v1/analytics/reports
```
List user's report requests.

```http
GET /api/v1/analytics/reports/{request_id}/download
```
Download generated report file.

## 🔐 Authentication & Authorization

All analytics endpoints require authentication and proper role permissions:

- **Required Roles**: `admin`, `super_admin`
- **Authentication**: Bearer token in Authorization header
- **Permissions**: Automatic makerspace scoping based on user context

Example request:
```http
GET /api/v1/analytics/dashboard
Authorization: Bearer your-jwt-token
```

## 📊 Data Models

### UsageEvent
Tracks all user activities and interactions:

```python
{
  "makerspace_id": "uuid",
  "user_id": "string",
  "event_type": "login|logout|equipment_reservation|inventory_issue",
  "event_category": "authentication|equipment|inventory|project",
  "metadata": {"key": "value"},  # JSON
  "timestamp": "datetime"
}
```

### EquipmentUsageLog
Detailed equipment usage sessions:

```python
{
  "equipment_id": "string",
  "user_id": "string", 
  "start_time": "datetime",
  "duration_minutes": "integer",
  "usage_type": "string",
  "materials_used": {"material": "amount"},  # JSON
  "project_id": "string"
}
```

### InventoryAnalytics
Daily inventory consumption tracking:

```python
{
  "item_id": "string",
  "date": "date",
  "quantity_consumed": "float",
  "cost_consumed": "decimal",
  "efficiency_score": "float",
  "waste_percentage": "float",
  "reorder_triggered": "boolean"
}
```

### RevenueAnalytics
Financial transaction tracking:

```python
{
  "transaction_date": "date",
  "revenue_source": "membership|equipment_usage|workshops|materials",
  "amount": "decimal",
  "transaction_id": "string",
  "payment_method": "string",
  "customer_id": "string"
}
```

## 🛠️ Development & Testing

### Mock Data

For development without real data, use the mock data generator:

```python
from utils.analytics_mock_data import get_mock_dashboard_data

# Get mock dashboard data
mock_data = get_mock_dashboard_data()
```

Set `ANALYTICS_USE_MOCK_DATA=True` in your `.env` file to automatically use mock data when database is empty.

### Sample Data

Generate sample data for testing:

```bash
python migrations/create_analytics_tables.py --reset --sample
```

### Database Queries

The analytics system uses optimized SQL queries with proper indexing:

```sql
-- Usage events by time period
SELECT DATE(timestamp) as date, COUNT(*) as events
FROM usage_events 
WHERE makerspace_id = ? AND timestamp >= ? AND timestamp <= ?
GROUP BY DATE(timestamp)
ORDER BY date;

-- Equipment utilization
SELECT equipment_id, 
       SUM(duration_minutes) as total_usage,
       COUNT(*) as session_count,
       AVG(duration_minutes) as avg_session
FROM equipment_usage_logs
WHERE makerspace_id = ? AND start_time >= ?
GROUP BY equipment_id;
```

## 📈 Performance Optimization

### Caching Strategy

1. **Dashboard Data**: Cached for 5 minutes (configurable)
2. **Report Results**: Cached until invalidated by new data
3. **Aggregated Stats**: Pre-calculated and stored in `analytics_snapshots`

### Database Indexes

Critical indexes for performance:
- `idx_usage_events_makerspace_timestamp`
- `idx_equipment_usage_equipment_timestamp`
- `idx_inventory_analytics_makerspace_date`
- `idx_revenue_analytics_makerspace_date`

### Background Processing

Heavy operations run as background tasks:
- Report generation
- Data aggregation
- Cache warming

## 📋 Report Generation

### Supported Formats

1. **CSV**: Usage events, inventory consumption, equipment logs
2. **Excel**: Multi-sheet reports with charts and summaries
3. **PDF**: Formatted reports with graphs and company branding

### Report Types

1. **Usage Reports**: User activity, login patterns, peak hours
2. **Inventory Reports**: Consumption analysis, cost tracking, efficiency
3. **Equipment Reports**: Utilization, maintenance, revenue per equipment
4. **Revenue Reports**: Income analysis, payment methods, growth trends

### Background Processing

Reports are generated asynchronously:

1. User requests report via API
2. Request queued in database
3. Background worker processes request
4. User notified when complete
5. Download link provided

## 🚨 Error Handling

### Common Issues

1. **Database Connection Errors**
   - Fallback to mock data if configured
   - Graceful error messages to frontend

2. **Missing Data**
   - Return appropriate default values
   - Use mock data for development

3. **Report Generation Failures**
   - Mark report status as 'failed'
   - Include error details for debugging

### Logging

All analytics operations are logged:
- API requests and responses
- Database query performance
- Report generation status
- Error details with stack traces

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANALYTICS_CACHE_TTL` | 300 | Cache TTL in seconds |
| `ANALYTICS_USE_MOCK_DATA` | False | Use mock data fallback |
| `ANALYTICS_REPORT_STORAGE_DIR` | ./reports | Report file directory |
| `ANALYTICS_MAX_REPORT_AGE_DAYS` | 30 | Auto-delete old reports |
| `ANALYTICS_BATCH_SIZE` | 1000 | Data processing batch size |

### Database Configuration

For production, ensure proper database configuration:
- Connection pooling
- Read replicas for analytics queries
- Regular backup of analytics data

## 🔄 Data Flow

### Real-time Event Tracking

1. User performs action (login, equipment use, etc.)
2. Frontend/backend creates usage event
3. Event stored in `usage_events` table
4. Analytics aggregated in background

### Dashboard Data Generation

1. API request for dashboard data
2. Check cache for recent data
3. If cache miss, query database
4. Aggregate and format data
5. Cache results and return

### Report Generation Workflow

1. User requests report via frontend
2. API creates `ReportRequest` record
3. Background task picks up request
4. Data queried and processed
5. Report file generated (CSV/Excel/PDF)
6. File saved and download URL created
7. Request marked as 'completed'

## 📚 Usage Examples

### Creating Usage Events

```python
# Manual event creation
from crud.analytics import AnalyticsCRUD
from schemas.analytics import UsageEventCreate

crud = AnalyticsCRUD(db)
event_data = UsageEventCreate(
    user_id="user123",
    event_type="equipment_reservation",
    event_category="equipment",
    metadata={"equipment_id": "3d_printer_01", "duration": 120}
)
event = crud.create_usage_event("makerspace123", event_data)
```

### Generating Reports

```python
# Request report generation
from schemas.analytics import ReportRequestCreate

report_data = ReportRequestCreate(
    report_type="usage",
    format="pdf",
    filters={"start_date": "2024-01-01", "end_date": "2024-01-31"}
)
request = crud.create_report_request("makerspace123", "user123", report_data)
```

### Custom Analytics Queries

```python
# Custom analytics query
def get_peak_usage_hours(makerspace_id: str, date_range: tuple):
    return db.query(
        extract('hour', UsageEvent.timestamp).label('hour'),
        func.count(UsageEvent.id).label('event_count')
    ).filter(
        UsageEvent.makerspace_id == makerspace_id,
        UsageEvent.timestamp.between(*date_range)
    ).group_by(
        extract('hour', UsageEvent.timestamp)
    ).order_by(
        func.count(UsageEvent.id).desc()
    ).all()
```

## 🔍 Troubleshooting

### Common Issues & Solutions

1. **"Analytics Unavailable" Error**
   - Check database connection
   - Verify analytics tables exist
   - Run migration script if needed

2. **Slow Dashboard Loading**
   - Check database indexes
   - Verify cache configuration
   - Consider data archiving

3. **Report Generation Failures**
   - Check background task status
   - Verify file permissions on report directory
   - Review error logs

4. **Missing Dependencies**
   - Install required packages: `pip install -r requirements.txt`
   - Verify reportlab, pandas, openpyxl are installed

### Debug Commands

```bash
# Check analytics tables
python -c "from database import engine; print(engine.table_names())"

# Test analytics endpoints
curl -H "Authorization: Bearer your-token" http://localhost:8000/api/v1/analytics/overview

# Generate sample data
python migrations/create_analytics_tables.py --sample

# Check background tasks
celery -A main worker --loglevel=info
```

## 🚀 Deployment Considerations

### Production Setup

1. **Database Optimization**
   - Use PostgreSQL for production
   - Configure connection pooling
   - Set up read replicas for analytics

2. **Caching**
   - Use Redis for caching
   - Configure cache expiration policies
   - Implement cache warming strategies

3. **Background Tasks**
   - Set up Celery workers
   - Use Redis as message broker
   - Monitor task queue health

4. **File Storage**
   - Use cloud storage for reports (S3, GCS)
   - Implement file cleanup policies
   - Secure file access with signed URLs

5. **Monitoring**
   - Set up analytics API monitoring
   - Track database query performance
   - Monitor background task completion rates

### Security

1. **Data Privacy**
   - Anonymize personal data in analytics
   - Implement data retention policies
   - Secure report file access

2. **API Security**
   - Validate all input parameters
   - Implement rate limiting
   - Secure file download endpoints

3. **Database Security**
   - Use read-only database users for analytics queries
   - Encrypt sensitive analytics data
   - Regular security audits

## 📞 Support

For analytics module support:
1. Check error logs in `logs/makrcave.log`
2. Review database migration status
3. Verify environment configuration
4. Test with mock data first
5. Contact development team with specific error details

---

*Last updated: December 2024*
*Version: 1.0.0*
