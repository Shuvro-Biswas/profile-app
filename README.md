# ProFile - Personal Profile Manager

A lightweight, full-stack web application designed to help users create and manage their personal profiles with a public directory for browsing and connecting with other users.

## 🌟 Features

### Authentication System
- **User Registration**: Complete profile creation with validation
- **User Login**: Secure JWT-based authentication
- **Protected Routes**: Automatic redirection for unauthorized access
- **Persistent Sessions**: Token-based session management

### Profile Management
- **Profile Creation**: Comprehensive form with personal information
- **Profile Editing**: Update profile information with real-time validation
- **Profile Viewing**: Beautiful profile display with avatar and information
- **Data Validation**: Client-side and server-side validation

### User Directory
- **Public Directory**: Browse all registered users
- **User Cards**: Clean, informative user cards with key information
- **Search Functionality**: Find users by name or email (ready for implementation)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: React Hook Form with Zod schema validation
- **State Management**: Redux Toolkit for efficient state management
- **Modern UI**: shadcn/ui components for professional appearance
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🚀 Live Demo

**Deployed Application**: [https://19hninclxjzl.manus.space](https://19hninclxjzl.manus.space)

Try the application with these features:
1. Register a new account with your information
2. Log in and explore the dashboard
3. Edit your profile and add interests
4. Browse the user directory
5. View account settings

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management with RTK Query
- **React Hook Form**: Efficient form handling with validation
- **Zod**: TypeScript-first schema validation
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI components
- **Lucide React**: Beautiful, customizable icons

### Backend
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **PyJWT**: JSON Web Token implementation
- **SQLite**: Lightweight database for development

### Development Tools
- **pnpm**: Fast, disk space efficient package manager
- **ESLint**: Code linting and formatting
- **Git**: Version control

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd profile-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python src/main.py
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The frontend development server will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to access the application.

## 🏗️ Project Structure

```
profile-app/
├── backend/                 # Flask backend application
│   ├── src/
│   │   ├── models/         # Database models
│   │   │   └── user.py     # User model with profile fields
│   │   ├── routes/         # API route handlers
│   │   │   ├── auth.py     # Authentication endpoints
│   │   │   └── user.py     # User management endpoints
│   │   ├── database/       # SQLite database files
│   │   ├── static/         # Static files (built frontend)
│   │   └── main.py         # Flask application entry point
│   ├── venv/               # Python virtual environment
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── profile/    # Profile management components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   │   └── slices/     # Redux slices for state management
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── dist/               # Built frontend files
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # Project documentation
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone_number": "+1-555-123-4567",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "interests": ["Tech", "Sports"],
  "bio": "Software developer passionate about technology."
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Management Endpoints

#### GET /api/users
Retrieve list of all users (public directory).

**Query Parameters:**
- `search` (optional): Search by name or email
- `page` (optional): Page number for pagination
- `per_page` (optional): Number of users per page

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "bio": "Software developer...",
      "interests": "[\"Tech\", \"Sports\"]",
      "created_at": "2025-06-27T10:30:00Z"
    }
  ],
  "total": 1,
  "pages": 1,
  "current_page": 1,
  "per_page": 10
}
```

#### GET /api/users/:id
Retrieve specific user profile.

**Response:**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+1-555-123-4567",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "interests": "[\"Tech\", \"Sports\"]",
  "bio": "Software developer passionate about technology.",
  "created_at": "2025-06-27T10:30:00Z"
}
```

#### PUT /api/users/:id
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "full_name": "John Smith",
  "phone_number": "+1-555-987-6543",
  "bio": "Updated bio information",
  "interests": ["Tech", "Gaming", "Travel"]
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Modern blue tones for buttons and accents
- **Secondary**: Subtle grays for backgrounds and borders
- **Success**: Green for positive actions and confirmations
- **Warning**: Orange for alerts and important information
- **Error**: Red for validation errors and critical actions

### Typography
- **Headings**: Clean, modern sans-serif fonts
- **Body Text**: Readable font sizes with proper line spacing
- **Form Labels**: Clear, accessible labeling

### Components
- **Cards**: Clean, shadowed containers for content sections
- **Forms**: Well-spaced, validated input fields
- **Buttons**: Consistent styling with hover and focus states
- **Navigation**: Intuitive tab-based navigation

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: Secure password storage with hashing
- **Token Expiration**: Automatic session timeout for security

### Data Validation
- **Client-Side**: Real-time form validation with Zod schemas
- **Server-Side**: Backend validation for all API endpoints
- **Input Sanitization**: Protection against malicious input

### CORS Configuration
- **Cross-Origin Requests**: Properly configured CORS for API access
- **Secure Headers**: Security headers for production deployment

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with all required fields
- [ ] User registration with validation errors
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Automatic redirect to login when not authenticated
- [ ] Logout functionality

#### Profile Management
- [ ] View profile information
- [ ] Edit profile with valid data
- [ ] Edit profile with validation errors
- [ ] Profile picture placeholder display
- [ ] Interest selection and display

#### User Directory
- [ ] View all users in directory
- [ ] User card information display
- [ ] Loading states during API calls
- [ ] Error handling for failed requests

#### Responsive Design
- [ ] Mobile device compatibility
- [ ] Tablet device compatibility
- [ ] Desktop display optimization
- [ ] Touch-friendly interface elements

## 🚀 Deployment

The application is deployed using Manus deployment services:

### Production URL
**Live Application**: [https://19hninclxjzl.manus.space](https://19hninclxjzl.manus.space)

### Deployment Process
1. **Frontend Build**: React application built for production
2. **Static File Integration**: Frontend files served by Flask backend
3. **Backend Deployment**: Flask application deployed with integrated frontend
4. **Database**: SQLite database automatically created and managed

### Environment Configuration
- **Production Mode**: Optimized builds and error handling
- **CORS**: Configured for cross-origin requests
- **Static Files**: Efficient serving of frontend assets

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow existing code formatting and structure
2. **Components**: Create reusable, well-documented components
3. **State Management**: Use Redux for global state, local state for component-specific data
4. **Validation**: Implement both client-side and server-side validation
5. **Accessibility**: Ensure all components are accessible and keyboard navigable

### Adding New Features
1. **Backend**: Add new API endpoints in appropriate route files
2. **Frontend**: Create components in the appropriate directory structure
3. **State**: Add Redux slices for new data management needs
4. **Validation**: Implement Zod schemas for new form fields
5. **Testing**: Test new features thoroughly before deployment

## 📝 License

This project is created as a demonstration application for the ProFile personal profile management system.

## 🙏 Acknowledgments

- **shadcn/ui**: For providing excellent UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **React Hook Form**: For efficient form management
- **Redux Toolkit**: For simplified state management
- **Flask**: For the lightweight backend framework
- **Manus**: For deployment and hosting services

---

**Built with ❤️ using modern web technologies**

