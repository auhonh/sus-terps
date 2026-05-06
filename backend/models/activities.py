from .base import BaseActivity

class WalkCycle(MeasuredActivity):
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class ShuttleMetro(MeasuredActivity):
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class Carpool(MeasuredActivity):
    # number of people carpooling together
    num_ppl: int = Field(ge=2)
    
    activity_type: str = "Carpool"
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class Compost(BaseActivity):
    activity_type: str = "Compost"
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class Recycle(BaseActivity):
    # kind of material being recycled (Plastic, Paper, Metal, Cardboard)
    material: str
    activity_type: str = "Recycle"
    
class EWaste(BaseActivity):
    activity_type: str = "E-Waste"
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class EatVeganMeal(BaseActivity):
    activity_type: str = "Eat Vegan"
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class ColdShower(BaseActivity):
    activity_type: str = "Cold Shower"
    duration: int # length of shower in minutes
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class LaptopReduc(BaseActivity):
    activity_type: str = "Reduce Laptop Time"
    # how many hours less than usual did user spend on laptop
    hours_reduce: int = Field(ge=1, le=4)
    base_points: float = 0.0
    co2_saved: float = 0.0
    
class ReusableBag(BaseActivity):
    activity_type: str = "Use Reusable Bag"
    base_points: float = 0.0
    co2_saved: float = 0.0