from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Event, Log, Detail, Profile


# createに特化した汎用APIViewを継承
# settingsでPermissionをdefaultでJWT認証を通らないとViewにアクセスできないようにしている
# アカウント作成画面は誰でもアクセスできるようにしたいのでAllowAnyを用いる
class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny, )


# EventSerializerでuserEventをread_onlyにカスタムしたのでperform_createをオーバーライト
# userEventにログインユーザーを割り当てる
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = serializers.EventSerializer

    def perform_create(self, serializer):
        serializer.save(userEvent=self.request.user)


# LogSerializerでuserLogをread_onlyにカスタムしたのでperform_createをオーバーライト
# userLogにログインユーザーを割り当てる
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)


# get_queryset関数のfilterでログインしているユーザーのみのプロフィールを返す
class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)


# LogSerializerでuserLogをread_onlyにカスタムしたのでperform_createをオーバーライト
# userLogにログインユーザーを割り当てる
class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = serializers.LogSerializer

    def perform_create(self, serializer):
        serializer.save(userLog=self.request.user)


# DetailSerializerでuserDetailをread_onlyにカスタムしたのでperform_createをオーバーライト
# userDetailにログインユーザーを割り当てる
class DetailViewSet(viewsets.ModelViewSet):
    queryset = Detail.objects.all()
    serializer_class = serializers.DetailSerializer

    def perform_create(self, serializer):
        serializer.save(userDetail=self.request.user)
