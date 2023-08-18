import React, { useState } from "react";

const Login = props => {
  //Initial state for user data
  const initialUserState = {
    name: "",
    id: "",
  }

  //Iniitalize state using the initialUserState
  const [user, setUser] = useState(initialUserState);

  //Function for handling input changes
  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value }); //Update the user state with the new value whilst keeping the existing user data.
  }

  //Function to perform login and page redirect
  const login = () => {
    //Call the login function passed through the props whilst providing the user data
    props.login(user);
    props.history.push('/'); //User redirect to home page after successful login.
  }

  return (
    <div className="submit-form">
      <div>

        {/* Username input */}
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name" required
            value={user.name}
            onChange={handleInputChange}
            name="name"
          />
        </div>

        {/* ID input */}
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            className="form-control"
            id="id" required
            value={user.id}
            onChange={handleInputChange}
            name="id"
          />
        </div>

        {/* Login Button */}
        <button onClick={login} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  )
};

export default Login;
