from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.http import HttpResponseRedirect, JsonResponse
from .models import Questionnaire,QuestionnaireDetail,QuestionnaireResult
import json
import re 
from sondage.utils import extraire_chiffre_fin
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize

def create_view(request):
    return render(request, 'questionnaire/create_view.html')

@csrf_exempt
def save_sondage(request):
    if request.method == 'POST' and request.session.get('s_username'):
        try:
            data_post = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            titre = data_post.get('titre')
            commentaire = data_post.get('commentaire')
            data = Questionnaire(
                titre=titre,
                commentaire=commentaire,
                cree_par=request.session.get('s_username')
            )
            data.save()

            for key, value in data_post.items():
                if key.startswith('question'):
                    index = extraire_chiffre_fin(key)  # Extrait le chiffre de la clé
                    obligatoire_key = f'obligatoire{index}'  # Forme la clé correspondante
                    is_obligatoire = 1 if obligatoire_key in data_post else 0    # Vérifie si le champ obligatoire existe               
                    data_detail = QuestionnaireDetail(
                        obligatoire=int(is_obligatoire),  # 1 ou 0
                        question=value,
                        questionnaire=data
                    )
                    data_detail.save()

            return JsonResponse(data.id, safe=False, status=200)
        except Exception as e:
            transaction.set_rollback(True)
            return JsonResponse({'message': 'Erreur'}, status=400)

def list_sondage(request):
    try:
        questionnaire_objects = Questionnaire.objects.all().order_by('-id')        
        questionnaire_with_count = []
        for quest in questionnaire_objects:
            total = QuestionnaireDetail.objects.filter(questionnaire_id=quest.id).count()
            data = {
                "questionnaires": quest,
                "nombre": total            
            }
            questionnaire_with_count.append(data)  
        return render(request, 'questionnaire/list_view.html', {"data_questionnaire" : questionnaire_with_count})
    except Exception as e:
        return render(request, 'sondage/error/not_found.html')
    
            
def show_sondage(request, id):
    try:
        questionnaire_objects = Questionnaire.objects.get(id=id)
        if (questionnaire_objects.actif == True): 
            detail_question = QuestionnaireDetail.objects.filter(questionnaire_id=id)
            context = {
                "questionnaires" : questionnaire_objects,
                "list_question" : detail_question
            }
            
            return render(request, 'questionnaire/show_questionnaire.html', context)
        else:
            return render(request, 'sondage/error/not_available.html')
    except ObjectDoesNotExist:
        return render(request, 'sondage/error/not_found.html')  
          
@csrf_exempt
def save_response(request):
    try:
        if request.method == 'POST' :
            data_post = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            base_infos = json.loads(data_post.get('data_infos'))
            questions = json.loads(data_post.get('questions'))
        for key, value in questions.items():
            data_reponse = QuestionnaireResult(
                            nom=base_infos.get('nom'),
                            questionnaire_reponse=value,
                            questionnaire_detail_id=key
            )
            data_reponse.save()
        return JsonResponse({'message': 'Success'}, status=200)    
    except Exception as e:
        transaction.set_rollback(True)
        raise e

@csrf_exempt   
def checkName(request):
    try:
        if request.method == 'POST' :
            data_post = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            questions = json.loads(data_post.get('questions'))
            base_infos = json.loads(data_post.get('data_infos'))
            nom=base_infos.get('nom')
        id_list = []        
        for key, value in questions.items():
           id_list.append(key)
        exists = QuestionnaireResult.objects.filter(questionnaire_detail_id__in=id_list, nom__iexact=nom).exists()    
        if exists : 
            return JsonResponse({"message": 1}, status=200)
        else :
            return JsonResponse({"message": 0}, status=200)
    except Exception as e:
        raise e
    
def get_all_questionnaire(request):
    if request.session.get('s_username') :
        try:
            questionnaire_objects = Questionnaire.objects.all().order_by('-id') 
            return render(request, 'questionnaire/result_questionnaire.html',{"questionnaires": questionnaire_objects})
        except Exception as e:
            raise e  

@csrf_exempt  
def get_detail(request):
    if request.method == 'POST' and request.session.get('s_username'):
        try:
            data_post = request.POST.dict()  # Convertit QueryDict en dictionnaire Python
            questionnaire_objects = Questionnaire.objects.filter(id=data_post.get('id')).first()
            question_objects = QuestionnaireDetail.objects.filter(questionnaire_id=questionnaire_objects.id)
            id_question = [value.id for value in question_objects]            
            results = QuestionnaireResult.objects.select_related('questionnaire_detail').filter(questionnaire_detail_id__in=id_question).values(
                'nom',
                'questionnaire_reponse',
                'questionnaire_detail__question'
            ) # Récupérer les résultats (jointure)
            structured_data = {}  # Initialiser un dictionnaire pour structurer les données
            
            for entry in results:    # Parcourir les résultats pour les organiser
                nom = entry['nom']
                question = entry['questionnaire_detail__question']
                reponse = entry['questionnaire_reponse']
                if nom not in structured_data: # Créer une entrée pour le nom s'il n'existe pas
                    structured_data[nom] = {}
                structured_data[nom][question] = reponse # Ajouter la question et la réponse

            # Afficher les données structurées
            questionnaire_data = {
                "id": questionnaire_objects.id,
                "titre": questionnaire_objects.titre, 
                "actif": questionnaire_objects.actif
            }
            questions_data = list(question_objects.values())  # Convertir le QuerySet en liste de dictionnaires
            base_url = request.build_absolute_uri('/')
            data = {
                "questionnaire": questionnaire_data,
                "reponse": structured_data,
                "lien_questionnaire" : base_url+"questionnaire/show_sondage/"+ data_post.get('id')
            }
            return JsonResponse({"result": data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)  # Retourne une erreur JSON
    return JsonResponse({"error": "Invalid request"}, status=400)  # Gérer les requêtes non POST
      
@ csrf_exempt
def update_status(request):
    if request.method == 'POST':
        data = request.POST.dict()  # Convertit QueryDict en dictionnaire Python   
        print(data.get("actif"))     
        try:
            Questionnaire.objects.filter(id=data.get("id")).update(actif=data.get("actif"))
            return JsonResponse({'message': 'success'}, status=200)
        except Exception as e:
            transaction.set_rollback(True)
            return JsonResponse({'message': str(e)}, status=400)      