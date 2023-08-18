import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = React.useState(null);

  const login = (user) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      <Router>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to="/" className="navbar-brand">
            Restaurant Reviews
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/restaurants"} className="nav-link">
                Restaurants
              </Link>
            </li>
            <li className="nav-item">
              {user ? (
                <a onClick={logout} className="nav-link" style={{ cursor: 'pointer' }}>
                  Logout {user.name}
                </a>
              ) : (
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              )}
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
          <Route exact path="/" element={<RestaurantsList />} />
            <Route
              path="/restaurants/:id/review"
              element={<AddReview user={user} />}
            />
            <Route
              path="/restaurants/:id"
              element={<Restaurant user={user} />}
            />
            <Route
              path="/login"
              element={<Login user={user} login={login} />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
