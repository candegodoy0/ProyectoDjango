from django import forms
from django.core.exceptions import ValidationError
import re
from .models import Consulta

NIVELES = [
    ('Primario', 'Primario'),
    ('Secundario', 'Secundario'),
    ('Terciario', 'Terciario'),
    ('Universitario', 'Universitario'),
    ('Doctorado', 'Doctorado'),
]

PREGUNTA1 = [
    ('Tecnológico', 'Programar o armar cosas'),
    ('Creativo/Artístico', 'Dibujar, diseñar o crear'),
    ('Social/Humanístico', 'Ayudar o acompañar a otros'),
    ('Científico/Analítico', 'Resolver problemas lógicos')
]

PREGUNTA2 = [
    ('Tecnológico', 'Me gusta entender cómo funcionan las cosas'),
    ('Creativo/Artístico', 'Necesito expresarme de forma creativa'),
    ('Social/Humanístico', 'Me motiva mejorar la vida de otros'),
    ('Científico/Analítico', 'Me gusta investigar y analizar datos')
]

PREGUNTA3 = [
    ('Tecnológico', 'Aportar soluciones técnicas'),
    ('Creativo/Artístico', 'Dar ideas creativas'),
    ('Social/Humanístico', 'Organizar y acompañar al equipo'),
    ('Científico/Analítico', 'Analizar la información')
]

PREGUNTA4 = [
    ('Tecnológico', 'Programación o robótica'),
    ('Creativo/Artístico', 'Diseño gráfico o música'),
    ('Social/Humanístico', 'Oratoria o trabajo social'),
    ('Científico/Analítico', 'Estadística o laboratorio')
]

PREGUNTA5 = [
    ('Tecnológico', 'Una app o sistema'),
    ('Creativo/Artístico', 'Una obra o producción artística'),
    ('Social/Humanístico', 'Una campaña comunitaria'),
    ('Científico/Analítico', 'Una investigación con datos')
]


class TestForm(forms.ModelForm):
    nombre = forms.CharField(
        max_length=100,
        label="Nombre y Apellido",
        error_messages={'required': 'Por favor, ingresá tu nombre completo.'},
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )

    correo = forms.EmailField(
        label="Correo electrónico",
        error_messages={
            'required': 'El correo es obligatorio.',
            'invalid': 'Por favor, ingresá una dirección de correo válida.'
        },
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )

    edad = forms.IntegerField(
        min_value=1,
        label="Edad",
        error_messages={
            'required': 'La edad es obligatoria.',
            'invalid': 'Por favor, ingresá solo números.'
        },
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )

    nivel = forms.ChoiceField(
        choices=[('', 'Seleccioná tu nivel educativo')] + NIVELES,
        label="Nivel educativo",
        error_messages={'required': 'Debes seleccionar tu nivel educativo de la lista.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    q1 = forms.ChoiceField(
        choices=[('', 'Seleccioná una opción')] + PREGUNTA1,
        label="¿Qué actividad preferís?",
        error_messages={'required': 'Debes responder la Pregunta 1.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    q2 = forms.ChoiceField(
        choices=[('', 'Seleccioná una opción')] + PREGUNTA2,
        label="¿Con qué frase te identificás más?",
        error_messages={'required': 'Debes responder la Pregunta 2.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    q3 = forms.ChoiceField(
        choices=[('', 'Seleccioná una opción')] + PREGUNTA3,
        label="¿En un trabajo grupal preferís?",
        error_messages={'required': 'Debes responder la Pregunta 3.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    q4 = forms.ChoiceField(
        choices=[('', 'Seleccioná una opción')] + PREGUNTA4,
        label="¿Qué tipo de curso elegirías?",
        error_messages={'required': 'Debes responder la Pregunta 4.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    q5 = forms.ChoiceField(
        choices=[('', 'Seleccioná una opción')] + PREGUNTA5,
        label="Si tuvieras que elegir un proyecto final sería...",
        error_messages={'required': 'Debes responder la Pregunta 5.'},
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    class Meta:
        model = Consulta
        fields = ['nombre', 'correo', 'edad', 'nivel', 'q1', 'q2', 'q3', 'q4', 'q5']

    def clean_nombre(self):
        nombre = self.cleaned_data.get('nombre')
        patron = re.compile(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$')
        if nombre and not patron.match(nombre):
            raise forms.ValidationError('El nombre solo debe contener letras y espacios.')
        return nombre

    def clean_edad(self):
        edad = self.cleaned_data.get('edad')
        if edad is not None and edad < 16:
            raise forms.ValidationError('Debes tener al menos 16 años para realizar el test.')
        return edad


class ContactoForm(forms.Form):
    nombre = forms.CharField(
        max_length=100,
        label="Tu Nombre Completo",
        error_messages={'required': 'Por favor, ingresá tu nombre completo.'},
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )

    correo = forms.EmailField(
        label="Tu Correo Electrónico",
        error_messages={
            'required': 'El correo es obligatorio para responderte.',
            'invalid': 'Por favor, ingresá una dirección de correo válida.'
        },
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )

    mensaje = forms.CharField(
        label="Mensaje",
        error_messages={'required': 'El mensaje no puede estar vacío.'},
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 4})
    )

    def clean_nombre(self):
        nombre = self.cleaned_data.get('nombre')
        patron = re.compile(r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$')
        if nombre and not patron.match(nombre):
            raise forms.ValidationError('El nombre solo debe contener letras y espacios, sin números.')
        return nombre