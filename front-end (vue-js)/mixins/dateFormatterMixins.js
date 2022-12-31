import dayjs from 'dayjs';

export default {
  methods: {
    parseDate(date) {
      if (!date) return null
      
        const [day, month, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },

      formatDate(date) {
        date = this.getOnlyDateIgnoringTimestamp(date);
        return dayjs(date).format('DD/MM/YYYY');
      },

      formatDateHour(date) {
        return dayjs(date).format('DD/MM/YYYY HH:mm');
      },

      parseMonth(date) {
        if (!date) return null;
    
        const [month, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}`;
      },

      formatMonth(date) {
        date = this.getOnlyDateIgnoringTimestamp(date);
        return dayjs(date).format('MM/YYYY');
      },

      formatDateToPicker(date) {
        date = this.getOnlyDateIgnoringTimestamp(date);
        return dayjs(date).format('YYYY-MM-DD');
      },

      formatMonthToPicker(date) {
        date = this.getOnlyDateIgnoringTimestamp(date);
        return dayjs(date).format('YYYY-MM');
      },

      getOnlyDateIgnoringTimestamp(date) {
        if (date && date.length > 10) date = date.substr(0, 10);

        return date;
      }
    }
};