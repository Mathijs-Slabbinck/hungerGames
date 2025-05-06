let looper = 0;
let number;
let name;
let sex;
let alive;
let speed;
let power;
let intelligence;
let popularity;
let risk;
let survivalSkills;
let luck;
let tribute = [];
let tributes = [];
let newTribute = [];
let newTributes = [];
let index2 = 0;
$(document).ready(function(){
    tributes = [];
    tribute = [];
    tributeTurned = [];
    $("#submit").on("click", prepareAll);
});

function prepareAll(){
    console.log("prepare all");
    number = "";
    name = "";
    sex = "";
    alive = "";
    speed = "";
    power = "";
    intelligence = "";
    popularity;
    risk = "";
    survivalSkills = "";
    luck = "";
    fillTributes("M");
    console.groupCollapsed("tributes stats");
    console.groupCollapsed("stats submitted");
    console.table(tributes);
    console.groupEnd();
    console.groupCollapsed("stats transformed");
    console.table(newTributes);
    console.groupEnd();
    console.groupEnd();
}

function fillTributes(MorF){
    index2+=1;
    if(index2 < 13){
        let i = index2.toString();
        number = i + MorF;
        name = $("#tributeInfo" + index2 + MorF + " #name").val();
        if(MorF === "M"){
            sex = "male";
        } else{
            sex = "female";
        }
        alive = "true";
        speed = parseInt($("#tributeInfo" + index2 + MorF + " #speed").val());
        power = parseInt($("#tributeInfo" + index2 + MorF + " #power").val());
        intelligence = parseInt($("#tributeInfo" + index2 + MorF + " #intelligence").val());
        popularity = parseInt($("#tributeInfo" + index2 + MorF + " #popularity").val());
        risk = parseInt($("#tributeInfo" + index2 + MorF + " #risk").val());
        survivalSkills = parseInt($("#tributeInfo" + index2 + MorF + " #skills").val());
        luck = parseInt($("#tributeInfo" + index2 + MorF + " #luck").val());
        CheckAndPush(MorF);
    } else{
        looper+=1;
        index2=0;
        if(looper === 1){
            fillTributes("F");
        } else{
            startGames();
        }
    }
}

function CheckAndPush(MorF){
    if(speed > 9 || speed <= 0 || speed === NaN || power > 9 || power <= 0 || power === NaN || intelligence > 9 || intelligence <= 0 || intelligence === NaN || popularity > 9 || popularity <= 0 || popularity === NaN || risk > 9 || risk <= 0 || risk === NaN || survivalSkills > 9 || survivalSkills <= 0 || survivalSkills === NaN || luck > 9 || luck <= 0 || luck === NaN || name === undefined){
        alert("You did not submit valid information!");
    } else{
        tribute.push(number, name, sex, alive, speed, power, intelligence, popularity, risk, survivalSkills, luck);
        tributes.push(tribute);
        tribute = [];
        let newSpeed = 10-speed;
        let newPower = 10-power;
        let newIntelligence = 10-intelligence;
        let newPopularity = 10-popularity;
        let newSurvivalSklls = 10-survivalSkills;
        let newLuck = 10-luck;
        newTribute.push(number, name, sex, alive, newSpeed, newPower, newIntelligence, newPopularity, risk, newSurvivalSklls, newLuck);
        newTributes.push(newTribute);
        newTribute = [];
        fillTributes(MorF);
    }
}

/*
console.log("number: ", number,"  name: ", name,"  sex: ", sex,"  alive: ", alive,"  speed: ", speed,"  power: ", power,"  intelligence: ", intelligence,"  popularity: ", popularity,"  ponsorChance: ","  risk: ", risk,"  survivalSkills: ", survivalSkills);

0) number
1) name
2) sex
3) alive
4) speed
5) power
6) intelligence
7) popularity
8) risk
9) skills
10) luck
*/