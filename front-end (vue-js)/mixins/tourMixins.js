import introJs from 'intro.js'
import store from '@/store'
import TourService from '@/services/TourService'
import '../../public/css/introjs-customizable.css'

export default {
  data: () => ({
    scrollToElement: true,
    desativarTourAoSair: true,
    doneLabel: 'Finalizar',
    tourFuncCalled: false
  }),

  beforeDestroy() {
    introJs().exit();
    introJs().refresh();
  },

  computed: {
    nomePagina() {
      return this.$router.history.current.name;
    }
  },

  methods: {
    iniciarTour(arrTour,
                arrDicas = [],
                onBeforeChangeFunctions = [() => {}],
                onBeforeExitFunctions = [() => {}],
               ) {

      this.tourFuncCalled = true;
      let infoTourCurrentPage = this.checkTourCurrentPage();

      /* Força parada de tour's existentes e (atualiza/ordenada) as camadas */
      introJs().exit();
      introJs().refresh();

      if (typeof infoTourCurrentPage === "undefined") return;

      /* Impede que o Tour inicie em resoluçoes < 762px */
      if (this.getLarguraWindow() < 762) { return }

      let intro = introJs().setOptions({
        nextLabel : 'Próximo',
        prevLabel : 'Voltar',
        doneLabel : this.doneLabel,
        hintButtonLabel: 'OK',
        showStepNumbers: false, /* exibe paginação contendo pag atual e total de pag's ex: 1 of 5 */
        showBullets: false, /* exibe marcadores de introdução (barra horizontal) */
        showProgress: true, /* exibe barra de progresso */
        steps: arrTour,
        hints: arrDicas,
        scrollToElement : this.scrollToElement
      });

      intro.onbeforechange(() => {
        onBeforeChangeFunctions.forEach(item => {
          if (typeof item.func === 'function') {
            if (intro._currentStep == item.runInStep) item.func();
          }
        });
      });   

      intro.onbeforeexit(() => {
        arrDicas.length > 0 ? intro.showHints() : intro.hideHints();
          onBeforeExitFunctions.forEach(item => {
            if (typeof item.func === 'function') item.func();
          });

        /* Checa se o tour ainda não foi completado e se a desativacao Tour está liberada.
        OBS: Parâmetro {desativarTourAoSair} é utilizado em wizzard's, para criar lista de
        execução de tour's em sequencia sem desativar ao finalizar o tour antecessor */
        if (!infoTourCurrentPage.tour_completado && this.desativarTourAoSair) {
          this.markTourCompleted();
        }
      });

      if (!infoTourCurrentPage.tour_completado) {
        this.checkElementsRenderAndStart(intro)
      }
    },

    /**
     * Checa se existe algum TOUR cadastrado para essa página
     *
     * @returns {number | null}
     * - caso sim = return {nome_pagina: string, tour_completado: boolean}, 
     * - caso não = return undefined
     */
    checkTourCurrentPage() {
      let arrTourInfo = store.getters.getTourInfo;

      let tourPage = arrTourInfo.find(tourInfo => this.nomePagina == tourInfo.nome_pagina);

      return tourPage ? tourPage : undefined;
    },

    getLarguraWindow() {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    },

    markTourCompleted() {
      TourService.desativarTourUserCurrentPage(this.nomePagina)
      .catch(() => {
        this.$toast.error("Erro ao marcar tour da página atual como concluído", '',{position:'topRight'});
      })

      let arrTourInfo = store.getters.getTourInfo;
      arrTourInfo.forEach(tourInfo => {
        if (tourInfo.nome_pagina == this.nomePagina) tourInfo.tour_completado = true;
      });
      this.$store.dispatch('setTour', arrTourInfo);
    },

    /**
     * Verifica se todos elementos que serão focados nas etapas do TOUR foram renderizados,
     * caso não ira irá aguardar até que sejam, tempo limite: ± 1 minuto
     */
    checkElementsRenderAndStart(intro) {

      let arrTour = intro._options.steps;

      /* Cria um novo array apenas com os id's dos elementos que serão focados */
      let arrElementsIds = arrTour.map((item) => item.element);

      /* Retira elementos undefined (que não possuem foco) */
      arrElementsIds = arrElementsIds.filter(item => item);

      /* Converte o array em Set */
      arrElementsIds = new Set(arrElementsIds);

      let contador = 0;

      var checkArrElementsIds = function() {
        /* Deixa no SET -> arrElementsIds apenas elementos que não foram renderizados */
        for (let elementId of arrElementsIds) {
          let elementExist = document.getElementById(elementId.substr(1));
          if (elementExist) arrElementsIds.delete(elementId);
        }
        contador++;

        /* Caso o SET esteja vazio, significa que todos elementos foram renderizados, 
        ira então iniciar o introJS */
        if (!arrElementsIds.size) {
          setTimeout(() => intro.start(), 400);
        /* Caso o SET não esteja vazio, significa que falta elementos para serem rederizados,
        ira então repetir a execução da função com timeout até que sejam renderizados.
        OBS: 35 == (63 segundos ou 63000 ms) (máximo de tempo do timeout) */
        } else if (contador <= 35) {
          setTimeout(checkArrElementsIds, contador * 100);
        }
      };

      checkArrElementsIds();
    },
  }
}