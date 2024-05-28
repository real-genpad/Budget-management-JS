export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(localStorage.getItem('accessToke')){
            return this.openNewRoute('/');
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                valid: false
            }
        ]

        this.commonErrorElement = document.getElementById('common-error');
        this.rememberMeElement = document.getElementById('flexCheckDefault');
        this.processElement = document.getElementById('process-button');

        this.init();
        this.processElement.addEventListener('click', this.login.bind(this));
    }

    //запускаем валидацию формы
    init() {
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
    }

    //валидируем каждое поле
    validateField(field, element) {
        if (!element.value) {
            element.classList.add('is-invalid');
            element.previousElementSibling.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            element.previousElementSibling.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    }

    //если все поля валидны, разблокируем кнопку
    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: this.fields.find(item => item.name === 'email').element.value,
                    password: this.fields.find(item => item.name === 'password').element.value,
                    rememberMe: this.rememberMeElement.checked
                })
            });
            const result = await response.json();
            if (result.error || !result.tokens || !result.user) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            localStorage.setItem('accessToken', result.tokens.accessToken);
            localStorage.setItem('refreshToken', result.tokens.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify({
                id: result.user.id,
                name: result.user.name + ' ' + result.user.lastName
            }));

            this.openNewRoute('/');
        }
    }
}
