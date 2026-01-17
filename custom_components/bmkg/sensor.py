from homeassistant.components.sensor import SensorEntity
from .coordinator import BMKGDataCoordinator
from .const import DOMAIN

async def async_setup_entry(hass, entry, async_add_entities):
    """Set up sensors."""
    adm4 = entry.data.get("adm4")
    coordinator = BMKGDataCoordinator(hass, adm4)
    await coordinator.async_config_entry_first_refresh()

    entities = [
        BMGKWeatherSensor(coordinator),
        BMGKTemperatureSensor(coordinator),
        BMGKWindSensor(coordinator),
        BMGKExtremeSensor(coordinator),
        BMGKGempaSensor(coordinator)
    ]
    async_add_entities(entities)

class BMGKWeatherSensor(SensorEntity):
    def __init__(self, coordinator):
        self.coordinator = coordinator
        self._attr_name = "BMKG Cuaca"
        self._attr_unique_id = "bmkg_cuaca"

    @property
    def state(self):
        try:
            return self.coordinator.data["cuaca"][0]["cuaca"][0][0]["weather_desc"]
        except:
            return "Tidak tersedia"

    @property
    def extra_state_attributes(self):
        return self.coordinator.data

