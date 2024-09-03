from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout

def login_view(request):
    return render(request,'user_auth/login_view.html')

@ csrf_exempt
def check_account(request):
    if request.method == 'POST':
        username = request.POST.get('username', False)
        password = request.POST.get('password', False)
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            login(request, user)
            request.session['s_username'] = username
            return JsonResponse({'message': 'success'}, status=200)  
    return JsonResponse({'message': 'erreur'}, status=200)      

@ csrf_exempt
def logout_view(request):
    logout(request)
    request.session.clear()
    return login_view(request)