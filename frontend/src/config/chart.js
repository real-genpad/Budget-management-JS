import Chart from 'chart.js/auto';

export class CustomChart {
    constructor() {
        this.data = {
            type: 'pie',
            data: {
                labels: ['red', 'orange', 'yellow', 'green', 'blue'],
                datasets: [{
                    backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'],
                    data: [20, 20, 20, 20, 20]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#000',
                            boxWidth: 35,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        },
                    },
                    title: {
                        display: false,
                    }
                }
            }
        }
        this.renderCharts();
    }

    renderCharts() {
        const incomeChart = document.getElementById('chart-income');
        new Chart(incomeChart, this.data);

        const expensesChart = document.getElementById('chart-expenses');
        new Chart(expensesChart, this.data);
    }
}
