from django.urls import path
from .views import create_view,save_sondage,list_sondage,show_sondage,save_response,checkName,get_all_questionnaire,get_detail,update_status

urlpatterns = [
    path('create_view/', create_view, name="create_view_questionnaire"),
    path('save_sondage/', save_sondage),
    path('show_sondage/<int:id>/', show_sondage, name="sondage_view_questionnaire"),
    path('list_sondage/', list_sondage, name="list_view_questionnaire"),
    path('save_response/', save_response, name="save_response"),
    path('checkName/', checkName, name="checkName"),
    path('get_all_questionnaire/', get_all_questionnaire, name="get_all_questionnaire"),
    path('get_detail/', get_detail, name="get_detail"),
    path('update_status/', update_status, name="update_status"),
]
