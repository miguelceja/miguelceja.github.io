window.onload = (function () {
  let isGameOver = false;
  let isDraw = false;
  let player = 'X';
  let turnNumber = 1;
  let isComputerFirstMove = true;
  let winner = '';

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

  init();

  function init() {
    console.log(`Hola! 👋`);
    setupGame();
    setupReset();
  }

  // TODO: Replace "O" and "X" with Mario and Luigi or maybe some fun emojis.
  // TODO: Refactor/cleanup code!

  function updateGameStatusText(isNewGame) {
    if (isDraw) {
      $('.game-status').html(
        `It's a draw! Wanna go again? Just hit <span class="red">reset</span>.`
      );
      player = player === 'X' ? 'O' : 'X';
      turnNumber++;
    } else if (isGameOver) {
      const pronoun = winner === 'O' ? 'I' : 'You';
      const finalMsg = winner === 'O' ? 'Wanna play again?' : 'Rematch?';

      $('.game-status').html(
        `🙌 Nice game!
        ${pronoun} won in <span class="red">${Math.round(
          turnNumber / 2
        )}</span> turns!
        ${finalMsg}`
      );

      $('.wrapper').addClass('game-over');
    } else if (isNewGame) {
      $('.game-status').text('Your move.');
    } else {
      player = player === 'X' ? 'O' : 'X';
      turnNumber++;

      const turnMsg =
        player === 'X'
          ? 'Your move.'
          : `<span class="red">I'm thinking...<span>`;
      $('.game-status').html(turnMsg);
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
    // setTimeout to give the feel of "thinking" before computer makes a move.
    setTimeout(() => {
      const computerSelection = getComputerSelection();

      // Choose random available square and recreate a "chosen square"
      $(computerSelection)
        .text(player)
        .addClass('red-bg')
        .append(`<span class="turn-number">${turnNumber}</span>`)
        .attr('disabled', true);

      // Flash of red background to draw the eye to computer's chosen square.
      setTimeout(function () {
        $(computerSelection).removeClass('red-bg');
      }, 500);

      checkStatus();
      updateGameStatusText();
    }, 1000);
  }

  function getComputerSelection() {
    // If it's computer's first move, check if center square is available, if so, take it.
    const centerSquare = $('.center-square');
    const centerSquareAvailable = centerSquare.attr('disabled') !== 'disabled';

    if (isComputerFirstMove && centerSquareAvailable) {
      isComputerFirstMove = false;
      return centerSquare;
    }

    // Get current available squares
    const buttons = $('.button');
    const availableSquares = [];

    $.each(buttons, (i, v) => {
      const isAvailableSquare = $(v).attr('disabled') !== 'disabled';

      if (isAvailableSquare) {
        availableSquares.push(v);
      }
    });

    const squaresData = [];

    $.each(buttons, (i, button) => {
      const playerInSquare = $(button).text()[0] || '';
      const squarePlayer = playerInSquare ? `${playerInSquare}${i + 1}` : '';
      squaresData.push(squarePlayer); // + 1 to match winningRows numbers
    });

    // Offense: Check if there is a row with two O's, if so, choose remaining square to complete row.
    const targetSquare = getTargetSquare(squaresData);

    if (targetSquare) {
      return targetSquare;
    }

    // Defense: Loop through possible winning rows;
    for (let i = 0; i < winningRows.length; i++) {
      const row = winningRows[i]; // ['X1', 'X2', 'X3'], etc.

      let hasOinRow = false;
      const xsInThisRow = [];

      // For each row, check if "O" has already taken a square, if it has, no need to do anything with the row as it's already "blocked".  If no "O" in the row, then check if there are two "X"'s in the row, if so, take the available square to block the win.
      row.forEach((square) => {
        let squareNumb = parseInt(square[1], 10);
        squareNumb = squareNumb - 1; // Minus 1 to match class names.
        const squareText = $(`.button-${squareNumb}`).text();

        if (squareText.includes('O')) {
          hasOinRow = true;
        }

        const isXsquare = square.includes('X');

        if (isXsquare && squaresData.includes(square)) {
          xsInThisRow.push(square);
        }
      });

      // If there are two "X"'s AND no "O"s, take available square.
      if (!hasOinRow && xsInThisRow.length === 2) {
        const availableSquare = row.filter((x) => !xsInThisRow.includes(x))[0];

        let squareNumb = parseInt(availableSquare[1], 10);
        squareNumb = squareNumb - 1; // Minus 1 to match class names.

        return $(`.button-${squareNumb}`);
      }
    }

    // Otherwise, just choose a random available square.
    return getRandomSquare(availableSquares);
  }

  function getTargetSquare(squaresData) {
    let targetRows = [];

    // Loop through possible winning rows and see if there are any "O"'s in any of them.
    for (let i = 0; i < winningRows.length; i++) {
      const row = winningRows[i]; // ['O1', 'O2', 'O3'], etc.

      // If row has an X, then ignore this row for now as it's not ideal. If row has two O's, then get the available square and choose it.
      let hasXinRow = false;

      row.forEach((square) => {
        let squareNumb = parseInt(square[1], 10);
        squareNumb = squareNumb - 1; // Minus 1 to match class names.
        const squareText = $(`.button-${squareNumb}`).text();

        if (squareText.includes('X')) {
          hasXinRow = true;
        }
      });

      const osInRow = row.filter(
        (square) => square.includes('O') && squaresData.includes(square)
      );

      if (!hasXinRow && osInRow.length === 2) {
        targetRows.push(row);
      }
    }

    const targetRow = targetRows[0];

    let targetSquare = null;

    if (targetRow) {
      // If we have a target row, we need to figure out where to put the O.

      targetRow.forEach((square) => {
        let squareNumb = parseInt(square[1], 10);
        squareNumb = squareNumb - 1; // Minus 1 to match class names.
        const squareText = $(`.button-${squareNumb}`).text();

        // If no squareText, it's an available square
        if (!squareText) {
          targetSquare = $(`.button-${squareNumb}`);
        }
      });
    }

    return targetSquare;
  }

  function getRandomSquare(availableSquares) {
    const availableSquaresLength = availableSquares.length;
    const randomIndex = Math.floor(Math.random() * availableSquaresLength);
    const randomSquare = $(availableSquares[randomIndex]);

    return randomSquare;
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
      isComputerFirstMove = true;

      updateGameStatusText(true);

      $('.wrapper').removeClass('game-over');
    });
  }

  function checkStatus() {
    const buttons = $('.button');
    const squaresData = [];

    $.each(buttons, (i, button) => {
      const playerInSquare = $(button).text()[0] || '';
      const squarePlayer = playerInSquare ? `${playerInSquare}${i + 1}` : '';
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
        winner = player;

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
