export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if(localStorage.getItem('accessToke')){
            return this.openNewRoute('/');
        }

        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                regex: /^[А-ЯA-Z][а-яa-z]+\s[А-ЯA-Z][а-яa-z]+$/,
                valid: false
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
                valid: false
            },
            {
                name: 'repeatPassword',
                id: 'password-repeat',
                element: null,
                valid: false
            },
        ]

        this.commonErrorElement = document.getElementById('common-error');
        this.passwordElement = document.getElementById('password')
        this.processElement = document.getElementById('process-button');

        this.init();
        this.processElement.addEventListener('click', this.signUp.bind(this));
    }

    //запускаем валидацию формы
    init(){
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function(){
              that.validateField.call(that, item, this);
            }
        });
    }

    //валидируем каждое поле
    validateField(field, element) {
        // проверка, что поле повторения пароля совпадает с полем пароля
        if (field.name === 'repeatPassword') {
            if (element.value !== this.passwordElement.value) {
                element.classList.add('is-invalid');
                element.previousElementSibling.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                element.previousElementSibling.removeAttribute('style');
                field.valid = true;
            }
        } else {
            // Валидация остальных полей
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.add('is-invalid');
                element.previousElementSibling.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                element.previousElementSibling.removeAttribute('style');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    //если все поля валидны, разблокируем кнопку
    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if(validForm){
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async signUp (){
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: this.fields.find(item => item.name === 'name').element.value.split(' ')[0],
                    lastName: this.fields.find(item => item.name === 'name').element.value.split(' ')[1],
                    email: this.fields.find(item => item.name === 'email').element.value,
                    password: this.fields.find(item => item.name === 'password').element.value,
                    passwordRepeat: this.fields.find(item => item.name === 'repeatPassword').element.value
                })
            });
            const result = await response.json();
            console.log(result);
            if (result.error || !result.user.id || !result.user.email || !result.user.name || !result.user.lastName) {
                this.commonErrorElement.style.display = 'block';
                return;
            } else {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.fields.find(item => item.name === 'email').element.value,
                        password: this.fields.find(item => item.name === 'password').element.value
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
            }
            this.openNewRoute('/');
        }
    }
}
