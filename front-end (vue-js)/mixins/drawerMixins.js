export default {
    methods: {
        changeSizeHeaderDashBoard() {
            var clientHeight = document.getElementsByClassName('cards-header-dashboard');
            let maiorHeight = 0;
    
            setTimeout(() => {
                clientHeight.forEach(element => {
                    element.style.minHeight = '100%';
                    if (element.clientHeight > maiorHeight) maiorHeight = element.clientHeight;
                });

                clientHeight.forEach(element => {
                    element.style.minHeight = `${maiorHeight}px`;
                });
            }, 500)
        }
    }
};