from pydantic import BaseModel, Field
from datetime import datetime

# represents fields EVERY activity that is logged must have
class BaseActivity(BaseModel):
    username: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    activity_type: str # from limited number of options
    
    # how many points an activity is worth
    base_points: float = Field(gt=0)
    # a calculation of points earned by user, level-based
    points_earned: float = Field(gt=0)
    
    # how much CO2 saved (in lbs) for an activity
    co2_saved: float = Field(gt=0)

# represents fields that many activities also require
class MeasuredActivity(BaseActivity):
    # distance in miles they traveled
    distance: float = Field(gt=0)