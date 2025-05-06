let aliveTributes = [];
let allTributes = [];

$(document).ready(function(){
    const fields = [
        "speed", "power", "intelligence", "popularity",
        "risk", "survivalSkills", "combatSkills", "luck"
    ];


    $("#clearFields").on("click", function() {
        if (confirm("Are you sure?")) {
            $("input").val('');
        }
    });

    $("#submit").on("click", function() {
        let maleTribute;
        let femaleTribute;
        for(let i = 1; i < 13; i++){
            try {
                // Code that might throw an error
                maleTribute = new Tribute(GetName(i, "male"), "male", i, GetSpeed(i, "male"), GetPower(i, "male"), GetIntelligence(i, "male"), GetPopularity(i, "male"), GetRisk(i, "male"), GetSurvivalSkills(i, "male"), GetCombatSkills(i, "male"), GetLuck(i, "male"));
                femaleTribute = new Tribute(GetName(i, "female"), "female", i, GetSpeed(i, "female"), GetPower(i, "female"), GetIntelligence(i, "female"), GetPopularity(i, "female"), GetRisk(i, "female"), GetSurvivalSkills(i, "female"), GetCombatSkills(i, "female"), GetLuck(i, "female"));
            } catch (error) {
                // Catch and handle the error
                alert(error.message);
                return;
              }
            aliveTributes.push(maleTribute);
            aliveTributes.push(femaleTribute);
            allTributes.push(maleTribute);
            allTributes.push(femaleTribute);
        }
        StartGame();
    });

    function GetName(i, gender){
        const name = $(`#name${i}${gender[0].toUpperCase()}`);
        return name.val();
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

    function StartLogging(){
        $("main").append("<p class='col-12' id='logTitle'>logging started</p>");
        let startEventsAmount = Math.floor(Math.random() * 3) + 2;
        $("main").append("<ul>");
        console.log(startEventsAmount);
        let delay = 0; // Start with no delay
        for (let i = 0; i < startEventsAmount; i++) {
            let randomTimer = ReturnRandomTimer();
            delay += randomTimer; // Increase delay by the random timer each time
            setTimeout(function(){
                let tribute1 = ReturnTributeForCombatOrStart();
                let tribute2 = ReturnTributeForCombatOrStart();
                while (tribute1 == tribute2){
                    tribute2 = ReturnTributeForCombatOrStart();
                }
                CombatTributes(tribute1, tribute2);
                // Remove possible remaining dead tributes from the list
                CheckToRemoveTributesFromList();
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


    function CombatTributes(tribute1, tribute2) {
        function calculateDamage(tribute) {
            let baseDamage = Math.floor(Math.random() * 26) + 20;
            let damageModifier = tribute.combatSkills * 0.5;
            return baseDamage + damageModifier;
        }
    
        while (tribute1.hp > 0 && tribute2.hp > 0) {
            let damageMode = Math.floor(Math.random() * 5) + 1;
            console.log(`Damage Mode: ${damageMode}`);
    
            if (damageMode === 1 || damageMode === 2) {
                let damageToTribute1 = calculateDamage(tribute2);
                let damageToTribute2 = calculateDamage(tribute1);
    
                tribute1.DoDamage(damageToTribute1);
                tribute2.DoDamage(damageToTribute2);
    
                if (tribute1.hp <= 0 && tribute2.hp > 0) {
                    $("main").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</li></div>`);
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                } else if (tribute2.hp <= 0 && tribute1.hp > 0) {
                    $("main").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li></div>`);
                    tribute1.kills += 1;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute2);
                } else if (tribute1.hp > 0 && tribute2.hp > 0) {
                    $("main").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li></div>`);
                } else {
                    $("main").append(`<div class="log"><li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</li><li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</li></div>`);
                    tribute1.kills += 1;
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                    RemoveTributeFromAliveList(tribute2);
                }
            } else if (damageMode === 3) {
                let damageTo = Math.random() < 0.5 ? tribute1 : tribute2;
                let attacker = damageTo === tribute1 ? tribute2 : tribute1;
                let damage = calculateDamage(attacker);
                damageTo.DoDamage(damage);
                $("main").append(`<div class="log"><li>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} now has ${damageTo.hp.toFixed(2)} HP.</li></div>`);
            } else if (damageMode === 4) {
                let victim = Math.random() < 0.5 ? tribute1 : tribute2;
                let killer = victim === tribute1 ? tribute2 : tribute1;
                victim.hp = 0;
                victim.isAlive = false;
                killer.kills += 1;
                RemoveTributeFromAliveList(victim);
                $("main").append(`<div class="log"><li>${victim.name} has been killed instantly by ${killer.name}!</li></div>`);
            } else if (damageMode === 5) {
                let fightLog = `<div class="log">`;
                while (tribute1.hp > 0 && tribute2.hp > 0) {
                    let damageToTribute1 = calculateDamage(tribute2);
                    let damageToTribute2 = calculateDamage(tribute1);
    
                    tribute1.DoDamage(damageToTribute1);
                    tribute2.DoDamage(damageToTribute2);
    
                    fightLog += `<li>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</li>`;
                    fightLog += `<li>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</li>`;
                }
                fightLog += `</div>`;
                $("main").append(fightLog);
            }
    
            // Post-combat death handling
            if (tribute1.hp <= 0 || tribute2.hp <= 0) {
                if (tribute1.hp <= 0 && tribute2.hp <= 0) {
                    tribute1.kills += 1;
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                    RemoveTributeFromAliveList(tribute2);
                } else if (tribute1.hp <= 0) {
                    tribute2.kills += 1;
                    tribute1.isAlive = false;
                    RemoveTributeFromAliveList(tribute1);
                } else if (tribute2.hp <= 0) {
                    tribute1.kills += 1;
                    tribute2.isAlive = false;
                    RemoveTributeFromAliveList(tribute2);
                }
                break;
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
        return Math.floor(Math.random() * 1500) + 500;
    }
});