import { useEffect, useState } from "react";

function ActivityForm({ user }) {
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [selectedActivity, setSelectedActivity] = useState("");
  const [material, setMaterial] = useState("");

  // shared inputs
  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [numPeople, setNumPeople] = useState("");

  // ----------------------------
  // LOAD ENUMS FROM BACKEND
  // ----------------------------
  useEffect(() => {
    // activities enum
    fetch("http://localhost:8000/activities")
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setSelectedActivity(data[0]?.key || "");
      });

    // materials enum
    fetch("http://localhost:8000/materials")
      .then(res => res.json())
      .then(data => setMaterials(data));
  }, []);

  // ----------------------------
  // SUBMIT ACTIVITY
  // ----------------------------
  const submitActivity = async () => {
    if (!user) {
      alert("User not found");
      return;
    }

    const payload = {
      username: user.username,
      activity_type: selectedActivity,
    };

    // add optional fields based on activity type
    if (distance) payload.distance_mi = Number(distance);
    if (minutes) payload.minutes = Number(minutes);
    if (numPeople) payload.num_ppl = Number(numPeople);

    // recycle requires material enum
    if (selectedActivity === "RECYCLE") {
      if (!material) {
        alert("Please select a material");
        return;
      }
      payload.material = material;
    }

    try {
      const response = await fetch("http://localhost:8000/log-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
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

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div>
      <h2>Log Activity</h2>

      {/* ACTIVITY DROPDOWN */}
      <select
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
      >
        {activities.map((act) => (
          <option key={act.key} value={act.key}>
            {act.label}
          </option>
        ))}
      </select>

      {/* DISTANCE INPUT */}
      {(selectedActivity === "WALK_CYCLE" ||
        selectedActivity === "SHUTTLE" ||
        selectedActivity === "CARPOOL") && (
        <input
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      )}

      {/* SHOWER INPUT */}
      {selectedActivity === "SHOWER" && (
        <input
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      )}

      {/* CARPOOL INPUT */}
      {selectedActivity === "CARPOOL" && (
        <input
          placeholder="Number of people"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
        />
      )}

      {/* MATERIAL DROPDOWN (FROM ENUM) */}
      {selectedActivity === "RECYCLE" && (
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          <option value="">Select material</option>

          {materials.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      )}

      {/* SUBMIT */}
      <button onClick={submitActivity}>
        Log Activity
      </button>
    </div>
  );
}

export default ActivityForm;