import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from '../config/api.config';

export default function api(path: string, method: 'get' | 'post' | 'patch' | 'delete', body: any | undefined) {

    const requestDATA = {
        method: method,
        baseURL: ApiConfig.API_URL, // baseUrl + url === complited url
        url: path,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getToken(),
        }
    }

    
    return new Promise<ApiResponse>((resolve) => {
        
        axios(requestDATA)
            .then(res => responseHandler(res, resolve))
            .catch(async error => {
                // ovdje je error vezan za komunikaciju 
                if (error.response.status === 401) {
                    const newToken = await refreshToken();
    
                    if (!newToken){
                        const response: ApiResponse = {
                            status: 'login Error',
                            data: null
                        }
    
                        return resolve(response);
                    }
    
                    saveToken(newToken);
    
                    requestDATA.headers['Authorization'] = getToken()
                    return await repeatRequest(resolve, requestDATA);
    
                }
                const response: ApiResponse = {
                    status: 'service Error',
                    data: error
                }
                resolve(response)
            });
    })
}

    export interface ApiResponse {
        status: 'ok' | 'login Error' | 'service Error';
        data: any;
    }


    async function responseHandler(res: AxiosResponse<any>,resolve: (value: ApiResponse) => void) {
    
        //u  slucaju odgovora servera
        if (res.status < 200 || res.status >= 300) {
          
            const response: ApiResponse = {
                status: 'service Error',
                data: res.data
            };

            return resolve(response)
            
        }
        // u slucaju odgovora nase aplikacije u backendu (npr pogresno logovanje sa netacnim podacima) (ApiResponse)
        let response: ApiResponse;
        if (res.data.errorStatus < 0) 
            response = {
                status: 'login Error',
                data: res.data,
            }
        else 
            response = {
                status: 'ok',
                data: res.data
            }
        return resolve(response)
}
    
async function repeatRequest(resolve: (value: ApiResponse) => void, requestDATA: AxiosRequestConfig) {

    await axios(requestDATA).
        then(res => {
            let response: ApiResponse;

            if (res.status === 401)
                response = {
                    status: 'login Error',
                    data: res.data
                }
            else
                response = {
                    status: 'ok',
                    data: res.data
                }
            return resolve(response);
        }).
        catch(err => {
            const response: ApiResponse = {
                status: 'service Error',
                data: err
            }
            return resolve(response);
        });
}


async  function refreshToken(): Promise<string | null> {
    
    const path = '/auth/Administrator/user/refresh';
    const data = {
        token: getRefreshToken()
    }

    const refreshTokenRequestDATA: AxiosRequestConfig = {
        url: path,
        method: 'post',
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const rts: { data: { token: string | undefined } } = await axios(refreshTokenRequestDATA)
    
    if (!rts.data.token)
        return null;
    
    return rts.data.token;
}

    function getToken(): string {
        const token = localStorage.getItem('api_token');
        return 'Berer ' + token;
    }

    export function saveToken(token: string) {
        localStorage.setItem('api_token', token);       
    }
    function getRefreshToken(): string {
        const token = localStorage.getItem('api_refreshToken');
        return token + '';
    }
    export function saveRefreshToken(token: string) {
        localStorage.setItem('api_refreshToken', token);       
    }
    

