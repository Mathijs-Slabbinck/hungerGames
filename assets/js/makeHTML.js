$(document).ready(function(){
    GenerateDistricts(true);
    $(document).on("click", "[id^=div]", function () {
        let id = $(this).attr("id");     // e.g., "div3"
        let number = id.replace("div", "");  // Extract number: "3"
        ToggleDiv(Number(number));
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

function GenerateDistricts(beforeGame = true) {
    function renderField(stat, index, gender) {
        const id = `${stat}${index}${gender}`;
        const label = stat.replace(/([A-Z])/g, ' $1').toLowerCase();

        if (beforeGame) {
            if (stat === "name") {
                return `<input type="text" placeholder="${label}" class="col-10 name" id="${id}" required>`;
            } else {
                return `<input type="number" min="1" max="10" placeholder="${label}" class="col-10 stat" id="${id}" required>`;
            }
        } else {
            return `<div id="${stat}Field${index}${gender}"><p>${label}:</p><p id="${id}"></p></div>`;
        }
    }

    let $container = beforeGame
        ? $('<form id="tributeFormContainer"></form>')
        : $('<div id="tributeDisplayList" class="list-unstyled"></div>');

    for (let index = 1; index <= 12; index++) {
        let kind;

        const $districtWrapper = beforeGame
            ? $('<div class="tributeForm"></div>')
            : $('<div class="districtDisplay"></div>');

        const $districtBar = $(`
            <div class="row districtBar" id="div${index}">
                <p class="col-12">District ${index}</p>
            </div>
        `);

        const $districtSection = $(`
            <section class="row district" id="district${index}">
                <div class="col-12">
                    <h1>District ${index}</h1><h2></h2>
                </div>
                <div class="col-4 tribute tributeForm" id="D${index}M">
                    <div class="insideForm">
                        <img src="images/male.png" alt="male icon" class="col-12 col-sm-8 col-md-6 col-lg-4">
                        <section class="tributeInfo" id="tributeInfo${index}M"></section>
                    </div>
                </div>
                <img class="districtLogo col-3" src="images/district${index}.png" alt="district ${index}'s logo">
                <div class="tributeForm col-4 tribute" id="D${index}F">
                    <div class="insideForm">
                        <img src="images/female.png" alt="female icon" class="col-12 col-sm-8 col-md-6 col-lg-4">
                        <section class="tributeInfo" id="tributeInfo${index}F"></section>
                    </div>
                </div>
            </section>
        `);

        const stats = [
            "name", "speed", "power", "intelligence", "popularity",
            "risk", "survivalSkills", "combatSkills", "luck"
        ];

        stats.forEach(stat => {
            $districtSection.find(`#tributeInfo${index}M`).append(renderField(stat, index, "M"));
            $districtSection.find(`#tributeInfo${index}F`).append(renderField(stat, index, "F"));
        });

        if (beforeGame) {
            $districtSection.find(`#tributeInfo${index}M`).append(`<div id="weaponBlock${index}M"></div>`);
        }

        switch (index) {
            case 1: kind = "luxury"; break;
            case 2: kind = "masonry"; break;
            case 3: kind = "technology"; break;
            case 4: kind = "fishing"; break;
            case 5: kind = "power"; break;
            case 6: kind = "transportation"; break;
            case 7: kind = "lumber"; break;
            case 8: kind = "textiles"; break;
            case 9: kind = "grain"; break;
            case 10: kind = "livestock"; break;
            case 11: kind = "agriculture"; break;
            case 12: kind = "mining"; break;
        }

        $districtSection.find(`#district${index} h2`).append(kind);
        $districtWrapper.append($districtBar, $districtSection);
        $container.append($districtWrapper);
    }

    if (beforeGame) {
        $container.append(`
            <div class="row" id="fillInRandomly"><p class="col-12">fill empty fields randomly</p></div>
            <div class="row" id="clearFields"><p class="col-12">clear all fields</p></div>
            <div class="row" id="submit"><p class="col-12">submit info</p></div>
        `);
    }

    $("main").append($container);
    $(".district").hide();
}
