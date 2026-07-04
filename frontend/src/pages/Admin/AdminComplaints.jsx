import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getAllComplaints,
  updateComplaintStatus,
  getMaintenanceUsers,
  assignComplaint,
} from "../../services/adminService";

function AdminComplaints() {
  // ===========================================
  // State
  // ===========================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [maintenanceUsers, setMaintenanceUsers] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState({});

  // ===========================================
  // Search & Filters
  // ===========================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [buildingFilter, setBuildingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // ===========================================
  // Pagination
  // ===========================================

  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 8;

  // ===========================================
  // Initial Load
  // ===========================================

  useEffect(() => {
    fetchComplaints();
    fetchMaintenanceUsers();
  }, []);

  // ===========================================
  // Fetch Complaints
  // ===========================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await getAllComplaints();

      setComplaints(res.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // Fetch Maintenance Users
  // ===========================================

  const fetchMaintenanceUsers = async () => {
    try {
      const res = await getMaintenanceUsers();

      setMaintenanceUsers(res.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load maintenance users.");
    }
  };

  // ===========================================
  // Assign Complaint
  // ===========================================

  const handleAssign = async (complaintId) => {
    try {
      const maintenanceId =
        selectedMaintenance[complaintId];

      if (!maintenanceId) {
        toast.error(
          "Please select a maintenance user."
        );
        return;
      }

      const res = await assignComplaint(
        complaintId,
        maintenanceId
      );

      toast.success(
        res.data?.message ||
          "Complaint assigned successfully."
      );

      await fetchComplaints();

      setSelectedMaintenance({
        ...selectedMaintenance,
        [complaintId]: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Assignment failed."
      );
    }
  };

  // ===========================================
  // Update Complaint Status
  // ===========================================

  const handleStatusChange = async (
    complaintId,
    newStatus
  ) => {
    try {
      const res =
        await updateComplaintStatus(
          complaintId,
          newStatus
        );

      toast.success(
        res.data?.message ||
          "Status updated successfully."
      );

      await fetchComplaints();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint status."
      );
    }
  };
    // ===========================================
  // Search + Filter + Sort
  // ===========================================

  const filteredComplaints = useMemo(() => {
    let data = [...complaints];

    // ---------------- Search ----------------

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();

      data = data.filter((complaint) => {
        return (
          complaint.title?.toLowerCase().includes(keyword) ||
          complaint.description?.toLowerCase().includes(keyword) ||
          complaint.category?.toLowerCase().includes(keyword) ||
          complaint.building?.toLowerCase().includes(keyword) ||
          complaint.floor?.toString().includes(keyword) ||
          complaint.room?.toString().includes(keyword) ||
          complaint.status?.toLowerCase().includes(keyword) ||
          complaint.student?.name
            ?.toLowerCase()
            .includes(keyword) ||
          complaint.student?.email
            ?.toLowerCase()
            .includes(keyword) ||
          complaint.assignedTo?.name
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    // ---------------- Status Filter ----------------

    if (statusFilter !== "All") {
      data = data.filter(
        (complaint) =>
          complaint.status === statusFilter
      );
    }

    // ---------------- Category Filter ----------------

    if (categoryFilter !== "All") {
      data = data.filter(
        (complaint) =>
          complaint.category === categoryFilter
      );
    }

    // ---------------- Building Filter ----------------

    if (buildingFilter !== "All") {
      data = data.filter(
        (complaint) =>
          complaint.building === buildingFilter
      );
    }

    // ---------------- Sorting ----------------

    switch (sortBy) {
      case "Newest":
        data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      case "Oldest":
        data.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Pending":
        data.sort((a, b) => {
          if (
            a.status === "Pending" &&
            b.status !== "Pending"
          )
            return -1;

          if (
            a.status !== "Pending" &&
            b.status === "Pending"
          )
            return 1;

          return 0;
        });
        break;

      case "Resolved":
        data.sort((a, b) => {
          if (
            a.status === "Resolved" &&
            b.status !== "Resolved"
          )
            return -1;

          if (
            a.status !== "Resolved" &&
            b.status === "Resolved"
          )
            return 1;

          return 0;
        });
        break;

      default:
        break;
    }

    return data;
  }, [
    complaints,
    searchTerm,
    statusFilter,
    categoryFilter,
    buildingFilter,
    sortBy,
  ]);

  // ===========================================
  // Pagination
  // ===========================================

  const totalPages = Math.ceil(
    filteredComplaints.length /
      complaintsPerPage
  );

  const indexOfLastComplaint =
    currentPage * complaintsPerPage;

  const indexOfFirstComplaint =
    indexOfLastComplaint -
    complaintsPerPage;

  const currentComplaints =
    filteredComplaints.slice(
      indexOfFirstComplaint,
      indexOfLastComplaint
    );

  // ===========================================
  // Filter Dropdown Data
  // ===========================================

  const categories = [
    "All",
    ...new Set(
      complaints
        .map(
          (complaint) =>
            complaint.category
        )
        .filter(Boolean)
    ),
  ];

  const buildings = [
    "All",
    ...new Set(
      complaints
        .map(
          (complaint) =>
            complaint.building
        )
        .filter(Boolean)
    ),
  ];

  // ===========================================
  // Reset Filters
  // ===========================================

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setBuildingFilter("All");
    setSortBy("Newest");
    setCurrentPage(1);
  };

  // ===========================================
  // JSX Starts Here
  // ===========================================

  return (
    <DashboardLayout>
          {/* ================= Dashboard Header ================= */}

      <div className="dashboard-header">
        <h1>Manage Complaints</h1>

        <p>
          Search, filter, assign and manage campus
          infrastructure complaints.
        </p>
      </div>

      {/* ================= Search & Filters ================= */}

      <div className="dashboard-section">

        <div className="filter-container">

          {/* Search */}

          <input
            type="text"
            placeholder="🔍 Search complaints..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Status */}

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">
              In Progress
            </option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Category */}

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {/* Building */}

          <select
            className="filter-select"
            value={buildingFilter}
            onChange={(e) => {
              setBuildingFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {buildings.map((building) => (
              <option
                key={building}
                value={building}
              >
                {building}
              </option>
            ))}
          </select>

          {/* Sort */}

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="Newest">
              Newest First
            </option>

            <option value="Oldest">
              Oldest First
            </option>

            <option value="Pending">
              Pending First
            </option>

            <option value="Resolved">
              Resolved First
            </option>
          </select>

          {/* Reset */}

          <button
            className="action-btn"
            onClick={resetFilters}
          >
            Reset
          </button>

        </div>

      </div>

      {/* ================= Complaints ================= */}

      {loading ? (

        <p>Loading complaints...</p>

      ) : currentComplaints.length === 0 ? (

        <p>No complaints found.</p>

      ) : (

        <div className="complaints-grid">

          {currentComplaints.map((complaint) => (

            <div
              className="complaint-card"
              key={complaint._id}
            >

              <h3>{complaint.title}</h3>

              <p>
                <strong>Category:</strong>{" "}
                {complaint.category}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {complaint.description}
              </p>

              <p>
                <strong>Building:</strong>{" "}
                {complaint.building || "N/A"}
              </p>

              <p>
                <strong>Floor:</strong>{" "}
                {complaint.floor || "N/A"}
              </p>

              <p>
                <strong>Room:</strong>{" "}
                {complaint.room || "N/A"}
              </p>

              <p>
                <strong>Student:</strong>{" "}
                {complaint.student?.name ||
                  "N/A"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {complaint.student?.email ||
                  "N/A"}
              </p>

              <p>
                <strong>Assigned To:</strong>{" "}
                {complaint.assignedTo?.name ||
                  "Not Assigned"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {complaint.status}
              </p>

              {/* Image */}

              {complaint.image && (
                <div
                  style={{
                    marginTop: "15px",
                  }}
                >
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}

              {/* Status Update */}

              <div
                style={{
                  marginTop: "18px",
                }}
              >
                <label
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Update Status
                </label>

                <select
                  className="filter-select"
                  value={complaint.status}
                  onChange={(e) =>
                    handleStatusChange(
                      complaint._id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              {/* Assign Maintenance */}

              <div
                style={{
                  marginTop: "18px",
                }}
              >
                <label
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Assign Maintenance
                </label>

                <select
                  className="filter-select"
                  value={
                    selectedMaintenance[
                      complaint._id
                    ] || ""
                  }
                  onChange={(e) =>
                    setSelectedMaintenance({
                      ...selectedMaintenance,
                      [complaint._id]:
                        e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Maintenance
                  </option>

                  {maintenanceUsers.map(
                    (user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.name}
                      </option>
                    )
                  )}
                </select>

                <button
                  className="action-btn"
                  style={{
                    width: "100%",
                    marginTop: "12px",
                  }}
                  onClick={() =>
                    handleAssign(
                      complaint._id
                    )
                  }
                >
                  Assign Complaint
                </button>

              </div>

            </div>

          ))}

        </div>

      )}
            {/* ================= Pagination ================= */}

      {!loading && totalPages > 1 && (
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="action-btn"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              className="action-btn"
              style={{
                backgroundColor:
                  currentPage === page
                    ? "#2563eb"
                    : "",
                color:
                  currentPage === page
                    ? "#fff"
                    : "",
              }}
              onClick={() =>
                setCurrentPage(page)
              }
            >
              {page}
            </button>
          ))}

          <button
            className="action-btn"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </button>
        </div>
      )}

    </DashboardLayout>
  );
}

export default AdminComplaints;