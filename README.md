# Note Nook - Notes taking application

A full-stack note-taking application built with React (TypeScript) and Node.js (Typescript), featuring email OTP authentication and JWT-based authorization.

## Demo

Check out the live demo: [Note Nook Demo](https://notenook-notes.netlify.app/)

## Features

- User authentication via Email OTP
- Create, read, and delete notes
- JWT-based API authorization
- Mobile-friendly responsive design
- TypeScript implementation for both frontend and backend
- MongoDB database integration

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Project Structure

```
notenook/
├── server/                   # Backend Node.js application
│   ├── src/
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── client-notenook/                 # Frontend React application
    ├── src/
    │   ├── components/      # React components
    │   ├── context/        # React context
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ramtejvigna/NoteNook.git
cd notenook
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd client-notenook
npm install
```

## Setting up Email Service

This application uses Gmail SMTP for sending OTP emails. To set this up:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security > App Passwords
   - Select 'Mail' and your device
   - Copy the generated password
4. Use this password in your backend .env file

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the backend server:
```bash
cd server
npm run dev
```

3. Start the frontend application:
```bash
cd client-notenook
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- POST `/auth/signup` - Request OTP
- POST `/auth/verify-otp` - Verify OTP and get JWT
- POST `/auth/signin` - Signin and Request OTP
- POST `/auth/verify-signin` - Verify OTP, get JWT and Signin 

### Notes
- GET `/note/:userId` - Get all notes based on the user (requires authentication)
- POST `/note/createNote` - Create a new note (requires authentication)
- DELETE `/note/:id` - Delete a note (requires authentication)
- PUT `/note/:id` - Edit a note (requires authentication)

### User
- GET `/user/:id` - Get the user Data (requires authentication)
- PUT `/user/:id` - Edit user Data (requires authentication)

## Technologies Used

### Frontend
- React
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email service

## Development

For development, you can run both frontend and backend in development mode:

## Building for Production

### Backend
```bash
cd backend
npx tsc
```

### Frontend
```bash
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
