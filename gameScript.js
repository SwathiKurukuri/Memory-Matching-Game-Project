$(document).ready(function () {
    const icons = [
        "🍎","🍔","🌹","🍩","🌼","🍕",
        "🌴","🍉","🌻","🍇","🥥"
    ];

    let rows = 4;
    let cols = 4;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let timer = null;
    let seconds = 0;

    // Show instruction overlay
    showInstructions();

    function showInstructions() {
        $("#ol").html(`
            <div id="inst">
                <h2>Welcome!</h2>
                <ul>
                    <li>Click on a block to flip it.</li>
                    <li>Match two similar blocks.</li>
                    <li>If they don't match, they flip back.</li>
                </ul>
                <p>Choose Mode</p>
                <button onclick="startGame(3,4)">3 x 4</button>
                <button onclick="startGame(4,4)">4 x 4</button>
                <button onclick="startGame(4,5)">4 x 5</button>
                <button onclick="startGame(5,6)">5 x 6</button>
                <button onclick="startGame(6,6)">6 x 6</button>
            </div>
        `);
    }

    window.startGame = function (r, c) {
        rows = r;
        cols = c;
        resetGame();
        $("#ol").empty();
        generateBoard();
        startTimer();
    };

    function resetGame() {
        $("table").empty();
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        moves = 0;
        matches = 0;
        seconds = 0;
        clearInterval(timer);
        updateStats();
    }

    function generateBoard() {
        const totalCards = rows * cols;
        const neededIcons = totalCards / 2;
        let selectedIcons = icons.slice(0, neededIcons);
        let cardSet = [...selectedIcons, ...selectedIcons];
        shuffle(cardSet);

        let index = 0;
        for (let r = 0; r < rows; r++) {
            let row = $("<tr></tr>");
            for (let c = 0; c < cols; c++) {
                let icon = cardSet[index++];
                let cell = $(`
                    <td>
                        <div class="inner" data-icon="${icon}">
                            <div class="front"></div>
                            <div class="back">${icon}</div>
                        </div>
                    </td>
                `);
                cell.click(onCardClick);
                row.append(cell);
            }
            $("table").append(row);
        }
    }

    function onCardClick() {
        if (lockBoard) return;

        const inner = $(this).find(".inner");
        if (inner.hasClass("matched") || inner.is(firstCard)) return;

        inner.css("transform", "rotateY(180deg)");

        if (!firstCard) {
            firstCard = inner;
            return;
        }

        secondCard = inner;
        lockBoard = true;
        moves++;
        updateStats();

        checkMatch();
    }

    function checkMatch() {
        const isMatch =
            firstCard.data("icon") === secondCard.data("icon");

        if (isMatch) {
            firstCard.addClass("matched");
            secondCard.addClass("matched");
            matches++;
            resetTurn();

            if (matches === (rows * cols) / 2) {
                gameOver();
            }
        } else {
            setTimeout(() => {
                firstCard.css("transform", "rotateY(0deg)");
                secondCard.css("transform", "rotateY(0deg)");
                resetTurn();
            }, 800);
        }
    }

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            updateStats();
        }, 1000);
    }

    function updateStats() {
        $("#moves").text(`Moves: ${moves}`);
        $("#time").text(`Time: ${formatTime(seconds)}`);
    }

    function gameOver() {
        clearInterval(timer);
        setTimeout(() => {
            alert(`🎉 You won!\nMoves: ${moves}\nTime: ${formatTime(seconds)}`);
            showInstructions();
        }, 300);
    }

    function formatTime(sec) {
        let min = Math.floor(sec / 60);
        let s = sec % 60;
        return `${min.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
