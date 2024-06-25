import {Main} from "./components/main";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {IncomeAndExpenses} from "./components/income-expenses/income-expenses";
import {IncomeAndExpensesCreate} from "./components/income-expenses/income-expenses-create";
import {IncomeAndExpensesEdit} from "./components/income-expenses/income-expenses-edit";
import {Income} from "./components/income/income";
import {IncomeEdit} from "./components/income/income-edit";
import {IncomeCreate} from "./components/income/income-create";
import {Expenses} from "./components/expenses/expenses";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {Logout} from "./components/logout";
import {IncomeAndExpensesDelete} from "./components/income-expenses/income-expenses-delete";
import {IncomeDelete} from "./components/income/income-delete";
import {ExpensesDelete} from "./components/expenses/expenses-delete";

export class Router {
    constructor() {
        this.initEvents();
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                requiresAuth: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                requiresAuth: false,
                load: () => {
                    document.body.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('d-flex', 'justify-content-center', 'align-items-center', 'vh-100');
                }
            },
            {
                route: '/income-and-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-and-expenses/income-expenses.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/income-and-expenses/income-expenses-edit.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeAndExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-and-expenses-delete',
                requiresAuth: false,
                load: () => {
                    new IncomeAndExpensesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income/income.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/income/income-edit.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/income/income-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-delete',
                requiresAuth: false,
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expenses/expenses-edit.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expenses/expenses-create.html',
                useLayout: '/templates/layout.html',
                requiresAuth: true,
                load: () => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses-delete',
                requiresAuth: false,
                load: () => {
                    new ExpensesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                requiresAuth: false,
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            }
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRout.bind(this));
        window.addEventListener('popstate', this.activateRout.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this)); //переход по страницам без пересборки приложения
    }

    async openNewRoute(url){ //переходим на новую страницу, неважно это клик по ссылке от пользователя
                                        // или принудительный перевод
        //5.вызываем нужные действия, чтобы сменить страницу
        const currentRoute = window.location.pathname; //берем текущий роут
        history.pushState({}, '', url); //изменяем url-адрес в браузере
        await this.activateRout(null, currentRoute); //вызываем ф-цию activateRout с текущим роутом
    }

    async clickHandler(e){ //обрабатываем клик по ссылке
        //1.ищем элемент
        let element = null;
        if(e.target.nodeName === 'A'){
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A'){
            element = e.target.parentNode;
        }

        //2.обрабатываем клик по элементу
        //3.если элемент нашелся
        if(element){
            e.preventDefault();
            //4.берем из него url-адрес
            const url = element.href.replace(window.location.origin, '');
            if(!url || url === '/#' || url.startsWith('javascript:void(0)')){
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRout(e, oldRoute = null) {
        if(oldRoute){
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.requiresAuth && !this.isAuthenticated()) {
                return this.openNewRoute('/login');
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('requested route was not found');
            history.pushState({}, '', '/');
            await this.activateRout();
        }
    }

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    }
}