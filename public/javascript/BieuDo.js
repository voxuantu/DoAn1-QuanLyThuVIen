Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 15;
Chart.defaults.color = 'black';

let BieuDoSoLuotMuonSach = document.getElementById('BieuDoSoLuotMuonSach').getContext('2d');

let chartSoLuotMuonSach = new Chart(BieuDoSoLuotMuonSach, {
    type: 'line',
    data: {
        labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
        datasets: [{
            label: "Lượt mượn",
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 5,
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [50, 150, 100, 250, 200, 350, 300, 450, 400, 550, 500, 650]
        }],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 25
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Bảng thống kê số lượt mượn sách',
                font:{
                    size:18
                }
            },
            legend:{
                display:true,
                position:'bottom'
            }
        },
    }
})


//BIỂU ĐỒ SỐ TIỀN PHẠT 

let BieuDoSoTienPhat = document.getElementById('BieuDoSoTienPhat').getContext('2d');

let chartSoTienPhat = new Chart(BieuDoSoTienPhat, {
    type: 'line',
    data: {
        labels: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
        datasets: [{
            label: "Tiền phạt",
            lineTension: 0.3,
            backgroundColor: "rgba(244, 67, 54, 0.05)",
            borderColor: "rgba(244, 67, 54, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(244, 67, 54, 1)",
            pointHoverRadius: 5,
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: [500000, 1500000, 1000000, 2500000, 2000000, 3500000, 3000000, 4500000, 4000000, 5500000, 5000000, 6500000]
        }],
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 25
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Bảng thống kê số tiền phạt',
                font:{
                    size:18
                }
            },
            legend:{
                display:true,
                position:'bottom'
            }
        },
    }
})
