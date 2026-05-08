import { useNavigate } from "react-router-dom";

function Auth(){
    const navigate = useNavigate();

    return(
        <div id="Auth">
            <h2>Login to Get Started</h2>

            <div className="button-group">
                <button className="btn-primary" onClick={() => navigate("/login")}>
                Login
                </button>
                <button className="btn-secondary" onClick={() => navigate("/newuser")}>
                New User
                </button>
            </div>
        </div>
    )
}

export default Auth