import Mapbox from '@/config/Mapbox';

export default {

  methods: {
   
    createGeocoderControl(L, map, position = 'topleft') {

      const control = L.Control.geocoder({
        defaultMarkGeocode: false,
        geocoder: L.Control.Geocoder.mapbox({ 
          apiKey: Mapbox.access_token 
        })
      })
      .on('markgeocode', (e) => {
            
        console.log(e);

        // Adiciona a popup com o nome da localização encontrada
        this.addPopupLocation(L, map, e);
            
        // Ajusta o mapa para exibir inteiramente a localização encontrada 
        this.fitLocationOnMap(map, e);
      });

      // Configura a posição do controle no mapa
      control.setPosition(position);

      return control;
    },

    addPopupLocation(L, map, e) {

      const { name, center } = e.geocode;

      const popup = L.popup()
        .setLatLng(center)
        .setContent(name || 'Local desconhecido');

      popup.openOn(map);

      return popup;
    },

    fitLocationOnMap(map, e) {
      
      let bbox = e.geocode.bbox;
      let poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ]);
      
      map.fitBounds(poly.getBounds());  
    }
  }
};