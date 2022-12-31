export default {

  methods: {
    
    createBrowserPrintControl(L, documentTitle, position = 'topleft') {
      
      const control = L.control.browserPrint({
        title: 'Imprimir Mapa',
        documentTitle,
        printModes: [
          L.BrowserPrint.Mode.Auto('B4', {
            title: 'Imprimir' 
          }),
          L.BrowserPrint.Mode.Custom('B5', {
            title: 'Imprimir Selecionando Região'
          })
        ]
      });

      control.setPosition(position);

      return control;   
    }
  }
};    