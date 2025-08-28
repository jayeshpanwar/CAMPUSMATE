# users/serializers.py

from rest_framework import serializers
from .models import User

# ✅ ADD THIS CLASS
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # These are the fields that will be returned when fetching user data.
        # We exclude the password for security.
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department']

# --- Your existing serializers below ---

# A base serializer for handling password confirmation
class PasswordConfirmationSerializer(serializers.ModelSerializer):
    # ... (rest of this class is unchanged)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

# --- Role-Specific Registration Serializers ---

class StudentRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']
    
    def create(self, validated_data):
        validated_data.pop('password2')
        username = validated_data['email'].split('@')[0]
        user = User.objects.create_user(
            username=username,
            role='student',
            **validated_data
        )
        return user


class FacultyRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'department', 'password', 'password2']
        
    def create(self, validated_data):
        validated_data.pop('password2')
        username = validated_data['email'].split('@')[0]
        user = User.objects.create_user(
            username=username,
            role='faculty',
            **validated_data
        )
        return user


class AdminRegisterSerializer(PasswordConfirmationSerializer):
    # ... (this class is unchanged)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def create(self, validated_data):
        validated_data.pop('password2')
        username = validated_data['email'].split('@')[0]
        user = User.objects.create_user(
            username=username,
            role='admin',
            is_staff=True,
            **validated_data
        )
        return user