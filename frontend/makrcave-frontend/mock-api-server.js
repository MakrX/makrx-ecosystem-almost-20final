import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

// Mock Analytics Data
const mockAnalyticsOverview = {
  total_users: 42,
  active_users_today: 8,
  active_users_week: 25,
  total_projects: 15,
  active_projects: 8,
  total_equipment: 12,
  equipment_in_use: 3,
  total_inventory_items: 180,
  low_stock_items: 5,
  total_revenue: 8450.75,
  revenue_this_month: 1250.25
};

const mockDashboardData = {
  overview: mockAnalyticsOverview,
  sections: [
    {
      section_id: "usage",
      title: "Usage Analytics",
      charts: [
        {
          title: "Weekly Activity",
          data: [
            { label: "Logins", value: 45 },
            { label: "New Members", value: 3 },
            { label: "Projects", value: 8 }
          ],
          chart_type: "bar",
          x_axis_label: "Activity Type",
          y_axis_label: "Count"
        }
      ],
      summary_stats: { logins: 45, new_members: 3, project_creations: 8 },
      last_updated: new Date().toISOString()
    },
    {
      section_id: "inventory",
      title: "Inventory Insights",
      charts: [
        {
          title: "Top Consumed Items",
          data: [
            { label: "PLA Filament", value: 15 },
            { label: "Arduino Boards", value: 8 },
            { label: "Resistors", value: 25 },
            { label: "Wood Sheets", value: 5 },
            { label: "Screws", value: 12 }
          ],
          chart_type: "pie"
        }
      ],
      summary_stats: { efficiency_score: 85.2 },
      last_updated: new Date().toISOString()
    },
    {
      section_id: "revenue",
      title: "Revenue Analytics",
      charts: [
        {
          title: "Revenue by Source",
          data: [
            { label: "Memberships", value: 4500 },
            { label: "Equipment Usage", value: 2200 },
            { label: "Workshops", value: 800 },
            { label: "Materials", value: 950 }
          ],
          chart_type: "pie"
        }
      ],
      summary_stats: { total_revenue: 8450 },
      last_updated: new Date().toISOString()
    }
  ],
  generated_at: new Date().toISOString(),
  cache_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
};

// Analytics endpoints
app.get('/api/v1/analytics/overview', (req, res) => {
  res.json(mockAnalyticsOverview);
});

app.get('/api/v1/analytics/dashboard', (req, res) => {
  res.json(mockDashboardData);
});

app.get('/api/v1/analytics/usage', (req, res) => {
  res.json({
    logins: 45,
    new_members: 3,
    project_creations: 8,
    equipment_reservations: 12,
    inventory_issues: 22,
    total_session_time: 340,
    avg_session_duration: 85,
    peak_hours: [14, 15, 16, 19, 20],
    active_days: 6,
    user_retention_rate: 78.5
  });
});

app.get('/api/v1/analytics/inventory', (req, res) => {
  res.json({
    total_items_tracked: 180,
    total_consumption_value: 2450.75,
    efficiency_score: 85.2,
    waste_percentage: 8.3,
    top_consumed_items: [
      { item_id: "item_001", name: "PLA Filament - Black", total_consumed: 15.5, cost_consumed: 387.50 },
      { item_id: "item_002", name: "Arduino Uno R3", total_consumed: 8, cost_consumed: 180.00 },
      { item_id: "item_003", name: "Resistor Kit", total_consumed: 25, cost_consumed: 125.00 }
    ],
    low_stock_alerts: 5,
    reorder_suggestions: 8,
    cost_savings: 245.30,
    consumption_trend: "increasing"
  });
});

app.get('/api/v1/analytics/equipment', (req, res) => {
  res.json([
    {
      equipment_id: "eq_001",
      name: "3D Printer Pro",
      total_usage_hours: 156.5,
      utilization_rate: 78.2,
      uptime_percentage: 94.5,
      maintenance_events: 2,
      avg_session_duration: 125.5,
      revenue_generated: 780.00,
      user_count: 15,
      status: "operational",
      next_maintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      equipment_id: "eq_002", 
      name: "Laser Cutter X1",
      total_usage_hours: 89.2,
      utilization_rate: 65.8,
      uptime_percentage: 96.2,
      maintenance_events: 1,
      avg_session_duration: 45.5,
      revenue_generated: 1200.00,
      user_count: 12,
      status: "operational",
      next_maintenance: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
});

app.get('/api/v1/analytics/projects', (req, res) => {
  res.json({
    total_projects: 15,
    projects_by_status: {
      planning: 3,
      in_progress: 8,
      completed: 3,
      on_hold: 1
    },
    avg_completion_time: 28.5,
    total_bom_value: 12450.75,
    avg_project_cost: 830.05,
    success_rate: 87.5,
    collaboration_score: 72.8,
    equipment_utilization: 65.2,
    popular_categories: ["Electronics", "3D Printing", "Woodworking"],
    monthly_completions: 5
  });
});

app.get('/api/v1/analytics/revenue', (req, res) => {
  res.json({
    total_revenue: 8450.75,
    revenue_by_source: {
      memberships: 4500.00,
      equipment_usage: 2200.00,
      workshops: 800.00,
      materials: 950.75
    },
    monthly_growth: 12.5,
    avg_revenue_per_user: 201.20,
    recurring_revenue: 4500.00,
    one_time_revenue: 3950.75,
    payment_methods: {
      credit_card: 65,
      bank_transfer: 20,
      cash: 10,
      digital_wallet: 5
    },
    refunds_rate: 2.1,
    outstanding_invoices: 450.00
  });
});

// Maintenance endpoints
app.get('/api/v1/maintenance/logs', (req, res) => {
  const mockLogs = [
    {
      id: 'log-1',
      equipment_id: 'eq-1',
      equipment_name: '3D Printer Pro',
      makerspace_id: 'ms-1',
      type: 'preventive',
      status: 'scheduled',
      priority: 'medium',
      description: 'Monthly preventive maintenance - nozzle cleaning and calibration',
      created_by: 'Sarah Martinez',
      assigned_to: 'Tech Team',
      created_at: '2024-01-15T10:00:00Z',
      scheduled_date: '2024-01-20T14:00:00Z',
      estimated_duration: 120,
      cost: 50
    },
    {
      id: 'log-2',
      equipment_id: 'eq-2',
      equipment_name: 'Laser Cutter X1',
      makerspace_id: 'ms-1',
      type: 'breakdown',
      status: 'in_progress',
      priority: 'high',
      description: 'Laser alignment issue - cutting accuracy problems reported',
      created_by: 'Mike Johnson',
      assigned_to: 'Alex Tech',
      created_at: '2024-01-18T09:30:00Z',
      estimated_duration: 180,
      parts_used: ['Laser mirror', 'Alignment tool'],
      cost: 150
    },
    {
      id: 'log-3',
      equipment_id: 'eq-3',
      equipment_name: 'CNC Mill Pro',
      makerspace_id: 'ms-1',
      type: 'repair',
      status: 'resolved',
      priority: 'medium',
      description: 'Spindle bearing replacement',
      created_by: 'Sarah Martinez',
      assigned_to: 'Tech Team',
      created_at: '2024-01-10T08:00:00Z',
      resolved_at: '2024-01-12T16:30:00Z',
      actual_duration: 240,
      cost: 300,
      parts_used: ['Spindle bearing set', 'Lubricant']
    }
  ];
  res.json(mockLogs);
});

app.get('/api/v1/maintenance/schedules', (req, res) => {
  const mockSchedules = [
    {
      id: 'sched-1',
      equipment_id: 'eq-1',
      equipment_name: '3D Printer Pro',
      interval_type: 'days',
      interval_value: 30,
      last_maintenance_date: '2023-12-20',
      next_due_date: '2024-01-20',
      is_active: true,
      maintenance_type: 'Preventive Cleaning',
      responsible_team: 'Tech Team'
    },
    {
      id: 'sched-2',
      equipment_id: 'eq-2',
      equipment_name: 'Laser Cutter X1',
      interval_type: 'hours',
      interval_value: 100,
      last_maintenance_date: '2024-01-05',
      next_due_date: '2024-02-15',
      is_active: true,
      maintenance_type: 'Lens Cleaning & Calibration',
      responsible_team: 'Laser Specialists'
    }
  ];
  res.json(mockSchedules);
});

app.get('/api/v1/maintenance/equipment-status', (req, res) => {
  const mockStatuses = [
    {
      equipment_id: 'eq-1',
      name: '3D Printer Pro',
      status: 'maintenance_scheduled',
      last_maintenance: '2023-12-20',
      next_maintenance: '2024-01-20'
    },
    {
      equipment_id: 'eq-2',
      name: 'Laser Cutter X1',
      status: 'out_of_service',
      current_issue: 'Laser alignment issue',
      estimated_repair_time: '3 hours',
      last_maintenance: '2024-01-05',
      next_maintenance: '2024-02-15'
    },
    {
      equipment_id: 'eq-3',
      name: 'CNC Mill Pro',
      status: 'available',
      last_maintenance: '2024-01-12',
      next_maintenance: '2024-02-12'
    }
  ];
  res.json(mockStatuses);
});

app.post('/api/v1/maintenance/logs', (req, res) => {
  const newLog = {
    id: `log-${Date.now()}`,
    ...req.body,
    created_at: new Date().toISOString()
  };
  res.status(201).json(newLog);
});

app.post('/api/v1/maintenance/schedules', (req, res) => {
  const newSchedule = {
    id: `sched-${Date.now()}`,
    ...req.body,
    created_at: new Date().toISOString()
  };
  res.status(201).json(newSchedule);
});

// Billing endpoints
app.get('/api/v1/billing/transactions', (req, res) => {
  const mockTransactions = [
    {
      id: 'tx-001',
      type: 'subscription',
      description: 'Professional Plan - Monthly',
      amount: 99,
      status: 'completed',
      date: '2024-01-15',
      invoiceId: 'inv-001'
    },
    {
      id: 'tx-002',
      type: 'credits',
      description: 'Credit Purchase - 100 Credits',
      amount: 50,
      status: 'completed',
      date: '2024-01-12',
      invoiceId: 'inv-002'
    }
  ];
  res.json(mockTransactions);
});

app.get('/api/v1/billing/invoices', (req, res) => {
  const mockInvoices = [
    {
      id: 'inv-001',
      date: '2024-01-15',
      amount: 99,
      status: 'paid',
      description: 'Professional Plan - Monthly',
      downloadUrl: '#'
    },
    {
      id: 'inv-002',
      date: '2024-01-12',
      amount: 50,
      status: 'paid',
      description: 'Credit Purchase',
      downloadUrl: '#'
    }
  ];
  res.json(mockInvoices);
});

app.get('/api/v1/billing/credit-wallet', (req, res) => {
  res.json({
    balance: 250,
    totalSpent: 1850,
    totalPurchased: 2100
  });
});

app.post('/api/v1/billing/credits/purchase', (req, res) => {
  const { amount, credits } = req.body;
  res.json({
    success: true,
    transactionId: `tx-${Date.now()}`,
    amount,
    credits,
    message: 'Credit purchase successful'
  });
});

// Inventory CRUD endpoints
app.get('/api/v1/inventory', (req, res) => {
  const mockInventory = [
    {
      id: 'inv-001',
      name: 'PLA Filament - Red',
      category: 'filament',
      quantity: 10,
      unit: 'kg',
      minThreshold: 2,
      location: 'Storage A1',
      status: 'active',
      supplierType: 'makrx',
      price: 25,
      history: []
    },
    {
      id: 'inv-002',
      name: 'ABS Filament - Black',
      category: 'filament',
      quantity: 5,
      unit: 'kg',
      minThreshold: 1,
      location: 'Storage A2',
      status: 'active',
      supplierType: 'external',
      price: 30,
      history: []
    }
  ];
  res.json(mockInventory);
});

app.post('/api/v1/inventory', (req, res) => {
  const newItem = {
    id: `inv-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    history: []
  };
  res.json(newItem);
});

app.put('/api/v1/inventory/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = {
    id,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(updatedItem);
});

app.delete('/api/v1/inventory/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, message: `Item ${id} deleted successfully` });
});

// Equipment management endpoints
app.get('/api/v1/equipment', (req, res) => {
  const mockEquipment = [
    {
      id: 'eq-001',
      name: '3D Printer Pro',
      type: '3d_printer',
      status: 'available',
      location: 'Workshop A',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01'
    },
    {
      id: 'eq-002',
      name: 'Laser Cutter X1',
      type: 'laser_cutter',
      status: 'in_use',
      location: 'Workshop B',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05'
    }
  ];
  res.json(mockEquipment);
});

app.post('/api/v1/equipment', (req, res) => {
  const newEquipment = {
    id: `eq-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(newEquipment);
});

app.put('/api/v1/equipment/:id', (req, res) => {
  const { id } = req.params;
  const updatedEquipment = {
    id,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(updatedEquipment);
});

// Generic 404 handler for other endpoints
app.use('*', (req, res) => {
  console.log(`🔍 Missing endpoint: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    detail: `Endpoint ${req.method} ${req.originalUrl} not found`,
    mock_server: true,
    suggestion: "Check if this endpoint needs to be implemented"
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Analytics endpoints available:`);
  console.log(`   GET /api/v1/analytics/overview`);
  console.log(`   GET /api/v1/analytics/dashboard`);
  console.log(`   GET /api/v1/analytics/usage`);
  console.log(`   GET /api/v1/analytics/inventory`);
  console.log(`   GET /api/v1/analytics/equipment`);
  console.log(`   GET /api/v1/analytics/projects`);
  console.log(`   GET /api/v1/analytics/revenue`);
});
