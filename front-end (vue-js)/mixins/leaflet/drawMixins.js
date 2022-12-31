import drawLocales from 'leaflet-draw-locales';

drawLocales('pt');

export default {

  methods: {
    
    createDrawControl(
      L, 
      drawConfig = {
        polygon: true,
        rectangle: true,
        circle: false,
        polyline: false,
        marker: false,
        circlemarker: false
      }, 
      position = 'topleft'
    ) {
      
      let drawnItems = new L.FeatureGroup();
      
      let drawControl = new L.Control.Draw({
        position,
        draw: drawConfig,
        edit: {
          featureGroup: drawnItems
        }
      });

      return { drawnItems, drawControl };
    }
  }
};    