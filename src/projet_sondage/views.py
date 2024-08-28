from django.shortcuts import render
from django.http import HttpResponse


def accueil(request):
    return render(request, 'projet_sondage/index.html')
