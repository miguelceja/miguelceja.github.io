window.onload = (function () {
  init();
  let isGameOver = false;
  let isDraw = false;
  let player = 'X';
  let turnNumber = 1;

  function init() {
    setupGame();
    setupReset();
  }

  // TODO: Replace "O" and "X" with Mario and Luigi or maybe some fun emojis.
  // TODO: Refactor/cleanup code!

  function updateGameStatusText(isNewGame) {
    if (isDraw) {
      $('.game-status').text(`It's a draw!  Hit reset to play again.`);
      player = player === 'X' ? 'O' : 'X';
      turnNumber++;
    } else if (isGameOver) {
      const winner = player === 'O' ? 'I' : 'You';
      const finalMsg = player === 'O' ? 'Better luck next time!' : 'Rematch?';

      $('.game-status').html(
        `Nice game!
        <br>${winner} won in ${Math.round(turnNumber / 2)} turns!
        <br>${finalMsg}`
      );

      $('.wrapper').addClass('game-over');
    } else if (isNewGame) {
      $('.game-status').text("It's your turn.");
    } else {
      player = player === 'X' ? 'O' : 'X';
      turnNumber++;

      const turnMsg = player === 'X' ? "It's your turn." : "I'm thinking...";
      $('.game-status').text(turnMsg);
    }
  }

  function setupGame() {
    const buttons = $('.button');

    $.each(buttons, (i, button) => {
      $(button).on('click', function (e) {
        updateSquare(button, buttons);
      });
    });
  }

  function updateSquare(button, buttons) {
    $(button).text(player);
    $(button).append(`<span class="turn-number">${turnNumber}</span>`);

    checkStatus(player);

    if (isGameOver) {
      updateGameStatusText();
      turnNumber = 1;

      $.each(buttons, (i, button) => {
        $(button).attr('disabled', true);
      });

      return false;
    }

    updateGameStatusText();

    $(button).attr('disabled', true);

    computerMove();
  }

  function computerMove() {
    setTimeout(() => {
      const availableSquares = [];
      // Loop through all buttons, create an array of "available" buttons
      const buttons = $('.button');
      $.each(buttons, (i, v) => {
        const isAvailableSquare = $(v).attr('disabled') !== 'disabled';

        if (isAvailableSquare) {
          availableSquares.push(v);
        }
      });

      // Choose random available square and recreate a "chosen square"
      const availableSquaresLength = availableSquares.length;
      const randomIndex = Math.floor(Math.random() * availableSquaresLength);
      const computerSelection = $(availableSquares[randomIndex]);

      $(computerSelection)
        .text(player)
        .append(`<span class="turn-number">${turnNumber}</span>`)
        .attr('disabled', true);

      checkStatus();
      updateGameStatusText();
    }, 1000);
  }

  function setupReset() {
    $('.reset-game').on('click', function () {
      // Loop through all buttons, reset text, remove disabled, remove winner text.
      const buttons = $('.button');

      $.each(buttons, (i, button) => {
        $(button)
          .text('')
          .removeClass('winning-square')
          .attr('disabled', false);
      });

      isDraw = false;
      isGameOver = false;
      player = 'X';
      turnNumber = 1;

      updateGameStatusText(true);

      $('.wrapper').removeClass('game-over');
    });
  }

  function checkStatus() {
    const buttons = $('.button');

    const winningRows = [
      ['X1', 'X2', 'X3'],
      ['O1', 'O2', 'O3'],
      ['X4', 'X5', 'X6'],
      ['O4', 'O5', 'O6'],
      ['X7', 'X8', 'X9'],
      ['O7', 'O8', 'O9'],
      ['X1', 'X4', 'X7'],
      ['O1', 'O4', 'O7'],
      ['X2', 'X5', 'X8'],
      ['O2', 'O5', 'O8'],
      ['X3', 'X6', 'X9'],
      ['O3', 'O6', 'O9'],
      ['X1', 'X5', 'X9'],
      ['O1', 'O5', 'O9'],
      ['X3', 'X5', 'X7'],
      ['O3', 'O5', 'O7'],
    ];

    const squaresData = [];

    $.each(buttons, (i, button) => {
      const player = $(button).text()[0] || '';
      const squarePlayer = player ? `${player}${i + 1}` : '';
      squaresData.push(squarePlayer); // + 1 to match winningRows numbers
    });

    for (let i = 0; i < winningRows.length; i++) {
      const row = winningRows[i];
      const playerRows = [];
      row.forEach((square) => {
        if (squaresData.includes(square)) {
          playerRows.push(square);
        }
      });

      if (playerRows.length === 3) {
        isGameOver = true;

        row.forEach((square) => {
          const squareNumb = parseInt(square[1] - 1, 10); // -1 to match html class numbers
          $(`.button-${squareNumb}`).addClass('winning-square');
        });

        break;
      }
    }

    // Check if all 9 squares are filled in.  If so and !isGameOver, then it's a draw.
    const playedSquares = squaresData.filter((s) => s);

    if (playedSquares.length === 9 && !isGameOver) {
      isDraw = true;
    }
  }
})();
