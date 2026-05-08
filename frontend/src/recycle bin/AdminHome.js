import { useNavigate } from "react-router-dom";
import "./CSS/AdminHome.css"

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="row mb-4">
      <h3>Welcome Admin Dashboard</h3>

       <div className="row mb-4">
                  <div className="col-md-6 col-lg-5 mb-4">
                    <div className="card dashboard-card shadow-sm">
                      <div className="card-body text-center">
                        <h5>Mobile</h5>
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => navigate("/home/mobile")}>
                          View Mobiles
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-5 mb-4">
                    <div className="card dashboard-card shadow-sm">
                      <div className="card-body text-center">
                        <h5>Laptop</h5>
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => navigate("/home/laptop")}>
                          View Laptops
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-5 mb-4">
                    <div className="card dashboard-card shadow-sm">
                      <div className="card-body text-center">
                        <h5>Accessories</h5>
                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => navigate("/home/accessories")}>
                          View Accessories
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

    </div>
  );}

export default AdminHome;
