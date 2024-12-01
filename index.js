let start = true;
let level = 0;
let computerInputs = [];
let userInputs = [];

// Start game
if (start) {
    $('div[type="button"]').click(function () {
        if (start) {
            start = false;
            level++;
            $("#level-title").text("Level " + level);
            gamestart();
        }
    });
}

async function gamestart() {
    computerInputs = await computerPress(level);
    userInputs = [];
    await waitForUserInput();

    const userAnswer = userInputChecker(userInputs, computerInputs);
    if (userAnswer) {
        level++;
        $("#level-title").text("Level " + level);
        setTimeout(gamestart, 1000);
    } else {
        outputSound("wrong");
        let defaultColor = $("body").css("background-color");
        $("body").css("background-color", "red");
        setTimeout(() => $("body").css("background-color", defaultColor), 500);
        $("#level-title").text("Game Over, Press Any Button to Restart");
        $('div[type="button"]').click(function () {
            resetGame();
            level++;
            $("#level-title").text("Level " + level);
            setTimeout(gamestart(),3000);
        
        })
        
    }
}

function clickAnimation(buttonId) {
    keyAnimation(buttonId);
    outputSound(buttonId);
}

function keyAnimation(key) {
    let activeKey = $("#" + key);
    activeKey.addClass("pressed");
    setTimeout(() => activeKey.removeClass("pressed"), 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function computerPress(level) {
    let buttons = ["green", "red", "yellow", "blue"];
    let result = [];
    for (let i = 0; i < level; i++) {
        let randomIndex = Math.floor(Math.random() * buttons.length);
        let key = buttons[randomIndex];
        result.push(key);
        await sleep(1000);
        clickAnimation(key);
    }
    return result;
}

function outputSound(key) {
    let sounds = {
        blue: "./sounds/blue.mp3",
        red: "./sounds/red.mp3",
        yellow: "./sounds/yellow.mp3",
        green: "./sounds/green.mp3",
        wrong: "./sounds/wrong.mp3",
    };
    let audio = new Audio(sounds[key] || sounds.wrong);
    audio.play();
}

function waitForUserInput() {
    return new Promise(resolve => {
        $('div[type="button"]').off("click").click(function () {
            let buttonId = $(this).attr("id");
            userInputs.push(buttonId);
            clickAnimation(buttonId);
            if (userInputs.length === computerInputs.length) {
                resolve();
            }
        });
    });
}

function userInputChecker(userInputs, computerInputs) {
    if (userInputs.length !== computerInputs.length) return false;

    for (let i = 0; i < userInputs.length; i++) {
        if (computerInputs[i] !== userInputs[i]) return false;
    }
    return true;
}

function resetGame() {
    start = true;
    level = 0;
    computerInputs = [];
    userInputs = [];
}
