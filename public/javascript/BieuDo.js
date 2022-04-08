$(document).ready(function(){
    $('#tableTop10BorrowedBook').DataTable();
})

function getNumberOfBorrowBooksByMonth(){
    var numberOfBorrowBooksByMonth = []
    $.ajax({
        type: 'get',
        url: '/api/laySoLuotMuonSachTheoThang',
        dataType: 'json',
        success: function(data){
            data.forEach(e => {
                numberOfBorrowBooksByMonth.push(e)
            });
        },
        error: function(req, status, error){
            alert(error)
        }
    })
    return numberOfBorrowBooksByMonth
}

function getFineByMonth(){
    var fineByMonth = []
    $.ajax({
        type: 'get',
        url: '/api/laySoTienPhatTheoThang',
        dataType: 'json',
        success: function(data){
            data.forEach(e => {
                fineByMonth.push(e)
            });
        },
        error: function(req, status, error){
            alert(error)
        }
    })
    return fineByMonth
}

Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 15;
Chart.defaults.color = 'black';


//BIỂU ĐỒ SỐ LƯỢT MƯỢN SÁCH
var dataNumberOfBorrowBooksByMonth = getNumberOfBorrowBooksByMonth()

console.log(dataNumberOfBorrowBooksByMonth)

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
            data: dataNumberOfBorrowBooksByMonth
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

var dataFineByMonth = getFineByMonth()

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
            data: dataFineByMonth
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
