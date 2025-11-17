from django.db import models


class Consulta(models.Model):
    nombre = models.CharField(max_length=100)
    edad = models.IntegerField()
    correo = models.EmailField()
    nivel = models.CharField(max_length=50)

    # campos de preguntas
    q1 = models.CharField(max_length=50)
    q2 = models.CharField(max_length=50)
    q3 = models.CharField(max_length=50)
    q4 = models.CharField(max_length=50)
    q5 = models.CharField(max_length=50)

    # campos de resultados y metadatos
    perfil_obtenido = models.CharField(max_length=100)
    fecha_consulta = models.DateTimeField(auto_now_add=True)

    cursos_interes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Consulta"
        verbose_name_plural = "Consultas"

    def _str_(self):
        return f"Consulta de {self.nombre} - {self.perfil_obtenido}"