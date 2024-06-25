import {HttpUtils} from "../../utils/http-utils";

export class Expenses{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getExpenseList().then();
    }

    async getExpenseList(){ //запрос на получение категорий расходов
        const result = await HttpUtils.request('/categories/expense');
        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категорий расходов');
        }
        this.showExpenseList(result.response);
    }

    showExpenseList(income){ //рисуем блоки с категориями
        const cardsElement = document.getElementById('cards');
        for (let i = 0; i < income.length; i++) {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            const cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';

            const cardTitleElement = document.createElement('h5');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerHTML = income[i].title;

            const editElement = document.createElement('a');
            editElement.setAttribute('href', '/expenses-edit?id=' + income[i].id);
            editElement.setAttribute('type', 'button');
            editElement.className = 'operations-btn btn btn-primary';
            editElement.innerHTML = 'Редактировать';

            const deleteElement = document.createElement('a');
            deleteElement.setAttribute('href', 'javascript:void(0)');
            deleteElement.setAttribute('type', 'button');
            deleteElement.setAttribute('data-id', income[i].id);
            deleteElement.setAttribute('data-bs-toggle', 'modal');
            deleteElement.setAttribute('data-bs-target', '#exampleModalCenter');
            deleteElement.className = 'operations-btn btn delete-btn btn-danger';
            deleteElement.innerHTML = 'Удалить';

            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(editElement);
            cardBodyElement.appendChild(deleteElement);

            cardElement.appendChild(cardBodyElement);

            cardsElement.appendChild(cardElement);
        }

        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardBodyElement = document.createElement('div');
        cardBodyElement.className = 'card-body card-body-new';

        const newElement = document.createElement('a');
        newElement.setAttribute('href', '/expenses-create');
        newElement.innerHTML = '+';

        cardBodyElement.appendChild(newElement);
        cardElement.appendChild(cardBodyElement);
        cardsElement.appendChild(cardElement);

        this.categoryDeleteEventListeners();
    }

    categoryDeleteEventListeners() { //передаем id операции в каждую кнопку удаления
        const deleteButtons = document.querySelectorAll('.delete-btn');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', (event) => {
                let operationId = event.target.closest('.delete-btn').getAttribute('data-id');
                let deleteBtn = document.getElementById('delete-btn');
                deleteBtn.setAttribute('href', '/expenses-delete?id=' + operationId);
            });
        }
    }
}