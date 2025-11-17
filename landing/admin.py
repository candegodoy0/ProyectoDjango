from django.contrib import admin
from .models import Consulta

class ConsultaAdmin(admin.ModelAdmin):
    # campos que se mostraran en la vista de lista de consultas
    list_display = ('id', 'nombre', 'correo', 'perfil_obtenido', 'fecha_consulta')

    # filtros laterales para busqueda rapida
    list_filter = ('perfil_obtenido', 'nivel', 'fecha_consulta')

    # campos que permiten la busqueda de texto
    search_fields = ('nombre', 'correo', 'perfil_obtenido')

    # campos que se convierten en enlaces a la pagina de edicion
    list_display_links = ('id', 'nombre')

    # permite editar campos directamente desde el listado
    list_editable = ('perfil_obtenido',)

admin.site.register(Consulta, ConsultaAdmin)