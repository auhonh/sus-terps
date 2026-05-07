import { useNavigate } from "react-router-dom";
import {useDebugValue, useEffect, useState} from "react";

function NewUser(){
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if(password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully!");
        console.log("Created user:", data);

        navigate("/login"); 
      } else {
        const errorMessage = typeof data.detail === "string" ?
        data.detail : JSON.stringify(data.detail);
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };
    return (
    <div id="newuser">
        <h1>New User</h1>

        <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

        <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {confirmPassword && password !== confirmPassword && (
        <p id="matchPW">Passwords must match</p>
      )}


        <button onClick={handleSignup}>Create Account</button>
    </div>
    )
}


export default NewUser