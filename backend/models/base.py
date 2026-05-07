from pydantic import BaseModel, Field
from datetime import datetime

# represents fields EVERY activity that is logged must have
class BaseActivity(BaseModel):
    username: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    activity_type: str # from limited number of options
    
    # fields that will be calculated internally
    base_points: float | None = None # how many points an activity is worth
    points_earned: float | None = None # a calculation of points earned by user, level-based
    co2_saved_lbs: float | None = None  # how much CO2 saved (in lbs) for an activity

# represents fields that many activities also require
class MeasuredActivity(BaseActivity):
    distance_mi: float = Field(gt=0) # distance in miles they traveled