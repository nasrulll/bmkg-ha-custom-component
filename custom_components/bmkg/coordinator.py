import asyncio
from datetime import timedelta
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
import aiohttp
from .const import API_URL_CUACA, API_URL_GEMPA, API_URL_EXTREME

class BMKGDataCoordinator(DataUpdateCoordinator):
    """Coordinator to fetch BMKG data."""

    def __init__(self, hass, adm4):
        super().__init__(
            hass,
            _LOGGER,
            name="bmkg",
            update_interval=timedelta(seconds=300)
        )
        self.adm4 = adm4
        self.data = {}

    async def _async_update_data(self):
        """Fetch data from BMKG."""
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(API_URL_CUACA.format(adm4=self.adm4)) as resp:
                    cuaca = await resp.json()
                async with session.get(API_URL_GEMPA) as resp:
                    gempa = await resp.json()
                async with session.get(API_URL_EXTREME) as resp:
                    extreme = await resp.json()

                self.data = {
                    "cuaca": cuaca.get("data", []),
                    "gempa": gempa.get("Infogempa", []),
                    "extreme": extreme.get("data", [])
                }
                return self.data

            except Exception as e:
                raise UpdateFailed(f"Error fetching BMKG data: {e}")

