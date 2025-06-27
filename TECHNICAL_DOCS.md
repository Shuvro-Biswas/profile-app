# ProFile - Technical Documentation

## Architecture Overview

ProFile is a full-stack web application built with a React frontend and Flask backend, designed using modern web development practices and patterns.

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Flask Backend  │    │ SQLite Database │
│                 │    │                 │    │                 │
│ - Redux Store   │◄──►│ - REST API      │◄──►│ - User Data     │
│ - Components    │    │ - JWT Auth      │    │ - Profile Info  │
│ - Forms         │    │ - CORS          │    │ - Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Decisions

#### Frontend: React with Modern Tooling
- **React 19**: Latest stable version with improved performance
- **Vite**: Fast development server and build tool
- **Redux Toolkit**: Simplified state management with less boilerplate
- **React Hook Form**: Performant forms with minimal re-renders
- **Tailwind CSS**: Utility-first styling for rapid development

#### Backend: Flask with SQLAlchemy
- **Flask**: Lightweight, flexible Python web framework
- **SQLAlchemy**: Powerful ORM for database operations
- **JWT**: Stateless authentication for scalability
- **SQLite**: Simple, file-based database for development

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx          # Login form with validation
│   │   └── RegisterForm.jsx       # Registration form with all fields
│   ├── profile/
│   │   ├── ProfileView.jsx        # Display user profile
│   │   └── ProfileEditForm.jsx    # Edit profile form
│   ├── ui/                        # shadcn/ui components
│   └── ProtectedRoute.jsx         # Route protection wrapper
├── pages/
│   ├── AuthPage.jsx               # Authentication page container
│   └── Dashboard.jsx              # Main dashboard with tabs
├── store/
│   ├── store.js                   # Redux store configuration
│   └── slices/
│       ├── authSlice.js           # Authentication state
│       └── userSlice.js           # User data and directory
└── App.jsx                        # Main application component
```

### State Management Strategy

#### Redux Store Structure
```javascript
{
  auth: {
    user: null,           // Current authenticated user
    token: null,          // JWT authentication token
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  user: {
    users: [],            // Public user directory
    currentUser: null,    // Current user profile data
    selectedUser: null,   // Selected user for viewing
    pagination: {...},    // Pagination information
    isLoading: false,
    error: null,
    searchQuery: ''
  }
}
```

#### Async Actions with RTK Query
- **Authentication**: Login, register, logout actions
- **User Management**: Fetch users, update profile, get user by ID
- **Error Handling**: Centralized error management
- **Loading States**: UI feedback during API calls

### Form Management

#### React Hook Form Integration
```javascript
const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
  watch
} = useForm({
  resolver: zodResolver(profileSchema),
  defaultValues: {...}
})
```

#### Validation with Zod
```javascript
const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  interests: z.array(z.string()).optional(),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional()
})
```

### Routing Strategy

#### Protected Routes Implementation
```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)
  
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  
  return children
}
```

#### Route Configuration
- `/` - Redirects to `/auth` or `/dashboard` based on authentication
- `/auth` - Authentication page (login/register)
- `/dashboard` - Protected dashboard with profile management

## Backend Architecture

### API Design Principles

#### RESTful Endpoints
```
Authentication:
POST /api/auth/register    # User registration
POST /api/auth/login       # User authentication

User Management:
GET  /api/users           # List all users (public directory)
GET  /api/users/:id       # Get specific user profile
PUT  /api/users/:id       # Update user profile (authenticated)
```

#### Response Format Standardization
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "error": null
}
```

### Database Schema

#### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20))
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    interests = db.Column(db.Text)  # JSON string
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

#### Data Relationships
- **Users**: Self-contained entities with profile information
- **Interests**: Stored as JSON strings for flexibility
- **Authentication**: JWT tokens for stateless authentication

### Authentication System

#### JWT Implementation
```python
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
```

#### Password Security
```python
from werkzeug.security import generate_password_hash, check_password_hash

# Password hashing during registration
password_hash = generate_password_hash(password)

# Password verification during login
is_valid = check_password_hash(user.password_hash, password)
```

#### Middleware Protection
```python
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated
```

## Security Implementation

### Frontend Security

#### Token Management
```javascript
// Store token securely in localStorage
localStorage.setItem('token', token)

// Include token in API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
```

#### Input Validation
- **Client-side**: Zod schemas for immediate feedback
- **Sanitization**: Prevent XSS attacks through proper escaping
- **Type Safety**: TypeScript-like validation with Zod

### Backend Security

#### CORS Configuration
```python
CORS(app, origins="*")  # Configure for production
```

#### SQL Injection Prevention
```python
# Using SQLAlchemy ORM prevents SQL injection
user = User.query.filter_by(email=email).first()
```

#### Password Security
- **Hashing**: Werkzeug's secure password hashing
- **Salt**: Automatic salt generation for each password
- **Timing Attacks**: Constant-time comparison functions

## Performance Optimizations

### Frontend Optimizations

#### Code Splitting
```javascript
// Lazy loading for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

#### State Management Efficiency
- **Normalized State**: Avoid nested objects in Redux
- **Memoization**: React.memo for expensive components
- **Selective Subscriptions**: useSelector with specific selectors

#### Bundle Optimization
```javascript
// Vite configuration for optimal builds
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    }
  }
})
```

### Backend Optimizations

#### Database Queries
```python
# Efficient user listing with pagination
users = User.query.paginate(
    page=page, 
    per_page=per_page, 
    error_out=False
)
```

#### Response Optimization
```python
# Only return necessary fields for public directory
def to_public_dict(self):
    return {
        'id': self.id,
        'full_name': self.full_name,
        'email': self.email,
        'bio': self.bio,
        'interests': self.interests,
        'created_at': self.created_at.isoformat()
    }
```

## Testing Strategy

### Frontend Testing Approach

#### Component Testing
```javascript
// Example test structure
describe('LoginForm', () => {
  test('validates required fields', () => {
    // Test form validation
  })
  
  test('submits form with valid data', () => {
    // Test form submission
  })
})
```

#### Integration Testing
- **API Integration**: Test Redux actions with mock API
- **Route Testing**: Verify navigation and protection
- **Form Flow**: End-to-end form submission testing

### Backend Testing Approach

#### Unit Testing
```python
def test_user_registration():
    # Test user creation
    response = client.post('/api/auth/register', json=user_data)
    assert response.status_code == 201
```

#### API Testing
- **Endpoint Testing**: Verify all API endpoints
- **Authentication Testing**: Test JWT token validation
- **Data Validation**: Test input validation and sanitization

## Deployment Architecture

### Production Configuration

#### Frontend Build Process
```bash
# Production build with optimizations
pnpm run build

# Output: dist/ directory with optimized assets
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── ...
```

#### Backend Integration
```python
# Serve React app from Flask
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')
```

### Environment Configuration

#### Development Environment
- **Hot Reload**: Vite dev server for frontend
- **API Proxy**: Vite proxy configuration for backend calls
- **Debug Mode**: Flask debug mode enabled

#### Production Environment
- **Static Serving**: Flask serves built React files
- **Error Handling**: Production-ready error responses
- **Security Headers**: CORS and security configurations

## Scalability Considerations

### Frontend Scalability

#### State Management
- **Redux Toolkit**: Efficient state updates with Immer
- **Normalized Data**: Flat state structure for better performance
- **Selective Updates**: Component-level subscriptions

#### Component Architecture
- **Reusable Components**: Modular, composable UI elements
- **Prop Drilling**: Avoided through Redux and context
- **Code Splitting**: Lazy loading for large applications

### Backend Scalability

#### Database Optimization
- **Indexing**: Database indexes for frequently queried fields
- **Pagination**: Efficient data loading for large datasets
- **Connection Pooling**: SQLAlchemy connection management

#### API Design
- **Stateless Authentication**: JWT tokens for horizontal scaling
- **RESTful Design**: Standard HTTP methods and status codes
- **Error Handling**: Consistent error response format

## Future Enhancements

### Planned Features

#### Advanced Search
```javascript
// Enhanced user directory search
const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ query, filters }) => {
    // Implementation for advanced search
  }
)
```

#### Real-time Features
- **WebSocket Integration**: Real-time user status updates
- **Live Chat**: User-to-user messaging system
- **Notifications**: Real-time notification system

#### Enhanced Security
- **Two-Factor Authentication**: SMS or app-based 2FA
- **OAuth Integration**: Social media login options
- **Rate Limiting**: API rate limiting for security

### Technical Improvements

#### Performance
- **Caching**: Redis for session and data caching
- **CDN**: Content delivery network for static assets
- **Database**: PostgreSQL for production scalability

#### Monitoring
- **Error Tracking**: Sentry for error monitoring
- **Analytics**: User behavior tracking
- **Performance Monitoring**: Application performance metrics

---

This technical documentation provides a comprehensive overview of the ProFile application architecture, implementation details, and considerations for future development.

