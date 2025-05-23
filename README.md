# Patient Journey Enterprise Platform

A comprehensive platform for modeling, visualizing, and analyzing patient journeys across different therapeutic areas and healthcare systems.

## Architecture

This project implements a modern, scalable architecture:

- MongoDB database for flexible storage of journey templates, interventions, and scenarios
- Node.js/Express backend API
- React frontend (to be implemented)

## Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```
3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/patient_journey
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Claude API Integration

This application uses Anthropic's Claude API for AI-powered chat capabilities, research, and visualization generation. To use these features:

1. Sign up for an Anthropic API key at [https://console.anthropic.com/](https://console.anthropic.com/)
2. Add your API key to the `.env` file as shown above
3. The application will automatically use Claude when the API key is provided
4. If no API key is provided, the application will fall back to using mock responses for development purposes

## Database Setup

1. Make sure MongoDB is running on your machine
2. Seed the database with initial data:
```
npm run seed
```

## Running the Application

Start the development server:
```
npm run dev
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Journey Templates
- `GET /api/journeys` - Get all journey templates
- `GET /api/journeys/:id` - Get journey template by ID
- `POST /api/journeys` - Create a new journey template
- `PUT /api/journeys/:id` - Update a journey template
- `DELETE /api/journeys/:id` - Delete a journey template

### Authentication
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user information

### Claude AI Integration
- `POST /api/claude/chat` - Send a message to Claude and get a response
- `POST /api/claude/research` - Generate structured research data for a patient journey
- `POST /api/claude/generate` - Generate a visualization plan for a patient journey

## Data Models

### Journey Template
- Contains stages, stakeholders, and metadata for a patient journey
- Associated with therapeutic area and healthcare region
- Can be used as a template for scenario modeling

### Therapeutic Area
- Represents a disease or condition area (e.g., Obesity, Diabetes)
- Contains specific metadata related to the condition

### Region
- Represents a healthcare system or region (e.g., UK NHS, US Medicare)
- Contains system-specific tiers and characteristics

### Barriers & Interventions
- Defined for specific therapeutic areas and regions
- Used in scenario modeling to simulate improvements

### Scenarios
- Created from journey templates
- Allow for modeling the impact of interventions
- Store calculation results for comparison

## Future Development

- Frontend implementation with React
- More advanced scenario modeling
- Integration with healthcare data sources
- Collaborative features
- Export to presentation formats