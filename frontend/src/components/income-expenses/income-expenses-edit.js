import {HttpUtils} from "../../utils/http-utils";

export class IncomeAndExpensesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if(!id){
            return this.openNewRoute('/');
        }
        this.typeSelectElement = document.getElementById('type-select');
        this.categorySelectElement = document.getElementById('category-select');
        this.incomeOperation = null; //сюда сохраним массив с категориями доходов
        this.expenseOperation = null; //сюда сохраним массив с категориями расходов

        this.getOperation(id).then();
        this.typeSelectElement.addEventListener('change', () => { //если юзер поменял тип в селекте, то меняем наполнение для категорий
            this.showCategories(this.incomeOperation, this.expenseOperation);
        });
    }

    async getOperation(id){ //получаем данные для таблицы
        const result = await HttpUtils.request('/operations/' + id);
        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе операции');
        }
        console.log(result.response);
        //сразу определяем тип операции в селекте, чтобы категории потом подгружались верно
        for (let i = 0; i < this.typeSelectElement.options.length; i++){
            if(this.typeSelectElement.options[i].value === result.response.type){
                this.typeSelectElement.selectedIndex = i;
            }
        }

        await this.getIncomeCategories(); //ждем получение категорий, прежде, чем рисовать таблицу
        await this.getExpenseCategories();
        this.showCategories(this.incomeOperation, this.expenseOperation);
        this.showOperation(result.response);
    }

    async getIncomeCategories() { //получаем категории для доходов
        const result = await HttpUtils.request('/categories/income');
        this.incomeOperation = result.response;
    }

    async getExpenseCategories() { //подучаем категории для расходов
        const result = await HttpUtils.request('/categories/expense');
        this.expenseOperation = result.response;
    }

    showCategories(incomeOperation, expenseOperation) { //наполняем селекты в зависимости от выбранного типа
        console.log(incomeOperation, expenseOperation);
        console.log(this.typeSelectElement.value);
        this.categorySelectElement.innerHTML = '';
        if (this.typeSelectElement.value === 'income') {
            for (let i = 0; i < incomeOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", incomeOperation[i].title);
                optionElement.innerText = incomeOperation[i].title;
                this.categorySelectElement.appendChild(optionElement);
            }
        } else if (this.typeSelectElement.value === 'expense') {
            for (let i = 0; i < expenseOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", expenseOperation[i].title);
                optionElement.innerText = expenseOperation[i].title;
                this.categorySelectElement.appendChild(optionElement);
            }
        }
    }

    showOperation(operation){ //заполняем таблицу, тип уже заранее выбран
        for (let i = 0; i < this.categorySelectElement.options.length; i++){
            if(this.categorySelectElement.options[i].value === operation.category){
                this.categorySelectElement.selectedIndex = i;
            }
        }
        document.getElementById('sum').value = operation.amount;
        document.getElementById('date').value = operation.date;
        document.getElementById('floatingTextarea').value = operation.comment;
    }
}
