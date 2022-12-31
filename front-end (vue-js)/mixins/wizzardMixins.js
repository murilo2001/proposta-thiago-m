export default {
  data: () => ({
    tab: 0, /* Váriavel responsável por armazenar a páginação das tabs, irá manter a referência da tab atual */
    tabs: [], /* Váriavel responsável por armazenar o nome das tabs */
    tabsLiberadas: [], /* Váriavel responsável por armazenar as tabs que estão disponiveis para navegação via card e botões */
    tabsStatusAUX: {}  /* Váriavel responsável por armazenar o status das tabs com base nos formularios que utiliza a biblioteca vee-validate */
  }),

  methods: {
    /**
     * Gerencia a paginação progressiva do wizzard, caso chegar a ultima tab irá então executar o metodo save()
     */
    next() {
      if (this.tab === this.tabs.length - 1) {
        this.save()
      } else {
        this.tab++;
      }
      this.$forceUpdate();
    },

    /**
     * Gerencia a paginação retroativa do wizzard
     */
     back() {
      this.tab--;
    },

    /**
     * Gerencia a variável auxiliar tabsStatusAUX, mantem o valor atual de cada etapa com base no formulario,
     * ou seja se as etapas foram completada ou não
     * @param {Object} event objeto contendo o numero da tab atual e seu status, evento responsável -> step-observer
     */
    updateTabStatus(event) {
      this.$set(this.tabsStatusAUX, event.step, event.complete);

      /* Percorre a váriavel auxiliar e verifica o status de cada tab */
      for (let keyTab in this.tabsStatusAUX) {
        /* Caso a nova atualização de status tenha sido invalida irá então executar a função gerenciadorArrayTabsLiberadas(),
        será retirado os valores das tabs posteriores do array que gerencia as tabs disponiveis para navegação */
        if (!event.complete && (keyTab > event.step)) {
          this.gerenciadorArrayTabsLiberadas(keyTab, 'remove');
        } else {
          this.updateTabsLiberadas(keyTab);
        }
      }
    },

    /**
     * Verifica o status o elemento ou seja se a etapa do wizzard foi completada ou não e com base nisso executa a função 
     * gerenciadorArrayTabsLiberadas() para adicionar ou remover o elemento do array
     * @param {String|Number} element Elemento que será adicionado ou removido do array tabsLiberadas
     */
    updateTabsLiberadas(element) {
      let tabCompleted = this.tabsStatusAUX[element];

      tabCompleted ? this.gerenciadorArrayTabsLiberadas(element, 'add') : this.gerenciadorArrayTabsLiberadas(element, 'delete');
    },

    /**
     * Adiciona ou remove elementos do array tabsLiberadas
     * @param {String|Number} element Elemento que será adicionado ou removido do array
     * @param {String} acao ação que será realizado no element dentro do array -> 'add' ou 'delete'
     */
    gerenciadorArrayTabsLiberadas(element, acao) {
      let setTabsLiberadas = new Set(this.tabsLiberadas);

      element = parseInt(element);
      acao === 'add' ? setTabsLiberadas.add(element) : setTabsLiberadas.delete(element);

      this.tabsLiberadas = Array.from(setTabsLiberadas);
    },

    /**
     * Libera todas as etapas do wizzard, está função é utilizada habitualmente no modo edição, quando o formulario é preenchido automaticamente
     */
    liberarEtapasWizzard() {
      setTimeout(() => {
        for (let i = 0; i < this.tabs.length; i++) {
          this.$set(this.tabsStatusAUX, i, true);
          this.tabsLiberadas.push(i);
        }
      }, 500);
    }
  }
}