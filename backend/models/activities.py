from .base import BaseActivity, MeasuredActivity
from pydantic import Field, model_validator
from enum import Enum

### stores the rates associated with each activity, leaving the math to the
# classes themselves
class ActivityRates(Enum):
    WALK_CYCLE = {"type": "Walk/Cycle", "points_per": 44.0, "co2_per": 0.88}
    SHUTTLE = {"type": "Shuttle/Metro", "points_per": 28.0, "co2_per": 0.55}
    CARPOOL = {"type": "Carpool", "points_per": 44.0, "co2_per": 0.44}
    COMPOST = {"type": "Compost", "points_per": 6.0, "co2_per": 0.11}
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
        config = ActivityRates.WALK_CYCLE.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * self.distance_mi
        self.co2_saved_lbs = config["co2_per"] * self.distance_mi

        return self   
         
class ShuttleMetro(MeasuredActivity):
    @model_validator(mode="after")
    def calc_metrics(self) -> "ShuttleMetro":
        config = ActivityRates.SHUTTLE.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * self.distance_mi
        self.co2_saved_lbs = config["co2_per"] * self.distance_mi

        return self
    
class Carpool(MeasuredActivity):
    # number of people carpooling together
    num_ppl: int = Field(ge=2)
    
    @model_validator(mode="after")
    def calc_metrics(self) -> "Carpool":
        config = ActivityRates.CARPOOL.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * (1 - (1/self.num_ppl)) * self.distance_mi
        self.co2_saved_lbs = config["co2_per"] * (1 - (1/self.num_ppl))

        return self
    
class Compost(BaseActivity):
    @model_validator(mode="after")
    def calc_metrics(self) -> "Compost":
        config = ActivityRates.COMPOST.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"]
        self.co2_saved_lbs = config["co2_per"]

        return self
   
class Recycle(BaseActivity):
    material: MaterialType

    @model_validator(mode="after")
    def calc_metrics(self) -> "Recycle":
        config = ActivityRates.RECYCLE.data # pulling stored rates

        self.activity_type = config["type"]
        # getting rate based on material by accessing enum field
        material_rate = config["rates"].get(self.material.value)

        # handles case of None if material not in ActivityRates
        if material_rate:
            self.base_points = material_rate["points_per"]
            self.co2_saved_lbs = material_rate["co2_per"]

        return self
    
class EWaste(BaseActivity):
    # how many GBs of cloud storage deleted
    gb_deleted: float = Field(gt=0)
    
    @model_validator(mode="after")
    def calc_metrics(self) -> "EWaste":
        config = ActivityRates.E_WASTE.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * self.gb_deleted
        self.co2_saved_lbs = config["co2_per"] * self.gb_deleted

        return self
    
class EatVeganMeal(BaseActivity):
    @model_validator(mode="after")
    def calc_metrics(self) -> "EatVeganMeal":
        config = ActivityRates.VEGAN.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"]
        self.co2_saved_lbs = config["co2_per"]

        return self

class ColdShower(BaseActivity):
    minutes: int # length of shower in minutes
    
    @model_validator(mode="after")
    def calc_metrics(self) -> "ColdShower":
        config = ActivityRates.SHOWER.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * self.minutes
        self.co2_saved_lbs = config["co2_per"] * self.minutes

        return self
    
class LaptopReduc(BaseActivity):
    # how many hours less than usual did user spend on laptop
    hours_reduce: int = Field(ge=1, le=4)

    @model_validator(mode="after")
    def calc_metrics(self) -> "LaptopReduc":
        config = ActivityRates.LAPTOP.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"] * self.hours_reduce
        self.co2_saved_lbs = config["co2_per"] * self.hours_reduce

        return self
    
class ReusableBag(BaseActivity):
    @model_validator(mode="after")
    def calc_metrics(self) -> "ReusableBag":
        config = ActivityRates.BAG.data # pulling stored rates

        self.activity_type = config["type"]
        self.base_points = config["points_per"]
        self.co2_saved_lbs = config["co2_per"]

        return self