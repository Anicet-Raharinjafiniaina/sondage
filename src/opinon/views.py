from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import HttpResponseRedirect, JsonResponse
from .models import Opinon, OpinonDetail, OpinonResult
from django.core.exceptions import ObjectDoesNotExist
import json
from django.db import transaction


def create_view(request):
    return render(request, 'opinon/create_view.html')


@csrf_exempt
def save_sondage(request):
    if request.method == 'POST':
        try:
            data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            data_opinon = Opinon(
                titre=data.get("titre"), commentaire=data.get("commentaire"), anonyme=(data.get("anonyme").capitalize())
            )
            data_opinon.save()

            # Filtrer les clés qui commencent par "colonne" ou "plus"
            filtered_data = {k: v for k, v in data.items() if k.startswith(
                "colonne") or k.startswith("plus")}

            for key, value in data.items():
                if key.startswith('colonne'):
                    colonne_value = value
                    # Obtenir la valeur associée à "plus"
                    plus_value = data.get(f'plus{key[-1]}', '')
                    OpinonDetail.objects.create(
                        colonne=colonne_value, plus=plus_value, opinon=data_opinon)

        except Exception as e:
            transaction.set_rollback(True)
            return JsonResponse({'message': str(e)}, status=400)
        else:
            return JsonResponse(data_opinon.id, safe=False)


def show_sondage(request, id):
    try:
        opinion_object = Opinon.objects.get(id=id)
        opinion_detail_object = OpinonDetail.objects.filter(opinon=id)
        colonne_id = get_titre_id(id)
        result = []
        if (opinion_object.actif == True):
            if (opinion_object.anonyme == False):
                result = get_result_detail(id)

            context = {
                "opinion": opinion_object,
                "opinion_detail": opinion_detail_object,
                "titre_id": list(colonne_id),
                "result_detail": result
            }
            return render(request, 'opinon/show_sondage.html', context)
        else:
            return render(request, 'projet_sondage/error/not_available.html')

    except ObjectDoesNotExist:
        return render(request, 'projet_sondage/error/not_found.html')


def list_sondage(request):
    try:
        opinion_objects = Opinon.objects.all().order_by('-id')
        opinions_with_count = []

        for opinion in opinion_objects:
            total = OpinonDetail.objects.filter(opinon_id=opinion.id).count()
            opinion_data = {
                "opinion": opinion,
                "nombre": total
            }
            opinions_with_count.append(opinion_data)

        return render(request, 'opinon/list_sondage.html', {"opinions": opinions_with_count})

    except Exception as e:
        return render(request, 'projet_sondage/error/not_found.html')


@csrf_exempt
def save_choice(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        choice_id = data.get("choice")
        name = data.get("name")
        try:
            opinon_detail = get_object_or_404(OpinonDetail, id=choice_id)
            data_chosen = OpinonResult(
                opinon_detail=opinon_detail,
                nom=name
            )
            data_chosen.save()
            return JsonResponse({'message': 'Success'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


def get_all_sondage(model):
    return model.objects.all().order_by("-id")


def result_sondage(request):
    opinion_all = get_all_sondage(Opinon)
    # opinion = Opinon.objects.filter(id=12).first()
    # opinion_detail = OpinonDetail.objects.filter(opinon_id=12)
    return render(request, 'opinon/result_sondage_view.html', {"list_sondage": opinion_all})


@csrf_exempt
def get_info_detail(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        opinion_id = data.get("id")
        try:
            nb_total_sondage = Opinon.objects.all().count()
            opinion_data = Opinon.objects.filter(
                id=opinion_id).first()

            colonne_titre = OpinonDetail.objects.filter(
                opinon__id=opinion_id).values_list('colonne', flat=True).order_by("id")

            # colonne_id = OpinonDetail.objects.filter(
            #     opinon__id=opinion_id).values_list('id', flat=True).order_by("id")

            colonne_id = get_titre_id(opinion_id)

            result_count = []
            for detail_id in colonne_id:
                result_detail = OpinonResult.objects.filter(
                    opinon_detail_id=detail_id).count()
                result_count.append(result_detail)

            result = get_result_detail(opinion_id)
            data_sondage = {
                'nb_participant': sum(result_count),
                'nb_total_sondage': nb_total_sondage,
                'actif': opinion_data.actif,
                'titre': opinion_data.titre,
                'colonne_titre': list(colonne_titre),
                'resultat_sondage': result_count,
                'data_result': list(result),
                'titre_id': list(colonne_id)
            }
            # return JsonResponse({"re": result}, status=200)
            return JsonResponse(data_sondage, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


@ csrf_exempt
def update_status(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
        opinion_id = data.get("id")
        val_status = data.get("actif")
        try:
            Opinon.objects.filter(id=opinion_id).update(actif=val_status)
            return JsonResponse({'message': 'success'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)


def get_result_detail(opinion_id):
    colonne_id = OpinonDetail.objects.filter(
        opinon__id=opinion_id).values_list('id', flat=True).order_by("id")
    result = OpinonResult.objects.filter(
        opinon_detail_id__in=colonne_id).order_by("id").values()
    return result


def get_titre_id(opinion_id):
    return OpinonDetail.objects.filter(
        opinon__id=opinion_id).values_list('id', flat=True).order_by("id")
