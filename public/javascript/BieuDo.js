var data = []
var labels = []
$(document).ready(function(){
    $('#tableTop10BorrowedBook').DataTable();
    $('#tableLostBook').DataTable();
})
$(document).ready(
    $.ajax({
        type: 'get',
        url: '/api/laySoLuotMuonSach',
        dataType: 'json',
        data:{
            type: 'theo thang'
        },
        success: function(dataChart){
            dataChart.data.forEach(e => {
                data.push(e)
            });
            dataChart.labels.forEach(e => {
                labels.push(e)
            })
        },
        error: function(req, status, error){
            alert(error)
        }
    })
)

let BieuDo = document.getElementById('BieuDo').getContext('2d');

let chart = new Chart(BieuDo, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Lượt mượn',
            lineTension: 0.3,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointRadius: 3,
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointHoverRadius: 5,
            pointHitRadius: 10,
            pointBorderWidth: 2,
            data: data
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
            legend: {
                display: true,
                position: 'bottom'
            }
        },
    }
})

Chart.defaults.font.family = 'Roboto';
Chart.defaults.font.size = 15;
Chart.defaults.color = 'black';


//BIỂU ĐỒ 

console.log(data)
console.log(labels)


var LuotMuonSach = document.getElementById('ChartType1')
var TienPhat = document.getElementById('ChartType2')
$(document).ready(
    $('.js-choose-time').each(function(i,obj){
        $(this).click(function(){
            var chartType
            if(LuotMuonSach.checked){
                chartType = 1
            }else if(TienPhat.checked){
                chartType=2
            }
            var type = $(this).attr('value')
            if(chartType == 1){
                $.ajax({
                    type: 'get',
                    url: '/api/laySoLuotMuonSach',
                    dataType: 'json',
                    data:{
                        type: type
                    },
                    success: function(dataChart){
                        data.length = 0
                        dataChart.data.forEach(e => {
                            data.push(e)
                        });
                        labels.length = 0
                        dataChart.labels.forEach(e => {
                            labels.push(e)
                        })
                        console.log(data)
                        console.log(labels)
                        $('#titleChart').text('Biểu đồ số lượt mượn sách')
                        let BieuDo = document.getElementById('BieuDo').getContext('2d');
                        chart.destroy();
                        chart = new Chart(BieuDo, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Lượt mượn',
                                    lineTension: 0.3,
                                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                                    borderColor: "rgba(78, 115, 223, 1)",
                                    pointRadius: 3,
                                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                                    pointHoverRadius: 5,
                                    pointHitRadius: 10,
                                    pointBorderWidth: 2,
                                    data: data
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
                                    legend: {
                                        display: true,
                                        position: 'bottom'
                                    }
                                },
                            }
                        })
                    },
                    error: function(req, status, error){
                        alert(error)
                    }
                })
            }else if(chartType == 2){
                $.ajax({
                    type: 'get',
                    url: '/api/laySoTienPhat',
                    dataType: 'json',
                    data:{
                        type: type
                    },
                    success: function(dataChart){
                        data.length = 0
                        dataChart.data.forEach(e => {
                            data.push(e)
                        });
                        labels.length = 0
                        dataChart.labels.forEach(e => {
                            labels.push(e)
                        })
                        console.log(data)
                        console.log(labels)
                        $('#titleChart').text('Biểu đồ số tiền phạt')
                        let BieuDo = document.getElementById('BieuDo').getContext('2d');
                        chart.destroy();
                        chart = new Chart(BieuDo, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Tiền phạt',
                                    lineTension: 0.3,
                                    backgroundColor: "rgba(244, 67, 54, 0.05)",
                                    borderColor: "rgba(244, 67, 54, 1)",
                                    pointRadius: 3,
                                    pointBackgroundColor: "rgba(244, 67, 54, 1)",
                                    pointHoverRadius: 5,
                                    pointHitRadius: 10,
                                    pointBorderWidth: 2,
                                    data: data
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
                                    legend: {
                                        display: true,
                                        position: 'bottom'
                                    }
                                },
                            }
                        })
                    },
                    error: function(req, status, error){
                        alert(error)
                    }
                })
            }
        })
    })
)

function laySachMatTheoThang(){
    var thang = document.getElementById('thang').value;
    $.ajax({
        url: '/api/laySachHuHongHoacMat',
        type: 'get',
        dataType: 'json',
        data: {
            thang: thang
        },
        success: function(data){
            $(".js-table-lost-book tbody tr").remove()
            var html = ''
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                html += '<tr>';
                html += '    <td>'+(i+1)+'</td>';
                html += '    <td>'+e.bookName+'</td>';
                html += '    <td>'+e.lostNumber+'</td>';
                html += '</tr>';   
            }
            $('.js-table-lost-book tbody').append(html)
        }
    })
}