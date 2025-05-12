let aliveTributes = [];
let allTributes = [];

$(document).ready(function(){
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

        StartGame();
    });

    function GetName(i, gender){ // reads the name of asked tribute and returns it
        const name = $(`#name${i}${gender[0].toUpperCase()}`); // select the field it should read the name from
        return name.val(); //return the value of the input field (the name)
    }

    function GetSpeed(i, gender){
        const speed = $(`#speed${i}${gender[0].toUpperCase()}`);
       return speed.val();
    }

    function GetPower(i, gender){
        const power = $(`#power${i}${gender[0].toUpperCase()}`);
        return power.val();
    }

    function GetIntelligence(i, gender){
        const intelligence = $(`#intelligence${i}${gender[0].toUpperCase()}`);
        return intelligence.val();
    }

    function GetPopularity(i, gender){
        const popularity = $(`#popularity${i}${gender[0].toUpperCase()}`);
        return popularity.val();
    }

    function GetRisk(i, gender){
        const risk = $(`#risk${i}${gender[0].toUpperCase()}`);
        return risk.val();
    }

    function GetSurvivalSkills(i, gender){
        const survivalSkills = $(`#survivalSkills${i}${gender[0].toUpperCase()}`);
        return survivalSkills.val();
    }

    function GetCombatSkills(i, gender){
        const combatSkills = $(`#combatSkills${i}${gender[0].toUpperCase()}`);
        return combatSkills.val();
    }

    function GetLuck(i, gender){
        const luck = $(`#luck${i}${gender[0].toUpperCase()}`);
        return luck.val();
    }

    function StartGame(){
        $("main").empty();

        /* UNCOMMENT THIS, THIS IS FOR TESTING PURPOSES IN COMMENT
        let slogan = new Audio('assets/media/slogan.mp3');
        let countDown = new Audio('assets/media/countDown.mp3');
        slogan.play();
        setTimeout(function(){
            countDown.play();*/
            StartLogging();
        //},8000);
    }

    function StartLogging() {
        let startEventsAmount = ReturnRandomNumber(6, 15);
        $("main").append("<ul id='eventLog'></ul>");

        console.log(startEventsAmount);
        let delay = 0;
        let eventsCompleted = 0;

        for (let i = 0; i < startEventsAmount; i++) {
            let randomTimer = ReturnRandomTimer();
            delay += randomTimer;

            setTimeout(function () {
                let tribute1 = ReturnTributeForCombatOrStart();
                let tribute2 = ReturnTributeForCombatOrStart();

                if (aliveTributes.length > 2) {
                    while (tribute1.name === tribute2.name) {
                        tribute2 = ReturnTributeForCombatOrStart();
                    }
                } else if (aliveTributes.length === 2) {
                    tribute1 = aliveTributes[0];
                    tribute2 = aliveTributes[1];
                }

                if (aliveTributes.length > 3) { // if more than 3 tributes are alive, only have a 1/6 chance tributes from the same district fight each other
                    while (tribute1.district === tribute2.district) {
                        if (ReturnRandomNumber(1, 6) === 1) break;
                        tribute2 = ReturnTributeForCombatOrStart();
                    }
                }

                CombatTributes(tribute1, tribute2, true);
                CheckToRemoveTributesFromList();

                eventsCompleted++;
                if (eventsCompleted === startEventsAmount) {
                    $("ul").append(`<div class="log"><li>The bloodbath has ended!</li>`);
                    $("ul").append(`<li id="seeTributes" class="col-12">SEE TRIBUTES</li>`);
                }
            }, delay);
        }
    }



    function ReturnTributeForCombatOrStart() { //raised chance for risk, and combat skills, lower chance for luck
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
            let weight = riskValue;

            // Reduce the weight based on the luck and combatSkills stats
            weight -= luckValue * 0.5;  // Decrease the weight based on luck (lower luck = more likely)
            weight -= combatSkillsValue * 0.5;  // Decrease the weight based on combatSkills (lower combatSkills = more likely)

            // Ensure weight is at least 1 (so it can be added to the array)
            weight = Math.max(weight, 1);

            // Add a number of "entries" based on the calculated weight
            for (let j = 0; j < weight; j++) {
                weightedAliveTributes.push(tribute); // This creates more entries for higher risk and less for higher luck/combatSkills
            }
        }

        // Now, pick a random tribute based on the weighted array
        let randomIndex = Math.floor(Math.random() * weightedAliveTributes.length);
        let selectedTribute = weightedAliveTributes[randomIndex];
        console.log("Selected Tribute:", selectedTribute);
        return selectedTribute;
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


    function ReturnTributeThatFoundSomething() { // higher chance for higher speed, luck, combatSkills or risk
        if (!Array.isArray(aliveTributes) || aliveTributes.length === 0) {
            console.log("Invalid input or empty aliveTributes array");
            return;
        }

        let weightedAliveTributes = [];

        for (let i = 0; i < aliveTributes.length; i++) {
            let tribute = aliveTributes[i];
            let luck = tribute["luck"] || 0;
            let speed = tribute["speed"] || 0;
            let combat = tribute["combatSkills"] || 0;
            let risk = tribute["risk"] || 0;

            // You can tune the multipliers based on how much you want each stat to influence weight
            let weight =
                (luck * 1.0) +
                (speed * 1.0) +
                (combat * 1.0) +
                (risk * 1.0);

            // Ensure minimum weight of 1 so everyone has at least a small chance
            weight = Math.max(weight, 1);

            for (let j = 0; j < weight; j++) {
                weightedAliveTributes.push(tribute);
            }
        }

        let randomIndex = Math.floor(Math.random() * weightedAliveTributes.length);
        let selectedTribute = weightedAliveTributes[randomIndex];
        console.log("Selected Tribute:", selectedTribute);
        return selectedTribute;
    }


    function CombatTributes(tribute1, tribute2, isStartOfGame = false) {

        function CalculateDamage(attacker) { // calculate damage (min: 9, max: 94)
            let baseDamage = ReturnRandomNumber(8, 30); // have a random between 8 and 30 for the base damage (random aspect)
            let damageModifier = attacker.damage * 1.5; // apply bonus dmg for dmg stat
            let combatDamageModifier = attacker.combatSkills * 1.15; // apply bonus dmg for combat skills
            let damageModifier2 = weaponModifiers[attacker.weapon] || 1; // apply bonus dmg for weapon
            return Math.floor((baseDamage + damageModifier + combatDamageModifier) * damageModifier2); // calculate and return damage output
        }
    
        if (tribute1.hp > 0 && tribute2.hp > 0) {
            let damageMode;
            if (isStartOfGame == true){
                damageMode = Math.floor(Math.random() * 7) + 1
            } else{
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
                if(damageTo.hp == 0){
                    $("ul").append(`<div class="log"><li>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} has died.</li></div>`);
                    damageTo.isAlive = false;
                    attacker.kills += 1;
                } else{
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
                if(tribute1.hp == 0){
                    tribute1.isAlive = false;
                    tribute2.kills += 1;
                    fightLog += `<li>${tribute1.name} was killed by ${tribute2.name}</li>`;
                }
                if(tribute2.hp == 0){
                    tribute2.isAlive = false;
                    tribute1.kills += 1;
                    fightLog += `<li>${tribute2.name} was killed by ${tribute1.name}</li>`;
                }
                fightLog += `</div>`;
                $("ul").append(fightLog);
            } else if (damageMode == 6 || damageMode == 7){
                let random = Math.floor(Math.random() * 7) + 1
                let chosenTribute = ReturnTributeThatFoundSomething();
                switch (random)
                {
                    case 1 :
                        if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a sword.</li></div>`);
                            chosenTribute.weapon = "sword";
                        } else if(chosenTribute.weapon === "sword"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a sword but already has one.</li></div>`);
                        } else if(chosenTribute.weapon === "bow" || chosenTribute.weapon === "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a sword and upgraded their weapon.</li></div>`);
                            chosenTribute.weapon = "sword";
                        } else{ //should never happen
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a sword.</li></div>`);
                            chosenTribute.weapon = "sword";
                            throw new Error("error");
                        }
                        break;
                    case 2:
                        if(chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a bow.</li></div>`);
                            chosenTribute.weapon = "bow";
                        } else if(chosenTribute.weapon === "bow"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow but already has one.</li></div>`);
                        } else if(chosenTribute.weapon === "sword"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow but already has a better weapon.</li></div>`);
                        } else if(chosenTribute.weapon === "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a bow and upgraded their weapon.</li></div>`);
                            chosenTribute.weapon = "bow";
                        } else{ // should never happen
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a bow.</li></div>`);
                            chosenTribute.weapon = "bow";
                            throw new Error("error");
                        }
                        break;
                    case 3:
                        if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a knife.</li></div>`);
                            chosenTribute.weapon = "knife";
                        } else if(chosenTribute.weapon === "sword" || chosenTribute.weapon == "bow"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a knife but already has a better weapon.</li></div>`);
                        } else if(chosenTribute.weapon === "knife"){
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} found a knife but already has one.</li></div>`);
                        } else{ // should never happen
                            $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up a knife.</li></div>`);
                            chosenTribute.weapon = "bow";
                            throw new Error("error");
                        }
                        break;
                    case 4:
                    case 5:
                        let amountOfMedkits = Math.floor(Math.random() * 2) + 1;
                        $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up ${amountOfMedkits} medkit(s).</li></div>`);
                        chosenTribute.findMedKit(amountOfMedkits);
                        break;
                    case 6:
                    case 7:
                        $("ul").append(`<div class="log"><li>${chosenTribute.name} picked up armor.</li></div>`);
                        chosenTribute.findArmor();
                        break;
                }
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
        }
    }


    /*
    function CalculateDamage(tribute) {
        let baseDamage = Math.floor(Math.random() * 26) + 20;  // Random damage between 20 and 45
        let damageModifier = tribute.combatSkills * 0.5;  // CombatSkills will influence the damage, you can adjust the multiplier

        let finalDamage = baseDamage + damageModifier;  // Apply combat skills to the damage
        return Math.max(finalDamage, baseDamage);  // Ensure damage isn't lower than the base damage
    }
        */

    function CheckToRemoveTributesFromList() {
        for (let i = 0; i < aliveTributes.length; i++) {
            if (aliveTributes[i].isAlive === false) {
                aliveTributes.splice(i, 1); // Remove 1 element at index i
                i--; // Decrease the index to account for the shift in the array
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
            console.log(`${tribute.name} has been removed from the alive list.`);
        } else {
            console.log("Tribute not found in the alive list.");
        }
    }
    

    function ReturnRandomTimer(){
        return ReturnRandomNumber(500, 2000);
    }

    $(document).on("click", "#seeTributes", function () {
        $("#eventLog").hide();
        GenerateDistricts(false);
        FillInData();
    });

    function FillInData() {
        for (let i = 0; i < 24; i += 2) {
            const district = i / 2 + 1; // Convert 0,2,4,... to 1,2,3,...
            let maleTribute = allTributes[i];
            let femaleTribute = allTributes[i+1];

            if(!maleTribute.isAlive){
                $("#image" + district + "M").attr("src", "images/maleDead.png");
                $("#image" + district + "M").attr("id", "deadTribute");
            }

            if(!femaleTribute.isAlive){
                $("#image" + district + "F").attr("src", "images/femaleDead.png");
                $("#image" + district + "F").attr("id", "deadTribute");
            }

            for (let j = 0; j < fields.length; j++) {
                let field = fields[j];
                $("#" + field + district + "M").text(maleTribute[field]);
                $("#" + field + district + "F").text(femaleTribute[field]);
                console.log("#" + field + district + "M");
            }
        }
    }

    function ReturnRandomNumber(number1, number2) {
        const min = Math.min(number1, number2);
        const max = Math.max(number1, number2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});