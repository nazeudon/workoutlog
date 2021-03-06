from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Event, Log, Detail, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # 現在アクティブなUserモデルを取得できる。
        # 今回であれば、カスタムしたUserモデル
        model = get_user_model()
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # validated_data -> validation後の辞書型データ
        user = get_user_model().objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Profile
        fields = ("id", "userProfile", "created_on")
        extra_kwargs = {"userProfile": {"read_only": True}}


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ("id", "title", "category", "userEvent", "img")
        extra_kwargs = {"userEvent": {"read_only": True}}


class LogSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Log
        fields = ("id", "userLog", "created_on", "event")
        extra_kwargs = {"userLog": {"read_only": True}}


class DetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detail
        fields = ("id", "weight", "times", "userDetail", "event", "log")
        extra_kwargs = {"userDetail": {"read_only": True}}
