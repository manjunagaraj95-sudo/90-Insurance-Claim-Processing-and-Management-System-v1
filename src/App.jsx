
import React, { useState, useEffect } from 'react';

// --- RBAC Configuration ---
const ROLES = {
    POLICYHOLDER: 'Policyholder',
    CLAIMS_OFFICER: 'Claims Officer',
    CLAIMS_MANAGER: 'Claims Manager',
    VERIFICATION_TEAM: 'Verification Team',
    FINANCE_TEAM: 'Finance Team',
};

// --- Dummy Data ---
const DUMMY_CLAIMS_DATA = [
    {
        id: 'CLM-001',
        policyholder: 'Alice Smith',
        policyNumber: 'INS-001-P',
        claimType: 'Auto Accident',
        submittedDate: '2023-10-26',
        status: 'Approved',
        amount: 15000.00,
        assignedTo: 'John Doe',
        documents: ['Police Report.pdf', 'Estimate.docx'],
        relatedRecords: ['Repair Shop Invoice.pdf'],
        workflow: [
            { stage: 'Submission', date: '2023-10-26', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-27', status: 'Completed', assignedTo: 'John Doe', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-10-28', status: 'Completed', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: '2023-10-30', status: 'Completed', assignedTo: 'Claims Manager', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-26 10:00 AM', user: 'Alice Smith', action: 'Claim submitted for policy INS-001-P.' },
            { timestamp: '2023-10-27 09:30 AM', user: 'John Doe', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-28 02:15 PM', user: 'Verification Team', action: 'Documents verified and approved.' },
            { timestamp: '2023-10-30 11:00 AM', user: 'Claims Manager', action: 'Claim CLM-001 approved for $15,000.00.' },
        ],
    },
    {
        id: 'CLM-002',
        policyholder: 'Bob Johnson',
        policyNumber: 'INS-002-H',
        claimType: 'Property Damage',
        submittedDate: '2023-10-25',
        status: 'In Progress',
        amount: 5000.00,
        assignedTo: 'Jane Smith',
        documents: ['Photo Evidence.jpg', 'Contractor Quote.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-10-25', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-26', status: 'Completed', assignedTo: 'Jane Smith', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-11-01', status: 'Current', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'breached' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-25 01:00 PM', user: 'Bob Johnson', action: 'Claim submitted for policy INS-002-H.' },
            { timestamp: '2023-10-26 10:00 AM', user: 'Jane Smith', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-31 03:00 PM', user: 'System', action: 'SLA breached for Verification stage.' },
        ],
    },
    {
        id: 'CLM-003',
        policyholder: 'Charlie Brown',
        policyNumber: 'INS-003-L',
        claimType: 'Life Insurance',
        submittedDate: '2023-11-01',
        status: 'Pending',
        amount: 100000.00,
        assignedTo: 'Sarah Connor',
        documents: ['Death Certificate.pdf', 'Beneficiary Form.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-11-01', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-11-02', status: 'Current', assignedTo: 'Sarah Connor', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: null, status: 'Not Started', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-11-01 09:00 AM', user: 'Charlie Brown', action: 'Claim submitted for policy INS-003-L.' },
            { timestamp: '2023-11-02 11:30 AM', user: 'Sarah Connor', action: 'Claim moved to Initial Review stage.' },
        ],
    },
    {
        id: 'CLM-004',
        policyholder: 'Diana Prince',
        policyNumber: 'INS-004-M',
        claimType: 'Medical Expense',
        submittedDate: '2023-10-20',
        status: 'Rejected',
        amount: 2500.00,
        assignedTo: 'Mike Ross',
        documents: ['Medical Bills.pdf', 'Doctor Notes.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-10-20', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-21', status: 'Completed', assignedTo: 'Mike Ross', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-10-23', status: 'Completed', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: '2023-10-24', status: 'Completed', assignedTo: 'Claims Manager', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Rejection Notification', date: '2023-10-24', status: 'Completed', sla: '1 day', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-20 02:00 PM', user: 'Diana Prince', action: 'Claim submitted for policy INS-004-M.' },
            { timestamp: '2023-10-21 10:00 AM', user: 'Mike Ross', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-24 01:00 PM', user: 'Claims Manager', action: 'Claim CLM-004 rejected due to insufficient coverage.' },
        ],
    },
    {
        id: 'CLM-005',
        policyholder: 'Eve Adams',
        policyNumber: 'INS-005-B',
        claimType: 'Business Interruption',
        submittedDate: '2023-11-03',
        status: 'In Progress',
        amount: 50000.00,
        assignedTo: 'John Doe',
        documents: ['Financial Records.pdf', 'Incident Report.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-11-03', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-11-04', status: 'Current', assignedTo: 'John Doe', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: null, status: 'Not Started', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-11-03 09:00 AM', user: 'Eve Adams', action: 'Claim submitted for policy INS-005-B.' },
            { timestamp: '2023-11-04 10:00 AM', user: 'John Doe', action: 'Claim moved to Initial Review stage.' },
        ],
    },
];

const DUMMY_KPI_DATA = {
    totalClaims: { value: 1250, trend: '+5%', isPositive: true },
    approvedClaims: { value: 980, trend: '+2%', isPositive: true },
    pendingClaims: { value: 180, trend: '-10%', isPositive: false },
    averageProcessingTime: { value: '3.2 days', trend: '-0.5 days', isPositive: true },
};

const DUMMY_USER_INFO = {
    name: 'Claims Manager',
    role: ROLES.CLAIMS_MANAGER,
    initials: 'CM',
};

const DUMMY_CHARTS = [
    { id: 'statusDistribution', title: 'Claim Status Distribution', type: 'Donut' },
    { id: 'claimsByMonth', title: 'Claims Trend by Month', type: 'Line' },
    { id: 'claimsByType', title: 'Claims by Type', type: 'Bar' },
    { id: 'slaCompliance', title: 'SLA Compliance Rate', type: 'Gauge' },
];

function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [userRole, setUserRole] = useState(DUMMY_USER_INFO.role);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [filteredClaims, setFilteredClaims] = useState(DUMMY_CLAIMS_DATA);

    // --- Helper function for status colors ---
    const getStatusColorVariables = (status) => {
        const normalizedStatus = status.toLowerCase().replace(/\s/g, '-');
        return {
            backgroundColor: `var(--status-${normalizedStatus}-bg)`,
            borderColor: `var(--status-${normalizedStatus}-border)`,
            tagBackgroundColor: `var(--status-${normalizedStatus}-border)`,
            tagColor: 'var(--text-inverted)', // Consistent for tags
        };
    };

    // --- Global Search & Role-based filtering ---
    useEffect(() => {
        let claims = DUMMY_CLAIMS_DATA;

        // Apply global search
        if (globalSearchTerm) {
            const lowerCaseSearch = globalSearchTerm.toLowerCase();
            claims = claims.filter(
                (claim) =>
                    claim.id.toLowerCase().includes(lowerCaseSearch) ||
                    claim.policyholder.toLowerCase().includes(lowerCaseSearch) ||
                    claim.claimType.toLowerCase().includes(lowerCaseSearch) ||
                    claim.status.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Role-based filtering (example: Policyholder only sees their claims)
        if (userRole === ROLES.POLICYHOLDER) {
            claims = claims.filter((claim) => claim.policyholder === DUMMY_USER_INFO.name);
        }
        // Additional RBAC for data filtering could go here

        setFilteredClaims(claims);
    }, [globalSearchTerm, userRole]);

    const handleCardClick = (screen, params = {}) => {
        setView({ screen, params });
    };

    const handleGlobalSearch = (event) => {
        setGlobalSearchTerm(event.target.value);
    };

    const renderDashboard = () => (
        <div className="dashboard">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Claims Dashboard</h1>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Key Performance Indicators</h2>
                    <button className="secondary">
                        <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export KPIs
                    </button>
                </div>
                <div className="kpi-grid">
                    {Object.entries(DUMMY_KPI_DATA).map(([key, kpi]) => (
                        <div key={key} className="card kpi-card">
                            <div className="kpi-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                            <div className="kpi-value">
                                {kpi.value}
                                <span className={`kpi-trend ${kpi.isPositive ? 'positive' : 'negative'}`}>
                                    <span className={`icon ${kpi.isPositive ? 'icon-arrow-up' : 'icon-arrow-down'}`}></span>
                                    {kpi.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Claims Analytics</h2>
                    <div>
                        <button className="secondary" style={{ marginRight: 'var(--spacing-md)' }}>
                            <span className="icon icon-filter" style={{ marginRight: 'var(--spacing-sm)' }}></span> Filters
                        </button>
                        <button className="secondary">
                            <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export Charts
                        </button>
                    </div>
                </div>
                <div className="charts-grid">
                    {DUMMY_CHARTS.map((chart) => (
                        <div key={chart.id} className="card chart-container">
                            <h3>{chart.title}</h3>
                            <p><em>{chart.type} Chart Placeholder</em></p>
                            <span className="icon icon-chart" style={{ fontSize: '3rem', marginTop: 'var(--spacing-md)' }}></span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Recent Claims Overview</h2>
                    <div>
                        <button className="secondary" style={{ marginRight: 'var(--spacing-md)' }}>
                            <span className="icon icon-filter" style={{ marginRight: 'var(--spacing-sm)' }}></span> Saved Views
                        </button>
                        <button className="secondary">
                            <span className="icon icon-sort" style={{ marginRight: 'var(--spacing-sm)' }}></span> Sort
                        </button>
                    </div>
                </div>
                {filteredClaims.length > 0 ? (
                    <div className="claim-cards-grid">
                        {filteredClaims.map((claim) => {
                            const statusColors = getStatusColorVariables(claim.status);
                            return (
                                <div
                                    key={claim.id}
                                    className={`card claim-card status-${claim.status.toLowerCase().replace(/\s/g, '-')}`}
                                    onClick={() => handleCardClick('CLAIM_DETAIL', { claimId: claim.id })}
                                    style={{
                                        borderColor: statusColors.borderColor,
                                        backgroundColor: statusColors.backgroundColor
                                    }}
                                >
                                    <div>
                                        <div className="card-title">{claim.id} - {claim.claimType}</div>
                                        <div className="card-subtitle">{claim.policyholder} ({claim.policyNumber})</div>
                                    </div>
                                    <div className="card-meta">
                                        <span>Submitted: {claim.submittedDate}</span>
                                        <span
                                            className="card-status"
                                            style={{
                                                backgroundColor: statusColors.tagBackgroundColor,
                                                color: statusColors.tagColor
                                            }}
                                        >
                                            {claim.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-state-icon icon-info"></span>
                        <h3>No Claims Found</h3>
                        <p>It looks like there are no claims matching your current filters or search term. Try adjusting your criteria or adding a new claim.</p>
                        {userRole !== ROLES.POLICYHOLDER && (
                            <button><span className="icon icon-add" style={{ marginRight: 'var(--spacing-sm)' }}></span> Create New Claim</button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );

    const renderClaimDetail = (claimId) => {
        const claim = DUMMY_CLAIMS_DATA.find((c) => c.id === claimId);

        if (!claim) {
            return (
                <div className="empty-state">
                    <span className="empty-state-icon icon-info"></span>
                    <h3>Claim Not Found</h3>
                    <p>The claim you are looking for does not exist or you do not have permission to view it.</p>
                    <button onClick={() => handleCardClick('DASHBOARD')}><span className="icon icon-dashboard" style={{ marginRight: 'var(--spacing-sm)' }}></span> Back to Dashboard</button>
                </div>
            );
        }

        const currentMilestoneIndex = claim.workflow.findIndex(stage => stage.status === 'Current');
        const statusColors = getStatusColorVariables(claim.status);

        return (
            <div className="claim-detail">
                <div className="breadcrumbs">
                    <a href="#" onClick={() => handleCardClick('DASHBOARD')}>Dashboard</a>
                    <span>/</span>
                    <span>Claim Detail: {claim.id}</span>
                </div>

                <div className="detail-view-header">
                    <h1>{claim.id} - {claim.claimType}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)' }}>
                        Policyholder: {claim.policyholder} | Policy Number: {claim.policyNumber}
                    </p>
                    <div className="detail-view-actions">
                        <button><span className="icon icon-edit" style={{ marginRight: 'var(--spacing-sm)' }}></span> Edit Claim</button>
                        {userRole === ROLES.CLAIMS_MANAGER && (
                            <>
                                <button style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
                                    <span className="icon icon-approve" style={{ marginRight: 'var(--spacing-sm)' }}></span> Approve
                                </button>
                                <button className="danger">
                                    <span className="icon icon-reject" style={{ marginRight: 'var(--spacing-sm)' }}></span> Reject
                                </button>
                            </>
                        )}
                         <button className="secondary">
                            <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export PDF
                        </button>
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-main">
                        <section className="detail-section">
                            <h2>Record Summary</h2>
                            <div className="summary-items">
                                <div className="summary-item">
                                    <label>Current Status</label>
                                    <p>
                                        <span
                                            className="status-tag"
                                            style={{
                                                backgroundColor: statusColors.tagBackgroundColor,
                                                color: statusColors.tagColor
                                            }}
                                        >
                                            {claim.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="summary-item">
                                    <label>Claim Amount</label>
                                    <p>${claim.amount?.toLocaleString('en-US')}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Submitted On</label>
                                    <p>{claim.submittedDate}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Assigned To</label>
                                    <p>{claim.assignedTo || 'N/A'}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Last Updated</label>
                                    <p>{claim.auditLog?.[claim.auditLog.length - 1]?.timestamp || 'N/A'}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Policy Number</label>
                                    <p>{claim.policyNumber}</p>
                                </div>
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2>Milestone Tracker <span className="icon icon-workflow"></span></h2>
                            <div className="milestone-tracker">
                                {claim.workflow?.map((stage, index) => (
                                    <div
                                        key={stage.stage}
                                        className={`milestone-step ${stage.status === 'Completed' ? 'completed' : ''} ${stage.status === 'Current' ? 'current' : ''}`}
                                    >
                                        <div className="milestone-icon">
                                            {stage.status === 'Completed' ? '✔' : index + 1}
                                        </div>
                                        <div className="milestone-content">
                                            <h3>{stage.stage}</h3>
                                            <p>{stage.date ? `Completed on ${stage.date}` : `Expected SLA: ${stage.sla}`}</p>
                                            {stage.assignedTo && <p>Assigned to: {stage.assignedTo}</p>}
                                            {stage.slaStatus && (
                                                <span className={`sla-status ${stage.slaStatus}`}>
                                                    SLA: {stage.slaStatus === 'on-track' ? 'On Track' : 'Breached'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* Related Records / Documents (example, can be split) */}
                        <section className="detail-section">
                            <h2>Documents & Related Records</h2>
                            <h3 style={{fontSize: 'var(--font-lg)', color: 'var(--text-main)', marginTop: 'var(--spacing-md)'}}>Documents ({claim.documents?.length || 0})</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                                {claim.documents?.length > 0 ? (
                                    claim.documents.map((doc, index) => (
                                        <li key={index} style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center' }}>
                                            <span className="icon icon-document" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                                            <a href="#" style={{ color: 'var(--color-primary)' }} onClick={(e) => { e.preventDefault(); alert(`Previewing ${doc}`); }}>{doc}</a>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>No documents uploaded.</p>
                                )}
                            </ul>
                            <button className="secondary mt-xl">
                                <span className="icon icon-upload" style={{ marginRight: 'var(--spacing-sm)' }}></span> Upload Document
                            </button>

                            <h3 style={{fontSize: 'var(--font-lg)', color: 'var(--text-main)', marginTop: 'var(--spacing-xxl)'}}>Related Records ({claim.relatedRecords?.length || 0})</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                                {claim.relatedRecords?.length > 0 ? (
                                    claim.relatedRecords.map((record, index) => (
                                        <li key={index} style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center' }}>
                                            <span className="icon icon-claim" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Viewing related record: ${record}`); }}>{record}</a>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>No related records.</p>
                                )}
                            </ul>
                        </section>
                    </div>

                    <div className="detail-sidebar">
                        <section className="detail-section">
                            <h2>News/Audit Feed <span className="icon icon-audit"></span></h2>
                            <ul className="audit-feed-list">
                                {claim.auditLog?.map((entry, index) => (
                                    <li key={index} className="audit-feed-item">
                                        <div className="audit-feed-icon">
                                            {/* Could use different icons based on action type */}
                                            <span className="icon icon-info"></span>
                                        </div>
                                        <div className="audit-feed-content">
                                            <strong>{entry.user}</strong> {entry.action}
                                            <span className="audit-feed-timestamp">{entry.timestamp}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">
                    <a href="#" onClick={() => handleCardClick('DASHBOARD')}>
                        ClaimPro
                    </a>
                </div>
                <div className="global-search-container">
                    <span className="icon icon-search" style={{ position: 'absolute', left: 'var(--spacing-sm)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }}></span>
                    <input
                        type="text"
                        placeholder="Search claims, policies, documents..."
                        className="global-search-input"
                        value={globalSearchTerm}
                        onChange={handleGlobalSearch}
                        style={{ paddingLeft: 'var(--spacing-xl)' }}
                    />
                </div>
                <div className="user-profile">
                    {userRole === ROLES.CLAIMS_MANAGER && ( // Example RBAC for an icon
                        <span className="icon icon-bell" style={{ fontSize: 'var(--font-lg)', color: 'var(--text-secondary)' }}></span>
                    )}
                    <div className="user-avatar">{DUMMY_USER_INFO.initials}</div>
                    <span>{DUMMY_USER_INFO.name}</span>
                </div>
            </header>

            <main className="main-content">
                {view.screen === 'DASHBOARD' && renderDashboard()}
                {view.screen === 'CLAIM_DETAIL' && renderClaimDetail(view.params?.claimId)}
                {/* Add more screens here as needed */}
            </main>
        </div>
    );
}

export default App;