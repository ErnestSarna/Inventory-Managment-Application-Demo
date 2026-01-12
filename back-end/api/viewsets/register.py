from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers.register import CustomUserRegisterSerializer

class RegisterAPIView(APIView):
     def post(self, request):
        serializer = CustomUserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully",
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
