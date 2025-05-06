let secs = 10 * 1; // 10 seconds
let interval = null;

function startGames(){
    $("main").empty();
    //$("main").append("<p class='col-12' id='countDown'>10</p>");
    let slogan = new Audio('assets/media/slogan.mp3');
    let countDown = new Audio('assets/media/countDown.mp3');
//    slogan.play();
//    setTimeout(function(){
        //countDown.play();
        startCountdown();
//    },10000);
}

function startCountdown(){
    updateLabel();
    //interval = window.setInterval(tick, 1000);
}

function tick(){
    secs--;
    if (secs <= 0)
    {
        window.clearInterval(interval);
    }
    updateLabel();
}

function updateLabel(){
    //let h = parseInt(secs / 3600);
    //let m = parseInt((secs - h * 3600) / 60);
    //$("#countDown").html(secs - h * 3600 - m * 60);
    //if(secs - h * 3600 - m * 60 === 0){
    //    $("#countDown").remove();
        startLogging();
    //}
}