Project context
🎯 Objectifs pédagogiques
À l’issue de ce brief, vous serez capables de :

Installer et configurer un environnement mobile professionnel avec Expo
Comprendre et structurer un projet React Native
Construire des interfaces mobiles interactives avec composants natifs
Mettre en place une navigation mobile avec Stack Navigator
Gérer l’état local et la persistance des données avec AsyncStorage
Organiser un projet mobile de manière professionnelle
--- 📘 Contexte du projet

Une startup spécialisée dans le Health & Fitness souhaite lancer une application mobile permettant aux utilisateurs de :

enregistrer leurs séances sportives,
consulter leur historique,
suivre leur progression personnelle.
Vous êtes chargés de développer la version mobile V1, qui constituera la base du produit final.

⚠️ Aucun modèle de données ne vous est fourni.

Vous devez analyser le besoin, structurer vos données et justifier vos choix techniques.

---✍ Cahier des charges fonctionnel – V1

1️⃣ Gestion des séances sportives
L’application doit permettre :

d’ajouter une nouvelle séance,
de consulter la liste des séances enregistrées,
de consulter le détail d’une séance,
de supprimer une séance.
Une séance contient au minimum :
type d’activité (course, musculation, vélo, etc.),
durée (en minutes),
intensité (faible, moyenne, élevée),
date,
notes facultatives.
---

2️⃣ Navigation mobile
L’application doit intégrer une navigation Stack :

🏠 HomeScreen – Liste des séances
➕ AddWorkoutScreen – Formulaire d’ajout
📄 WorkoutDetailsScreen – Détails d’une séance
Contraintes
Navigation propre et structurée
Passage de paramètres entre écrans
Gestion correcte du retour arrière
---

3️⃣ Gestion de l’état & persistance
L’application doit :

gérer les données via useState / useReducer ou Context API
persister les données avec AsyncStorage
restaurer les données au démarrage de l’application
Contraintes
Aucune perte de données au redémarrage
Gestion d’un état de chargement initial
Gestion des erreurs de stockage
---

4️⃣ Interface & UX
L’application doit :

utiliser uniquement des composants React Native standards
appliquer des styles via StyleSheet
utiliser FlatList pour afficher les séances
proposer une interface claire et mobile-first
Contraintes
séparation claire entre components et screens
composants réutilisables
structure recommandée :
src/
 ├── screens/
 ├── components/
 ├── context/
 ├── storage/
 └── navigation/
---🧩 Organisation du travail (Git – obligatoire)

Repository GitHub individuel.

Branching recommandé
main
develop
feature/*
Commits
messages explicites
convention recommandée : feat:, fix:, refactor:, chore:
---🚨 Contraintes techniques

Expo (managed workflow)
React Navigation (Stack)
AsyncStorage
Architecture modulaire
Code propre et lisible
