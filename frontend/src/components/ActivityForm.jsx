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

function ActivityForm({ onUpdate }) {
  const [selectedActivity, setSelectedActivity] = useState(
    ACTIVITIES[0].key
  );

  const [material, setMaterial] = useState("");

  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [numPeople, setNumPeople] = useState("");

  const [statusMsg, setStatusMsg] = useState({text: "", isError: false});

  /* ---------------------------
     SUBMIT ACTIVITY
  ---------------------------- */
  const submitActivity = async () => {
  // setStatusMsg({ text: "", isError: false });
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setStatusMsg({ text: "No user found. Please log in.", isError: true });
    return;
  }

  /* -- EMPTY FIELD CHECK -- */
  // check if the field for the current selection is empty
  const isDistanceAct = ["WALK_CYCLE", "SHUTTLE", "CARPOOL"].includes(selectedActivity);
  
  if (isDistanceAct && !distance) {
    setStatusMsg({ text: "Please enter the distance", isError: true });
    return;
  }
  if (selectedActivity === "SHOWER" && !minutes) {
    setStatusMsg({ text: "Please enter the duration", isError: true });
    return;
  }
  if (selectedActivity === "LAPTOP" && !minutes) {
    setStatusMsg({ text: "Please enter the hours reduced", isError: true });
    return;
  }
  if (selectedActivity === "RECYCLE" && !material) {
    setStatusMsg({ text: "Please select a material", isError: true });
    return;
  }

  const payload = {
    username: user.username,
    activity_type: currentActivity.type,
  };

    // validation for time on laptop reduction
    if (selectedActivity === "LAPTOP") {
      const val = Number(minutes); // use minutes state, but capture hours
      
      if (!Number.isInteger(val) || val < 1 || val > 4) {
        setStatusMsg({ 
          text: "Please enter a whole number between 1 and 4 hours", 
          isError: true 
        });
        return;
      }
      payload.hours_reduce = val; 
    }


    // optional fields depending on activity
    if (distance) {
      const val = Number(distance);
      if (isNaN(val) || val <= 0) {
        setStatusMsg({ text: "Please enter a valid distance", isError: true });
        return;
      }
      payload.distance_mi = val;
    }
    
    if (minutes) {
      const val = Number(minutes);
      if (isNaN(val) || val <= 0) {
        setStatusMsg({ text: "Please enter valid minutes", isError: true });
        return;
      }
      payload.minutes = val;
    }

    if (numPeople) {
      const val = Number(numPeople);
      if (isNaN(val) || val <= 0) {
        setStatusMsg({ text: "Please enter a valid number of people", isError: true });
        return;
      }
      payload.num_ppl = Number(numPeople);
    }

    // recycle requires material
    if (selectedActivity === "RECYCLE") {
      if (!material) {
        setStatusMsg({ text: "Please select a material", isError: true });
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
        setStatusMsg({ text: `+${data.points_earned} points earned! 🎉`, isError: false });
        onUpdate();
        // reset form
        setDistance("");
        setMinutes("");
        setNumPeople("");
        setMaterial("");

        // auto clear success message
        setTimeout(() => setStatusMsg({ text: "", isError: false }), 3000);
      } else {
        setStatusMsg({ text: data.detail || "Error logging activity", isError: true });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Server error. Try again.", isError: true });    
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
    <div id="activityform">
      <h2>Log Activity</h2>

      {/* displaying status message if it's populated */}
        {statusMsg.text && (
          <p className = {statusMsg.isError ? "error-msg" : "success-msg"}>
            {statusMsg.text}
          </p>
        )}

      {/* Activity dropdown */}
      <select
        value={selectedActivity}
        onChange={(e) => {
          setSelectedActivity(e.target.value);
          setDistance("");
          setMinutes("");
          setNumPeople("");
          setMaterial("");
          setStatusMsg({ text: "", isError: false });
        }}
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
          type="number"
          placeholder="Distance (miles)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      )}

      {/* Shower */}
      {selectedActivity === "SHOWER" && (
        <input
          type="number"
          placeholder="Minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      )}

      {/* Carpool */}
      {selectedActivity === "CARPOOL" && (
        <input
          type="number"
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

      {/* Laptop Reduction */}
      {selectedActivity === "LAPTOP" && (
        <input
          type="number"
          placeholder="Hours reduced (1-4)"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      )}

      {/* Submit button */}
      <button onClick={submitActivity} className="btn-primary">
        Log Activity
      </button>
    </div>
  );
}

export default ActivityForm;