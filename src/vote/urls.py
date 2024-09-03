from django.urls import path
from .views import create_view, save_sondage, show_sondage, list_sondage, save_choice, result_sondage, get_info_detail, update_status

urlpatterns = [
    path('create_view/', create_view, name="create_view_opinion"),
    path('save_sondage/', save_sondage),
    path('show_sondage/<int:id>/', show_sondage, name="sondage_view_opinion"),
    path('list_sondage/', list_sondage, name="list_view_opinion"),
    path('save_choice/', save_choice, name="save_choice"),
    path('result_sondage/', result_sondage, name="result_sondage"),
    path('get_info_detail/', get_info_detail, name="get_info_detail"),
    path('update_status/', update_status, name="update_status"),
]
