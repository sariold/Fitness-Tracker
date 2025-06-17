# Fitness Tracker

A React web app that visualizes workout progress by charting body weight and top set weights over time for various exercises.

## Technologies Used

- React with functional components and hooks for dynamic UI  
- PapaParse for efficient CSV parsing of workout data  
- Chart.js and react-chartjs-2 for interactive line charts with zoom and pan features  
- CSS Modules for scoped styling  
- Google Sheets CSV as a data source for flexible updates without redeployment  

## Features

- Fetches and parses workout data from a live Google Sheets CSV  
- Allows selection of exercise and custom date ranges  
- Interactive chart displaying body weight and top set weight trends  
- Zoom and pan support on charts for detailed analysis  
- Handles data loading errors and empty states gracefully  

## Setup

1. Clone the repo  
2. Run `npm install` to install dependencies  
3. Run `npm start` to launch the app locally  

## Challenges & Solutions

Parsing and normalizing inconsistent exercise names from CSV data required creating a mapping dictionary to unify naming conventions. Implemented performant filtering and sorting of data inside React state hooks to support responsive updates on user interaction.

## What I Learned

- Advanced data visualization techniques with Chart.js, including time-based scales and zoom plugin integration  
- Managing asynchronous CSV data fetching and parsing in React  
- Designing clean and responsive UI components with React hooks and CSS Modules  
- Handling edge cases in data transformation and user input control  
