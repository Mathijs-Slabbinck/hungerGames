let tributeX = [];
let thingy = 0;
let events = ["sponsorGift", "battle", "foundThing", "trapped", "teamUp", "cammo", "gameMakerTrigger"];
let countingStatArray = [];

function giveMeATribute(whatIsAsked){
    let totalStat = returnStats(whatIsAsked, "total");
    let randomNumberForStat = Math.floor(Math.random() * totalStat) + 1;
    let statArray = returnStats(whatIsAsked, "array");
    let numberMax = 0;
    let numberMin = 0;
    for(countingToSeeArray=0;countingToSeeArray<=(statArray.length)-1;countingToSeeArray+=1){
        numberMax += statArray[countingToSeeArray];
        numberMin = numberMax - statArray[countingToSeeArray];
        //console.log("max (" + countingToSeeArray + "): " + numberMax);
        //console.log("min (" + countingToSeeArray + "): " + numberMin);
        if(randomNumberForStat <= numberMax && randomNumberForStat > numberMin){
            return countingToSeeArray;
        }
    }
}

function returnStats(whatToCount, arrayOrTotal){
    switch(whatToCount){
        case "speed":
            whatToCount=4;
            break;
        case "power":
            whatToCount=5;
            break;
        case "intelligence":
            whatToCount=6;
            break;
        case "popularity":
            whatToCount=7;
            break;
        case "risk":
            whatToCount=8;
            break;
        case "skills":
            whatToCount=9;
            break;
        case "luck":
            whatToCount=10;
            break;
    }
    countingStatArray = [];
        for(counter=0;counter<newTributes.length;counter+=1){
            //get the array from the wanted tribute
            let part1 = newTributes[counter];
            //get the right info from that array
            let part2 = part1[whatToCount];
            let howManyth = counter+1;
            tributeX[howManyth] = part2;
            countingStatArray.push(tributeX[howManyth]);
            }
            switch(arrayOrTotal){
                case "array":
                    return countingStatArray;
                    break;
                case "total":
                    for(countingThing=0;countingThing<=(tributes.length)-1;countingThing+=1){
                        thingy += countingStatArray[countingThing];
                    }
                    return thingy;
                    break;
            }
}

function startLogging(){
    $("main").append("<p class='col-12' id='log'>logging started</p>");
    let randomNumberForHowMuchDied = Math.floor(Math.random() * 6) + 1;
    $("main").append("<ul>");
    for(anotherCounter=0; anotherCounter <= randomNumberForHowMuchDied; anotherCounter+=1){
        let chosenOne = giveMeATribute("risk");
        let tributeInGame = newTributes[chosenOne];
        $("main").append("<li>"+ tributeInGame[1] + " died at the Cornucopia</li>");
        newTributes.splice(chosenOne-1, 1);
    }
}

function gotSponsorGift(){
    // water (for fellInTrap) [luck + luck]
    // weapon (+1 fit) [luck]
    // food (+1 fit) [luck]
    // medicine (+1 fit) [sponsorChance]
    // bomb trap (for triggerGame) [luck]
}

function fellInTrap(){
    // Tracker Jackers (die) [survival skills | luck]
    // mine (die) [survival skills | luck]
}

function triggerGame(){
    // bomb trap (sponsor gift false : die | sponsor chance true : +1 fit) [luck + sponsor chance]
    // wolf mutants (die) [speed]
    // forest fire (die) [survival chance | speed]
    // no rain (die | sponor saves you | -1 fit) [sponsor chance / luck]
}

function wildSurvive(){
    // nightLock (die) [survivalSkills]
    // campfire (negative : died | positive : +1 fit) [luck]
    // sleep in tree (+1 fit) [survival skills]
    // find water (+1 fit) [luck]
}

function battleGoingOn(){
    // 1v1 (1 dies | 1 loses 5 fit) [risk + power]
    // 2v2 (if team : 2 die) [risk + power + team?]
}

function foundSomething(){
    // hidden bunker (+3 fit) [luck]
    // trap (die) [luck]
    // other tribute hiding (for hide : kill the other tribute) [luck]
}

function tributesTeamUp(){
    // make a team (2 ppl play together / won't kill each other when chosen) [popularity]
}

function hide(){
    // apply cammo (+2 fit)
    // animal kills you (die)
}