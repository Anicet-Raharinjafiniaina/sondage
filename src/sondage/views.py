from django.shortcuts import render

def accueil(request):
    if request.session.get('s_username') and request.session.get('s_username') !="":
        return render(request, 'sondage/index.html')
    return render(request, 'sondage/error/not_found.html')