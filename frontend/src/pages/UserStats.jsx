import {useDebugValue, useEffect, useState} from "react";
import ActivityForm from "../components/ActivityForm";

const quotes = [
    "Sustainability is a way of life, not a trend",
    "A journey of a thousand miles begins with a single step",
    "Think green, live green",
    "Every small action matters when it comes to preserving our planet",
    "Be the change you wish to see in the world"
];

function UserStats(){
    const [quote] = useState(() => {
        const randomIdx = Math.floor(Math.random() * quotes.length);
        return quotes[randomIdx];
    })

     const [user, setUser] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const fetchUser = () => {
    fetch(`http://localhost:8000/user/${storedUser.username}`)
      .then((res) => res.json())
      .then((data) => {setUser(data); });
  };

  useEffect(() => {
    if (!storedUser) return;
    fetchUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {storedUser.username}</h1>

      <div id="quote">
        <h2>{quote}</h2>
      </div>

      <div id="stats">
        <button>🌱 Points: {user.total_points}</button>
        <button>🌍 CO₂ Saved: {user.total_co2} lbs</button>
        <button>⭐ Level: {user.level}</button>
      </div>

      <ActivityForm onUpdate={fetchUser}/>
    </div>
  );
}

export default UserStats