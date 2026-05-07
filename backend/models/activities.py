from .base import BaseActivity, MeasuredActivity, Field, model_validator
from enum import Enum

### stores the rates associated with each activity, leaving the math to the
# classes themselves
class ActivityRates(Enum):
    WALK_CYCLE = {"type": "Walk/Cycle", "points_per": 44.0, "co2_per": 0.88}
    SHUTTLE = {"type": "Shuttle/Metro", "points_per": 28.0, "co2_per": 0.55}
    CARPOOL = {"type": "Carpool", "points_per": 44.0, "co2_per": 0.44}
    COMPOST = {"type": "Compost", "points_per": 6.0, "co2_per": 0}.11
    RECYCLE = {"type": "Recycle", 
               "rates": {
                   "plastic": {"points_per": 8.0, "co2_per": 0.15},
                   "paper": {"points_per": 1.0, "co2_per": 0.01},
                   "metal": {"points_per": 15.0, "co2_per": 0.30},
                   "cardboard": {"points_per": 25.0, "co2_per": 0.50},
               }
    }
    E_WASTE = {"type": "E-Waste", "points_per": 5, "co2_per": 0.44}
    VEGAN = {"type": "Eat Vegan", "points_per": 220, "co2_per": 4.4}
    SHOWER = {"type": "Cold Shower", "points_per": 3.4, "co2_per": 0.066}
    LAPTOP = {"type": "Reduce Laptop Time", "points_per": 3, "co2_per": 0.06}
    BAG = {"type": "Use a Reusable Bag", "points_per": 11, "co2_per": 0.22}
    
    @property
    def data(self):
        return self.value
###
   
### used to restrict the available kinds of recycling material 
class MaterialType(str, Enum):
    PLASTIC = "plastic"
    PAPER = "paper"
    METAL = "metal"
    CARDBOARD = "cardboard"
###
    
# specific activities that can be logged by the user
class WalkCycle(MeasuredActivity):
    @model_validator(mode="after")
    def calc_metrics(self) -> "WalkCycle":
        
    
         
class ShuttleMetro(MeasuredActivity):
    # per mile
    base_points: float = 28
    co2_saved_lbs: float = 0.55
    
class Carpool(MeasuredActivity):
    # number of people carpooling together
    num_ppl: int = Field(ge=2)
    
    activity_type: str = "Carpool"
    # per mile (w/ 2 people)
    base_points: float = 44
    co2_saved_lbs: float = 0.44
    
class Compost(BaseActivity):
    activity_type: str = "Compost"
    base_points: float = 6 # per event
    co2_saved_lbs: float = 0.0
   
class Recycle(BaseActivity):
    # kind of material being recycled (Plastic, Paper, Metal, Cardboard)
    material: MaterialType
    activity_type: str = "Recycle"
    
class EWaste(BaseActivity):
    # how many GBs of cloud storage deleted
    gb_deleted: float = Field(gt=0)
    
    activity_type: str = "E-Waste"
    base_points: float = 5
    co2_saved_lbs: float = 0.0
    
class EatVeganMeal(BaseActivity):
    activity_type: str = "Eat Vegan"
    base_points: float = 220
    co2_saved_lbs: float = 0.0

class ColdShower(BaseActivity):
    activity_type: str = "Cold Shower"
    duration: int # length of shower in minutes
    base_points: float = 3.4
    co2_saved_lbs: float = 0.0
    
class LaptopReduc(BaseActivity):
    activity_type: str = "Reduce Laptop Time"
    # how many hours less than usual did user spend on laptop
    hours_reduce: int = Field(ge=1, le=4)
    base_points: float = 3
    co2_saved_lbs: float = 0.0
    
class ReusableBag(BaseActivity):
    activity_type: str = "Use Reusable Bag"
    base_points: float = 11
    co2_saved_lbs: float = 0.0