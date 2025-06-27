# Contributing to ProFile

Thank you for your interest in contributing to ProFile! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Python (v3.8 or higher)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/profile-app.git
   cd profile-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   pnpm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend && python src/main.py
   
   # Terminal 2: Frontend
   cd frontend && pnpm run dev
   ```

## 📋 Development Guidelines

### Code Style

#### Frontend (React/JavaScript)
- Use functional components with hooks
- Follow React best practices and patterns
- Use meaningful component and variable names
- Implement proper error boundaries
- Write accessible components (ARIA labels, keyboard navigation)

#### Backend (Python/Flask)
- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Implement proper error handling
- Write docstrings for functions and classes
- Use meaningful variable and function names

### Component Structure

#### React Components
```jsx
// Good component structure
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [localState, setLocalState] = useState('')
  const globalState = useSelector(state => state.slice)
  const dispatch = useDispatch()
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  }
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

export default ComponentName
```

#### Flask Routes
```python
# Good route structure
@blueprint.route('/endpoint', methods=['POST'])
@token_required
def endpoint_function(current_user_id):
    """
    Brief description of what this endpoint does.
    
    Args:
        current_user_id: ID of the authenticated user
        
    Returns:
        JSON response with success/error status
    """
    try:
        # Validation
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Business logic
        result = perform_operation(data)
        
        # Response
        return jsonify({
            'message': 'Operation successful',
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### State Management

#### Redux Best Practices
- Use Redux Toolkit for all state management
- Create separate slices for different domains
- Use createAsyncThunk for API calls
- Normalize state structure when dealing with collections
- Keep state minimal and derived data in selectors

```javascript
// Good slice structure
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    currentUser: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  }
})
```

### Form Handling

#### React Hook Form + Zod
```javascript
// Good form implementation
const schema = z.object({
  field: z.string().min(1, 'Field is required')
})

const FormComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = async (data) => {
    try {
      await submitData(data)
    } catch (error) {
      // Handle error
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('field')}
        aria-invalid={errors.field ? 'true' : 'false'}
      />
      {errors.field && (
        <span role="alert">{errors.field.message}</span>
      )}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  )
}
```

## 🧪 Testing

### Frontend Testing
- Write unit tests for utility functions
- Test components with React Testing Library
- Test Redux slices and async actions
- Test form validation and submission

### Backend Testing
- Write unit tests for models and utilities
- Test API endpoints with different scenarios
- Test authentication and authorization
- Test data validation and error handling

### Testing Commands
```bash
# Frontend tests
cd frontend && pnpm test

# Backend tests
cd backend && python -m pytest
```

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add password reset functionality

fix(profile): resolve avatar upload issue

docs(readme): update installation instructions

style(components): format code with prettier

refactor(api): simplify user endpoint logic

test(auth): add login form validation tests

chore(deps): update dependencies
```

## 🔄 Pull Request Process

### Before Submitting
1. **Test your changes**
   - Run all tests locally
   - Test the application manually
   - Ensure no console errors

2. **Code quality**
   - Follow the style guidelines
   - Add comments for complex logic
   - Update documentation if needed

3. **Git hygiene**
   - Rebase your branch on the latest main
   - Squash related commits
   - Write clear commit messages

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Postman](https://www.postman.com/) for API testing

## 🤝 Community

### Getting Help
- Check existing issues before creating new ones
- Use clear, descriptive titles for issues
- Provide as much context as possible
- Be respectful and constructive

### Code of Conduct
- Be respectful to all contributors
- Focus on constructive feedback
- Help others learn and grow
- Maintain a welcoming environment

## 📄 License

By contributing to ProFile, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ProFile! Your efforts help make this project better for everyone.

