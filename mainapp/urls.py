from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('materias/', views.materias, name='materias'),
    path('nosotros/', views.nosotros, name='nosotros'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('auth/google/', views.google_auth, name='google_auth'),
    path('perfil/', views.perfil, name='perfil'),
    path('matematica/', views.matematica, name='matematica'),
    path('ciencia/', views.ciencia, name='ciencia'),
    path('gramatica/', views.gramatica, name='gramatica'),
    path('ingles/', views.ingles, name='ingles'),
    path('edureto1/', views.edureto1, name='edureto1'),
    path('examat/', views.examat, name='examat'),
    path('exacien/', views.exacien, name='exacien'),
    path('exagra/', views.exagra, name='exagra'),
    path('exaing/', views.exaing, name='exaing'),
    path('diploma/', views.diploma, name='diploma'),
    # Juegos
    path('games/cienjuego1/', views.cienjuego1, name='cienjuego1'),
    path('games/cienjuego2/', views.cienjuego2, name='cienjuego2'),
    path('games/cienjuego3/', views.cienjuego3, name='cienjuego3'),
    path('games/cienjuego4/', views.cienjuego4, name='cienjuego4'),
    path('games/cienjuego5/', views.cienjuego5, name='cienjuego5'),
    path('games/gramjuego1/', views.gramjuego1, name='gramjuego1'),
    path('games/gramjuego2/', views.gramjuego2, name='gramjuego2'),
    path('games/gramjuego3/', views.gramjuego3, name='gramjuego3'),
    path('games/gramjuego4/', views.gramjuego4, name='gramjuego4'),
    path('games/gramjuego5/', views.gramjuego5, name='gramjuego5'),
    path('games/ingjuego1/', views.ingjuego1, name='ingjuego1'),
    path('games/ingjuego2/', views.ingjuego2, name='ingjuego2'),
    path('games/ingjuego3/', views.ingjuego3, name='ingjuego3'),
    path('games/ingjuego4/', views.ingjuego4, name='ingjuego4'),
    path('games/ingjuego5/', views.ingjuego5, name='ingjuego5'),
    path('games/matjuego1/', views.matjuego1, name='matjuego1'),
    path('games/matjuego2/', views.matjuego2, name='matjuego2'),
    path('games/matjuego3/', views.matjuego3, name='matjuego3'),
    path('games/matjuego4/', views.matjuego4, name='matjuego4'),
    path('games/matjuego5/', views.matjuego5, name='matjuego5'),
    # Endpoints para guardar progreso
    path('api/guardar-progreso-juego/', views.guardar_progreso_juego, name='guardar_progreso_juego'),
    path('api/guardar-progreso-examen/', views.guardar_progreso_examen, name='guardar_progreso_examen'),
]


