import {useState} from "react";

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
    const user = JSON.parse(localStorage.getItem("user"));
    return (<div>
        <h1>Welcome, {user.username}</h1>
        <div id="quote">{quote}</div>
        <PieChart />
        <ActivityForm user={user}/>
        <LeaderBoard />
        <Badges user={user}/>
    </div>)
}

export default UserStats