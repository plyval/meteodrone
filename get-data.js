
const urls = [
    './data.json',
];

var data;
var txt = "";

urls.forEach(function (url) {
    requestWeather(url);
});


function addTableData(data) {

    var tableBody = document.getElementById("tablebody");

    for (var i=0; i<data.length; i++){
       var tr = document.createElement('TR');
       tableBody.appendChild(tr);
       var values = Object.values(data[i]);

       for (var j=0; j<5; j++){
           var td = document.createElement('TD');
           td.appendChild(document.createTextNode(values[j]));
           tr.appendChild(td);
       }
    }
}

function requestWeather(url) {
    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            console.log('Loading... ' + url);
            data = JSON.parse(Http.responseText);
            console.log(data);
            addTableData(data);
            audio(data);
        }
    };
}

