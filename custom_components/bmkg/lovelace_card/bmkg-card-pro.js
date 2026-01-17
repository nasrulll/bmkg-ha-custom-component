import { html, css, LitElement } from "https://unpkg.com/lit-element?module";
import Sparkline from "https://cdn.jsdelivr.net/npm/sparkline-js@0.1.0/sparkline.min.js";

class BMKGCardProPlus extends LitElement {

  static get properties() {
    return { hass: {}, config: {} };
  }

  static get styles() {
    return css`
      .card {
        padding:16px;
        border-radius:12px;
        background:linear-gradient(145deg,#f0f8ff,#e0f7fa);
        box-shadow:0 4px 6px rgba(0,0,0,0.1);
        font-family:sans-serif;
      }
      .title { font-size:20px; text-align:center; margin-bottom:12px; }
      .scrollable { overflow-x:auto; white-space:nowrap; }
      .region { display:inline-block; min-width:220px; padding:8px 12px; margin-right:8px; border-radius:8px; background:rgba(255,255,255,0.7); box-shadow:0 2px 4px rgba(0,0,0,0.1);}
      .row { display:flex; justify-content:space-between; margin-bottom:6px; }
      .emoji { font-size:18px; margin-right:4px; }
      .sparkline { height:30px; margin-top:2px; }
      .alert { font-weight:bold; color:red; }
      .ok { color:green; font-weight:bold; }
      .region:hover { background: rgba(255,255,255,0.9); transform: scale(1.03); transition:0.3s; }
    `;
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const regions = this.config.regions || [];
    const regionCards = regions.map(region => {
      const sensor_prefix = `sensor.${region.sensor_prefix}`;

      const condition = this.hass.states[`${sensor_prefix}_condition`] ? this.hass.states[`${sensor_prefix}_condition`].state : "N/A";
      const temp = this.hass.states[`${sensor_prefix}_suhu`] ? this.hass.states[`${sensor_prefix}_suhu`].state : "-";
      const wind = this.hass.states[`${sensor_prefix}_angin`] ? this.hass.states[`${sensor_prefix}_angin`].state : "-";
      const extreme = this.hass.states[`${sensor_prefix}_extreme`] ? this.hass.states[`${sensor_prefix}_extreme`].state : "Normal";
      const gempa = this.hass.states[`${sensor_prefix}_gempa`] ? this.hass.states[`${sensor_prefix}_gempa`].state : "Tidak tersedia";
      const update = this.hass.states[`${sensor_prefix}_update`] ? this.hass.states[`${sensor_prefix}_update`].state : "-";

      const weatherIcon = condition.includes("Cerah") ? "☀️" :
                          condition.includes("Berawan") ? "🌤️" :
                          condition.includes("Hujan") ? "🌧️" :
                          condition.includes("Petir") ? "🌩️" : "☁️";

      const extremeEmoji = extreme !== "Normal" ? "⚠️" : "✅";
      const gempaEmoji = gempa !== "Tidak tersedia" ? "🌍" : "✅";

      // Mini Sparkline data: gunakan 24 jam terakhir jika ada attribute `temp_history` & `wind_history`
      const tempHistory = this.hass.states[`${sensor_prefix}_suhu`]?.attributes?.history || Array(24).fill(temp);
      const windHistory = this.hass.states[`${sensor_prefix}_angin`]?.attributes?.history || Array(24).fill(wind);

      return html`
        <div class="region">
          <div><strong>${region.name}</strong></div>
          <div class="row"><span class="emoji">${weatherIcon}</span> ${condition}</div>
          <div class="row">🌡️ ${temp} °C</div>
          <canvas class="sparkline" id="temp-${region.sensor_prefix}"></canvas>
          <div class="row">💨 ${wind} km/h</div>
          <canvas class="sparkline" id="wind-${region.sensor_prefix}"></canvas>
          <div class="row" style="color:${extreme !== "Normal" ? 'red':'green'}">${extremeEmoji} ${extreme}</div>
          <div class="row" style="color:${gempa !== "Tidak tersedia" ? 'orange':'green'}">${gempaEmoji} ${gempa}</div>
          <div class="row" style="font-size:10px; color:gray;">⏱️ ${update}</div>
        </div>
      `;
    });

    setTimeout(() => {
      regions.forEach(region => {
        const tempEl = this.shadowRoot.getElementById(`temp-${region.sensor_prefix}`);
        const windEl = this.shadowRoot.getElementById(`wind-${region.sensor_prefix}`);
        if(tempEl) Sparkline.draw(tempEl, this.hass.states[`sensor.${region.sensor_prefix}_suhu`]?.attributes?.history || Array(24).fill(0));
        if(windEl) Sparkline.draw(windEl, this.hass.states[`sensor.${region.sensor_prefix}_angin`]?.attributes?.history || Array(24).fill(0));
      });
    }, 300);

    return html`
      <div class="card">
        <div class="title">🌦️ BMKG PRO+ Dashboard</div>
        <div class="scrollable">${regionCards}</div>
      </div>
    `;
  }

  setConfig(config) { this.config = config; }
  getCardSize() { return 8; }
}

customElements.define('bmkg-card-pro-plus', BMKGCardProPlus);

