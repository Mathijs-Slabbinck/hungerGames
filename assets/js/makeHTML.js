$(document).ready(function(){
    GenerateDistricts();
    $(".district").hide();
    $("#div1").on("click",function(){
        ToggleDiv(1);
    });
    $("#div2").on("click",function(){
        ToggleDiv(2);
    });
    $("#div3").on("click",function(){
        ToggleDiv(3);
    });
    $("#div4").on("click",function(){
        ToggleDiv(4);
    });
    $("#div5").on("click",function(){
        ToggleDiv(5);
    });
    $("#div6").on("click",function(){
        ToggleDiv(6);
    });
    $("#div7").on("click",function(){
        ToggleDiv(7);
    });
    $("#div8").on("click",function(){
        ToggleDiv(8);
    });
    $("#div9").on("click",function(){
        ToggleDiv(9);
    });
    $("#div10").on("click",function(){
        ToggleDiv(10);
    });
    $("#div11").on("click",function(){
        ToggleDiv(11);
    });
    $("#div12").on("click",function(){
        ToggleDiv(12);
    });
    $("#close").on("click",function(){
        $(".district").hide();
        $('.districtBar').css("background-color", "white");
        $('.districtBar p').css("color", "black");
    });
});

function ToggleDiv(number) {
    let selectedDistrict = $("#district" + number);
    let selectedBar = $("#div" + number);

    if (selectedDistrict.is(":visible")) {
        // Hide it and reset styling
        selectedDistrict.hide();
        selectedBar.css("background-color", "white");
        selectedBar.find("p").css("color", "black");
    } else {
        // Reset all others
        $('.districtBar').css("background-color", "white");
        $('.districtBar p').css("color", "black");
        $(".district").hide();

        // Show selected and apply styling
        selectedDistrict.show();
        selectedBar.css("background-color", "black");
        selectedBar.find("p").css("color", "white");
    }
}

function GenerateDistricts(){
    let kind;
    for(let index=1; index<=12; index+=1){
        $("main").append('<div class="row districtBar" id="div'+index+'"><p class="col-12">District '+index+'</p></div><section class="row district" id="district'+index+'"></section');
        $("main #district" + index).append(`<div class="col-12"><h1>District `+index+`</h1><h2></h2></div><form class="col-4 tribute" id="D`+index+`M"><div class="insideForm"><img src="images/male.png" alt="male icon" class="col-12 col-sm-8 col-md-6 col-lg-4"></div></form><img class="districtLogo col-3" src="images/district`+index+`.png" alt="district `+index+`'s logo"><form class="col-4 tribute" id="D`+index+`F"><div class="insideForm"><img src="images/female.png" alt="female icon" class="col-12 col-sm-8 col-md-6 col-lg-4"></div></form>`);
        $("main .district #D"+index+"M .insideForm").append('<section class="tributeInfo" id="tributeInfo'+index+'M"></section>');
        $("main .district #D"+index+"F .insideForm").append('<section class="tributeInfo" id="tributeInfo'+index+'F"></section>');
        $("main #tributeInfo"+index+"M").append('<input type="text" placeholder="full name" autocomplete="off" id="name'+index+'M" class="col-10 name" required><input type="number" min="1"  max="10" placeholder="speed" class="col-10 stat" id="speed'+index+'M" required><input type="number" min="1"  max="10" placeholder="power" class="col-10 stat" id="power'+index+'M" required><input type="number" min="1"  max="10" placeholder="intelligence" class="col-10 stat" id="intelligence'+index+'M" required><input type="number" min="1"  max="10" placeholder="popularity" class="col-10 stat" id="popularity'+index+'M" required><input type="number" min="1"  max="10" placeholder="risk" class="col-10 stat" id="risk'+index+'M" required><input type="number" min="1"  max="10" placeholder="survival skills" class="col-10 stat" id="survivalSkills'+index+'M" required><input type="number" min="1"  max="10" placeholder="combat skills" class="col-10 stat" id="combatSkills'+index+'M" required><input type="number" min="1"  max="10" placeholder="luck" class="col-10 stat" id="luck'+index+'M" required>');
        $("main #tributeInfo"+index+"F").append('<input type="text" placeholder="full name" autocomplete="off" id="name'+index+'F" class="col-10 name" required><input type="number" min="1"  max="10" placeholder="speed" class="col-10 stat" id="speed'+index+'F" required><input type="number" min="1"  max="10" placeholder="power" class="col-10 stat" id="power'+index+'F" required><input type="number" min="1"  max="10" placeholder="intelligence" class="col-10 stat" id="intelligence'+index+'F" required><input type="number" min="1"  max="10" placeholder="popularity" class="col-10 stat" id="popularity'+index+'F" required><input type="number" min="1"  max="10" placeholder="risk" class="col-10 stat" id="risk'+index+'F" required><input type="number" min="1"  max="10" placeholder="survival skills" class="col-10 stat" id="survivalSkills'+index+'F" required><input type="number" min="1"  max="10" placeholder="combat skills" class="col-10 stat" id="combatSkills'+index+'F" required><input type="number" min="1"  max="10" placeholder="luck" class="col-10 stat" id="luck'+index+'F" required>');
        switch(index){
            case 1:
                kind = "luxury";
                break;
            case 2:
                kind = "masonry";
                break;
            case 3:
                kind = "technology";
                break;
            case 4:
                kind = "fishing";
                break;
            case 5:
                kind = "power";
                break;
            case 6:
                kind = "transportation";
            case 7:
                kind = "lumber";
                break;
            case 8:
                kind = "textiles"
                break;
            case 9:
                kind = "grain";
                break;
            case 10:
                kind = "livestock";
                break;
            case 11:
                kind = "agriculture";
                break;
            case 12:
                kind = "mining";
                break;
        }
        $("main #district"+index+" h2").append(kind);
    }
    $("main").append('<div class="row" id="fillInRandomly"><p class="col-12">fill empty fields randomly</p></div>');
    $("main").append('<div class="row" id="clearFields"><p class="col-12">clear all fields</p></div>');
    $("main").append('<div class="row" id="submit"><p class="col-12">submit info</p></div>');
}