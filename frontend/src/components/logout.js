export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')){
            return this.openNewRoute('/sign-up');
        }

        this.logout().then();
    }

    async logout() {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: localStorage.getItem('refreshToken')
                })
            });
            const result = await response.json();
            console.log(result);

            //независимо от успешности запроса разлогиниваем пользователя
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');

            this.openNewRoute('/sign-up');
    }
}
