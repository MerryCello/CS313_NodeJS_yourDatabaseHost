
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min +1) -min)
}

function getCpuChoice() {
    var num = getRandomInt(0, 2);
    switch (num) {
        case 0:
            return 'rock';
            break;
        case 1:
            return 'paper';
        default:
            return "scissors";
    }
}

function playGame(req, res) {
    console.log("playing the game from a diff file");
    let player = req.query.player_choice;
    let username = req.query.username;

    let cpu = getCpuChoice();
}

module.exports = {playGame: playGame};
