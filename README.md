# Broit's Bunk Bed

## Description

This is a 3D model of a bunk bed that I'm designing to eventually showcase fun code. It's made with Three.js and React.

## Table of Contents

- [Broit's Bunk Bed](#broits-bunk-bed)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Deployment](#deployment)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run deploy`](#npm-run-deploy)
    - [`npm run eject`](#npm-run-eject)
  - [Learn More](#learn-more)

## Technologies Used

- React
- Three.js
- JavaScript
- HTML/CSS

## Features

- Interactive 3D model of a bunk bed
- Realistic lighting and shadows
- Responsive design

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/rochiv.github.io.git
   cd rochiv.github.io
   ```

   If you already have Node.js and npm installed, you can skip to **Install Project Dependencies** (step 3).

2. **Install Dependencies**:
   
   If you don't have Node.js and npm installed, follow these steps:

   a. First, install Node Version Manager (nvm):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```
   
   b. Restart your terminal, then install Node.js and npm:
   ```bash
   nvm install node # Installs the latest version
   nvm use node     # Uses the installed version
   ```

   c. Verify the installation:
   ```bash
   node --version
   npm --version
   ```

   d. If you plan to develop React applications, install Create React App globally:
   ```bash
   npm install -g create-react-app
   ```

3. **Install Project Dependencies**:
   ```bash
   npm install
   npm install --save three  # Install Three.js
   ```

## Usage

To run the project locally:

1. **Navigate to the Project Directory**:
   Make sure you are in the root directory of the project, which is `rochiv.github.io`.

2. **Start the Development Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

To deploy the project to GitHub Pages:

1. **Build the Project**:

   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy`

Deploys the app to GitHub Pages.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
