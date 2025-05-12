let aliveTributes = [];
let allTributes = [];

$(document).ready(function() {
    const fields = [ // an array containing all stats a Tribute has
        "name", "speed", "power", "intelligence", "popularity",
        "risk", "survivalSkills", "combatSkills", "luck", "hp",
        "weapon", "hasArmor", "armorDurability", "medKits", "isAlive", "kills"
    ];

    const weaponModifiers = { // an array that keeps track of dmg modifiers for weapons
        knife: 1.25,
        bow: 1.5,
        sword: 1.75,
    };
  
    let generated;
    let whichDay = 0;

    $("#clearFields").on("click", function() { // when clicked on clear fields button, verify if user is sure this and clear if yes
        if (confirm("Are you sure?")) {
            $("input").val('');
        }
    });

    function CheckIfNameExists(i, gender, usedNames) { // make sure a unique name gets returned
        let name = GetName(i, gender).trim(); // Ask a name, remove spaces before and after and assign it to the variable name

        if (usedNames.has(name)) { // check if the tribute's name already exists, if yes, throw an error
            throw new Error(`Two tributes have the same name: "${name}". Please change this.`);
        }

        return name; // if the tribute's name doesn't exist yet, return the name
    }

    $("#submit").on("click", function () {
        let maleTribute;
        let femaleTribute;
        let usedNames = new Set(); // a set to keep track of which names have already been picked

        for (let i = 1; i < 13; i++) { // loop between 1 and 12 (once for every district)
            try {
                let maleName = CheckIfNameExists(i, "male", usedNames);
                let femaleName = CheckIfNameExists(i, "female", usedNames);
                if(maleName === femaleName){
                    console.log("ERROR 420")
                    throw new Error(`Two tributes have the same name: "${maleName}". Please change this.`);
                }

                maleTribute = new Tribute(
                    maleName, "male", i,
                    GetSpeed(i, "male"), GetPower(i, "male"),
                    GetIntelligence(i, "male"), GetPopularity(i, "male"),
                    GetRisk(i, "male"), GetSurvivalSkills(i, "male"),
                    GetCombatSkills(i, "male"), GetLuck(i, "male")
                );

                femaleTribute = new Tribute(
                    femaleName, "female", i,
                    GetSpeed(i, "female"), GetPower(i, "female"),
                    GetIntelligence(i, "female"), GetPopularity(i, "female"),
                    GetRisk(i, "female"), GetSurvivalSkills(i, "female"),
                    GetCombatSkills(i, "female"), GetLuck(i, "female")
                );

                usedNames.add(maleName);
                usedNames.add(femaleName);

            } catch (error) {
                alert(error.message);
                return;
            }

            aliveTributes.push(maleTribute, femaleTribute);
            allTributes.push(maleTribute, femaleTribute);
        }
        //StartGame();

        $("main").empty();

        // UNCOMMENT THIS, THIS IS FOR TESTING PURPOSES IN COMMENT
        let slogan = new Audio('assets/media/slogan.mp3');
        let countDown = new Audio('assets/media/countDown.mp3');
        slogan.play();
        setTimeout(function () {
            countDown.play();
            StartLogging();
        }, 8000);
    });

    function GetName(i, gender){ // reads the name of asked tribute and returns it
        const name = $(`#name${i}${gender[0].toUpperCase()}`); // select the field it should read the name from
        return name.val(); //return the value of the input field (the name)
    }

    function GetSpeed(i, gender) {
        const speed = $(`#speed${i}${gender[0].toUpperCase()}`);
        return speed.val();
    }

    function GetPower(i, gender) {
        const power = $(`#power${i}${gender[0].toUpperCase()}`);
        return power.val();
    }

    function GetIntelligence(i, gender) {
        const intelligence = $(`#intelligence${i}${gender[0].toUpperCase()}`);
        return intelligence.val();
    }

    function GetPopularity(i, gender) {
        const popularity = $(`#popularity${i}${gender[0].toUpperCase()}`);
        return popularity.val();
    }

    function GetRisk(i, gender) {
        const risk = $(`#risk${i}${gender[0].toUpperCase()}`);
        return risk.val();
    }

    function GetSurvivalSkills(i, gender) {
        const survivalSkills = $(`#survivalSkills${i}${gender[0].toUpperCase()}`);
        return survivalSkills.val();
    }

    function GetCombatSkills(i, gender) {
        const combatSkills = $(`#combatSkills${i}${gender[0].toUpperCase()}`);
        return combatSkills.val();
    }

    function GetLuck(i, gender) {
        const luck = $(`#luck${i}${gender[0].toUpperCase()}`);
        return luck.val();
    }

    function StartLogging() {
        let startEventsAmount = ReturnRandomNumber(6, 15);
        $("main").append("<ul id='eventLog'></ul>");
        LogShit(startEventsAmount, true);
    }

    function LogShit(eventsAmount, isStart) {
        console.log("events amount: " + eventsAmount);
        let delay = 0;

        for (let i = 0; i < eventsAmount; i++) {
            let randomTimer = ReturnRandomTimer(isStart);
            let randomEvent = ReturnRandomNumber(1, 8);
            delay += randomTimer;

            setTimeout(() => {
                if (isStart || randomEvent <= 5) {
                    Combat(Math.random(), isStart);
                } else if (randomEvent === 6) {
                    FoundSomething();
                } else if (randomEvent === 7) {
                    FellInTrap();
                } else if (randomEvent === 8) {
                    SponsorGift();
                }
            }, delay);
        }

        // This runs a little *after* the final event, guaranteeing it's last
        setTimeout(() => {
            if (whichDay === 0) {
                $("ul").append(`<div class="log"><li>The bloodbath has ended!</li></div>`);
            }
            $("ul").append(`<li id="seeTributes" class="col-12">SEE TRIBUTES</li>`);
            $("ul").append(`<li id="advanceToNext" class="col-12">ADVANCE TO DAY ${whichDay + 1}</li>`);
        }, delay + 250); // Slight buffer to ensure it's visually last
    }    

    function SponsorGift(){
        let chosenTribute = ReturnTribute("sponsorGift");
        let gift = Math.floor(Math.random() * 5) + 1;
        if (gift === 1 || gift == 2) { // try to give medkit
            if (chosenTribute.medKits == 0) {
                let randomMedkit = Math.floor(Math.random() * 2) + 1;
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</li></div>`);
                chosenTribute.findMedKit(randomMedkit);
            } else if (chosenTribute.medKits == 1) {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received a medkit from a sponsor.</li></div>`);
                chosenTribute.findMedKit(1);
            } else {
                if (chosenTribute.hasArmor === "no") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received armor from a sponsor.</li></div>`);
                    chosenTribute.findArmor(1);
                } else if (chosenTribute.weapon != "sword") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received a sword from a sponsor.</li></div>`);
                    chosenTribute.weapon = "sword";
                } else {
                    if(chosenTribute.intelligence < 10){
                        $("ul").append(`<div class="log"><li>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</li></div>`);
                        let intelligence = chosenTribute.intelligence + 1;
                        chosenTribute.intelligence = intelligence;
                    } else{
                        SponsorGift();
                    }
                }
            }
        } else if (gift === 4 || gift === 4) { // try to give armor
            if (chosenTribute.hasArmor === "no") { // try to give armor
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received armor from a sponsor.</li></div>`);
                chosenTribute.findArmor();
            } else if (chosenTribute.medKits != 2) {
                if (chosenTribute.medKits != 2) {
                    if (chosenTribute.medKits == 0) {
                        let randomMedkit = Math.floor(Math.random() * 2) + 1;
                        $("ul").append(`<div class="log"><li>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</li></div>`);
                        chosenTribute.findMedKit(randomMedkit);
                    } else {
                        $("ul").append(`<div class="log"><li>${chosenTribute.name} received a medkit from a sponsor.</li></div>`);
                        chosenTribute.findMedKit(1);
                    }
                }
            } else if (chosenTribute.weapon != "sword") {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received a sword from a sponsor.</li></div>`);
                chosenTribute.weapon = "sword";
            } else {
                if(chosenTribute.intelligence < 10){
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</li></div>`);
                    let intelligence = chosenTribute.intelligence + 1;
                    chosenTribute.intelligence = intelligence;
                } else{
                    SponsorGift();
                }
            }
        } else if (gift === 5) { // try to give sword
            if (chosenTribute.weapon != "sword") {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received a sword from a sponsor.</li></div>`);
                chosenTribute.weapon = "sword";
            } else if (chosenTribute.medKits != 2) {
                if (chosenTribute.medKits == 0) {
                    let randomMedkit = Math.floor(Math.random() * 2) + 1;
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</li></div>`);
                    chosenTribute.findMedKit(randomMedkit);
                } else {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received a medkit from a sponsor.</li></div>`);
                    chosenTribute.findMedKit(1);
                }
            } else if (chosenTribute.hasArmor === "no") {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} received armor from a sponsor.</li></div>`);
                chosenTribute.findArmor(1);
            } else {
                if(chosenTribute.intelligence < 10){
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</li></div>`);
                    let intelligence = chosenTribute.intelligence + 1;
                    chosenTribute.intelligence = intelligence;
                } else{
                    SponsorGift();
                }
            }
        }
    }

    function Combat(delay, isStart){
        setTimeout(function () {
            let tribute1 = ReturnTribute("combat");
            let tribute2 = ReturnTribute("combat");

            if (aliveTributes.length > 2) {
                while (tribute1 === tribute2) {
                    tribute2 = ReturnTribute("combat");
                }
            } else if (aliveTributes.length === 2) {
                tribute1 = aliveTributes[0];
                tribute2 = aliveTributes[1];
            }

            if (aliveTributes.length > 3) {
                while (tribute1.district === tribute2.district) {
                    if (Math.floor(Math.random() * 6) + 1 === 1) break;
                    tribute2 = ReturnTribute("combat");
                }
            }

            CombatTributes(tribute1, tribute2, isStart);
            CheckToRemoveTributesFromList();
        }, delay);
    }

    function FellInTrap() {
        let randomForWhichTrap = Math.floor(Math.random() * 3) + 1;
        let chosenTribute = ReturnTribute("fellInTrap");
        let trapSetter = ReturnTribute("trapSetter");
        if (randomForWhichTrap === 1 || randomForWhichTrap === 2) {
            let trapDamage = Math.floor(Math.random() * 36) + 25;
            chosenTribute.DoDamage(trapDamage);
            if (chosenTribute.hp <= 0) {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} fell into ${trapSetter.name}'s trap and took ${trapDamage.toFixed(2)} damage. ${chosenTribute.name} died.</li></div>`);
                chosenTribute.isAlive = false;
                RemoveTributeFromAliveList(chosenTribute);
                trapSetter.kills += 1;
            } else {
                $("ul").append(`<div class="log"><li>${chosenTribute.name} fell into ${trapSetter.name}'s and took ${trapDamage.toFixed(2)} damage. ${chosenTribute.name} now has ${chosenTribute.hp.toFixed(2)} HP.</li></div>`);
            }
        } else if (randomForWhichTrap === 3) {
            $("ul").append(`<div class="log"><li>${chosenTribute.name} fell into ${trapSetter.name}'s trap and died instantly.</li></div>`);
            chosenTribute.isAlive = false;
            RemoveTributeFromAliveList(chosenTribute);
            trapSetter.kills += 1;
        }
    }
  
    /*
    function ReturnKiller() {
        if (!Array.isArray(aliveTributes) || aliveTributes.length === 0) {
            console.log("Invalid input or empty aliveTributes array");
            return;
        }

        // Initialize an array to store the weighted values
        let weightedAliveTributes = [];

        // Iterate through each tribute to calculate the weight based on the given stat
        for (let i = 0; i < aliveTributes.length; i++) {
            let tribute = aliveTributes[i];
            let riskValue = tribute["risk"];  // Get the value of the risk stat
            let luckValue = tribute["luck"];  // Get the value of the luck stat
            let combatSkillsValue = tribute["combatSkills"];  // Get the value of the combatSkills stat
    
            // Calculate a weight factor for the tribute
            let weight = 1;  // Start with a base weight
    
            // Raise the weight for high risk and high combatSkills
            weight += riskValue * 0.5;  // Increase the weight based on risk (higher risk = more likely)
            weight += combatSkillsValue * 0.5;  // Increase the weight based on combatSkills (higher combatSkills = more likely)
    
            // Lower the weight for high luck
            weight -= luckValue * 0.5;  // Decrease the weight based on luck (higher luck = less likely)
    
            // Ensure the weight is at least 1 (so it can be added to the array)
            weight = Math.max(weight, 1);
    
            // Add a number of "entries" based on the calculated weight
            for (let j = 0; j < weight; j++) {
                weightedAliveTributes.push(tribute);  // This creates more entries for higher risk/combatSkills and fewer for high luck
            }
        }
    
        // Now, pick a random tribute based on the weighted array
        let randomIndex = Math.floor(Math.random() * weightedAliveTributes.length);
        let selectedTribute = weightedAliveTributes[randomIndex];
        console.log("Selected Tribute:", selectedTribute);
        return selectedTribute;
    }
    */

    // return a tribute based on random value and stats correlating to the event
    function ReturnTribute(whatFor) { //whatfor = which event?
        if (!Array.isArray(aliveTributes) || aliveTributes.length === 0) { // check if the array AliveTributes is valid and empty
            console.log("Invalid input or empty aliveTributes array");
            return;
        }

        let weightedAliveTributes = []; // Initialize an array to store the weighted values

        for (let i = 0; i < aliveTributes.length; i++) { // loop through all alive tributes
            let tribute = aliveTributes[i]; // select the current tribute

            // Get the values of the tribute's stats
            let speed = tribute["speed"] || 0;
            let power = tribute["power"] || 0;
            let intelligence = tribute["intelligence"] || 0;
            let popularity = tribute["popularity"] || 0;
            let risk = tribute["risk"] || 0;
            let survival = tribute["survivalSkills"] || 0
            let combat = tribute["combatSkills"] || 0;
            let luck = tribute["luck"] || 0;

            // initialize a var weight that will store the weight of the tribute
            let weight;

            switch (whatFor) {
                // tuned multipliers based on how much each stat influences weight
                case "foundSomething":
                    weight =
                        (luck * 1.2) +
                        (speed * 1.75) +
                        (combat * 1.2) +
                        (risk * 1.7) +
                        (survival * 0.9);
                    break;
                case "combat":
                    weight =
                        (luck * 0.80) +
                        (speed * 0.75) +
                        (combat * 1.2) +
                        (risk * 1.7) +
                        (survival * 0.85);
                    break;
                case "fellInTrap":
                    weight =
                        (luck * 0.85) +
                        (speed * 0.85) +
                        (intelligence * 0.7) +
                        (risk * 1.15) +
                        (survival * 0.7);
                    break;
                case "trapSetter":
                    weight =
                        (luck * 1.05) +
                        (intelligence * 1.9) +
                        (survival * 1.75);
                    break;
                case "sponsorGift":
                    weight =
                        (luck * 1.2) +
                        (popularity * 2.4);
                    break;
                case "animalAttack":
                    weight =
                        (luck * 0.85) +
                        (survival * 0.75) +
                        (combat * 0.75)
                            (risk * 1.15)
                            (speed * 0.85);
                    break;
                case "poisonedFood":
                    weight =
                        (luck * 0.85) +
                        (survival * 0.5) +
                        (risk * 1.15);
                    break;
                case "trainedPower":
                    weight =
                        (luck * 1.5) +
                        (power * 0.5) +
                        (risk * 1.2) +
                        (intelligence * 1.25) +
                        (survival * 1.2);
                    break;
                case "trainedCombat":
                    weight =
                        (luck * 1.5) +
                        (combat * 0.5) +
                        (risk * 1.2) +
                        (intelligence * 1.25) +
                        (survival * 1.2);
                    break;
                case "injured":
                    weight =
                        (luck * 0.85) +
                        (risk * 1.2) +
                        (survival * 0.7)
                            (intelligence * 0.9);
                    break;
                case "ambused":
                    weight =
                        (luck * 0.85) +
                        (speed * 0.7) +
                        (combat * 0.55) +
                        (risk * 1.2) +
                        (survival * 0.8);
                    break;
                case "ambusher":
                    weight =
                        (luck * 1.1) +
                        (speed * 1.1) +
                        (combat * 1.25) +
                        (risk * 1.25);
                    break;
                case "showedMercy":
                    weight =
                        (intelligence * 1.2) +
                        (risk * 1.2) +
                        (luck * 1.2);
                    break;
                case "rested":
                    weight =
                        (intelligence * 1.2) +
                        (risk * 1.5) +
                        (luck * 1.15) +
                        (survival * 1.25);
                    break;
            }


            // Ensure minimum weight of 1 so everyone has at least a small chance
            weight = Math.max(weight, 1);

            for (let j = 0; j < weight; j++) { // loop as much as the weight of the tribute
                weightedAliveTributes.push(tribute); // add the tribute x times to the array where x is the weight
            }
        }

        let randomIndex = Math.floor(Math.random() * weightedAliveTributes.length); // pick a random index from the weightedAliveTributes array
        let selectedTribute = weightedAliveTributes[randomIndex]; // select a random tribute from the weighted array
        return selectedTribute; // return the selected tribute
    }

    function CombatTributes(tribute1, tribute2, isStartOfGame = false) { // possibly add escaping later?

        function CalculateDamage(attacker) { // calculate damage (min: 9, max: 94)
            let baseDamage = ReturnRandomNumber(8, 30); // have a random between 8 and 30 for the base damage (random aspect)
            let damageModifier = attacker.power * 1.5; // apply bonus dmg for dmg stat
            let combatDamageModifier = attacker.combatSkills * 1.15; // apply bonus dmg for combat skills
            let damageModifier2 = weaponModifiers[attacker.weapon] || 1; // apply bonus dmg for weapon (or 1 if no weapon)
            return Math.floor((baseDamage + damageModifier + combatDamageModifier) * damageModifier2); // calculate and return damage output
        }

        if (tribute1.isAlive && tribute2.isAlive) { // check if both tributes are alive
            let damageMode;
            if (isStartOfGame == true) { // if it's the start of the game, also handle chance to find items to simulate bloodbath
                damageMode = Math.floor(Math.random() * 7) + 1
            } else {
                damageMode = Math.floor(Math.random() * 5) + 1;
            }

            console.log(`Damage Mode: ${damageMode}`);

            if (damageMode === 1 || damageMode === 2) { // make both tributes do damage to each other
                let damageToTribute1 = CalculateDamage(tribute2);
                let damageToTribute2 = CalculateDamage(tribute1);

                tribute1.DoDamage(damageToTribute1);
                tribute2.DoDamage(damageToTribute2);

                if (tribute1.hp <= 0 && tribute2.hp > 0) {
                    $("ul").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</li></div>`);
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                } else if (tribute2.hp <= 0 && tribute1.hp > 0) {
                    $("ul").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li></div>`);
                    tribute1.kills += 1;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute2);
                } else if (tribute1.hp > 0 && tribute2.hp > 0) {
                    $("ul").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li></div>`);
                } else {
                    $("ul").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</li></div>`);
                    tribute1.kills += 1;
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                    RemoveTributeFromAliveList(tribute2);
                }
            } else if (damageMode === 3) { // make 1 tribute do damage to another tribute
                let damageTo = Math.random() < 0.5 ? tribute1 : tribute2;
                let attacker = damageTo === tribute1 ? tribute2 : tribute1;
                let damage = CalculateDamage(attacker);
                damageTo.DoDamage(damage);
                if (damageTo.hp == 0) {
                    $("ul").append(`<div class="log"><li>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} has died.</li></div>`);
                    damageTo.isAlive = false;
                    attacker.kills += 1;
                } else {
                    $("ul").append(`<div class="log"><li>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} now has ${damageTo.hp.toFixed(2)} HP.</li></div>`);
                }
            } else if (damageMode === 4) { // 1 tribute gets killed instantly by the other
                let victim = Math.random() < 0.5 ? tribute1 : tribute2;
                let killer = victim === tribute1 ? tribute2 : tribute1;
                victim.hp = 0;
                victim.isAlive = false;
                killer.kills += 1;
                RemoveTributeFromAliveList(victim);
                $("ul").append(`<div class="log"><li>${victim.name} has been killed instantly by ${killer.name}!</li></div>`);
            } else if (damageMode === 5) { // make 2 tributes fight until 1 dies
                let fightLog = `<div class="log">`;
                while (tribute1.hp > 0 && tribute2.hp > 0) {
                    let damageToTribute1 = CalculateDamage(tribute2);
                    let damageToTribute2 = CalculateDamage(tribute1);

                    tribute1.DoDamage(damageToTribute1);
                    tribute2.DoDamage(damageToTribute2);
                    fightLog += `<li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li>`;
                    fightLog += `<li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li>`;
                }
                if (tribute1.hp == 0) {
                    tribute1.isAlive = false;
                    tribute2.kills += 1;
                    fightLog += `<li>${tribute1.name} was killed by ${tribute2.name}</li>`;
                }
                if (tribute2.hp == 0) {
                    tribute2.isAlive = false;
                    tribute1.kills += 1;
                    fightLog += `<li>${tribute2.name} was killed by ${tribute1.name}</li>`;
                }
                fightLog += `</div>`;
                $("ul").append(fightLog);
            } else if (damageMode == 6 || damageMode == 7) {
                FoundSomething();
            }

            // Post-combat death handling
            if (tribute1.hp <= 0 || tribute2.hp <= 0) {
                if (tribute1.hp <= 0 && tribute2.hp <= 0) {
                    tribute1.isAlive = false;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                    RemoveTributeFromAliveList(tribute2);
                } else if (tribute1.hp <= 0) {
                    tribute1.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                } else if (tribute2.hp <= 0) {
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute2);
                }
            }
        } else{ // should never happen || this executes when at least 1 of the chosen tributes is dead
            alert("Error: At least 1 chosen tribute is dead.");
            throw new Error("At least 1 chosen tribute is dead.");
        }
    }

    function FoundSomething() { // tribuyte finds a weapon, medkit or armor
        let random = Math.floor(Math.random() * 7) + 1
        let chosenTribute = ReturnTribute("foundSomething");
        switch (random) {
            case 1: // try to give a sword
                // when chosenTribute has no weapon, try giving a sword first
                // (could be chosenTribute.weapon == "none" but this is to avoid undefined)
                if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a sword.</li></div>`);
                    chosenTribute.weapon = "sword";
                } else if (chosenTribute.weapon === "sword") { // if the tribute already has a sword, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a sword but already has one.</li></div>`);
                } else if (chosenTribute.weapon === "bow" || chosenTribute.weapon === "knife") { // if the tribute has a bow or knife, upgrade to sword
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a sword and upgraded their weapon.</li></div>`);
                    chosenTribute.weapon = "sword";
                } else { //should never happen | otherwise, give a sword and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a sword.</li></div>`);
                    chosenTribute.weapon = "sword";
                    throw new Error("Error: Giving sword almost failed.");
                }
                break;
            case 2: // try to give a bow
                // when chosenTribute has no weapon, try giving a bow first
                // (could be chosenTribute.weapon == "none" but this is to avoid undefined)
                if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a bow.</li></div>`);
                    chosenTribute.weapon = "bow";
                } else if (chosenTribute.weapon === "bow") { // if tribute already has a bow, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow but already has one.</li></div>`);
                } else if (chosenTribute.weapon === "sword") { // if the tribute has a sword, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow but already has a better weapon.</li></div>`);
                } else if (chosenTribute.weapon === "knife") { // if the tribute has a knife, upgrade to bow
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow and upgraded their weapon.</li></div>`);
                    chosenTribute.weapon = "bow";
                } else { // should never happen | otherwise, give a bow and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a bow.</li></div>`);
                    chosenTribute.weapon = "bow";
                    throw new Error("Error: Giving bow almost failed.");
                }
                break;
            case 3: // try to give a knife
                // when chosenTribute has no weapon, try giving a knife first
                // (could be chosenTribute.weapon == "none" but this is to avoid undefined)
                if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a knife.</li></div>`);
                    chosenTribute.weapon = "knife";
                } else if (chosenTribute.weapon === "sword" || chosenTribute.weapon == "bow") { // if the tribute has a sword or bow, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a knife but already has a better weapon.</li></div>`);
                } else if (chosenTribute.weapon === "knife") { // if the tribute already has a knife, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a knife but already has one.</li></div>`);
                } else { // should never happen | otherwise, give a knife and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a knife.</li></div>`);
                    chosenTribute.weapon = "bow";
                    throw new Error("Error: Giving knife almost failed.");
                }
                break;
            case 4: // higher chance to give a medkit
            case 5:
                if(chosenTribute.medKits == 0){ // if the tribute has no medkits, give 1 or 2 (random)
                    let amountOfMedkits = Math.floor(Math.random() * 2) + 1;
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up ${amountOfMedkits} medkit(s).</li></div>`);
                    chosenTribute.findMedKit(amountOfMedkits);
                } else if(chosenTribute.medKits == 1){ // if the tribute has 1 medkit, give 1
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up 1 medkit.</li></div>`);
                    chosenTribute.findMedKit(1);
                } else{ // if the tribute already has 2 medkits, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found a medkit but already has 2.</li></div>`);
                }
                break;
            case 6: // higher chance to give armor
            case 7:
                if(chosenTribute.hasArmor === "yes"){ // if the tribute has armor, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} found armor but already has one.</li></div>`);
                } else{ // if the tribute has no armor, give 1
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up armor.</li></div>`);
                    chosenTribute.findArmor();
                }
                break;
        }
    }

    function CheckToRemoveTributesFromList() { // function to make sure the aliveTributes array is up to date
        for (let i = 0; i < aliveTributes.length; i++) {
            if (aliveTributes[i].isAlive === false) { // check if the tribute is dead
                aliveTributes.splice(i, 1); // Remove 1 element at index i (so remove the tribute from aliveTributes)
                i--; // when a tribute is removed, decrease the index to account for the shift in the array
            }
        }
    }

    function RemoveTributeFromAliveList(tribute) {
        // Find the index of the tribute to remove
        let index = aliveTributes.indexOf(tribute);

        // Check if the tribute is in the list
        if (index !== -1) {
            // Remove the tribute from the array
            aliveTributes.splice(index, 1);
        } else {
            console.log("Tribute not found in the alive list.");
        }
    }

    function ReturnRandomTimer(isStart) {
        if (isStart) { // if it's the start of the game, return a random timer between 0.5 and 2 seconds
            return ReturnRandomNumber(500, 2000);
        } else { // if it's not the start of the game, return a random timer between 1.5 and 4 seconds
            return ReturnRandomNumber(1500, 3000);
        }
    }

    $(document).on("click", "#advanceToNext", function () {
        let randomEvents = ReturnRandomNumber(3, 17); // how many events will happen this day
        let randomForWhenEndPhase = ReturnRandomNumber(3, 8); // how many tributes need to be alive for the end phase to start
        whichDay += 1;
        $("#eventLog").empty();
        $("#eventLog").append(`<div class="log"><li>Day ${whichDay} has started!</li></div>`);
        
        //for (let i = 0; i < randomEvents; i++) {
            if (aliveTributes.length > randomForWhenEndPhase) {
                    LogShit(randomEvents, false);
            } else { // end phase

            }
        //}
    });

    $(document).on("click", "#seeTributes", function () {
        $("#eventLog").hide();
        if (generated != true) {
            GenerateDistricts(false);
            generated = true;
        } else {
            $("#tributeDisplayList").show();
        }
        FillInData();
    });

    $(document).on("click", "#backToLog", function () {
        $("#tributeDisplayList").hide();
        $("#eventLog").show();
    });

    function FillInData() {
        for (let i = 0; i < 24; i += 2) { // loop trough all tributes (12 districts, 2 tributes each) by looping trough even values of i
            const district = i / 2 + 1; // Convert even value of i (0,2,4,...) to 1,2,3,...
            let maleTribute = allTributes[i];
            let femaleTribute = allTributes[i + 1];

            if (!maleTribute.isAlive) { // if the male tribute is dead, make the image red
                $("#image" + district + "M").attr("src", "images/maleDead.png");
                $("#image" + district + "M").attr("id", "deadTribute");
            }

            if (!femaleTribute.isAlive) { // if the female tribute is dead, make the image red
                $("#image" + district + "F").attr("src", "images/femaleDead.png");
                $("#image" + district + "F").attr("id", "deadTribute");
            }

            for (let j = 0; j < fields.length; j++) { // loop through all fields (all info to display)
                let field = fields[j]; // get the current field
                $("#" + field + district + "M").text(maleTribute[field]); // fill in the current male field with the right stat data
                $("#" + field + district + "F").text(femaleTribute[field]); // fill in the current female field with the right stat data
            }

            if(!maleTribute.isAlive && !femaleTribute.isAlive){ // if both tributes are dead, make the district bar red
                $(`#div${i}`).css("background-color", "darkred");
                $(`#div${i}`).css("color", "white");
            }
        }
    }

    function ReturnRandomNumber(number1, number2) {
        const min = Math.min(number1, number2);
        const max = Math.max(number1, number2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});