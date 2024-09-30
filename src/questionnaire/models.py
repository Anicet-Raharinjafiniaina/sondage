from django.db import models

class Questionnaire(models.Model):
    titre = models.CharField(max_length=255)
    commentaire = models.TextField(blank=True)
    actif = models.BooleanField(default=1)
    cree_par = models.CharField(max_length=255,default=999)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'questionnaire'
        
class QuestionnaireDetail(models.Model):
    obligatoire = models.BooleanField(default=0)
    question = models.TextField(blank=True)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)        
    
    class Meta:
        db_table = 'questionnaire_detail'
        
class QuestionnaireResult(models.Model):
    nom = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    questionnaire_reponse = models.TextField(blank=True)
    questionnaire_detail = models.ForeignKey(QuestionnaireDetail, on_delete=models.CASCADE)  

    class Meta:
        db_table = 'questionnaire_result'        