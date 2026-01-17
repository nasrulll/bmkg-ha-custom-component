# BMKG Custom Component for Home Assistant

**Version:** v1.7 PRO+  
**Author:** Nasrul Muiz  
**Status:** Production / Final  

![BMKG PRO+ Preview](./preview.png)

## Features

- Multi-region BMKG data (Cuaca, Cuaca Ekstrim, Gempa)  
- WhatsApp & Telegram notifications  
- Lovelace PRO+ Card dengan Mini Sparkline Charts (Suhu & Angin 24 jam)  
- Modern UI dengan emoji visual & hover effects  
- Config Flow untuk multi-region dan mudah disesuaikan  

## Installation

1. Copy folder `custom_components/bmkg` ke Home Assistant `custom_components/`.  
2. Restart Home Assistant.  
3. Tambahkan sensor di `configuration.yaml` atau melalui UI Config Flow.

### Contoh Konfigurasi Lovelace

```yaml
type: 'custom:bmkg-card-pro-plus'
regions:
  - name: Parepare
    sensor_prefix: bmkg_parepare
  - name: Makassar
    sensor_prefix: bmkg_makassar
