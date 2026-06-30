import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <main className="main">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <section className="content">
          {children}
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;