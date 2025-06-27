from flask import Blueprint, jsonify, request
from src.models.user import User, db
from datetime import datetime
import json
from functools import wraps

user_bp = Blueprint('user', __name__)

def auth_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        
        try:
            token = auth_header.split(' ')[1]  # Bearer <token>
        except IndexError:
            return jsonify({'error': 'Invalid authorization header format'}), 401
        
        user = User.verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

@user_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users (public profiles)"""
    try:
        search = request.args.get('search', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        query = User.query
        
        if search:
            query = query.filter(
                (User.full_name.contains(search)) | 
                (User.email.contains(search))
            )
        
        users = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'users': [user.to_public_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users', methods=['POST'])
@auth_required
def create_user():
    """Create a new user profile (authenticated)"""
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['full_name', 'email', 'date_of_birth', 'gender']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if email is already taken (excluding current user)
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != request.current_user.id:
            return jsonify({'error': 'Email already taken'}), 400
        
        # Parse date of birth
        try:
            dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Update current user's profile
        user = request.current_user
        user.full_name = data['full_name']
        user.email = data['email']
        user.phone_number = data.get('phone_number')
        user.date_of_birth = dob
        user.gender = data['gender']
        user.interests = json.dumps(data.get('interests', []))
        user.bio = data.get('bio', '')
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Check if requesting own profile or public profile
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
                current_user = User.verify_token(token)
                if current_user and current_user.id == user_id:
                    return jsonify(user.to_dict()), 200
            except:
                pass
        
        return jsonify(user.to_public_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@auth_required
def update_user(user_id):
    """Update a user profile"""
    try:
        # Users can only update their own profile
        if request.current_user.id != user_id:
            return jsonify({'error': 'Unauthorized to update this profile'}), 403
        
        user = User.query.get_or_404(user_id)
        data = request.json
        
        # Update fields if provided
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            # Check if email is already taken
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Email already taken'}), 400
            user.email = data['email']
        if 'phone_number' in data:
            user.phone_number = data['phone_number']
        if 'date_of_birth' in data:
            try:
                user.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        if 'gender' in data:
            user.gender = data['gender']
        if 'interests' in data:
            user.interests = json.dumps(data['interests'])
        if 'bio' in data:
            user.bio = data['bio']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@auth_required
def delete_user(user_id):
    """Delete a user profile"""
    try:
        # Users can only delete their own profile
        if request.current_user.id != user_id:
            return jsonify({'error': 'Unauthorized to delete this profile'}), 403
        
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['GET'])
@auth_required
def get_current_profile():
    """Get current user's profile"""
    try:
        return jsonify(request.current_user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

