

//Set ups the instrument/noise sources we want to use
var synth = new Tone.PolySynth().toMaster();
var wind = new Tone.Noise("pink");
var gust = new Tone.Noise("white");


//make an autofilter to shape the noise for wind speed noise source, connect it and start it
var windFilter = new Tone.AutoFilter({
	"frequency" : "16m",
	"min" : 1,
	"max" : 26
}).connect(Tone.Master);
wind.connect(windFilter);
windFilter.start();

//make an autofilter to shape the noise for wind gust speed noise source, connect it and start it
var gustFilter = new Tone.AutoFilter({
	//thoughts:  Max frequncy needs to be high in order to sound like gusts and min frequency keep at 0.
	"baseFrequency" : 200,
	"frequency" : "8m",
	"min" : 0,
	"max" : 16000
}).connect(Tone.Master);
gust.connect(gustFilter);
gustFilter.start();

//This function is to control the audio and to shape it based on the weather data provided into it. 
//It assumes the data provided is an array of javascript objects of the same type
function audio(data){

//listens for event by user to allow starting of the audio. Without this the audio will be blocked by browser autoplay polices.
//For all the below to work it assumes that the event is associated with a click to a togglebox
document.querySelector("#play").addEventListener('click', e => {

    //extract numbers from the array of objects into Arrays so they can be easily used within the audio control
    var tempArr = [];
    for (i = 0; i < data.length; i++){
        tempArr.push(scaleTemp(parseFloat(data[i].temp).toFixed(2)));
    }
    tempArr.sort(function(a, b){return a - b});
    console.log(tempArr);

    var windArr = [];
    for (i = 0; i < data.length; i++){
        if (parseFloat(data[i].windSpeed)){
            windArr.push(scaleTemp(parseFloat(data[i].windSpeed).toFixed(2)));
        }
    }
    windArr.sort(function(a, b){return a - b});
    console.log(windArr);

    var gustArr = [];
    for (i = 0; i < data.length; i++){
        if (parseFloat(data[i].windGust)){
            gustArr.push(scaleTemp(parseFloat(data[i].windGust).toFixed(2)));
        }
    }
    gustArr.sort(function(a, b){return a - b});
    console.log(gustArr);

    //if the event has set the toggle box to clicked then play. If set to not clicked then stop
    if (document.getElementById("play").checked) {
            synth.triggerAttack(tempArr);
            windFilter.min = windArr[windArr.length - 1];
            windFilter.max = windArr[0];
            gustFilter.min = gustArr[gustArr.length - 1];
            gustFilter.max = gustArr[0];
            wind.start();
            gust.start();
    }
    else if (document.getElementById("play").checked === false){
        synth.triggerRelease(tempArr);
        wind.stop();
        gust.stop();
    }
});

}


