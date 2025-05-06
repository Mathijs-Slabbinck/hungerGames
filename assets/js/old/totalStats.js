$(document).ready(function(){
    let fields = $("input[type='number']");

    fields.on("input", function(e) {
        console.log(e.target.value);
    });
});



/*$(document).ready(function(){
    let fields = $("input[type='number']");

    for (let i = 0; i < fields.length; i++) {
        $(fields[i]).on("keyup", function(e) {
            console.log(e.target.value);
        });
    }
});

document.addEventListener("DOMContentLoaded", init);*/