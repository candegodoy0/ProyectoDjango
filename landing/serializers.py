from rest_framework import serializers
from .models import Consulta

class ConsultaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Consulta
        fields = (
            'id',
            'nombre',
            'correo',
            'edad',
            'nivel',
            'q1',
            'q2',
            'q3',
            'q4',
            'q5',
            'perfil_obtenido',
            'fecha_consulta'
        )
        read_only_fields = ('perfil_obtenido', 'fecha_consulta')