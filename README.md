# Organizational Structure App

A web application for managing organizational structures, personnel, and goals. This application allows users to create and visualize hierarchical organizational structures, manage personnel details, and track goals that propagate through the organization.

## Features

- **Organization Tree Visualization**: Interactive tree view of the organizational structure
- **Personnel Management**: Add, edit, and delete personnel in the organization
- **Goal Management**: Create and track goals that propagate upward in the hierarchy
- **Goal Locking**: Ability to lock goals to prevent updates from subordinates

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful API endpoints

### Frontend
- **Framework**: React.js
- **UI Components**: Material-UI
- **State Management**: React Hooks
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Webpack

## Project Structure

```
Goals/
├── backend/               # Flask backend
│   ├── app/               # Application package
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── __init__.py    # App initialization
│   ├── venv/              # Python virtual environment
│   └── run.py             # Application entry point
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   ├── package.json       # NPM dependencies
│   └── webpack.config.js  # Webpack configuration
└── README.md              # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```
   python run.py
   ```
   The server will run on http://localhost:5001

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will be available at http://localhost:3000

## API Endpoints

### Person Endpoints

- `GET /api/persons/` - Get all persons
- `GET /api/persons/tree` - Get organization tree
- `GET /api/persons/:id` - Get a specific person
- `POST /api/persons/` - Create a new person
- `PUT /api/persons/:id` - Update a person
- `DELETE /api/persons/:id` - Delete a person
- `GET /api/persons/:id/subordinates` - Get subordinates of a person

### Goal Endpoints

- `GET /api/goals/` - Get all goals
- `GET /api/goals/:id` - Get a specific goal
- `GET /api/goals/person/:id` - Get goals for a specific person
- `POST /api/goals/` - Create a new goal
- `PUT /api/goals/:id` - Update a goal
- `DELETE /api/goals/:id` - Delete a goal

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. 