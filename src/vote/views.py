from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseRedirect, JsonResponse
from .models import Vote, VoteDetail, VoteResult
from django.core.exceptions import ObjectDoesNotExist
import json
from django.db import transaction


def create_view(request):
    return render(request, 'vote/create_view.html')


@csrf_exempt
def save_sondage(request):
    if request.method == 'POST' and request.session.get('s_username') and request.session.get('s_username') !="":
        try:
            data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            data_vote = Vote(
                titre=data.get("titre"), commentaire=data.get("commentaire"), anonyme=(data.get("anonyme").capitalize()), cree_par=request.session.get('s_username') 
            )
            data_vote.save()

            # Filtrer les clés qui commencent par "colonne" ou "plus"
            filtered_data = {k: v for k, v in data.items() if k.startswith(
                "colonne") or k.startswith("plus")}

            for key, value in data.items():
                if key.startswith('colonne'):
                    colonne_value = value
                    # Obtenir la valeur associée à "plus"
                    plus_value = data.get(f'plus{key[-1]}', '')
                    VoteDetail.objects.create(
                        colonne=colonne_value, plus=plus_value, vote=data_vote)

        except Exception as e:
            transaction.set_rollback(True)
            return JsonResponse({'message': str(e)}, status=400)
        else:
            return JsonResponse(data_vote.id, safe=False)


def show_sondage(request, id):
    try:
        vote_object = Vote.objects.get(id=id)
        vote_detail_object = VoteDetail.objects.filter(vote=id)
        colonne_id = get_titre_id(id)
        result = []
        if (vote_object.actif == True):
            if (vote_object.anonyme == False):
                result = get_result_detail(id)
            context = {
                "vote": vote_object,
                "vote_detail": vote_detail_object,
                "titre_id": list(colonne_id),
                "result_detail": result,             
            }
            return render(request, 'vote/show_sondage.html', context)
        else:
            return render(request, 'sondage/error/not_available.html')
    except ObjectDoesNotExist:
        return render(request, 'sondage/error/not_found.html')


def list_sondage(request):
    try:
        vote_objects = Vote.objects.all().order_by('-id')
        votes_with_count = []
        for vote in vote_objects:
            total = VoteDetail.objects.filter(vote_id=vote.id).count()
            vote_data = {
                "vote": vote,
                "nombre": total            
            }
            votes_with_count.append(vote_data)            
        return render(request, 'vote/list_sondage.html',  {"votes": votes_with_count})
    except Exception as e:
        return render(request, 'sondage/error/not_found.html')


@csrf_exempt
def save_choice(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        choice_id = data.get("choice")
        name = data.get("name")
        try:
            vote_detail = get_object_or_404(VoteDetail, id=choice_id)
            data_chosen = VoteResult(
                vote_detail=vote_detail,
                nom=name
            )
            data_chosen.save()
            return JsonResponse({'message': 'Success'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


def get_all_vote(model):
    return model.objects.all().order_by("-id")


def result_sondage(request):
    vote_all = get_all_vote(Vote)
    return render(request, 'vote/result_sondage_view.html', {"list_sondage": vote_all})


@csrf_exempt
def get_info_detail(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        vote_id = data.get("id")
        try:
            nb_total_sondage =Vote.objects.all().count()
            vote_data =Vote.objects.filter(
                id=vote_id).first()

            colonne_titre = VoteDetail.objects.filter(
                vote__id=vote_id).values_list('colonne', flat=True).order_by("id")

            colonne_id = get_titre_id(vote_id)

            result_count = []
            for detail_id in colonne_id:
                result_detail = VoteResult.objects.filter(
                    vote_detail_id=detail_id).count()
                result_count.append(result_detail)

            result = get_result_detail(vote_id)
            data_sondage = {
                'nb_participant': sum(result_count),
                'nb_total_sondage': nb_total_sondage,
                'actif': vote_data.actif,
                'titre': vote_data.titre,
                'colonne_titre': list(colonne_titre),
                'resultat_sondage': result_count,
                'data_result': list(result),
                'titre_id': list(colonne_id)
            }
            
            return JsonResponse(data_sondage, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


@ csrf_exempt
def update_status(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        vote_id = data.get("id")
        val_status = data.get("actif")
        try:
            Vote.objects.filter(id=vote_id).update(actif=val_status)
            return JsonResponse({'message': 'success'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


def get_result_detail(vote_id):
    colonne_id = VoteDetail.objects.filter(
        vote__id=vote_id).values_list('id', flat=True).order_by("id")
    result = VoteResult.objects.filter(
        vote_detail_id__in=colonne_id).order_by("id").values()
    return result


def get_titre_id(vote_id):
    return VoteDetail.objects.filter(
        vote__id=vote_id).values_list('id', flat=True).order_by("id")
