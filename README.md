# Tic Tac Toe Game with Single & Multiplayer Modes

This is a React and TypeScript Tic Tac Toe game that supports both multiplayer and single player modes:

- **Multiplayer:** Two players take turns on one computer.
- **Single Player:** You play as "X" against a computer that plays as "O".

By default, the game is configured with a 3×3 board and a winning sequence of 3. Users can update these settings via the configuration UI.

All aspects of this project—including the code, documentation, and repository setup—were created using **o3-mini** and **o3-mini-high**.

> **Note:** This project was created using **o3-mini** and **o3-mini-high**.

## Live Demo

Play the game online at: [https://chuenlum.github.io/tic-tac-toe-o3-mini](https://chuenlum.github.io/tic-tac-toe-o3-mini)

## Features

- **Default Configuration:** 3×3 board with a winning sequence of 3.
- **Multiplayer Mode:** Two players alternate turns.
- **Single Player Mode:** Play against a computer opponent.
- **Configurable Settings:** Easily adjust board size and win conditions via the UI.
- **Game History:** Review and jump back to previous moves.
- **Built with o3-mini & o3-mini-high:** From the codebase to the README and repo configuration.

## Getting Started

Follow these steps to run the project on your local machine.

### 1. Clone the Repository

Clone the repository to your local machine using Git:

```
git clone git@github.com:chuenlum/tic-tac-toe-o3-mini.git
```

### 2. Navigate to the Project Directory

Change into the project folder:

```
cd tic-tac-toe-o3-mini
```

### 3. Install Dependencies

Install the project dependencies using Yarn:

```
yarn install
```

### 4. Start the Development Server

Run the following command to start the development server:

```
yarn start
```

This will open the application in your default browser at [http://localhost:3000](http://localhost:3000).

## How to Use the Game

- **Default Configuration:**
  The game starts with a 3×3 board and requires 3 in a row to win. You can update these settings using the configuration panel at the top of the interface.

- **Mode Selection:**
  At the top of the interface, choose **Multiplayer** (for two players on one computer) or **Single Player** (to play against the computer).

- **Reset Game:**
  Click the **Reset Game** button at any time to restart the game with the current configuration.

- **Gameplay:**
  - In **Multiplayer**, players alternate clicking on empty squares.
  - In **Single Player**, you play as "X" and the computer (playing as "O") will automatically make a move after your turn.

- **Game History:**
  A list of past moves is displayed. Click on any move to jump back to that game state.

## ChatGPT Session

For detailed context on how this project was built and the decision-making process, view the entire ChatGPT session here: [View ChatGPT Session](https://chatgpt.com/share/679ddb60-054c-800a-8fa4-8cbe88e05428)

## Repository

View the source code on GitHub: [https://github.com/chuenlum/tic-tac-toe-o3-mini](https://github.com/chuenlum/tic-tac-toe-o3-mini)

## License

This project is provided as-is. Feel free to modify and use it for your own purposes.
