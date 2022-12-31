export default {
  data: () => ({
    refreshIntervalId: null,
    secondsToRefresh: 120
  }),
  methods: {
    refreshData(refreshFunction) {
      refreshFunction();  
      this.refreshIntervalId = setInterval(refreshFunction, this.secondsToRefresh * 1000);
    },
    cancelRefreshData() {
      clearInterval(this.refreshIntervalId);
    } 
  },
  beforeRouteLeave(to, from, next) {
    this.cancelRefreshData();
    next();
  },
}