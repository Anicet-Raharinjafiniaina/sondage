from django.db import models


class Vote(models.Model):
    titre = models.CharField(max_length=255)
    commentaire = models.TextField(blank=True)
    anonyme = models.BooleanField(default=False)
    actif = models.BooleanField(default=1)
    cree_par = models.CharField(max_length=255,default=999)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vote'


class VoteDetail(models.Model):
    colonne = models.CharField(max_length=255, blank=True)
    plus = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    vote = models.ForeignKey(Vote, on_delete=models.CASCADE)

    class Meta:
        db_table = 'vote_detail'


class VoteResult(models.Model):
    nom = models.CharField(max_length=255, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    vote_detail = models.ForeignKey(VoteDetail, on_delete=models.CASCADE)

    class Meta:
        db_table = 'vote_result'
