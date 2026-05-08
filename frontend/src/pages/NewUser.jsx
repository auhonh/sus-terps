import { useNavigate } from "react-router-dom";
import {useDebugValue, useEffect, useState} from "react";

function NewUser(){
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [statusMsg, setStatusMsg] = useState({text: "", isError: false});

  const handleSignup = async () => {
    if(password !== confirmPassword) {
      setStatusMsg({text: "Passwords do not match!", isError: true});
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
        setStatusMsg({ text: "Account created! Redirecting to login...", 
          isError: false });
        console.log("Created user:", data);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage = typeof data.detail === "string" ?
        data.detail : JSON.stringify(data.detail);
        
        setStatusMsg({text: errorMessage, isError: true});
      }
    } catch (error) {
      console.error(error);
      setStatusMsg({text: error.stringify, isError: true});
    }
  };
    return (
    <div id="newuser">
        <h1>New User</h1>

        {/* displaying status message if it's populated */}
        {statusMsg.text && (
          <p className = {statusMsg.isError ? "error-msg" : "success-msg"}>
            {statusMsg.text}
          </p>
        )}

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


        <button className="btn-primary" onClick={handleSignup}>Create Account</button>
    </div>
    )
}


export default NewUser