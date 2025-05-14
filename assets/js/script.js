let aliveTributes = [];
let allTributes = [];
let dreamer = null;
let dreamCameTrue = null;
let skipIntro = false; // set to true to skip the intro
let canonAudio = new Audio('assets/media/canon.mp3');

$(document).ready(function() {
    const fields = [ // an array containing all stats a Tribute has
        "name", "speed", "power", "intelligence", "popularity",
        "risk", "survivalSkills", "combatSkills", "luck", "hp",
        "weapon", "hasArmor", "armorDurability", "medKits", "isAlive", "kills", "causeOfDeath"
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
        let randomForSteppedOfPlate = ReturnRandomNumber(1, 7);
        let delay = ReturnRandomTimer(true);
        let counterDelay = ReturnRandomNumber(400, 500);
        setTimeout(function(){
            if (randomForSteppedOfPlate === 1) { // 1/7 chance a tribute stepped off their plate
                let tribute = ReturnTribute("steppedOfPlate");
                let randomFor2Tributes = ReturnRandomNumber(1, 5);
                if (randomFor2Tributes >= 1 && randomFor2Tributes <= 4) { // 4/5 chance only 1 tribute stepped of their plate
                    $("main").append(`<li class="log"><div>${tribute.name} [${tribute.district}] stepped off their plate early and was blown up!</div></li>`);
                    tribute.causeOfDeath = `started early and was blown up`;
                    HandleDeath(tribute);
                    ScrollToBottom();
                } else { // 1/5 chance multiple tributes stepped of their plate
                    let randomFor3Tributes = ReturnRandomNumber(1, 4);
                    let tribute2 = ReturnTribute("steppedOfPlate");
                    while (tribute === tribute2) { // make sure this isn't the same tribute
                        tribute2 = ReturnTribute("steppedOfPlate");
                    }
                    if (randomFor3Tributes >= 1 && randomFor3Tributes <= 3) { // 3/4 chance 2 tributes get blown up
                        $("main").append(`<li class="log"><div>${tribute.name} [${tribute.district}] stepped off their plate early and was blown up!</div></li>`);
                        tribute.causeOfDeath = `started early and was blown up`;
                        HandleDeath(tribute);
                        ScrollToBottom();
                        setTimeout(function(){
                            $("main").append(`<li class="log"><div>${tribute2.name} [${tribute2.district}] stepped off their plate early and was blown up!</div></li>`);
                            tribute2.causeOfDeath = `started early and was blown up`;
                            HandleDeath(tribute2);
                            ScrollToBottom();
                        }, delay - counterDelay);
                        setTimeout(function () {
                            PlayKillSound(); // play it again after short delay to make sure 2 canon shots can be heard
                        }, 750);
                    } else { // 1/4 chance more tributes stepped off their plate
                        let randomFor4Tributes = ReturnRandomNumber(1, 4);
                        let tribute3 = ReturnTribute("steppedOfPlate");
                        while (tribute3 === tribute || tribute3 === tribute2) { // make sure this isn't the same tribute
                            tribute3 = ReturnTribute("steppedOfPlate");
                        }
                        if (randomFor4Tributes >= 1 && randomFor4Tributes <= 3) { // 3/4 chance 3 tributes get blown up
                            $("main").append(`<li class="log"><div>${tribute.name} [${tribute.district}] stepped off their plate early and was blown up!</div></li>`);
                            tribute.causeOfDeath = `started early and was blown up`;
                            HandleDeath(tribute);
                            ScrollToBottom();
                            setTimeout(function () {
                                $("main").append(`<li class="log"><div>${tribute2.name} [${tribute2.district}] stepped off their plate early and was blown up!</div></li>`);
                                tribute2.causeOfDeath = `started early and was blown up`;
                                HandleDeath(tribute2);
                                ScrollToBottom();
                            }, delay - counterDelay);
                            setTimeout(function(){
                                $("main").append(`<li class="log"><div>${tribute3.name} [${tribute3.district}] stepped off their plate early and was blown up!</div></li>`);
                                tribute3.causeOfDeath = `started early and was blown up`;
                                HandleDeath(tribute3);
                                ScrollToBottom();
                            }, delay - counterDelay + delay - counterDelay);
                        } else {
                            let tribute4 = ReturnTribute("steppedOfPlate");
                            while (tribute4 === tribute || tribute4 === tribute2 || tribute4 === tribute3) { // make sure this isn't the same tribute
                                tribute4 = ReturnTribute("steppedOfPlate");
                            }
                            $("main").append(`<li class="log"><div>${tribute.name} [${tribute.district}] stepped off their plate early and was blown up!</div></li>`);
                            tribute.causeOfDeath = `started early and was blown up`;
                            HandleDeath(tribute);
                            ScrollToBottom();
                            setTimeout(function () {
                                $("main").append(`<li class="log"><div>${tribute2.name} [${tribute2.district}] stepped off their plate early and was blown up!</div></li>`);
                                tribute2.causeOfDeath = `started early and was blown up`;
                                HandleDeath(tribute2);
                                ScrollToBottom();
                            }, delay - counterDelay);
                            setTimeout(function () {
                                $("main").append(`<li class="log"><div>${tribute3.name} [${tribute3.district}] stepped off their plate early and was blown up!</div></li>`);
                                tribute3.causeOfDeath = `started early and was blown up`;
                                HandleDeath(tribute3);
                                ScrollToBottom();
                            }, delay - counterDelay + delay - counterDelay);
                            setTimeout(function (){
                                tribute4.causeOfDeath = `started early and was blown up`;
                                HandleDeath(tribute4);
                                $("main").append(`<li class="log"><div>${tribute4.name} [${tribute4.district}] stepped off their plate early and was blown up!</div></li>`);
                                ScrollToBottom();
                            }, delay - counterDelay + delay - counterDelay + delay - counterDelay)
                        }
                    }
                }
            }
        }, delay);

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
        $("main").append("<ul id='eventLog'><li class='log Announcement'><div>The Bloodbath has begun!</div></li></ul>");
        LogShit(startEventsAmount, true); // call the function, passing the amount of events and a boolean to say if it's the start of the game
    }

    function LogShit(eventsAmount, isStart) { // eventsAmount = how many events will happen, isStart = if it's the start of the game
        let delay = 0;
        console.log("events amount : " + eventsAmount);

        for (let i = 0; i < eventsAmount; i++) {
            let randomTimer = ReturnRandomTimer(isStart);
            let randomEvent = ReturnRandomNumber(1, 47);
            delay += randomTimer;

            if (aliveTributes.length === 2) {
                const [tribute1, tribute2] = aliveTributes;
                FinalBattle(tribute1, tribute2);
                return;
            }

            setTimeout(() => {
                // If only 2 tributes left, start the final battle
                if (aliveTributes.length === 2) {
                    const [tribute1, tribute2] = aliveTributes;
                    FinalBattle(tribute1, tribute2);
                    return;
                }

                // Proceed with regular event
                if (isStart || randomEvent <= 10) { // 10 chance
                    Combat(Math.random(), isStart, false);
                } else if (randomEvent >= 11 && randomEvent <= 13) { // 3 chance
                    FoundSomething();
                } else if (randomEvent >= 14 && randomEvent <= 17) { // 4 chance
                    FellInTrap();
                } else if (randomEvent >= 18 && randomEvent <= 20) {  // 3 chance
                    SponsorGift();
                } else if (randomEvent >= 21 && randomEvent <= 24) { // 4 chance
                    AnimalAttack();
                } else if (randomEvent >= 25 && randomEvent <= 28) { // 4 chance
                    AteFood();
                } else if (randomEvent >= 29 && randomEvent <= 31) { // 3 chance
                    Trained();
                } else if (randomEvent >= 32 && randomEvent <= 35) { // 4 chance
                    Injured();
                } else if (randomEvent >= 36 && randomEvent <= 39) { // 4 chance
                    Ambushed();
                } else if (randomEvent >= 40 && randomEvent <= 42) { // 3 chance
                    ShowedMercy();
                } else if (randomEvent >= 43 && randomEvent <= 46) { // 4 chance
                    Rested();
                } else if (randomEvent === 47) { // temp until I implement RareRandomEvent() | 1 chance
                    SuperRareRandomEvent();
                }

                /*else if (randomEvent === 47 || randomEvent === 48) { // temp until I implement RareRandomEvent()
                    RareRandomEvent();
                } else if (randomEvent === 49) {
                    SuperRareRandomEvent();
                }*/

                ScrollToBottom();
            }, delay);
        }

        // Run this slightly after the final event for end-of-day announcement
        setTimeout(() => {
            // Skip announcement if the final battle has started
            if (aliveTributes.length === 2) return;

            if (whichDay === 0) {
                $("ul").append(`<li class="log Announcement"><div>The bloodbath has ended!</div></li>`);
            } else {
                $("ul").append(`<li class="log Announcement"><div>Day ${whichDay} has ended!</div></li>`);
            }
            $("ul").append(`<li id="seeTributes" class="col-12">SEE TRIBUTES</li>`);
            $("ul").append(`<li id="advanceToNext" class="col-12">ADVANCE TO DAY ${whichDay + 1}</li>`);
        }, delay + 200);
    }

    function LogEndPhase() {
        console.log("end phase started");
        let delay = 0;

        // Function to schedule events
        function scheduleEvent() {
            // Check if more than 2 tributes are alive
            if (aliveTributes.length <= 2) {
                // Once only 2 tributes remain, trigger the final battle
                const [tribute1, tribute2] = aliveTributes;
                FinalBattle(tribute1, tribute2);
                return; // Exit the function once final battle is triggered
            }

            let randomTimer = ReturnRandomTimer(true);
            let randomEvent = ReturnRandomNumber(1, 20);
            delay = randomTimer;

            setTimeout(() => {
                // Execute events if more than 2 tributes are alive
                if (randomEvent <= 5) {
                    Combat(Math.random(), false, true);
                } else if (randomEvent === 6 || randomEvent === 7) {
                    FellInTrap();
                } else if (randomEvent === 8 || randomEvent === 9) {
                    AnimalAttack();
                } else if (randomEvent === 10 || randomEvent === 11) {
                    Injured();
                } else if (randomEvent === 12 || randomEvent === 13) {
                    Ambushed();
                } else if (randomEvent >= 14 && randomEvent <= 20) {
                    EncounterMonster();
                }

                ScrollToBottom();

                // Schedule the next event if there are more than 2 tributes alive
                scheduleEvent();
            }, delay);
        }

        // Start scheduling events
        scheduleEvent();
    }

    function NukeTributes(){
        for (let i = 0; i < aliveTributes.length - 2; i++){
            aliveTributes.pop();
        }
    }

    // prepare 2 tributes for combat and call CombatTributes to start the combat
    function Combat(delay, isStart, isEndGame = false){ // delay is the time in seconds before the combat starts, isStart is a boolean to check if it's the start of the game
        setTimeout(function () {
            let tribute1 = ReturnTribute("combat");
            let tribute2 = ReturnTribute("combat");

            if (aliveTributes.length > 2) { // if there are more than 2 tributes alive, make sure the tributes are not the same
                while (tribute1 === tribute2) {
                    tribute2 = ReturnTribute("combat"); // pick a different tribute if the tributes are the same
                }
            } else if (aliveTributes.length === 2) { // if there are only 2 tributes alive, pick them both
                const [tribute1, tribute2] = aliveTributes;
                FinalBattle(tribute1, tribute2);
            }

            if (aliveTributes.length > 3) { // if there are more than 3 tributes alive, make same district battles less likely
                while (tribute1.district === tribute2.district) { // check if the tributes are from the same district
                    if (ReturnRandomNumber(1, 6) === 1) break; // 1 in 6 chance to allow same district battles
                    tribute2 = ReturnTribute("combat"); // 5 in 6 chance to try to pick a different tribute
                }
            }

            CombatTributes(tribute1, tribute2, isStart, isEndGame); // start the combat with the prepared tributes
            CheckToRemoveTributesFromList(); // check if the tributes are dead and remove them from the aliveTributes array if missed
        }, delay);
    }

    function FinalBattle(tribute1, tribute2) {
        console.log(`⚔️ Final battle between ${tribute1.name} and ${tribute2.name} begins!`);

        // Show the initial start of the final battle, only once before the fight begins
        $("#eventLog").append(`<li class="log Announcement"><div>The final battle has started!</div></li>`);

        // Show the initial encounter message once
        $("#eventLog").append(`<li class='log Announcement'><div>${tribute1.name} and ${tribute2.name} face off in the final battle!</div></li>`);

        let attacker = Math.random() < 0.5 ? tribute1 : tribute2;
        let defender = attacker === tribute1 ? tribute2 : tribute1;
        let round = 1;

        // Use setInterval to simulate the rounds of the final battle
        const fightInterval = setInterval(() => {
            if (!attacker.isAlive || !defender.isAlive) {
                clearInterval(fightInterval);

                // Determine the winner and loser
                let winner = attacker.isAlive ? attacker : defender;
                let loser = !attacker.isAlive ? attacker : defender;

                // Record the death and add kill count
                winner.AddKill(loser);
                winner.killedTributes.push(loser.name);
                loser.causeOfDeath = `Killed by ${winner.name} [${winner.district}] in the final battle`;
                HandleDeath(loser);

                // Now that the battle is over, append the final winner and loser info
                $("#eventLog").append(`<li class='log gold'><div>${loser.name} [${loser.district}] was slain by ${winner.name} [${winner.district}] in round ${round} of the final battle.</div><div>${winner.name} from district ${winner.district} wins the Hunger Games!</div></li>`);
                $("#eventLog").append(`<li id="seeTributes" class="col-12 finish">SEE TRIBUTES</li>`);
                ScrollToBottom();  // Scroll to bottom of log once final battle is finished
                return;
            }

            // If the battle is still ongoing, calculate damage for this round
            let randomMaxDmg = ReturnRandomNumber(10, 20);
            const damage = Math.round(Math.max(randomMaxDmg, CalculateDamage(attacker) / 3)); // damage = calculated dmg / 3 with a minum of randomMaxDmg
            const result = defender.DoDamage(damage);

            // Log the damage dealt in the current round
            $("#eventLog").append(
                `<li class='log'><div>Round ${round}: ${attacker.name} [${attacker.district}] hits ${defender.name} [${defender.district}] for ${damage} HP damage${result.medKitUsed ? ", who uses a medkit and healed 40 HP!" : "!"} They now have ${defender.hp} HP.</div></li>`
            );
            ScrollToBottom();  // Scroll to bottom to keep log updated

            // Swap attacker and defender for the next round
            [attacker, defender] = [defender, attacker];
            round++;  // Increment round number for the next attack
        }, 1500); // time between attack rounds
    }

    function FellInTrap() {
        let randomForWhichTrap = ReturnRandomNumber(1, 3); // pick a random number between 1 and 3 to determine which trap the tribute fell into
        let trappedTribute = ReturnTribute("fellInTrap"); // pick a tribute to fall into the trap
        let trapSetter = ReturnTribute("trapSetter"); // pick a tribute that set the trap
        if (randomForWhichTrap === 1 || randomForWhichTrap === 2) { // 2/3 chance to take damage
            let trapDamage = ReturnRandomNumber(25, 60); // generate a random number between 25 and 60 for the trap damage
            HandleDamage(trappedTribute, trapDamage); // handle the damage
            if (!trappedTribute.isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${trappedTribute.name} [${trappedTribute.district}] fell into ${trapSetter.name} [${trapSetter.district}]'s trap and took ${trapDamage} damage. ${trappedTribute.name} died.</div></li>`);
                trapSetter.AddKill(trappedTribute); // award a kill to the trap setter and store the killed tribute
                trappedTribute.causeOfDeath = `trap by ${trapSetter.name} [${trapSetter.district}]`; // set the cause of death
                HandleDeath(trappedTribute); // handle death of the tribute
            } else {
                $("ul").append(`<li class="log"><div>${trappedTribute.name} [${trappedTribute.district}] fell into ${trapSetter.name} [${trapSetter.district}]'s trap and took ${trapDamage} damage. They now have ${trappedTribute.hp} HP.</div></li>`);
            }
        } else if (randomForWhichTrap === 3) { // 1/3 chance to die instantly
            $("ul").append(`<li class="log"><div class="bold">${trappedTribute.name} [${trappedTribute.district}] fell into ${trapSetter.name} [${trapSetter.district}]'s trap and died instantly.</div></li>`);
            trapSetter.AddKill(trappedTribute); // award a kill to the trap setter and store the killed tribute
            trappedTribute.causeOfDeath = `trap by ${trapSetter.name} [${trapSetter.district}]`; // set the cause of death
            HandleDeath(trappedTribute); // handle death of the tribute
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
                        (survival * 1.1);
                    break;
                case "combat":
                    weight =
                        (risk * 1.7) +
                        (combat * 1.2) +
                        (speed * 0.35) -
                        (luck * 0.2) -
                        (survival * 0.3);
                    break;
                case "fellInTrap":
                    weight =
                        (risk * 1.2) -
                        (luck * 0.2) -
                        (speed * 0.3) -
                        (intelligence * 0.4) -
                        (survival * 0.4);
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
                        (risk * 1.15) -
                        (luck * 0.2) -
                        (survival * 0.35) -
                        (combat * 0.25) -
                        (speed * 0.3);
                    break;
                case "poisonedFood":
                    weight =
                        (risk * 1.15) -
                        (luck * 0.2) -
                        (survival * 0.4);
                    break;
                case "ateFood":
                    weight =
                        (luck * 1.2) +
                        (survival * 1.4) +
                        (risk * 1.2);
                        break;
                case "trainedPower":
                    weight =
                        (luck * 1.2) +
                        (risk * 1.3) +
                        (intelligence * 1.25) +
                        (survival * 1.2) -
                        (power * 0.5);
                    break;
                case "trainedCombatSkills":
                    weight =
                        (luck * 1.2) +
                        (risk * 1.3) +
                        (intelligence * 1.25) +
                        (survival * 1.2) -
                        (combat * 0.5);
                    break;
                case "trainedSpeed":
                    weight =
                        (luck * 1.2) +
                        (risk * 1.3) +
                        (intelligence * 1.25) +
                        (survival * 1.2) -
                        (speed * 0.5);
                        break;
                case "injured":
                    weight =
                        (risk * 1.2) -
                        (luck * 0.2) -
                        (survival * 0.3) -
                        (intelligence * 0.15);
                    break;
                case "ambushed":
                    weight =
                        (risk * 1.2) -
                        (luck * 0.2) -
                        (speed * 0.3) -
                        (combat * 0.25) -
                        (survival * 0.3);
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
                case "sparedTribute":
                    weight =
                        (popularity * 1.5) +
                        (risk * 1.2) +
                        (luck * 1.3);
                    break;
                case "rested":
                    weight =
                        (intelligence * 1.2) +
                        (risk * 1.5) +
                        (luck * 1.15) +
                        (survival * 1.25);
                    break;
                case "attackedRester":
                    weight =
                        (luck * 1.2) +
                        (risk * 1.25) +
                        (survival * 1.2);
                    break;
                case "cheater":
                    weight =
                        (risk * 1.3) -
                        (luck * 0.2);
                    break;
                case "monsterEncounter":
                    weight =
                        (risk * 1.2) -
                        (luck * 0.2) -
                        (speed * 0.3) -
                        (survival * 0.3);
                    break;
                case "lightning":
                    weight =
                        (risk * 1.2) -
                        (luck * 0.25) -
                        (survival * 0.35) -
                        (speed * 0.3);
                        break;
                case "dream":
                    weight =
                        (risk * 1.2) + // plus here since intelligence should RAISE chance but only a tiny bit
                        (intelligence * 0.2) -
                        (luck * 0.2) -
                        (survival * 0.25);
                        break;
                case "steppedOfPlate":
                    weight =
                        (risk * 1.2) + // plus here since speed should RAISE chance but only a tiny bit
                        (speed * 0.2) -
                        (intelligence * 0.4) -
                        (luck * 0.2);
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
        if (tribute.DoDamage(damage).medKitUsed){ // apply the damage and check if a medkit was used
            if(tribute.isAlive){ // verify the tribute is still alive
                $("ul").append(`<li class="log"><div>${tribute.name} [${tribute.district}] used a medkit and healed 40 HP during the next encounter.</div></li>`);
            }
        }
    }

    function HandleHeal(tribute, healAmount) {
        if (parseInt(tribute.hp) + healAmount > 100) { // if the tribute's hp is higher than max after healing, set the tribute's hp to max
            tribute.hp = 100;
        } else { // if the tribute's hp is lower than max, heal the tribute for the heal amount
            newHp = parseInt(tribute.hp) + healAmount; // calculate the new hp
            tribute.hp = newHp; // set the tribute's hp to the new hp
        }

    }

    function HandleDeath(tribute){
        if(tribute.isAlive){
            tribute.KillTribute();
        }
        RemoveTributeFromAliveList(tribute); // if the tribute is dead, remove it from the aliveTributes array
        PlayKillSound(); // play the canon sound
    }

    function HandleEarthquake(damage, causeOfDeathMessage){
        for (let i = 0; i < aliveTributes.length; i++) {
            HandleDamage(aliveTributes[i], damage);
            if (!aliveTributes[i].isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${aliveTributes[i].name} [${aliveTributes[i].district}] died from the earthquake.</div></li>`);
                aliveTributes[i].causeOfDeath = `${causeOfDeathMessage}`;
                HandleDeath(aliveTributes[i]);
            }
        }

        if (aliveTributes.length === 0) {
            $("ul").append(`<li class="log Announcement"><div>All tributes died; there is no winner this edition!</div></li>`);
            $("ul").append(`<li id="seeTributes" class="col-12">SEE TRIBUTES</li>`);
            return;
        }
    }

    function CombatTributes(tribute1, tribute2, isStartOfGame = false, isEndGame = false) { // possibly add escaping later?
        if (tribute1.isAlive && tribute2.isAlive) { // check if both tributes are alive
            let damageMode;
            if (isStartOfGame == true) { // if it's the start of the game, also handle chance to find items to simulate bloodbath
                damageMode = ReturnRandomNumber(1, 7);
            } else if (isEndGame == true){
                damageMode = ReturnRandomNumber(3, 4);
            } else {
                damageMode = ReturnRandomNumber(1, 5);
            }

            if (damageMode === 1 || damageMode === 2) { // make both tributes do damage to each other
                let damageToTribute1 = CalculateDamage(tribute2);
                let damageToTribute2 = CalculateDamage(tribute1);

                HandleDamage(tribute1, damageToTribute1);
                HandleDamage(tribute2, damageToTribute2);

                if (tribute1.isAlive === false && tribute2.isAlive === true) { // if tribute1 is dead and tribute2 is alive
                    $("ul").append(`<li class="log"><div>${tribute1.name} [${tribute1.district}] attacks ${tribute2.name} [${tribute2.district}] for ${damageToTribute2} damage. ${tribute2.name} now has ${tribute2.hp} HP.</div><div class="bold">${tribute2.name} [${tribute2.district}] attacks ${tribute1.name} [${tribute1.district}] for ${damageToTribute1} damage. ${tribute1.name} died.</div></li>`);
                    tribute2.AddKill(tribute1); // award a kill to tribute2 and store the killed tribute
                    tribute1.causeOfDeath = `killed by ${tribute2.name} [${tribute2.district}]`; // set the cause of death
                    HandleDeath(tribute1); // handle death of tribute1
                } else if (tribute1.isAlive === true && tribute2.isAlive === false) { // if tribute1 is alive and tribute2 is dead
                    $("ul").append(`<li class="log"><div class="bold">${tribute1.name} [${tribute1.district}] attacks ${tribute2.name} [${tribute2.district}] for ${damageToTribute2} damage. ${tribute2.name} died.</div><div>${tribute2.name} [${tribute2.district}] attacks ${tribute1.name} [${tribute1.district}] for ${damageToTribute1} damage. ${tribute1.name} now has ${tribute1.hp} HP.</div></li>`);
                    tribute1.AddKill(tribute2); // award a kill to tribute1
                    tribute2.causeOfDeath = `killed by ${tribute1.name}`; // set the cause of death
                    HandleDeath(tribute2); // handle death of tribute2
                } else if (tribute1.isAlive === true && tribute2.isAlive === true) { // if both tributes are alive
                    $("ul").append(`<li class="log"><div>${tribute1.name} [${tribute1.district}] attacks ${tribute2.name} [${tribute2.district}] for ${damageToTribute2} damage. ${tribute2.name} now has ${tribute2.hp} HP.</div><div>${tribute2.name} [${tribute2.district}] attacks ${tribute1.name} [${tribute1.district}] for ${damageToTribute1} damage. ${tribute1.name} now has ${tribute1.hp} HP.</div></li>`);
                } else { // if both tributes are dead
                    $("ul").append(`<li class="log"><div class="bold">${tribute1.name} [${tribute1.district}] attacks ${tribute2.name} [${tribute2.district}] for ${damageToTribute2} damage. ${tribute2.name} died.</div><div class="bold">${tribute2.name} [${tribute2.district}] attacks ${tribute1.name} [${tribute1.district}] for ${damageToTribute1} damage. ${tribute1.name} died.</div></li>`);
                    tribute1.AddKill(tribute2); // award a kill to tribute1 and store the killed tribute
                    tribute2.AddKill(tribute1); // award a kill to tribute2 and store the killed tribute
                    tribute1.causeOfDeath = `killed by ${tribute2.name} [${tribute2.district}]`; // set the cause of death
                    tribute2.causeOfDeath = `killed by ${tribute1.name} [${tribute1.district}]`; // set the cause of death
                    HandleDeath(tribute1); // handle death of tribute1
                    HandleDeath(tribute2); // handle death of tribute2
                    setTimeout(function () {
                        PlayKillSound(); // play it again after short delay to make sure 2 canon shots can be heard
                    }, 750);
                }
            } else if (damageMode === 3) { // make 1 tribute do damage to another tribute
                let damageTo = Math.random() < 0.5 ? tribute1 : tribute2; // pick a random tribute to take damage
                let attacker = damageTo === tribute1 ? tribute2 : tribute1; // pick the other tribute as the attacker
                let damage = CalculateDamage(attacker); // calculate the damage of the attacker
                HandleDamage(damageTo, damage); // handle the damage of the tribute that takes damage
                if (damageTo.isAlive === false) { // if the tribute that took damage is dead
                    $("ul").append(`<li class="log"><div class="bold">${attacker.name} [${attacker.district}] attacks ${damageTo.name} [${damageTo.district}] for ${damage} damage. ${damageTo.name} has died.</li></div>`);
                    attacker.AddKill(damageTo); // award a kill to the attacker and store the killed tribute
                    damageTo.causeOfDeath = `killed by ${attacker.name}`; // set the cause of death
                    HandleDeath(damageTo); // handle death of the tribute that died
                } else { // if the tribute that took damage is alive
                    $("ul").append(`<li class="log"><div>${attacker.name} [${attacker.district}] attacks ${damageTo.name} [${damageTo.district}] for ${damage} damage. ${damageTo.name} now has ${damageTo.hp} HP.</li></div>`);
                }
            } else if (damageMode === 4) { // 1 tribute gets killed instantly by the other
                let victim = Math.random() < 0.5 ? tribute1 : tribute2; // pick a random tribute to be the victim
                let killer = victim === tribute1 ? tribute2 : tribute1; // pick the other tribute as the killer
                killer.AddKill(victim); // award a kill to the killer and store the killed tribute
                victim.causeOfDeath = `killed by ${killer.name} [${killer.district}]`; // set the cause of death
                HandleDeath(victim); // handle death of the victim
                $("ul").append(`<li class="log"><div class="bold">${victim.name} [${victim.district}] has been killed instantly by ${killer.name} [${killer.district}]!</div></li>`);
            } else if (damageMode === 5) { // make 2 tributes fight until 1 dies
                let fightLog = `<li class="log">`;
                while (tribute1.isAlive === true && tribute2.isAlive === true) { // as long as both tributes are alive, make them fight
                    let damageToTribute1 = CalculateDamage(tribute2); // calculate damage of tribute2
                    let damageToTribute2 = CalculateDamage(tribute1); // calculate damage of tribute1

                    HandleDamage(tribute1, damageToTribute1); // handle damage done to tribute1
                    HandleDamage(tribute2, damageToTribute2);  // handle damage done to tribute2
                    fightLog += `<div>${tribute1.name} [${tribute1.district}] attacks ${tribute2.name} [${tribute2.district}] for ${damageToTribute2} damage. ${tribute2.name} now has ${tribute2.hp} HP.</div>`;
                    fightLog += `<div>${tribute2.name} [${tribute2.district}] attacks ${tribute1.name} [${tribute1.district}] for ${damageToTribute1} damage. ${tribute1.name} now has ${tribute1.hp} HP.</div>`;
                }
                if (!tribute1.isAlive) { // if tribute1 is dead
                    tribute2.AddKill(tribute1); // award a kill to tribute2 and store the killed tribute
                    fightLog += `<div class="bold">${tribute1.name} [${tribute1.district}] was killed by ${tribute2.name} [${tribute2.district}]!</div>`;
                    tribute1.causeOfDeath = `killed by ${tribute2.name} [${tribute2.district}]`; // set the cause of death
                    HandleDeath(tribute1); // handle death of tribute1
                }
                if (!tribute2.isAlive) { // if tribute2 is dead
                    tribute1.AddKill(tribute2); // award a kill to tribute1
                    fightLog += `<div class="bold">${tribute2.name} [${tribute2.district}] was killed by ${tribute1.name} [${tribute1.district}]!</div>`;
                    tribute2.causeOfDeath = `killed by ${tribute1.name} [${tribute1.district}]`; // set the cause of death
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

    function PlayKillSound() {
        const canonInstance = canonAudio.cloneNode(); // make a new copy
        canonInstance.volume = canonAudio.volume;     // optional: inherit volume
        canonInstance.play().catch(e => console.warn("Audio play failed:", e));
    }

    function AnimalAttack() {
        let chosenTribute = ReturnTribute("animalAttack");
        let animalDamage = ReturnRandomNumber(25, 65);
        let random = ReturnRandomNumber(1, 10);

        function ApplyDamage() {
            HandleDamage(chosenTribute, animalDamage);
            if (chosenTribute.isAlive === false) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals and died.</div></li>`);
                HandleDeath(chosenTribute);
                chosenTribute.causeOfDeath = `killed by wild animals`; // set the cause of death
            } else {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals and took ${animalDamage} damage. ${chosenTribute.name} now has ${chosenTribute.hp} HP.</div></li>`);
            }
        }

        if (random === 1) { // 1/10 chance to take damage
            ApplyDamage();
        } else if (random === 2) { // 1/10 chance take no damage
            $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals but managed to escape.</div></li>`);
        } else if (random === 3) { // 1/10 chance to die instantly
            $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals and died instantly!</div></li>`);
            chosenTribute.causeOfDeath = `killed by wild animals`;
            HandleDeath(chosenTribute);
        } else if (random >= 4 && random <= 10) { // 7/10 chance for stat check
            if (chosenTribute.power >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals but managed to fight them off.</div></li>`);
            } else if (chosenTribute.speed >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals but managed to escape.</div></li>`);
            } else if (chosenTribute.survivalSkills >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals but managed to hide.</div></li>`);
            } else if (chosenTribute.intelligence >= 8) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by a pack of wild animals but managed to trick them.</div></li>`);
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
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a sword.</li></div>`);
                    chosenTribute.weapon = "sword";
                } else if (chosenTribute.weapon === "sword") { // if the tribute already has a sword, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a sword but already has one.</li></div>`);
                } else if (chosenTribute.weapon === "bow" || chosenTribute.weapon === "knife") { // if the tribute has a bow or knife, upgrade to sword
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a sword and upgraded their weapon.</li></div>`);
                    chosenTribute.weapon = "sword";
                } else { //should never happen | otherwise, give a sword and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a sword.</li></div>`);
                    chosenTribute.weapon = "sword";
                    throw new Error("Error: Giving sword almost failed.");
                }
                break;
            case 2: // try to give a bow
                // when chosenTribute has no weapon, try giving a bow first
                // (could be chosenTribute.weapon == "none" but this is to avoid undefined)
                if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a bow.</li></div>`);
                    chosenTribute.weapon = "bow";
                } else if (chosenTribute.weapon === "bow") { // if tribute already has a bow, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a bow but already has one.</li></div>`);
                } else if (chosenTribute.weapon === "sword") { // if the tribute has a sword, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a bow but already has a better weapon.</li></div>`);
                } else if (chosenTribute.weapon === "knife") { // if the tribute has a knife, upgrade to bow
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a bow and upgraded their weapon.</li></div>`);
                    chosenTribute.weapon = "bow";
                } else { // should never happen | otherwise, give a bow and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a bow.</li></div>`);
                    chosenTribute.weapon = "bow";
                    throw new Error("Error: Giving bow almost failed.");
                }
                break;
            case 3: // try to give a knife
                // when chosenTribute has no weapon, try giving a knife first
                // (could be chosenTribute.weapon == "none" but this is to avoid undefined)
                if (chosenTribute.weapon != "sword" && chosenTribute.weapon != "bow" && chosenTribute.weapon != "knife") {
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a knife.</li></div>`);
                    chosenTribute.weapon = "knife";
                } else if (chosenTribute.weapon === "sword" || chosenTribute.weapon == "bow") { // if the tribute has a sword or bow, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a knife but already has a better weapon.</li></div>`);
                } else if (chosenTribute.weapon === "knife") { // if the tribute already has a knife, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a knife but already has one.</li></div>`);
                } else { // should never happen | otherwise, give a knife and throw an error
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up a knife.</li></div>`);
                    chosenTribute.weapon = "bow";
                    throw new Error("Error: Giving knife almost failed.");
                }
                break;
            case 4: // higher chance to give a medkit
            case 5:
                if(chosenTribute.medKits == 0){ // if the tribute has no medkits, give 1 or 2 (random)
                    let amountOfMedkits = Math.floor(Math.random() * 2) + 1;
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up ${amountOfMedkits} medkit(s).</li></div>`);
                    chosenTribute.FindMedKit(amountOfMedkits);
                } else if(chosenTribute.medKits == 1){ // if the tribute has 1 medkit, give 1
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up 1 medkit.</li></div>`);
                    chosenTribute.FindMedKit(1);
                } else{ // if the tribute already has 2 medkits, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found a medkit but already has 2.</li></div>`);
                }
                break;
            case 6: // higher chance to give armor
            case 7:
                if(chosenTribute.hasArmor === "yes"){ // if the tribute has armor, give nothing
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] found armor but already has one.</li></div>`);
                } else{ // if the tribute has no armor, give 1
                    $("ul").append(`<div class="log"><li>${chosenTribute.name} [${chosenTribute.district}] picked up armor.</li></div>`);
                    chosenTribute.FindArmor();
                }
                break;
        }
    }

    function AteFood() {
        let chosenTribute = ReturnTribute("ateFood");
        let hpDifference = ReturnRandomNumber(10, 40);
        let random = ReturnRandomNumber(1, 5);

        function AtePoisonedFood(tribute) {
            HandleDamage(tribute, hpDifference);
            if (!tribute.isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${tribute.name} [${tribute.district}] ate poisoned food and died.</div></li>`);
                tribute.causeOfDeath = `poisoned food`; // set the cause of death
                HandleDeath(tribute); // handle death of the tribute
            } else {
                $("ul").append(`<li class="log"><div>${tribute.name} [${tribute.district}] ate poisoned food and took ${hpDifference} damage. They now have ${tribute.hp} HP.</div></li>`);
            }
        }

        if(random === 1){ // 1/5 chance to take damage from poisoned food
            let poisonedTribute = ReturnTribute("poisonedFood"); // pick a tribute to eat poisoned food
            AtePoisonedFood(poisonedTribute);
        } else if(random === 2 || random === 3){ // 2/5 chance to take eat healthy food and heal
            $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] ate healthy food and healed ${hpDifference} HP. They now have ${chosenTribute.hp} HP.</div></li>`);
            HandleHeal(chosenTribute, hpDifference);
        } else{ // 2/5 chance for stat check
            if(chosenTribute.survivalSkills >= 7){ // if the tribute has high survival skills, they wil find healthy food
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] found food and healed ${hpDifference} HP. They now have ${chosenTribute.hp} HP.</div></li>`);
                HandleHeal(chosenTribute, hpDifference);
            } else{ // if the tribute fails the survival skills check, they will eat poisoned food
                HandleDamage(chosenTribute, hpDifference);
                if (!chosenTribute.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] ate poisoned food and died.</div></li>`);
                    chosenTribute.causeOfDeath = `poisoned food`; // set the cause of death
                    HandleDeath(chosenTribute); // handle death of the tribute
                } else {
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] found food but it was poisoned. They now have ${chosenTribute.hp} HP.</div></li>`);
                }
            }
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
                let randomMedkit = ReturnRandomNumber(1, 2);
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                chosenTribute.FindMedKit(randomMedkit);
            } else if (chosenTribute.medKits == 1) { // if the tribute has 1 medkit, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a medkit from a sponsor.</div></li>`);
                chosenTribute.FindMedKit(1);
            } else { // if the tribute has 2 medkits, try to give armor
                if (chosenTribute.hasArmor === "no") { // if the tribute has no armor, give 1
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received armor from a sponsor.</div></li>`);
                    chosenTribute.FindArmor(1);
                } else if (chosenTribute.weapon != "sword") { // if the tribute has medkits and armor, try to give a sword
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a sword from a sponsor.</div></li>`);
                    chosenTribute.weapon = "sword";
                } else { // if the tribute has medkits, armor and a sword, try to give intelligence
                    if (chosenTribute.intelligence < 10) {
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received some knowledge about the arena from a sponsor. (+1 intelligence)</div></li>`);
                        let newIntelligence = parseInt(chosenTribute.intelligence) + 1;
                        chosenTribute.intelligence = newIntelligence;
                    } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                        SponsorGift(attempts + 1);
                    }
                }
            }
        } else if (gift === 4 || gift === 4) { // higher chance to get armor
            if (chosenTribute.hasArmor === "no") { // if the tribute has no armor, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received armor from a sponsor.</div></li>`);
                chosenTribute.FindArmor();
            } else if (chosenTribute.medKits != 2) { // if the tribute has armor, try to give a medkit
                if (chosenTribute.medKits != 2) { // check if the tribute doesn't have 2 medkits
                    if (chosenTribute.medKits == 0) { // if the tribute has no medkits, give 1 or 2
                        let randomMedkit = Math.floor(Math.random() * 2) + 1;
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                        chosenTribute.FindMedKit(randomMedkit);
                    } else { // if the tribute has 1 medkit, give 1
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a medkit from a sponsor.</div></li>`);
                        chosenTribute.FindMedKit(1);
                    }
                }
            } else if (chosenTribute.weapon != "sword") { // if the tribute has armor and medkits, try to give a sword
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a sword from a sponsor.</div></li>`);
                chosenTribute.weapon = "sword";
            } else { // if the tribute has armor, medkits and a sword, try to give intelligence
                if (chosenTribute.intelligence < 10) { // check if the tribute doesn't have max intelligence
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received some knowledge about the arena from a sponsor. (+1 intelligence)</div></li>`);
                    let newIntelligence = parseInt(chosenTribute.intelligence) + 1;
                    chosenTribute.intelligence = newIntelligence;
                } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                    SponsorGift(attempts + 1);
                }
            }
        } else if (gift === 5) { // lower chance to get a sword
            if (chosenTribute.weapon != "sword") { // if the tribute doesn't have a sword, give 1
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a sword from a sponsor.</div></li>`);
                chosenTribute.weapon = "sword";
            } else if (chosenTribute.medKits != 2) { // if the tribute has a sword, try to give a medkit
                if (chosenTribute.medKits == 0) { // if the tribute has no medkits, give 1 or 2
                    let randomMedkit = Math.floor(Math.random() * 2) + 1;
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received ${randomMedkit} medkit(s) from a sponsor.</div></li>`);
                    chosenTribute.FindMedKit(randomMedkit);
                } else { // if the tribute has 1 medkit, give 1
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received a medkit from a sponsor.</div></li>`);
                    chosenTribute.FindMedKit(1);
                }
            } else if (chosenTribute.hasArmor === "no") { // if the tribute has a sword and medkits, try to give armor
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received armor from a sponsor.</div></li>`);
                chosenTribute.FindArmor(1);
            } else { // if the tribute has a sword, medkits and armor, try to give intelligence
                if (chosenTribute.intelligence < 10) { // check if the tribute doesn't have max intelligence
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] received some knowledge about the arena from a sponsor. (+1 intelligence)</li></div>`);
                    let newIntelligence = parseInt(chosenTribute.intelligence) + 1;
                    chosenTribute.intelligence = newIntelligence;
                } else { // if the tribute has max intelligence, medkits, armor and a sword, recall the function to give a different gift to a different tribute
                    SponsorGift(attempts + 1);
                }
            }
        }
    }

    function Trained(counter = 0) {
        if (counter > 200) {// if it's likely (after trying over 200 times) every tribute has maxed out their stats, stop the function
            let earthquakeDamage = ReturnRandomNumber(10, 25);
            $("ul").append(`<li class="log"><div>A small earthquake hit the arena, all tributes lose ${earthquakeDamage} HP.</div></li>`);
            HandleEarthquake(earthquakeDamage, "small eartquake");
        }

        let random = ReturnRandomNumber(1, 3);

        if (random === 1) { // 50% chance to train power
            let chosenTribute = ReturnTribute("trainedPower");
            if (chosenTribute.power < 10) { // if tribute has less than 10 power, give +1 power
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else if (chosenTribute.speed < 10) { // if tribute has less than 10 speed, give +1 speed
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 speed.</div></li>`);
                let newSpeed = parseInt(chosenTribute.speed) + 1;
                chosenTribute.speed = newSpeed;
            } else if (chosenTribute.combatSkills < 10) { // if tribute has less than 10 combat skills, give +1 combat skills
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else { // if the tribute has 10 power, speed and combat skills, try to train again
                Trained(counter + 1);
                return; // prevent continuing with this run after recursion
            }
        } else if (random === 2) { // 50% chance to train speed
            let chosenTribute = ReturnTribute("trainedSpeed");
            if (chosenTribute.speed < 10) { // if tribute has less than 10 speed, give +1 speed
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 speed.</div></li>`);
                let newSpeed = parseInt(chosenTribute.speed) + 1;
                chosenTribute.speed = newSpeed;
            } else if (chosenTribute.combatSkills < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else if (chosenTribute.power < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else {
                Trained(counter + 1);
                return; // prevent continuing with this run after recursion
            }
        } else if (random === 3) { // 50% chance to train combat skills
            let chosenTribute = ReturnTribute("trainedCombatSkills");
            if (chosenTribute.combatSkills < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 combat skills.</div></li>`);
                let newCombatSkills = parseInt(chosenTribute.combatSkills) + 1;
                chosenTribute.combatSkills = newCombatSkills;
            } else if (chosenTribute.power < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 power.</div></li>`);
                let newPower = parseInt(chosenTribute.power) + 1;
                chosenTribute.power = newPower;
            } else if (chosenTribute.speed < 10) {
                $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] trained and got +1 speed.</div></li>`);
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
            $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] got injured and died to their injuries.</div></li>`);
            chosenTribute.causeOfDeath = `injuries`; // set the cause of death
            HandleDeath(chosenTribute);
        } else {
            $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] got injured and took ${injuryDamage} damage. They now have ${chosenTribute.hp} HP.</div></li>`);
        }
    }

    function Ambushed(){
        let ambushedTribute = ReturnTribute("ambushed");
        let ambusher = ReturnTribute("ambusher");
        let ambusherDamage = CalculateDamage(ambusher);
        let ambushedDamage = CalculateDamage(ambushedTribute);
        let random = ReturnRandomNumber(1, 8);

        function TakeDamage(damageTaker, damage, damageGiver) {
            HandleDamage(damageTaker, damage);

            if (!damageTaker.isAlive) { // check if the tribute is dead
                damageGiver.AddKill(damageTaker); // award a kill to the killer and store the killed tribute
                HandleDeath(damageTaker); // handle death of the tribute that died
            }
        }

        if (random === 1 || random === 2) { // 2/8 chance to take damage
            TakeDamage(ambushedTribute, ambusherDamage, ambusher); // apply damage to the ambushed tribute
            if (!ambushedTribute.isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] and died.</div></li>`);
                ambushedTribute.causeOfDeath = `ambushed by ${ambusher.name} [${ambusher.district}]`; // set the cause of death
                HandleDeath(ambushedTribute); // handle death of the tribute that died
                ambusher.AddKill(ambushedTribute); // award a kill to the killer and store the killed tribute
            } else {
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] and took ${ambusherDamage} damage. ${ambushedTribute.name} now has ${ambushedTribute.hp} HP.</div></li>`);
            }
        } else if (random === 3) { // 1/8 chance take no damage
            $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but managed to escape.</div></li>`);
        } else if (random === 4 || random === 5) { // 2/8 chance to to do stat check
            if (ambushedTribute.survivalSkills >= 8){ // if the ambushed tribute has passes the survival skills check, do nothing
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but managed to hide.</div></li>`);
            } else if (ambushedTribute.speed >= 8){ // if the ambushed tribute passes the speed check, do nothing
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but managed to run away.</div></li>`);
            } else if (ambushedTribute.combatSkills >= 8){ // // if the ambushed tribute passes the combat skills check, fight back
                TakeDamage(ambusher, ambushedDamage, ambushedTribute); // apply damage to the ambusher tribute
                if (!ambusher.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but fought back and killed them.</div></li>`);
                    ambusher.causeOfDeath = `failed ambush on ${ambushedTribute.name} [${ambushedTribute.district}]`; // set the cause of death
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but fought back, dealing ${ambushedDamage} damage. ${ambusher.name} now has ${ambusher.hp} HP.</div></li>`);
                }
            }
        } else{ // 3/8 chance to compare stats
            if (ambushedTribute.combatSkills > ambusher.combatSkills) { // if the ambushed tribute has more power than the ambusher
                TakeDamage(ambusher, ambushedDamage, ambushedTribute); // apply damage to the ambusher tribute
                if (!ambusher.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but fought back and killed them.</div></li>`);
                    ambusher.causeOfDeath = `failed ambush on ${ambushedTribute.name} [${ambushedTribute.district}]`; // set the cause of death
                    HandleDeath(ambusher); // handle death of the tribute that died
                    ambushedTribute.AddKill(ambusher); // award a kill to the killer and store the killed tribute
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} but fought back, dealing ${ambushedDamage} damage. ${ambusher.name} now has ${ambusher.hp} HP.</div></li>`);
                }
            } else if (ambushedTribute.speed > ambusher.speed) { // if the ambushed tribute has more speed than the ambusher
                $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] but managed to outrun them.</div></li>`);
            } else { // if the ambushed tribute fails both checks, apply damage
                TakeDamage(ambushedTribute, ambusherDamage, ambusher); // apply damage to the ambushed tribute
                if (!ambushedTribute.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} and died.</div></li>`);
                    ambushedTribute.causeOfDeath = `ambushed by ${ambusher.name} [${ambusher.district}]`; // set the cause of death
                } else {
                    $("ul").append(`<li class="log"><div>${ambushedTribute.name} [${ambushedTribute.district}] was ambushed by ${ambusher.name} [${ambusher.district}] and took ${ambusherDamage} damage. ${ambushedTribute.name} now has ${ambushedTribute.hp} HP.</div></li>`);
                }
            }
        }
    }

    function ShowedMercy(){
        let mercyShower = ReturnTribute("showedMercy");
        let sparedTribute = ReturnTribute("sparedTribute");
        let randomForBackStabbed = ReturnRandomNumber(1, 2);
        let tries = 0;

        while(mercyShower === sparedTribute){
            if(aliveTributes.length > 2){
                sparedTribute = ReturnTribute("sparedTribute");
                if (tries === 200) { // if the code can't find 2 tributes, should never happen
                    $("ul").append(`<li class="log"><div>${mercyShower.name} [${mercyShower.district}] showed mercy to a tribute.`);
                    return;
                }
                tries++;
            } else if(aliveTributes.length === 2){ // should never happen, but in case
                let randomNumber = ReturnRandomNumber(1, 2);
                if(randomNumber - 1 === 0){ // check if number is one
                    mercyShower = aliveTributes[randomNumber];
                    sparedTribute = aliveTributes[randomNumber +1];
                } else{ // if random number is 2
                    mercyShower = aliveTributes[randomNumber];
                    sparedTribute = aliveTributes[randomNumber - 1];
                }
            } else{
                alert("Critical Error: Only 1 tribute left to show mercy!");
                throw new Error("Only one tribute left to show mercy!");
            }
        }

        if (mercyShower.popularity >= 10){ // if the tribute has max popularity
            if (randomForBackStabbed === 1){ // 50% chance to do nothing
                $("ul").append(`<li class="log"><div>${mercyShower.name} [${mercyShower.district}] showed mercy to ${sparedTribute.name} [${sparedTribute.district}].</div></li>`);
            } else{ // 50% chance to be backstabbed
                let damage = sparedTribute.CalculateDamage() / 1.25;
                HandleDamage(mercyShower, damage);
                if (mercyShower.isAlive){
                    $("ul").append(`<li class="log"><div>${mercyShower.name} [${mercyShower.district}] showed mercy to ${sparedTribute.name} [${sparedTribute.district}] but was backstabbed and lost ${damage} HP.</div><div>${mercyShower.name} now has ${mercyShower.hp} HP.</div></li>`);
                } else{
                    $("ul").append(`<li class="log"><div>${mercyShower.name} [${mercyShower.district}] showed mercy to ${sparedTribute.name} [${sparedTribute.district}] but was backstabbed and got killed by ${sparedTribute.name}.</div>></li>`);
                    HandleDeath(mercyShower);
                    mercyShower.causeOfDeath = `showed mercy but backstabbed by ${sparedTribute.name} [${sparedTribute.district}]`
                    sparedTribute.AddKill(mercyShower);
                }
            }
        } else{ // if the tribute has less than 10 popularity, give +1 popularity
            $("ul").append(`<li class="log"><div>${mercyShower.name} [${mercyShower.district}] showed mercy to ${sparedTribute.name} [${sparedTribute.district}] and gained popularity.</div></li>`);
            let newPopularity = parseInt(mercyShower.popularity) + 1;
            mercyShower.popularity = newPopularity;
        }
    }

    function Rested(){
        let rester = ReturnTribute("rested");
        let attacker = ReturnTribute("attackedRester");
        let resterDamage = CalculateDamage(rester);
        let attackerDamage = CalculateDamage(attacker);
        let randomHeal = ReturnRandomNumber(15, 45);
        let random = ReturnRandomNumber(1, 7);
        HandleHeal(rester, randomHeal);

        if(random === 1 || random === 2){ // 2/7 chance to successfully heal
            $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and healed ${randomHeal} HP. They now have ${rester.hp} HP.</div></li>`);
        } else if(random === 3){ // 1/7 chance to get ambushed with guaranteed success
            HandleDamage(rester, attackerDamage); // apply damage to the rester
            if (!rester.isAlive) { // check if the tribute is dead
                $("ul").append(`<li class="log"><div class="bold">${rester.name} [${rester.district}] rested but got ambushed by ${attacker.name} [${attacker.district}] and died.</div></li>`);
                attacker.AddKill(rester); // award a kill to the killer and store the killed tribute
                rester.causeOfDeath = `attacked by ${attacker.name} while resting`; // set the cause of death
                HandleDeath(rester); // handle death of the tribute that died
            } else{
                $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested but got ambushed by ${attacker.name} [${attacker.district}] and lost ${attackerDamage} HP.</div></li>`);
            }
        } else if(random === 4 || random === 5){ // 2/7 chance to get ambushed with a chance to escape
            if(rester.speed >= 8){ // if the tribute passes the speed check, do nothing
                $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] but managed to escape.</div></li>`);
            } else if(rester.survivalSkills >= 8){ // if the tribute passes the survival skills check, do nothing
                $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] but woke up in time to escape.</div></li>`);
            } else{ // if the rester fails both checks, apply damage
                HandleDamage(rester, attackerDamage); // apply damage to the rester
                if (!rester.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${rester.name} [${rester.district}] rested but got ambushed by ${attacker.name} [${attacker.district}] and died.</div></li>`);
                    attacker.AddKill(rester); // award a kill to the killer and store the killed tribute
                    rester.causeOfDeath = `attacked by ${attacker.name} [${attacker.district}] while resting`; // set the cause of death
                    HandleDeath(rester); // handle death of the tribute that died
                } else{
                    $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested but got ambushed by ${attacker.name} [${attacker.district}] and lost ${attackerDamage} HP.</div></li>`);
                }
            }
        } else{ // 2/7 chance to compare stats between the two tributes
            if(rester.survivalSkills > 5 && rester.combatSkills > attacker.combatSkills){ // if the tribute passes a surival check and has more combat skills than the attacker, attack back
                HandleDamage(attacker, resterDamage); // apply damage to the ambusher tribute
                if (!attacker.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} ${attacker.district} but fought back and killed them.</div></li>`);
                    rester.AddKill(attacker); // award a kill to the killer and store the killed tribute
                    attacker.causeOfDeath = `failed attack on resting ${rester.name} [${rester.district}]`; // set the cause of death
                    HandleDeath(attacker); // handle death of the tribute that died
                } else {
                    $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] but fought back, dealing ${attackerDamage} damage. ${attacker.name} [${attacker.district}] now has ${attacker.hp} HP.</div></li>`);
                }
            } else if(rester.speed > attacker.speed){ // if the tribute has more speed than the ambusher, do nothing
                $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] but managed to escape.</div></li>`);
            } else{ // if the tribute fails both checks, apply damage
                HandleDamage(rester, attackerDamage); // apply damage to the ambushed tribute
                if (!rester.isAlive) { // check if the tribute is dead
                    $("ul").append(`<li class="log"><div class="bold">${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] and died.</div></li>`);
                    attacker.AddKill(rester); // award a kill to the killer and store the killed tribute
                    rester.causeOfDeath = `attacked by ${attacker.name} [${attacker.district}]  while resting`; // set the cause of death
                    HandleDeath(rester); // handle death of the tribute that died
                } else{
                    $("ul").append(`<li class="log"><div>${rester.name} [${rester.district}] rested and got ambushed by ${attacker.name} [${attacker.district}] and lost ${attackerDamage} HP.</div></li>`);
                }
            }
        }
    }

    function EncounterMonster(){
        let chosenTribute = ReturnTribute("monsterEncounter");
        let random = ReturnRandomNumber(1, 5);

        switch(random){
            case 1: // 1 / 5 chance to die instantly
                $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] got killed by an end phase monster.</div></li>`);
                chosenTribute.causeOfDeath = `end game monster`;
                HandleDeath(chosenTribute);
                break;
            case 2:
            case 3: // 2 / 5 chance to do stat check
                let randomSmallDamage = ReturnRandomNumber(5, 15);
                if(chosenTribute.speed >= 8){
                    HandleDamage(chosenTribute, randomSmallDamage);
                    if(chosenTribute.isAlive){
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by an end phase monster but escaped. They only lost ${randomSmallDamage} HP.</div></li>`);
                    } else{
                        $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] tried to run but got killed by an end phase monster.</div></li>`);
                        chosenTribute.causeOfDeath = `failed to run from end game monster`;
                        HandleDeath(chosenTribute);
                    }
                } else if (chosenTribute.luck >= 8){
                    HandleDamage(chosenTribute, randomSmallDamage);
                    if (chosenTribute.isAlive) {
                        $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by an end phase monster but succesfully played dead. They only lost ${randomSmallDamage} HP.</div></li>`);
                    } else {
                        $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] tried to play dead but got killed by an end phase monster.</div></li>`);
                        chosenTribute.causeOfDeath = `failed to play death from end game monster`;
                        HandleDeath(chosenTribute);
                    }
                } else{
                    $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] got killed by an end phase monster.</div></li>`);
                    chosenTribute.causeOfDeath = `end game monster`;
                    HandleDeath(chosenTribute);
                }
                break;
            case 4:
            case 5:
                let randomDamage = ReturnRandomNumber(45, 80);
                HandleDamage(chosenTribute, randomDamage);
                if (chosenTribute.isAlive) {
                    $("ul").append(`<li class="log"><div>${chosenTribute.name} [${chosenTribute.district}] was attacked by an end phase monster but survived. They lost ${randomDamage} HP.</div></li>`);
                } else {
                    $("ul").append(`<li class="log"><div class="bold">${chosenTribute.name} [${chosenTribute.district}] was attacked by an end phase monster and died.</div></li>`);
                    chosenTribute.causeOfDeath = `end game monster`;
                    HandleDeath(chosenTribute);
                }
                break;
        }
    }

    // to implement
    function RareRandomEvent() {
        // stepped on a mine
    }

    // to implement
    function SuperRareRandomEvent() {
        let random = ReturnRandomNumber(1, 8);

        switch (random) {
            case 1:
            case 2:
                let cheater = ReturnTribute("cheater");
                $("ul").append(`<li class="log"><div class="bold">${cheater.name} [${cheater.district}] was caught cheating and got killed by the gamemakers!</div></li>`);
                cheater.causeOfDeath = `caught cheating`;
                HandleDeath(cheater);
                break;
            case 3:
            case 4:
                let struckDownTribute = ReturnTribute("lightning");
                $("ul").append(`<li class="log"><div class="bold">${struckDownTribute.name} [${struckDownTribute.district}] was struck by lightning and died!</div></li>`);
                struckDownTribute.causeOfDeath = `struck by lightning`;
                HandleDeath(struckDownTribute);
                break;
            case 5:
            case 6:
                let earthquakeDamage = ReturnRandomNumber(20, 35);
                $("ul").append(`<li class="log"><div>The arena was hit by an eartquake! All tributes lose ${earthquakeDamage} HP.</div></li>`);
                HandleEarthquake(earthquakeDamage, "earthquake");
                break;
            case 7:
                let dreamerTribute = ReturnTribute("dream");
                let randomForDreamCameTrue = ReturnRandomNumber(1, 2);
                dreamer = dreamerTribute;
                if (randomForDreamCameTrue === 1) {
                    dreamCameTrue = true;
                } else {
                    dreamCameTrue = false;
                }
                $("ul").append(`<li class="log"><div>${dreamerTribute.name} [${dreamerTribute.district}] had a weird dream; foretelling their own death.</div></li>`);
                break;
            case 8:
                let weedTribute = ReturnTribute("sponsorGift");
                if (weedTribute.hp != 100) {
                    $("ul").append(`<li class="log"><div>${weedTribute.name} [${weedTribute.district}] received weed from a sponsor and restored all of their HP.</div></li>`);
                    weedTribute.hp = 100;
                } else {
                    if (weedTribute.intelligence != 1) {
                        $("ul").append(`<li class="log"><div>${weedTribute.name} [${weedTribute.district}] received weed from a sponsor and lost 1 intelligence.</div></li>`);
                        let newIntelligence = parseInt(weedTribute.intelligence) - 1;
                        weedTribute.intelligence = newIntelligence;
                    } else {
                        $("ul").append(`<li class="log"><div>${weedTribute.name} [${weedTribute.district}] received weed from a sponsor but decided not to smoke it.</div></li>`);
                    }
                }
        }
    }

    function ScrollToBottom() {
        $("html, body").animate({ scrollTop: $(document).height() }, 300);
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
        if (!canonAudio.unlocked) {
            canonAudio.volume = 0;
            canonAudio.play().then(() => {
                canonAudio.pause();
                canonAudio.currentTime = 0;
                canonAudio.volume = 1;
                canonAudio.unlocked = true; // custom property to track it
            });
        }

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
        let randomEvents = ReturnRandomNumber(3, 14); // how many events will happen this day
        let randomForWhenEndPhase = ReturnRandomNumber(5, 9); // how many tributes need to be alive for the end phase to start
        whichDay += 1;
        $("#eventLog").empty();
        $("#eventLog").append(`<li class="log Announcement"><div>Day ${whichDay} has started!</div></li>`);
        if (dreamer != null){
            let delay = ReturnRandomTimer(true);
            if(dreamCameTrue === true){
                if(dreamer.isAlive){
                    setTimeout(function () {
                        $("#eventLog").append(`<li class='log'><div class="bold">${dreamer.name}'s [${dreamer.district}] dream came true and they died to a hart attack.</div></li>`);
                        HandleDeath(dreamer);
                        dreamer.causeOfDeath = `foresaw their hart attack in a dream`;
                        dreamer = null;
                        dreamCameTrue = null;
                    }, delay);
                } // else (if I want to add a text for if the tribute has died during the day)
            } else {
                setTimeout(function () {
                    $("#eventLog").append(`<li class='log'><div>${dreamer.name}'s [${dreamer.district}] dream didn't come true and they lived (for now).</div></li>`);
                    dreamer = null;
                    dreamCameTrue = null;
                }, delay);
            }
        }

        if (aliveTributes.length > randomForWhenEndPhase) {
            //NukeTributes(); //enable this when a lot of tributes need to die at start for testing purposes
            LogShit(randomEvents, false);
        } else { // end phase
            $("#eventLog").append("<li class='log Announcement'><div>The arena starts shrinking, the end phase has begun!</div></li>");
            LogEndPhase();
        }
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

    $(document).on("click", "#skipIntro", function (){
        if(!skipIntro){
            skipIntro = true;
            $("#skipIntro").text("YES");
        } else{
            skipIntro = false;
            $("#skipIntro").text("NO");
        }
   });

    function FillInData() {
        for (let i = 0; i < 24; i += 2) { // loop trough all tributes (12 districts, 2 tributes each) by looping trough even values of i
            const district = i / 2 + 1; // Convert even value of i (0,2,4,...) to 1,2,3,...
            let maleTribute = allTributes[i];
            let femaleTribute = allTributes[i + 1];

            if (!maleTribute.isAlive) { // if the male tribute is dead, make the image red
                $("#image" + district + "M").attr("src", "images/maleDead.png");
                $("#image" + district + "M").addClass("deadTribute");
                $("#deathCauseField" + district + "M").removeClass("hidden");
                $("#deathCauseField" + district + "M").addClass("showFlex");
            }

            if (!femaleTribute.isAlive) { // if the female tribute is dead, make the image red
                $("#image" + district + "F").attr("src", "images/femaleDead.png");
                $("#image" + district + "F").addClass("deadTribute");
                $("#deathCauseField" + district + "F").removeClass("hidden");
                $("#deathCauseField" + district + "F").addClass("showFlex");
            }

            for (let j = 0; j < fields.length; j++) { // loop through all fields (all info to display)
                let field = fields[j]; // get the current field
                $("#" + field + district + "M").text(maleTribute[field]); // fill in the current male field with the right stat data
                $("#" + field + district + "F").text(femaleTribute[field]); // fill in the current female field with the right stat data
            }

            if(!maleTribute.isAlive && !femaleTribute.isAlive){ // if both tributes are dead, make the district bar red
                $(`#div${district}`).removeClass("halfDeadDistrict");
                $(`#div${district}`).addClass("deadDistrict");
            } else if(!maleTribute.isAlive || !femaleTribute.isAlive){
                $(`#div${district}`).addClass("halfDeadDistrict");
            }
        }
    }

    function ReturnRandomNumber(number1, number2) {
        const min = Math.min(number1, number2);
        const max = Math.max(number1, number2);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function ReturnRandomTimer(shortTimer) {
        if (shortTimer) { // if it's the start of the game, return a random timer between 0.5 and 2 seconds
            return ReturnRandomNumber(500, 2000);
        } else { // if it's not the start of the game, return a random timer between 2.5 and 3.75 seconds
            return ReturnRandomNumber(2500, 3750);
        }
    }
});