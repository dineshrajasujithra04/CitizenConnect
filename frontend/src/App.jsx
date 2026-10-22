import { useEffect, useState } from "react";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

function App() {
  const [complaints, setComplaints] = useState([]);
  const [dashboard, setDashboard] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    in_progress_complaints: 0,
    resolved_complaints: 0,
  });

  const [form, setForm] = useState({
    citizen_name: "",
    service_type: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let detail = "Something went wrong. Please try again.";

      try {
        const data = await response.json();
        detail =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail || data);
      } catch {
        // Use the default message.
      }

      throw new Error(detail);
    }

    return response.json();
  }

  async function loadData() {
    try {
      setError("");

      const [complaintData, dashboardData] = await Promise.all([
        request("/complaints"),
        request("/dashboard"),
      ]);

      setComplaints(complaintData);
      setDashboard(dashboardData);
    } catch (err) {
      setError(
        `Cannot connect to the backend. Make sure FastAPI is running. ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await request("/complaints", {
        method: "POST",
        body: JSON.stringify({
          citizen_name: form.citizen_name.trim(),
          service_type: form.service_type,
          location: form.location.trim(),
          description: form.description.trim(),
        }),
      });

      setForm({
        citizen_name: "",
        service_type: "",
        location: "",
        description: "",
      });

      setMessage("Complaint registered successfully!");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(id, status) {
    setError("");
    setMessage("");

    try {
      await request(`/complaints/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setMessage(`Complaint #${id} status updated successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteComplaint(id) {
    const confirmed = window.confirm(
      `Are you sure you want to delete complaint #${id}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await request(`/complaints/${id}`, {
        method: "DELETE",
      });

      setMessage(`Complaint #${id} deleted successfully.`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const values = [
      complaint.citizen_name,
      complaint.service_type,
      complaint.location,
      complaint.description,
      String(complaint.id),
    ];

    const matchesSearch = values.some((value) =>
      String(value).toLowerCase().includes(searchText)
    );

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function getStatusClass(status) {
    if (status === "Resolved") return "resolved";
    if (status === "In Progress") return "in-progress";
    return "pending";
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🏛️</div>
          <div>
            <h2>CitizenConnect</h2>
            <p>Public Service Portal</p>
          </div>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <a className="nav-item active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>

        <a className="nav-item" href="#register">
          <span>＋</span> Register Complaint
        </a>

        <a className="nav-item" href="#complaints">
          <span>☷</span> Track Complaints
        </a>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">💬</span>
            <h3>Need assistance?</h3>
            <p>Register your issue and track its progress here.</p>
            <a href="#register">Get started →</a>
          </div>

          <p className="sidebar-footer">CitizenConnect © 2026</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Public Services / Overview</p>
            <h1>Citizen Service Dashboard</h1>
          </div>

          <div className="user-profile">
            <div className="online-dot"></div>
            <div className="avatar">C</div>
            <div className="user-info">
              <strong>Citizen Portal</strong>
              <span>Service Management</span>
            </div>
          </div>
        </header>

        <section className="welcome-banner" id="dashboard">
          <div className="welcome-text">
            <span className="welcome-tag">YOUR VOICE MATTERS</span>
            <h2>Welcome to CitizenConnect 👋</h2>
            <p>
              A simple and transparent way to register complaints and monitor
              public service requests.
            </p>

            <a href="#register" className="primary-button">
              + Register a Complaint
            </a>
          </div>

          <div className="welcome-illustration" aria-hidden="true">
            <div className="illustration-circle circle-one"></div>
            <div className="illustration-circle circle-two"></div>
            <div className="illustration-card">
              <span>✓</span>
              <strong>Public Services</strong>
              <small>Working for you</small>
            </div>
            <div className="floating-icon">🏛️</div>
          </div>
        </section>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <div>
              <strong>Attention required</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => setError("")} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        {message && (
          <div className="alert alert-success">
            <span>✓</span>
            <p>{message}</p>
            <button onClick={() => setMessage("")} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}

        <section className="stats-section">
          <div className="section-heading">
            <div>
              <h2>Complaint Overview</h2>
              <p>Monitor citizen requests at a glance.</p>
            </div>

            <button className="secondary-button" onClick={loadData}>
              ↻ Refresh Data
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card total-card">
              <div className="stat-top">
                <div className="stat-icon">▤</div>
                <span className="stat-label">ALL REQUESTS</span>
              </div>
              <h3>{dashboard.total_complaints}</h3>
              <p>Total complaints registered</p>
            </div>

            <div className="stat-card pending-card">
              <div className="stat-top">
                <div className="stat-icon">◷</div>
                <span className="stat-label">PENDING</span>
              </div>
              <h3>{dashboard.pending_complaints}</h3>
              <p>Awaiting action</p>
            </div>

            <div className="stat-card progress-card">
              <div className="stat-top">
                <div className="stat-icon">↻</div>
                <span className="stat-label">IN PROGRESS</span>
              </div>
              <h3>{dashboard.in_progress_complaints}</h3>
              <p>Currently being handled</p>
            </div>

            <div className="stat-card resolved-card">
              <div className="stat-top">
                <div className="stat-icon">✓</div>
                <span className="stat-label">RESOLVED</span>
              </div>
              <h3>{dashboard.resolved_complaints}</h3>
              <p>Successfully completed</p>
            </div>
          </div>
        </section>

        <section className="register-section" id="register">
          <div className="section-heading">
            <div>
              <h2>Register a Complaint</h2>
              <p>Provide the details below to submit your service request.</p>
            </div>
            <span className="required-note">* Required fields</span>
          </div>

          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="citizen_name">Citizen Name *</label>
                <input
                  id="citizen_name"
                  name="citizen_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.citizen_name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="service_type">Service Category *</label>
                <select
                  id="service_type"
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Road Maintenance">Road Maintenance</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Street Lighting">Street Lighting</option>
                  <option value="Public Transport">Public Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="location">Location / Address *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter the affected area or address"
                  value={form.location}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Complaint Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={2000}
                  required
                />
              </div>
            </div>

            <div className="form-footer">
              <p>🔒 Your complaint will be recorded in the service database.</p>
              <button
                className="primary-button submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint →"}
              </button>
            </div>
          </form>
        </section>

        <section className="complaints-section" id="complaints">
          <div className="section-heading complaints-heading">
            <div>
              <h2>Complaint Records</h2>
              <p>Search, track and manage submitted complaints.</p>
            </div>

            <span className="record-count">
              {filteredComplaints.length} records
            </span>
          </div>

          <div className="table-controls">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search complaints..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Citizen / Complaint</th>
                  <th>Category & Location</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      Loading complaint records...
                    </td>
                  </tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <span>📂</span>
                      <strong>No complaints found</strong>
                      <p>Register a complaint or change your search filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>
                        <span className="complaint-id">#{complaint.id}</span>
                      </td>

                      <td>
                        <div className="citizen-cell">
                          <strong>{complaint.citizen_name}</strong>
                          <span>{complaint.description}</span>
                        </div>
                      </td>

                      <td>
                        <div className="category-cell">
                          <strong>{complaint.service_type}</strong>
                          <span>📍 {complaint.location}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            complaint.status
                          )}`}
                        >
                          <span className="status-dot"></span>
                          {complaint.status}
                        </span>
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={complaint.status}
                          onChange={(event) =>
                            updateStatus(complaint.id, event.target.value)
                          }
                          aria-label={`Update status for complaint ${complaint.id}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="delete-button"
                          onClick={() => deleteComplaint(complaint.id)}
                          title={`Delete complaint ${complaint.id}`}
                          aria-label={`Delete complaint ${complaint.id}`}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredComplaints.length} of {complaints.length}{" "}
              complaints
            </span>
            <span>CitizenConnect Service Portal</span>
          </div>
        </section>

        <footer className="main-footer">
          <p>© 2026 CitizenConnect. Cloud-Based Citizen Service Platform.</p>
          <p>Building better communities through transparent services.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;