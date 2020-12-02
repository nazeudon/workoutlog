from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, \
    PermissionsMixin
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator


def upload_event_path(instance, filename):
    ext = filename.split(".")[-1]
    return "/".join(
        ["events", str(instance.userEvent.id)+str("_") +
         str(instance.title)+str(".")+str(ext)]
    )


# 元々djangoが提供しているクラスをemail認証用に書き換える
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("email is must")

        user = self.model(email=self.normalize_email(email))
        user.set_password(password)  # 裏でハッシュ化も行われている
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"  # defaultだと"username"になっている

    def __str__(self) -> str:
        return self.email


class Profile(models.Model):
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # djangoのUserモデルとOneToOneで紐付ける
        related_name="userProfile",
        on_delete=models.CASCADE  # 紐づいているUserが削除されたとき連動してProfileも削除される
    )
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"userID: {self.userProfile}"


class Event(models.Model):
    title = models.CharField(max_length=30)
    category = models.CharField(max_length=10)
    userEvent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="userEvent",
        on_delete=models.CASCADE  # 紐づいているUserが削除されたとき連動して削除される
    )
    # img = models.ImageField(blank=True, null=True, upload_to=upload_event_path)
    img = models.ImageField(blank=True, null=True,
                            upload_to="events", default="events/maccho.png")

    def __str__(self) -> str:
        return self.title


class Log(models.Model):
    userLog = models.ForeignKey(  # OneToManyを表現するときにForeignKeyを用いる
        settings.AUTH_USER_MODEL,
        related_name="userLog",
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(f"{self.event}_{self.created_on.strftime('%Y-%m-%d')}")


class Detail(models.Model):
    weight = models.DecimalField(  # 文字列になってしまう
        max_digits=4,  # 数字部分の最大桁数
        decimal_places=1,  # 少数部分の桁数
        default=0.0,
        validators=[  # 0.0~999.9に制限
            MinValueValidator(0.0),
            MaxValueValidator(999.9)
        ])
    times = models.PositiveSmallIntegerField(
        default=0,
        validators=[  # 0~999に制限
            MinValueValidator(0),
            MaxValueValidator(999)
        ])
    userDetail = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="userDetail",
        on_delete=models.CASCADE
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    log = models.ForeignKey(Log, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.weight}kg times {self.times}"
