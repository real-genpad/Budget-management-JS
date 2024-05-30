import {HttpUtils} from "./http-utils";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    static setAuthInfo(accessToken, refreshToken, userInfo){
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }

    static removeAuthInfo(){
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null){
        if(key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)){
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    static async performLogin(email, password, rememberMe) {
        const result = await HttpUtils.request('/login', 'POST', { email, password, rememberMe });

        if (result.error || !result.response || (result.response && (!result.response.tokens || !result.response.user))) {
            throw new Error('Login failed');
        }

        this.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
            id: result.response.user.id,
            name: result.response.user.name + ' ' + result.response.user.lastName
        });
    }
}