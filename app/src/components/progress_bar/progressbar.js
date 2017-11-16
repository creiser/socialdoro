/**
 * Created by tvaisanen on 11/16/17.
 */

var counter = 0;
var height = 20;
var draw = true;

var myVar = setInterval(timer, 1000);

function timer() {
    counter += 1;
    document.getElementById("tick").innerHTML = counter;
    if (draw){
        draw_progress(counter);
    }
}

function draw_progress(time) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.moveTo(time, 0);
    ctx.lineTo(time, height);
    ctx.stroke();
}

document.getElementById('toggle').addEventListener('click', function(){
    var status = document.getElementById('status');
    if (draw){
        draw = false;
        status.innerHTML = "break";
    } else {
        draw = true;
        status.innerHTML = "work";
    }
});