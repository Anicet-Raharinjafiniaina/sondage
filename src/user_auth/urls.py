from django.urls import path
from .views import login_view,check_account,logout_view

urlpatterns = [
    path('', login_view, name="login"),
    path('check_account/', check_account, name="check_account"),
    path('logout_view/', logout_view, name="logout_view")
]