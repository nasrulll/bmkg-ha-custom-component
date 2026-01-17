import voluptuous as vol
from homeassistant import config_entries
from .const import DOMAIN

class BMKGConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(title="BMKG Region", data=user_input)

        data_schema = vol.Schema({
            vol.Required("adm4"): str,
            vol.Required("friendly_name", default="BMKG"): str,
        })
        return self.async_show_form(step_id="user", data_schema=data_schema)

