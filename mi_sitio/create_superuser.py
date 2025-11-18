from django.contrib.auth import get_user_model
from django.db.utils import OperationalError

try:
    User = get_user_model()

    if not User.objects.filter(username="postgres").exists():
        User.objects.create_superuser(
            username="candegodoy",
            email="godoycandela65@gmail.com",
            password="Cande1937"
        )
        print("Superusuario creado")
    else:
        print("El superusuario ya existe")

except OperationalError:
    print("La base de datos aún no está lista. Intenta de nuevo tras migraciones.")
