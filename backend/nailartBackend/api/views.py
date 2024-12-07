from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from .models import UserProfile
import json
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token

@ensure_csrf_cookie 
@csrf_exempt 
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            full_name = data.get('fullName')
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')
            
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            
            first_name = full_name.split()[0]
            last_name = ' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
            
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            UserProfile.objects.create(
                user=user,
                phone_number=phone
            )
            
            return JsonResponse({'message': 'Registration successful'})
            
        except Exception as e:
            print(f"Error during registration: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@ensure_csrf_cookie
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            user = authenticate(username=email, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    'message': 'Login successful',
                    'user': {
                        'email': user.email,
                        'fullName': f"{user.first_name} {user.last_name}".strip()
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
            
        except Exception as e:
            print(f"Error during login: {str(e)}")
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)