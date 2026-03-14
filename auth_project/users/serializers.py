from rest_framework import serializers
from .models import CustomUser
from .utils import create_otp_for_user


# =========================
# Register Serializer
# =========================
class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'role']

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = CustomUser(
            email=validated_data["email"],
            role=validated_data.get("role", "user")
        )

        user.set_password(password)   # password hash
        user.is_active = False        # OTP verify hone tak inactive
        user.save()

        # OTP generate + email bhejo
        create_otp_for_user(user)

        return user


# =========================
# Verify OTP Serializer
# =========================
class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


# =========================
# Login Serializer
# =========================
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)