import axios from 'axios';
import store from '@/store';
import router from '@/router';

function getCustomHeaders() {
    
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    const token = getLocalToken();
    if (token && token !== 'undefined') {
        headers.Authorization = `Bearer ${token}`;
    }

    const companyId = getCompanyId();
    if (companyId) {
        headers.CompanyId = companyId;
    }

    const userId = getUserId();
    if (userId) {
        headers.UserId = userId;
    }

    return headers;
}

function getLocalToken() {
    return sessionStorage.getItem('app-auth-token');
}

function getCompanyId() {
    const { getCompanyId } = store.getters;
    return getCompanyId;
}

function getUserId() {
    const { getUserId } = store.getters;
    return getUserId;
}

export default {

    // apiCall(isRequestForGetToken = false) {
    apiCall() {
        let call = axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL,
            headers: getCustomHeaders(),
            timeout: 60 * 4 * 1000,
        });

        // call.interceptors.request.use(async request => {
        //     if (!isRequestForGetToken) {
        //         request.headers.Authorization = await this.getTokenRefreshed();
        //     }

        //     return request;
        // });
        
        call.interceptors.response.use(
            response => {
                if (response.status === 200 || response.status === 201) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(response);
                }
            },
            error => {
                if (error.response && error.response.status) {
                    switch (error.response.status) {
                        case 401:
                        case 403:
                            router.push({ name: 'Login' });
                            break;
                    }
                    return Promise.reject(error.response);
                } else {
                    return Promise.reject(error);
                }
            },
        );
        
        return call;
    },

    /* Verifica se o token JWT está em processo de atualização e espera finalizar até prosseguir com a requisição */
    // async getTokenRefreshed() {
    //     const delay = ms => new Promise(res => setTimeout(res, ms));
    //     let timeLimit = 0;

    //     let released = sessionStorage.getItem('requisicoes-liberadas');
    //     while (released == 'false' || timeLimit == 60000) { // 90000 == (1.5 minutos ou 90 segundos)
    //         await delay(300);
    //         timeLimit+= 300;
    //         released = sessionStorage.getItem('requisicoes-liberadas');
    //     }

    //     const token = getLocalToken();
    //     return `Bearer ${token}`;
    // }
}