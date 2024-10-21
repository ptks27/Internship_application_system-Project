# THE TRAINEE - Frontend

This is the frontend application for THE TRAINEE, a platform connecting job seekers with internship opportunities.

## Technologies Used

- React
- Redux Toolkit
- React Router
- Axios
- react-i18next
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run lint`: Runs the linter
- `npm run preview`: Previews the production build

## Environment Variables

Create a `.env` file in the root directory and add the following:

## Folder Structure

- `src/`: Source files
  - `components/`: React components
  - `hooks/`: Custom React hooks
  - `redux/`: Redux store and slices
  - `utils/`: Utility functions and constants
 
  # THE TRAINEE - Backend

This is the backend server for THE TRAINEE, handling API requests, database operations, and email services.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Mailtrap

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Start the server: `npm run dev`

## Available Scripts

- `npm run dev`: Starts the development server with nodemon
- `npm start`: Starts the server in production mode

## Environment Variables

Create a `.env` file in the root directory and add the following:

## API Endpoints

- `/api/v1/user`: User-related operations
- `/api/v1/company`: Company-related operations
- `/api/v1/job`: Job-related operations
- `/api/v1/application`: Application-related operations

## Folder Structure

- `controllers/`: Request handlers
- `models/`: Mongoose models
- `routes/`: API routes
- `utils/`: Utility functions
- `mailtrap/`: Email service configuration
