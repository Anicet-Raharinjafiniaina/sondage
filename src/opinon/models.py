from django.db import models


class Opinon(models.Model):
    titre = models.CharField(max_length=255)
    commentaire = models.TextField(blank=True)
    anonyme = models.BooleanField(default=False)
    actif = models.BooleanField(default=1)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'opinon'


class OpinonDetail(models.Model):
    colonne = models.CharField(max_length=255, blank=True)
    plus = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    opinon = models.ForeignKey(Opinon, on_delete=models.CASCADE)

    class Meta:
        db_table = 'opinon_detail'


class OpinonResult(models.Model):
    nom = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    opinon_detail = models.ForeignKey(OpinonDetail, on_delete=models.CASCADE)

    class Meta:
        db_table = 'opinon_result'
