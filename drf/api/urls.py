from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


app_name = "user"

# ModelViewSetを継承しているviewsはrouter.registerでurlに紐付けできる
router = DefaultRouter()
router.register("event", views.EventViewSet)
router.register("log", views.LogViewSet)
router.register("detail", views.DetailViewSet)

# 汎用APIViewを継承したviewはurlpatternsでurlと紐付ける
urlpatterns = [
    path("register/", views.CreateUserView.as_view(), name="register"),
    path("", include(router.urls))
]
