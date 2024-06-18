import {HttpUtils} from "../../utils/http-utils";
import {DateFilter} from "../../config/date-filter";

export class IncomeAndExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        new DateFilter(this.fetchOperations.bind(this));
        this.fetchOperations('all').then();
    }

    async fetchOperations(period, dateFrom = '', dateTo = '') {
        let url = '/operations?period=all';
        if (period !== 'all') {
            url = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const result = await HttpUtils.request(url);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе операций');
        }

        this.showIncomeAndExpensesList(result.response);
    }

    showIncomeAndExpensesList(operations) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = ''; // Очищаем таблицу перед отображением новых данных
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            if (operations[i].type === 'expense') {
                trElement.insertCell().innerText = 'Расход';
                trElement.cells[1].className = 'text-danger';
            } else {
                trElement.insertCell().innerText = 'Доход';
                trElement.cells[1].className = 'text-success';
            }
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount + '$';

            const date = new Date(operations[i].date);
            trElement.insertCell().innerText = date.toLocaleDateString('ru-Ru');

            trElement.insertCell().innerText = operations[i].comment;
            trElement.insertCell().innerHTML = '<a href="javascript:void(0)" class="btn" type="button" ' +
                'data-bs-toggle="modal" data-bs-target="#exampleModalCenter"><i class="bi bi-trash"></i></a>' +
                '<a href="/income-and-expenses-edit?id=' + operations[i].id + '" class="btn" type="button"><i class="bi bi-pencil"></i></a>';

            recordsElement.appendChild(trElement);
        }
    }
}