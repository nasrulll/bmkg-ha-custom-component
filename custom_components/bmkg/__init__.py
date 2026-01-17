
"""BMKG Custom Component for Home Assistant v1.7 FINAL + PRO+"""
from homeassistant.helpers import discovery

DOMAIN = "bmkg"

async def async_setup(hass, config):
    """Set up the BMKG component."""
    # Placeholder, sensors & config_flow will handle actual setup
    return True

async def async_setup_entry(hass, entry):
    """Set up from a config entry."""
    return True
