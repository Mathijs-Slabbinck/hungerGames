let aliveTributes = [];
let allTributes = [];
let skipIntro = true; // set to true to skip the intro

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

    function CheckIfNameExists(i, gender, usedNames) { // make sure a unique name gets returned
        let name = GetName(i, gender).trim(); // Ask a name, remove spaces before and after and assign it to the variable name

        if (usedNames.has(name)) { // check if the tribute's name already exists, if yes, throw an error
            throw new Error(`Two tributes have the same name: "${name}". Please change this.`);
        }

        return name; // if the tribute's name doesn't exist yet, return the name
    }

    function StartCountdown() { // start the countdown
        $("main").append(`<li class="log"><div id="countDown"></div></li>`);

        for (let i = 0; i < 10; i++) { // loop 10 times, 1 time for every second
            setTimeout(function () {
                $("#countDown").text(`${10 - i}`);
            }, i * 1000); // set a timeout for every second
        }

        setTimeout(function () {
            $("main").empty();
            StartLogging();
        }, 10000); // after 10 seconds, start the bloodbath
    }

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
        let startEventsAmount = ReturnRandomNumber(6, 15); // generate a random to determine how many events will happen during the bloodbath
        $("main").append("<ul id='eventLog'><li class='log' id='Announcement'><div>The Bloodbath has begun!</div></li></ul>");
        LogShit(startEventsAmount, true); // call the function, passing the amount of events and a boolean to say if it's the start of the game
    }

    function LogShit(eventsAmount, isStart) { // eventsAmount = how many events will happen, isStart = if it's the start of the game


        let delay = 0;

        for (let i = 0; i < eventsAmount; i++) {
            let randomTimer = ReturnRandomTimer(isStart);
            let randomEvent = ReturnRandomNumber(1, 13);
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
                } else if (randomEvent === 9) {
                    AnimalAttack();
                } else if (randomEvent === 10) {
                    PoisonedFood();
                } else if (randomEvent === 11) {
                    Trained();
                } else if (randomEvent === 12) {
                    Injured();
                } else if (randomEvent === 13) {
                    Ambushed();
                }
            }, delay);
        }

        // This runs a little *after* the final event, guaranteeing it's last
        setTimeout(() => {
            if (whichDay === 0) {
                $("ul").append(`<li class="log" id="Announcement"><div>The bloodbath has ended!</div></li>`);
            } else{
                $("ul").append(`<li class="log" id="Announcement"><div>Day ${whichDay} has ended!</div></li>`);
            }
            $("ul").append(`<li id="seeTributes" class="col-12">SEE TRIBUTES</li>`);
            $("ul").append(`<li id="advanceToNext" class="col-12">ADVANCE TO DAY ${whichDay + 1}</li>`);
        }, delay + 200); // Slight buffer to ensure it's visually last
    }

    // prepare 2 tributes for combat and call CombatTributes to start the combat
    function Combat(delay, isStart){ // delay is the time in seconds before the combat starts, isStart is a boolean to check if it's the start of the game
        setTimeout(function () {
            let tribute1 = ReturnTribute("combat");
            let tribute2 = ReturnTribute("combat");

            if (aliveTributes.length > 2) { // if there are more than 2 tributes alive, make sure the tributes are not the same
                while (tribute1 === tribute2) {
                    tribute2 = ReturnTribute("combat"); // pick a different tribute if the tributes are the same
                }
            } else if (aliveTributes.length === 2) { // if there are only 2 tributes alive, pick them both
                tribute1 = aliveTributes[0];
                tribute2 = aliveTributes[1];
            }

            if (aliveTributes.length > 3) { // if there are more than 3 tributes alive, make same district battles less likely
                while (tribute1.district === tribute2.district) { // check if the tributes are from the same district
                    if (ReturnRandomNumber(1, 6) === 1) break; // 1 in 6 chance to allow same district battles
                    tribute2 = ReturnTribute("combat"); // 5 in 6 chance to try to pick a different tribute
                }
            }

            CombatTributes(tribute1, tribute2, isStart); // start the combat with the prepared tributes
            CheckToRemoveTributesFromList(); // check if the tributes are dead and remove them from the aliveTributes array if missed
        }, delay);
    }

    function FellInTrap() {
        let randomForWhichTrap = ReturnRandomNumber(1, 3); // pick a random number between 1 and 3 to determine which trap the tribute fell into
        let chosenTribute = ReturnTribute("fellInTrap"); // pick a tribute to fall into the trap
        let trapSetter = ReturnTribute("trapSetter"); // pick a tribute that set the trap
        if (randomForWhichTrap === 1 || randomForWhichTrap === 2) { // 2/3 chance to take damage
            let trapDamage = ReturnRandomNumber(25, 60); // generate a random number between 25 and 60 for the trap damage
            HandleDamage(chosenTribute, trapDamage); // handle the damage
            if (chosenTribute.isAlive === false) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div>${chosenTribute.name} fell into ${trapSetter.name}'s trap and took ${trapDamage.toFixed(2)} damage. ${chosenTribute.name} died.</div></li>`);
                RemoveTributeFromAliveList(chosenTribute); // remove the tribute from the aliveTributes array
                trapSetter.kills += 1; // award a kill to the trap setter
                PlayKillSound(); // play the canon sound
            } else {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} fell into ${trapSetter.name}'s trap and took ${trapDamage.toFixed(2)} damage. ${chosenTribute.name} now has ${chosenTribute.hp.toFixed(2)} HP.</div></li>`);
            }
        } else if (randomForWhichTrap === 3) { // 1/3 chance to die instantly
            $("ul").append(`<li class="log"><div>${chosenTribute.name} fell into ${trapSetter.name}'s trap and died instantly.</div></li>`);
            chosenTribute.KillTribute(); // kill the tribute
            RemoveTributeFromAliveList(chosenTribute); // remove the tribute from the aliveTributes array
            trapSetter.kills += 1; // award a kill to the trap setter
            PlayKillSound(); // play the canon sound
        }
    }

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
                        (combat * 0.75) +
                        (risk * 1.15) +
                        (speed * 0.85);
                    break;
                case "poisonedFood":
                    weight =
                        (luck * 0.85) +
                        (survival * 0.4) +
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
                case "trainedCombatSkills":
                    weight =
                        (luck * 1.5) +
                        (combat * 0.5) +
                        (risk * 1.2) +
                        (intelligence * 1.25) +
                        (survival * 1.2);
                    break;
                case "trainedSpeed":
                    weight =
                        (luck * 1.5) +
                        (risk * 1.2) +
                        (intelligence * 1.25) +
                        (survival * 1.2);
                        break;
                case "injured":
                    weight =
                        (luck * 0.85) +
                        (risk * 1.2) +
                        (survival * 0.7) +
                        (intelligence * 0.9);
                    break;
                case "ambushed":
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

    function HandleDamage(tribute, damage){
        if (tribute.DoDamage(damage).medKitUsed){
            setTimeout(function () {
                $("ul").append(`<li class="log"><div>${tribute.name} used a medkit and healed 40 HP. ${tribute.name} now has ${tribute.hp.toFixed(2)} HP.</div></li>`);
            }, 250);
        }
    }

    function HandleDeath(tribute)
    {
        RemoveTributeFromAliveList(tribute); // if the tribute is dead, remove it from the aliveTributes array
        PlayKillSound(); // play the canon sound
    }

    function CombatTributes(tribute1, tribute2, isStartOfGame = false) { // possibly add escaping later?
        if (tribute1.isAlive && tribute2.isAlive) { // check if both tributes are alive
            let damageMode;
            if (isStartOfGame == true) { // if it's the start of the game, also handle chance to find items to simulate bloodbath
                damageMode = Math.floor(Math.random() * 7) + 1
            } else {
                damageMode = Math.floor(Math.random() * 5) + 1;
            }

            if (damageMode === 1 || damageMode === 2) { // make both tributes do damage to each other
                let damageToTribute1 = CalculateDamage(tribute2);
                let damageToTribute2 = CalculateDamage(tribute1);

                HandleDamage(tribute1, damageToTribute1);
                HandleDamage(tribute2, damageToTribute2);

                if (tribute1.isAlive === false && tribute2.isAlive === true) { // if tribute1 is dead and tribute2 is alive
                    $("ul").append(`<li class="log"><div>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</div><div>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</div></li>`);
                    tribute2.kills += 1; // award a kill to tribute2
                    HandleDeath(tribute1); // handle death of tribute1
                } else if (tribute1.isAlive === true && tribute2.isAlive === false) { // if tribute1 is alive and tribute2 is dead
                    $("ul").append(`<li class="log"><div>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</div><div>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</div></li>`);
                    tribute1.kills += 1; // award a kill to tribute1
                    HandleDeath(tribute2); // handle death of tribute2
                } else if (tribute1.isAlive === true && tribute2.isAlive === true) { // if both tributes are alive
                    $("ul").append(`<li class="log"><div>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</div><div>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</div></li>`);
                } else { // if both tributes are dead
                    $("ul").append(`<li class="log"><div>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} died.</div><div>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} died.</div></li>`);
                    tribute1.kills += 1; // award a kill to tribute1
                    tribute2.kills += 1; // award a kill to tribute2
                    HandleDeath(tribute1); // handle death of tribute1
                    setTimeout(function () { // delay handling death of tribute2 a bit to delay the canon sound
                        HandleDeath(tribute2); // handle death of tribute2
                    }, 750);
                }
            } else if (damageMode === 3) { // make 1 tribute do damage to another tribute
                let damageTo = Math.random() < 0.5 ? tribute1 : tribute2; // pick a random tribute to take damage
                let attacker = damageTo === tribute1 ? tribute2 : tribute1; // pick the other tribute as the attacker
                let damage = CalculateDamage(attacker); // calculate the damage of the attacker
                HandleDamage(damageTo, damage); // handle the damage of the tribute that takes damage
                if (damageTo.isAlive === false) { // if the tribute that took damage is dead
                    $("ul").append(`<li class="log"><div>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} has died.</li></div>`);
                    attacker.kills += 1; // award a kill to the attacker
                    HandleDeath(damageTo); // handle death of the tribute that died
                } else { // if the tribute that took damage is alive
                    $("ul").append(`<li class="log"><div>${attacker.name} attacks ${damageTo.name} for ${damage.toFixed(2)} damage. ${damageTo.name} now has ${damageTo.hp.toFixed(2)} HP.</li></div>`);
                }
            } else if (damageMode === 4) { // 1 tribute gets killed instantly by the other
                let victim = Math.random() < 0.5 ? tribute1 : tribute2; // pick a random tribute to be the victim
                let killer = victim === tribute1 ? tribute2 : tribute1; // pick the other tribute as the killer
                victim.KillTribute(); // kill the victim
                killer.kills += 1; // award a kill to the killer
                HandleDeath(victim); // handle death of the victim
                $("ul").append(`<li class="log"><div>${victim.name} has been killed instantly by ${killer.name}!</div></li>`);
            } else if (damageMode === 5) { // make 2 tributes fight until 1 dies
                let fightLog = `<li class="log">`;
                while (tribute1.isAlive === true && tribute2.isAlive === true) { // as long as both tributes are alive, make them fight
                    let damageToTribute1 = CalculateDamage(tribute2); // calculate damage of tribute2
                    let damageToTribute2 = CalculateDamage(tribute1); // calculate damage of tribute1

                    HandleDamage(tribute1, damageToTribute1); // handle damage done to tribute1
                    HandleDamage(tribute2, damageToTribute2);  // handle damage done to tribute2
                    fightLog += `<div>${tribute1.name} attacks ${tribute2.name} for ${damageToTribute2.toFixed(2)} damage. ${tribute2.name} now has ${tribute2.hp.toFixed(2)} HP.</div>`;
                    fightLog += `<div>${tribute2.name} attacks ${tribute1.name} for ${damageToTribute1.toFixed(2)} damage. ${tribute1.name} now has ${tribute1.hp.toFixed(2)} HP.</div>`;
                }
                if (!tribute1.isAlive) { // if tribute1 is dead
                    tribute2.kills += 1; // award a kill to tribute2
                    fightLog += `<div>${tribute1.name} was killed by ${tribute2.name}!</div>`;
                    HandleDeath(tribute1); // handle death of tribute1
                }
                if (!tribute2.isAlive) { // if tribute2 is dead
                    tribute1.kills += 1; // award a kill to tribute1
                    fightLog += `<div>${tribute2.name} was killed by ${tribute1.name}!</div>`;
                    HandleDeath(tribute2); // handle death of tribute2
                }
                fightLog += `</li>`;
                $("ul").append(fightLog);
            } else if (damageMode == 6 || damageMode == 7) { // only applies during the bloodbath, 2/7 chance to find something in stead of fighting
                FoundSomething();
            }
        } else { // should never happen || this executes when at least 1 of the chosen tributes is dead
            alert("Critical Error: At least 1 chosen tribute is dead.");
            throw new Error("At least 1 chosen tribute is dead.");
        }
    }

    function CalculateDamage(tribute) { // calculate damage (min: 9, max: 94)
        let baseDamage = ReturnRandomNumber(8, 30); // have a random between 8 and 30 for the base damage (random aspect)
        let damageModifier = tribute.power * 1.5; // apply bonus dmg for dmg stat
        let combatDamageModifier = tribute.combatSkills * 1.15; // apply bonus dmg for combat skills
        let damageModifier2 = weaponModifiers[tribute.weapon] || 1; // apply bonus dmg for weapon (or 1 if no weapon)
        return Math.floor((baseDamage + damageModifier + combatDamageModifier) * damageModifier2); // calculate and return damage output
    }

    function PlayKillSound(){
        let canon = new Audio('assets/media/canon.mp3');
        canon.play();
    }

    function AnimalAttack() {
        let chosenTribute = ReturnTribute("animalAttack");
        let animalDamage = ReturnRandomNumber(25, 65);
        let random = ReturnRandomNumber(1, 10);

        function ApplyDamage() {
            HandleDamage(chosenTribute, animalDamage);
            if (chosenTribute.isAlive === false) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals and died.</div></li>`);
                RemoveTributeFromAliveList(chosenTribute); // if the tribute is dead, remove it from the aliveTributes array
                PlayKillSound(); // play the canon sound
            } else {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals and took ${animalDamage.toFixed(2)} damage. ${chosenTribute.name} now has ${chosenTribute.hp.toFixed(2)} HP.</div></li>`);
            }
        }

        if (random === 1) { // 1/10 chance to take damage
            ApplyDamage();
        } else if (random === 2) { // 1/10 chance take no damage
            $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals but managed to escape.</div></li>`);
        } else if (random === 3) { // 1/10 chance to die instantly
            $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals and died instantly!</div></li>`);
            chosenTribute.KillTribute(); // kill the tribute
            RemoveTributeFromAliveList(chosenTribute); // remove the tribute from the aliveTributes array
            PlayKillSound(); // play the canon sound
        } else if (random >= 4 && random <= 10) { // 7/10 chance for stat check
            if (chosenTribute.power >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals but managed to fight them off (power check).</div></li>`);
            } else if (chosenTribute.speed >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals but managed to escape (speed check).</div></li>`);
            } else if (chosenTribute.survivalSkills >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals but managed to hide (survival skills check).</div></li>`);
            } else if (chosenTribute.intelligence >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} was attacked by a pack of wild animals but managed to trick them (intelligence check).</div></li>`);
            } else {
                ApplyDamage(); // if the tribute fails all checks, apply damage
            }
        }
    }

    function FoundSomething() { // tribute finds a weapon, medkit or armor
        let random = ReturnRandomNumber(1, 7); // pick a random number to determine what the tribute finds
        let chosenTribute = ReturnTribute("foundSomething"); // select a tribute to find something
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

    function PoisonedFood() {
        let chosenTribute = ReturnTribute("poisonedFood");
        let poisonDamage = ReturnRandomNumber(10, 40);

        HandleDamage(chosenTribute, poisonDamage);
        if (chosenTribute.isAlive === false) { // check if the tribute is dead
            $("ul").append(`<li class="log"><div>${chosenTribute.name} ate poisoned food and died.</div></li>`);
            RemoveTributeFromAliveList(chosenTribute); // if the tribute is dead, remove it from the aliveTributes array
            PlayKillSound(); // play the canon sound
        } else {
            $("ul").append(`<li class="log"><div>${chosenTribute.name} ate poisoned food and took ${poisonDamage.toFixed(2)} damage. ${chosenTribute.name} now has ${chosenTribute.hp.toFixed(2)} HP.</div></li>`);
        }
    }

    function SponsorGift(attempts = 0) {
        let chosenTribute = ReturnTribute("sponsorGift"); // pick a tribute to give a gift to
        let gift = ReturnRandomNumber(1, 5); // generate a random to see what gift the tribute gets
        if (attempts > 200) { // if it's likely (after trying over 200 times) every tribute has max intelligence and all equipment, give nothing
            $("ul").append(`<li class="log"><div>A sponsor gift balloon crashed into a tree!</div></li>`);
            return;
        }
        if (gift === 1 || gift == 2) { // higher chance to get a medkit
            if (chosenTribute.medKits == 0) { // if the tribute has no medkits, give 1 or 2
                let randomMedkit = Math.floor(Math.random() * 2) + 1;
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                chosenTribute.findMedKit(randomMedkit);
            } else if (chosenTribute.medKits == 1) { // if the tribute has 1 medkit, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received a medkit from a sponsor.</div></li>`);
                chosenTribute.findMedKit(1);
            } else { // if the tribute has 2 medkits, try to give armor
                if (chosenTribute.hasArmor === "no") { // if the tribute has no armor, give 1
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received armor from a sponsor.</div></li>`);
                    chosenTribute.findArmor(1);
                } else if (chosenTribute.weapon != "sword") { // if the tribute has medkits and armor, try to give a sword
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received a sword from a sponsor.</div></li>`);
                    chosenTribute.weapon = "sword";
                } else { // if the tribute has medkits, armor and a sword, try to give intelligence
                    if (chosenTribute.intelligence < 10) {
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</div></li>`);
                        let intelligence = chosenTribute.intelligence + 1;
                        chosenTribute.intelligence = intelligence;
                    } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                        SponsorGift(attempts + 1);
                    }
                }
            }
        } else if (gift === 4 || gift === 4) { // higher chance to get armor
            if (chosenTribute.hasArmor === "no") { // if the tribute has no armor, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received armor from a sponsor.</div></li>`);
                chosenTribute.findArmor();
            } else if (chosenTribute.medKits != 2) { // if the tribute has armor, try to give a medkit
                if (chosenTribute.medKits != 2) { // check if the tribute doesn't have 2 medkits
                    if (chosenTribute.medKits == 0) { // if the tribute has no medkits, give 1 or 2
                        let randomMedkit = Math.floor(Math.random() * 2) + 1;
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                        chosenTribute.findMedKit(randomMedkit);
                    } else { // if the tribute has 1 medkit, give 1
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} received a medkit from a sponsor.</div></li>`);
                        chosenTribute.findMedKit(1);
                    }
                }
            } else if (chosenTribute.weapon != "sword") { // if the tribute has armor and medkits, try to give a sword
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received a sword from a sponsor.</div></li>`);
                chosenTribute.weapon = "sword";
            } else { // if the tribute has armor, medkits and a sword, try to give intelligence
                if (chosenTribute.intelligence < 10) { // check if the tribute doesn't have max intelligence
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</div></li>`);
                    let intelligence = chosenTribute.intelligence + 1;
                    chosenTribute.intelligence = intelligence;
                } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                    SponsorGift(attempts + 1);
                }
            }
        } else if (gift === 5) { // lower chance to get a sword
            if (chosenTribute.weapon != "sword") { // if the tribute doesn't have a sword, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received a sword from a sponsor.</div></li>`);
                chosenTribute.weapon = "sword";
            } else if (chosenTribute.medKits != 2) { // if the tribute has a sword, try to give a medkit
                if (chosenTribute.medKits == 0) { // if the tribute has no medkits, give 1 or 2
                    let randomMedkit = Math.floor(Math.random() * 2) + 1;
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                    chosenTribute.findMedKit(randomMedkit);
                } else { // if the tribute has 1 medkit, give 1
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received a medkit from a sponsor.</div></li>`);
                    chosenTribute.findMedKit(1);
                }
            } else if (chosenTribute.hasArmor === "no") { // if the tribute has a sword and medkits, try to give armor
                $("ul").append(`<li class="log"><div>${chosenTribute.name} received armor from a sponsor.</div></li>`);
                chosenTribute.findArmor(1);
            } else { // if the tribute has a sword, medkits and armor, try to give intelligence
                if (chosenTribute.intelligence < 10) { // check if the tribute doesn't have max intelligence
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} received some knowledge about the arena from a sponsor. (+1 intelligence)</li></div>`);
                    let intelligence = chosenTribute.intelligence + 1;
                    chosenTribute.intelligence = intelligence;
                } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                    SponsorGift(attempts + 1);
                }
            }
        }
    }

    function Trained(counter = 0) {

        if (counter > 200) {// if it's likely (after trying over 10 times) every tribute has maxed out their stats, stop the function
            $("ul").append(`<li class="log"><div>An earthquake hit the arena, all tributes lose 10HP.</div></li>`);
            for (let i = 0; i < aliveTributes.length; i++) {
                HandleDamage(aliveTributes[i], 10);
                if (aliveTributes[i].isAlive === false) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div>${aliveTributes[i].name} died from the earthquake.</div></li>`);
                    RemoveTributeFromAliveList(aliveTributes[i]); // if the tribute is dead, remove it from the aliveTributes array
                    PlayKillSound(); // play the canon sound
                }
            }
        }

        let random = ReturnRandomNumber(1, 3);

        if (random === 1) { // 50% chance to train power
            let chosenTribute = ReturnTribute("trainedPower");
            if (chosenTribute.power < 10) { // if tribute has less than 10 power, give +1 power
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else if (chosenTribute.speed < 10) { // if tribute has less than 10 speed, give +1 speed
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 speed.</div></li>`);
                let newSpeed = parseInt(chosenTribute.speed) + 1;
                chosenTribute.speed = newSpeed;
            } else if (chosenTribute.combatSkills < 10) { // if tribute has less than 10 combat skills, give +1 combat skills
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else { // if the tribute has 10 power, speed and combat skills, try to train again
                Trained(counter + 1);
                return; // prevent continuing with this run after recursion
            }
        } else if (random === 2) { // 50% chance to train speed
            let chosenTribute = ReturnTribute("trainedSpeed");
            if (chosenTribute.speed < 10) { // if tribute has less than 10 speed, give +1 speed
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 speed.</div></li>`);
                let newSpeed = parseInt(chosenTribute.speed) + 1;
                chosenTribute.speed = newSpeed;
            } else if (chosenTribute.combatSkills < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else if (chosenTribute.power < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else {
                Trained(counter + 1);
                return; // prevent continuing with this run after recursion
            }
        } else if (random === 3) { // 50% chance to train combat skills
            let chosenTribute = ReturnTribute("trainedCombatSkills");
            if (chosenTribute.combatSkills < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else if (chosenTribute.power < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else if (chosenTribute.speed < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} trained and got +1 speed.</div></li>`);
                let newSpeed = parseInt(chosenTribute.speed) + 1;
                chosenTribute.speed = newSpeed;
            } else {
                Trained(counter + 1);
                return; // prevent continuing with this run after recursion
            }
        }
    }

    function Injured(){
        let chosenTribute = ReturnTribute("injured");
        let injuryDamage = ReturnRandomNumber(5, 20);
        HandleDamage(chosenTribute, injuryDamage);
        if (chosenTribute.isAlive === false) { // check if the tribute is dead
            $("ul").append(`<li class="log"><div>${chosenTribute.name} got injured and died to their injuries.</div></li>`);
            HandleDeath(chosenTribute);
        } else {
            $("ul").append(`<li class="log"><div>${chosenTribute.name} got injured and took ${injuryDamage.toFixed(2)} damage.</div><div>${chosenTribute.name} now has ${chosenTribute.hp.toFixed(2)} HP.</div></li>`);
        }
    }

    function Ambushed(){
        let ambushedTribute = ReturnTribute("ambushed");
        let ambusher = ReturnTribute("ambusher");
        let ambusherDamage = CalculateDamage(ambusher);
        let ambushedDamage = CalculateDamage(ambushedTribute);
        let random = ReturnRandomNumber(1, 8);

        function TakeDamage(damageTaker, damage) {
            HandleDamage(damageTaker, damage);

            if (!damageTaker.isAlive) { // check if the tribute is dead
                damageGiver.kills += 1; // award a kill to the killer
                HandleDeath(damageTaker); // handle death of the tribute that died
            }
        }

        if (random === 1 || random === 2) { // 2/8 chance to take damage
            TakeDamage(ambushedTribute, ambusherDamage); // apply damage to the ambushed tribute
            if (!ambushedTribute.isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div>${damageTaker.name} was ambushed by ${damageGiver.name} and died.</div></li>`);
            } else {
                $("ul").append(`<li class="log"><div>${damageTaker.name} was ambushed by ${damageGiver.name} and took ${ambusherDamage.toFixed(2)} damage. ${damageTaker.name} now has ${damageTaker.hp.toFixed(2)} HP.</div></li>`);
            }
            $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} and died.</div></li>`);
        } else if (random === 3) { // 1/8 chance take no damage
            $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but managed to escape.</div></li>`);
        } else if (random === 4 || random === 5) { // 2/8 chance to to do stat check
            if (ambushedTribute.survivalSkills >= 8){ // if the ambushed tribute has passes the survival skills check, do nothing
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but managed to escape (survival skills check).</div></li>`);
            } else if (ambushedTribute.speed >= 8){ // if the ambushed tribute passes the speed check, do nothing
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but managed to run away (survival skills check).</div></li>`);
            } else if (ambushedTribute.combatSkills >= 8){ // // if the ambushed tribute passes the combat skills check, fight back
                TakeDamage(ambusher, ambushedDamage); // apply damage to the ambusher tribute
                if (!ambusher.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but fought back and killed them (combat skills check).</div></li>`);
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but fought back, dealing ${ambushedDamage.toFixed(2)} damage. ${ambusher.name} now has ${ambusher.hp.toFixed(2)} HP (combat skills check).</div></li>`);
                }
            }
        } else{ // 3/8 chance to compare stats
            if (ambushedTribute.combatSkills > ambusher.combatSkills) { // if the ambushed tribute has more power than the ambusher
                TakeDamage(ambusher, ambushedDamage); // apply damage to the ambusher tribute
                if (!ambusher.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but fought back and killed them (higher combat skills).</div></li>`);
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but fought back, dealing ${ambushedDamage.toFixed(2)} damage. ${ambusher.name} now has ${ambusher.hp.toFixed(2)} HP (higher combat skills).</div></li>`);
                }
            } else if (ambushedTribute.speed > ambusher.speed) { // if the ambushed tribute has more speed than the ambusher
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} but managed to outrun them (higher speed stat).</div></li>`);
            } else { // if the ambushed tribute fails both checks, apply damage
                TakeDamage(ambushedTribute, ambusherDamage); // apply damage to the ambushed tribute
                if (!ambushedTribute.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} and died (lost stat comparison).</div></li>`);
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} was ambushed by ${ambusher.name} and took ${ambusherDamage.toFixed(2)} damage. ${ambushedTribute.name} now has ${ambushedTribute.hp.toFixed(2)} HP (lost stat comparison).</div></li>`);
                }
            }
        }
    }

    // to implement
    function RareRandomEvent() {

    }

    // to implement
    function SuperRareRandomEvent() {

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

    $("#clearFields").on("click", function () { // when clicked on clear fields button, verify if user is sure this and clear if yes
        if (confirm("Are you sure?")) {
            $("input").val('');
        }
    });

    $(document).on("click", "#submit", function () {
        let maleTribute;
        let femaleTribute;
        let usedNames = new Set(); // a set to keep track of which names have already been picked

        for (let i = 1; i < 13; i++) { // loop between 1 and 12 (once for every district)
            try {
                let maleName = CheckIfNameExists(i, "male", usedNames);
                let femaleName = CheckIfNameExists(i, "female", usedNames);
                if (maleName === femaleName) {
                    console.log(`Two tributes have the same name: "${maleName}". Please change this.`)
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

        $("main").empty();

        if(skipIntro){
            StartLogging();
        } else{
            let slogan = new Audio('assets/media/slogan.mp3');
            let countDown = new Audio('assets/media/countDown.mp3');
            slogan.play();
            setTimeout(function () {
                countDown.play();
                StartCountdown();
            }, 8000);
        }
    });

    $(document).on("click", "#advanceToNext", function () {
        let randomEvents = ReturnRandomNumber(3, 17); // how many events will happen this day
        let randomForWhenEndPhase = ReturnRandomNumber(3, 8); // how many tributes need to be alive for the end phase to start
        whichDay += 1;
        $("#eventLog").empty();
        $("#eventLog").append(`<li class="log" id="Announcement"><div>Day ${whichDay} has started!</div></li>`);

        //for (let i = 0; i < randomEvents; i++) {
            if (aliveTributes.length > randomForWhenEndPhase) {
                    LogShit(randomEvents, false);
            } else { // end phase

            }
        //}
    });

    $(document).on("click", "#seeTributes", function () {
        let anthem = new Audio('assets/media/anthemShort.mp3');
        anthem.play();
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

    function ReturnRandomTimer(isStart) {
        if (isStart) { // if it's the start of the game, return a random timer between 0.5 and 2 seconds
            return ReturnRandomNumber(500, 2000);
        } else { // if it's not the start of the game, return a random timer between 2.5 and 3.75 seconds
            return ReturnRandomNumber(2500, 3750);
        }
    }
});