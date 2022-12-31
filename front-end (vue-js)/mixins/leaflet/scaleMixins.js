export default {

  methods: {
    
    createScaleControl(L, position = 'bottomleft') {
      
      const control = L.control.scale({ 
        imperial: false
      });

      control.setPosition(position);

      return control;   
    }
  }
};    