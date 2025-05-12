$(document).ready(function() {
    let names = [];
    const fields = [
        "speed", "power", "intelligence", "popularity",
        "risk", "survivalSkills", "combatSkills", "luck"
    ];

    $("#fillInRandomly").on("click", function() {
        for (let i = 1; i <= 12; i++) {
            EnterRandomNames(i, "male");
            EnterRandomNames(i, "female");
            FillInNumberFields(i);
        }
    });

    function EnterRandomNames(index, gender) {
        let firstName;
        
        switch (gender) {
            case "male":
                firstName = ReturnRandomName("maleFirstName");
                break;
            case "female":
                firstName = ReturnRandomName("femaleFirstName");
                break;
        }

        let lastName = ReturnRandomName("lastName");

        for (let i = 0; i < 10; i++) {
            firstName = ReturnRandomName(gender + "FirstName");
            lastName = ReturnRandomName(gender + "lastname");
            if (firstName !== undefined && lastName != undefined) break;
        }

        if (firstName === undefined) { // if after 10 times it's still undefined, throw an error
            alert("ERROR: First name ended up undefined after 10 attempts!");
            throw new Error("ERROR: First name ended up undefined after 10 attempts!");
        }

        if (lastName === undefined) { // if after 10 times it's still undefined, throw an error
            alert("ERROR: Last name ended up undefined after 10 attempts!");
            throw new Error("ERROR: Last name ended up undefined after 10 attempts!");
        }

        const nameInput = $(`#name${index}${gender[0].toUpperCase()}`); // select the input field it should fill with a name
        let name = `${firstName} ${lastName}`;

        // As long as the name already exists, try a name name
        while (names.includes(name)) {
            firstName = ReturnRandomName(gender + "FirstName");
            lastName = ReturnRandomName("lastName");
            name = `${firstName} ${lastName}`;
        }

        // Push the new unique name into the array
        names.push(name);

        // Set the input value if it is empty
        if (nameInput.val() == "") {
            nameInput.val(name);
        }
    }


    function FillInNumberFields(i) {
        for(let j = 0; j < fields.length; j++){ // loop trough the amount of stat fields it should fill in (8)
            let field = fields[j]; // select the name of the field it should currently fill in
            let random1 = Math.floor(Math.random() * 10) + 1;
            let random2 = Math.floor(Math.random() * 10) + 1;

            const maleField = $(`#${field}${i}M`); // select the current male tribute's stat field and store it
            const femaleField = $(`#${field}${i}F`); // select the current female tribute's stat field and store it

            if(maleField.val() == ""){
                maleField.val(random1);
            }
            if(femaleField.val() == ""){
                femaleField.val(random2);
            }
        }
    }

    function ReturnRandomName(whichName){
        const maleFirstNames = [
            "Liam", "Noah", "Aiden", "Lucas", "Mason", "Ethan", "James", "Benjamin", "Elijah", "Alexander",
            "William", "Daniel", "Michael", "Jacob", "Sebastian", "Jack", "Samuel", "David", "Matthew", "Joseph",
            "Isaac", "Matthew", "Henry", "Owen", "Gabriel", "Carter", "Julian", "Luke", "Leo", "Anthony",
            "Grayson", "Jackson", "Myles", "Ryan", "Cameron", "Hunter", "Nathan", "Isaiah", "Thomas", "Andrew",
            "Aaron", "Christopher", "Isaiah", "Cooper", "Lincoln", "Joshua", "Isaac", "Charlie", "Wyatt", "Jameson",
            "Victor", "Leo", "Caden", "Eli", "Miles", "Xander", "Oscar", "Eliot", "Seth", "Luca", "Kai",
            "Kaden", "Dean", "Miles", "Landon", "Harrison", "Theo", "Parker", "Chase", "Benjamin", "Jacob",
            "Elijah", "Joseph", "Logan", "Dylan", "Aidan", "Max", "Kai", "Kaden", "Luke", "Jack", "Carter",
            "Henry", "Isaiah", "Daniel", "Owen", "Gabriel", "Lucas", "Ethan", "David", "Elijah", "Mason",
            "James", "Joseph", "Ryan", "Matthew", "Samuel", "Jacob", "Ethan", "Carter", "Jack", "Eli",
            "Isaac", "Benjamin", "Zachary", "Aaron", "Nathaniel", "Seth", "Jackson", "Nolan", "Elliot", "Lucas",
            "Daniel", "Blake", "Logan", "Connor", "Joseph", "Finn", "Ethan", "Aiden", "Gabriel", "Maximus",
            "Elliott", "Sebastian", "Dylan", "Bennett", "Miles", "Cameron", "Wyatt", "Eli", "Jaden", "Zane",
            "Cole", "Austin", "Brandon", "Mason", "Henry", "Riley", "Eliot", "Christopher", "Zachary", "Ian",
            "Thomas", "Luke", "Cole", "Liam", "Jack", "Mason", "Julian", "Isaiah", "Victor", "Oliver",
            "Ryan", "Carter", "Gavin", "Sebastian", "Maxwell", "Elian", "Reed", "Asher", "Theo", "Jaxon",
            "Benjamin", "Sawyer", "Damian", "Isaiah", "Jesse", "Ezra", "Maverick", "Spencer", "Grayson", "Roman",
            "Tobias", "Zachariah", "Jasper", "Leo", "Hudson", "Elliot", "Dominic", "Beau", "Jackson", "Blake",
            "Finnley", "Ezekiel", "Rhett", "Mason", "Graham", "Brock", "Anderson", "Colton", "Maddox", "Dallas",
            "Jace", "Wesley", "Emmett", "Bennett", "Caleb", "Grayson", "Ethan", "Harrison", "Ryder", "Landon",
            "Brady", "Grant", "Nash", "Chase", "Finley", "Zane", "Milo", "Quinn", "Jace", "Rylan", "Hayden",
            "Jonah", "Kyler", "Maxim", "Tanner", "Maximus", "Oliver", "Preston", "Jaxson", "Paxton", "Zane",
            "Gage", "Emerson", "Beckett", "Graham", "Kieran", "Silas", "Chandler", "Reed", "Maddox", "Bryce",
            "Kellan", "Dante", "Cole", "Brandon", "Oliver", "Luca", "Weston", "Bodhi", "Milo", "Max"
        ];

        const femaleFirstNames = [
            "Emma", "Olivia", "Sophia", "Isabella", "Mia", "Amelia", "Harper", "Evelyn", "Abigail", "Ella",
            "Scarlett", "Aria", "Grace", "Lily", "Chloe", "Layla", "Zoe", "Nora", "Avery", "Hannah",
            "Charlotte", "Lillian", "Eleanor", "Ellie", "Zoey", "Audrey", "Sadie", "Nina", "Stella", "Victoria",
            "Leah", "Addison", "Mackenzie", "Hazel", "Maya", "Lucy", "Caroline", "Ruby", "Samantha", "Eden",
            "Willow", "Anna", "Madeline", "Maya", "Savannah", "Mila", "Eliza", "Lily", "Kennedy", "Chloe",
            "Sophie", "Autumn", "Kaitlyn", "Reagan", "Alice", "Paisley", "Adeline", "Violet", "Brooklyn", "Ivy",
            "Gabriella", "Brooklyn", "Sierra", "Aubrey", "Riley", "Madison", "Ariana", "Ella", "Lila", "Penelope",
            "Jasmine", "Aurora", "Ruby", "Josephine", "Madison", "Sophie", "Arianna", "Maria", "Elise", "Brianna",
            "Kaitlyn", "Hazel", "Sophie", "Landon", "Eve", "Isabella", "Archer", "Samantha", "Caitlyn", "Avery",
            "Leah", "Violet", "Maya", "Ruby", "Norah", "Olivia", "Riley", "Addison", "Eliana", "Lana",
            "Zoey", "Amelia", "Lucy", "Aubrey", "Charlotte", "Lydia", "Tessa", "Olivia", "Mackenzie", "Gianna",
            "Luna", "Caroline", "Quinn", "Ava", "Autumn", "Paisley", "Willa", "Leila", "Piper", "Laila",
            "Aria", "Ella", "Ariana", "Zara", "Natalie", "Holly", "Adeline", "Clara", "Emery", "Sophie",
            "Charlotte", "Tessa", "Blair", "Skylar", "Vivian", "Megan", "Lillian", "Lucia", "Gemma", "Holly",
            "Marley", "Vera", "Maggie", "Allison", "Lydia", "Sarah", "Maya", "Sadie", "Lena", "Bailey",
            "Scarlett", "Layla", "Abigail", "Charlotte", "Emily", "Hazel", "Charlotte", "Isla", "Sierra",
            "Emily", "Clara", "Madeline", "Stella", "Ivy", "Amara", "Paige", "Vivienne", "Camila", "Emilia",
            "Avery", "Leah", "Emma", "Delilah", "Adeline", "Carolina", "Josephine", "Hazel", "June", "Delilah",
            "Tatum", "Emma", "Freya", "Hannah", "Quinn", "Olive", "Mckenna", "Maggie", "Lucy", "Chloe",
            "Savannah", "Eve", "Olivia", "Mikayla", "Madeline", "Anastasia", "Miriam", "Aubrey", "Sophie",
            "Faith", "Ruby", "Sophia", "Stella", "Cora", "Sophia", "Celia", "Sierra", "Holly", "Wren",
            "Lillian", "Kelsey", "Addison", "Violet", "Eden", "Maeve", "Clara", "Amaya", "Ellie", "Sabrina"
        ];

        const lastNames = [
            "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
            "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Roberts",
            "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright",
            "Scott", "Torres", "Nguyen", "Hill", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell",
            "Perez", "Robinson", "Hernandez", "Gomez", "Duncan", "Sanchez", "Morris", "Cook", "Reed", "Morgan",
            "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richards", "Wood", "James", "Gonzalez", "Gray",
            "Jameson", "Ross", "Graham", "Davis", "Parker", "Evans", "Jenkins", "Patel", "Perry", "Russell",
            "Sanders", "Price", "Watson", "Hunter", "Cameron", "Fox", "Bryant", "Riley", "Austin", "Kim",
            "Gibson", "Johnston", "Burns", "Foster", "Cole", "Hamilton", "Wells", "Bryan", "Spencer", "Hughes",
            "Chavez", "Simmons", "Alexander", "Schmidt", "Bishop", "Ford", "Griffin", "Chavez", "Bates", "George",
            "Wagner", "Mendoza", "Sullivan", "Daniels", "Hansen", "Lynch", "Hoffman", "Hicks", "Shaw", "Wallace",
            "Gardner", "Cameron", "Cunningham", "Alvarez", "Chang", "Jenkins", "Dixon", "Mason", "Webb", "Ruiz",
            "Burnett", "Snyder", "Carr", "Hopkins", "Hart", "Edwards", "Austin", "Lowe", "Ramos", "Fletcher",
            "Patrick", "Freeman", "Curtis", "Griffith", "Black", "Kelley", "Dean", "Reynolds", "Dawson", "Chang",
            "Stewart", "Norris", "Ramirez", "Harrison", "Lamar", "Walsh", "Stone", "Webb", "Carson", "Stewart",
            "Howell", "Meyer", "Fernandez", "Burgess", "Carlson", "Bryant", "Richards", "Simmons", "Ramos", "Fox",
            "Chavez", "Hunt", "Johns", "Byrd", "Richmond", "Harrison", "Patterson", "Jimenez", "Chang", "Blair",
            "Newton", "Walters", "Cameron", "Porter", "Fleming", "Austin", "Garrett", "Jordan", "Blackwell", "Pearson",
            "Douglas", "Singh", "Hughes", "Franklin", "Cameron", "Hudson", "Fowler", "Bowers", "Lambert", "Green",
            "Kim", "Murray", "Hines", "Daniels", "Carlson", "Martinez", "Palmer", "Russell", "Coleman", "Sims",
            "Powers", "Weaver", "Lloyd", "Cameron", "Carroll", "Murray", "James", "Garrison", "Zimmerman", "Hodge",
            "Matthews", "Chang", "Fox", "Sanchez", "Travis", "Morris", "Jensen", "Wong", "Morales", "Wallace",
            "Elliott", "Sullivan", "Wade", "Bennett", "Davenport", "Shaffer", "Patel", "Hicks", "Hines", "Rowe",
            "Love", "Burns", "Freeman", "Reed", "Lutz", "Kirk", "Kim", "Bowers", "Leonard", "Walter", "Farmer",
            "Holmes", "Webster", "Bradley", "Gregory", "Wallace", "Whitehead", "Garrett", "Miller", "Chen", "Gentry",
            "Morrison", "Hughes", "Curtis", "Glover", "Griffith", "Burns", "Kennedy", "Harrison", "Mills", "Peters",
            "Harrison", "Craig", "Nash", "Vazquez", "Holland", "Ferguson", "Hodge", "George", "Fischer", "Nichols",
            "Franklin", "Taylor", "Davis", "Anderson", "Becker", "McCarthy", "Sweeney", "Willis", "Graham", "Burns"
        ];

        switch (whichName)
        {
            case "maleFirstName":
                {
                    let random = Math.floor(Math.random() * maleFirstNames.length);
                    return maleFirstNames[random];
                }
            case "femaleFirstName":
                {
                    let random = Math.floor(Math.random() * femaleFirstNames.length);
                    return femaleFirstNames[random];
                }
            case "lastName":
                {
                    let random = Math.floor(Math.random() * lastNames.length);
                    return lastNames[random];
                }
            default:
                return "ERROR"; // should never happen
        }
    }
});
