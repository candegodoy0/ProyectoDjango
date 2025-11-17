from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('inscribir/', views.inscribir, name='inscribir'),
    path('sobre-nosotros/', views.sobre_nosotros, name='sobre_nosotros'),
    path('contacto/', views.contacto, name='contacto'),
    path('registro/', views.registro, name='registro'),
    path('home/', views.login_redirect_view, name='login_redirect_view'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('listado/', views.listado_consultas, name='listado_consultas'),
    path('editar/<int:consulta_id>/', views.editar_consulta, name='editar_consulta'),
    path('eliminar/<int:consulta_id>/', views.eliminar_consulta, name='eliminar_consulta'),
    path('acceso/', views.no_admin_landing, name='no_admin_landing'),
]

