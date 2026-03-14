from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, OTPVerification
from .serializers import RegisterSerializer, VerifyOTPSerializer, LoginSerializer


# =========================
# Register API
# =========================
class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "OTP aapke email pe bhej diya!"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# Verify OTP API
# =========================
class VerifyOTPView(APIView):

    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]

            try:
                user = CustomUser.objects.get(email=email)
                otp_obj = OTPVerification.objects.get(user=user)

                if otp_obj.is_expired():
                    return Response(
                        {"error": "OTP expire ho gaya!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if otp_obj.otp != otp:
                    return Response(
                        {"error": "Galat OTP!"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                user.is_verified = True
                user.is_active = True
                user.save()

                otp_obj.delete()

                return Response(
                    {"message": "Email verify ho gayi!"},
                    status=status.HTTP_200_OK
                )

            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "User nahi mila"},
                    status=status.HTTP_404_NOT_FOUND
                )

            except OTPVerification.DoesNotExist:
                return Response(
                    {"error": "OTP record nahi mila"},
                    status=status.HTTP_404_NOT_FOUND
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# Login API (JWT Cookies)
# =========================
class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            user = authenticate(request, email=email, password=password)

            if not user:
                return Response(
                    {"error": "Credentials galat hain"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not user.is_verified:
                return Response(
                    {"error": "Pehle email verify karo!"},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            response = Response(
                {
                    "message": "Login successful",
                    "role": user.role
                },
                status=status.HTTP_200_OK
            )

            # Access Token Cookie
            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=1800
            )

            # Refresh Token Cookie
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=86400
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# Refresh Token API
# =========================
class RefreshTokenView(APIView):

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"error": "Refresh token nahi mila"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token

            response = Response(
                {"message": "Token refresh ho gaya"},
                status=status.HTTP_200_OK
            )

            response.set_cookie(
                key="access_token",
                value=str(access),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=1800
            )

            return response

        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )


# =========================
# Logout API
# =========================
class LogoutView(APIView):

    def post(self, request):

        response = Response(
            {"message": "Logout successful"},
            status=status.HTTP_200_OK
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response