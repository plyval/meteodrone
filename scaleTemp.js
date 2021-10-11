

function scaleTemp(number){
    inMax = 42.00;
    inMin = -30.00;

    outMax = 200.00;
    outMin = 20.00;

percent = (number - inMin) / (inMax - inMin);
output = percent * (outMax - outMin) + outMin;
return output;
}
