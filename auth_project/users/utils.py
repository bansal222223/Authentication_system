import random
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail

def generate_otp():
    return str(random.randint(100000, 999999))  # 6 digit OTP

def send_otp_email(email, otp):
    send_mail(
        subject='Email Verify Karo - OTP',
        message=f'Aapka OTP hai: {otp} (10 minutes valid)',
        from_email='your@gmail.com',
        recipient_list=[email],
    )

def create_otp_for_user(user):
    from users.models import OTPVerification
    otp = generate_otp()
    OTPVerification.objects.update_or_create(
        user=user,
        defaults={
            'otp': otp,
            'expires_at': timezone.now() + timedelta(minutes=10)
        }
    )
    send_otp_email(user.email, otp)