import { useNavigate } from "react-router-dom";

function NewUser(){
    const navigate = useNavigate();

    return (
    <div id="newuser">
        <h1>New User</h1>

        <input
            placeholder="Enter your email"
        />

        <input
            type="password"
            placeholder="Enter your password"
        />

        <input
            type="password"
            placeholder="Confirm password"
        />

        <input
            placeholder="Enter your name"
        />

        <input
            placeholder="Enter your email id"
        />

        <button onClick={() => navigate("/userstats")}>Login</button>
    </div>
    )
}


export default NewUser