import { useState } from "react";

/* ---------------------------
   HARD-CODED ACTIVITY LIST
---------------------------- */
const ACTIVITIES = [
  { key: "WALK_CYCLE", type: "Walk/Cycle" },
  { key: "SHUTTLE", type: "Shuttle/Metro" },
  { key: "CARPOOL", type: "Carpool" },
  { key: "COMPOST", type: "Compost" },
  { key: "RECYCLE", type: "Recycle" },
  { key: "E_WASTE", type: "E-Waste" },
  { key: "VEGAN", type: "Eat Vegan" },
  { key: "SHOWER", type: "Cold Shower" },
  { key: "LAPTOP", type: "Reduce Laptop Time" },
  { key: "BAG", type: "Use a Reusable Bag" },
];

/* -----------------
   MATERIAL OPTIONS 
-------------------- */
const MATERIALS = ["plastic", "paper", "metal", "cardboard"];

function ActivityForm({ user }) {
  const [selectedActivity, setSelectedActivity] = useState(
    ACTIVITIES[0].key
  );

  const [material, setMaterial] = useState("");

  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [numPeople, setNumPeople] = useState("");

  /* ---------------------------
     SUBMIT ACTIVITY
  ---------------------------- */
  const submitActivity = async () => {
    if (!user) {
      alert("No user found");
      return;
    }

    const payload = {
      username: user.username,
      activity_type: selectedActivity,
    };

    // optional fields depending on activity
    if (distance) payload.distance_mi = Number(distance);
    if (minutes) payload.minutes = Number(minutes);
    if (numPeople) payload.num_ppl = Number(numPeople);

    // recycle requires material
    if (selectedActivity === "RECYCLE") {
      if (!material) {
        alert("Please select a material");
        return;
      }
      payload.material = material;
    }

    try {
      const res = await fetch("http://localhost:8000/log-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`+${data.points_earned} points 🎉`);

        // reset form
        setDistance("");
        setMinutes("");
        setNumPeople("");
        setMaterial("");
      } else {
        alert(data.detail || "Error logging activity");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* ---------------------------
     GET CURRENT ACTIVITY OBJECT
  ---------------------------- */
  const currentActivity = ACTIVITIES.find(
    (a) => a.key === selectedActivity
  );

  /* ---------------------------
     UI
  ---------------------------- */
  return (
    <div>
      <h2>Log Activity</h2>

      {/* Activity dropdown */}
      <select
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
      >
        {ACTIVITIES.map((a) => (
          <option key={a.key} value={a.key}>
            {a.type}
          </option>
        ))}
      </select>

      {/* Distance-based activities */}
      {["WALK_CYCLE", "SHUTTLE", "CARPOOL"].includes(
        selectedActivity
      ) && (
        <input
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      )}

      {/* Shower */}
      {selectedActivity === "SHOWER" && (
        <input
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      )}

      {/* Carpool */}
      {selectedActivity === "CARPOOL" && (
        <input
          placeholder="Number of people"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
        />
      )}

      {/* Recycle material dropdown */}
      {selectedActivity === "RECYCLE" && (
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          <option value="">Select material</option>

          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}

      {/* Submit button */}
      <button onClick={submitActivity}>
        Log Activity
      </button>
    </div>
  );
}

export default ActivityForm;