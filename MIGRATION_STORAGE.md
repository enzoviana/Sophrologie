# Migration du système de stockage des images

## Problème résolu

Le site utilisait **Emergent Object Storage**, un service externe qui ne fonctionne pas depuis Render. Cela causait des erreurs 403 lors de l'upload et de l'affichage des images.

## Solution implémentée

Le système de stockage a été migré vers un **stockage local sur le serveur Render**.

## Changements effectués

### 1. Backend (server.py)

- Ajout de la variable `USE_LOCAL_STORAGE` (par défaut `true`)
- Modification des fonctions `put_object()` et `get_object()` pour supporter le stockage local
- Les fichiers sont maintenant stockés dans `backend/uploads/`
- Amélioration de la gestion d'erreurs dans l'endpoint `/api/files/{path}`

### 2. Configuration (.env)

Nouvelle variable ajoutée :
```env
USE_LOCAL_STORAGE="true"
```

### 3. Structure de fichiers

```
backend/
  ├── uploads/              # Nouveau dossier pour les images uploadées
  │   ├── .gitkeep         # Garde le dossier dans git
  │   └── mon-atelier-sophto/
  │       └── uploads/
  │           ├── profile/  # Photos de profil
  │           └── content/  # Images du contenu (hero, about, etc.)
```

### 4. .gitignore

Ajout de `backend/uploads/` pour éviter de committer les images uploadées.

## Déploiement sur Render

### Étapes à suivre :

1. **Pusher le code mis à jour sur GitHub**
   ```bash
   git add .
   git commit -m "Migration vers stockage local pour Render"
   git push
   ```

2. **Configurer la variable d'environnement sur Render**
   - Va sur ton dashboard Render
   - Clique sur ton service backend
   - Va dans "Environment"
   - Ajoute la variable : `USE_LOCAL_STORAGE` = `true`
   - Sauvegarde et redémarre le service

3. **Créer le dossier uploads sur Render**

   Le dossier sera créé automatiquement au premier upload, mais tu peux le créer manuellement via le Shell Render :
   ```bash
   mkdir -p /opt/render/project/src/backend/uploads
   ```

4. **Re-uploader les images**

   Malheureusement, les anciennes images stockées sur Emergent Object Storage ne sont plus accessibles. Tu devras :
   - Te connecter à l'interface admin
   - Re-uploader toutes les images (logo, photos, etc.)

## URLs des fichiers

Les URLs restent identiques :
```
https://sophrologie.onrender.com/api/files/mon-atelier-sophto/uploads/content/[uuid].jpg
```

## Rollback (si nécessaire)

Pour revenir à Emergent Object Storage (si tu es en environnement de développement) :

1. Dans le fichier `.env` :
   ```env
   USE_LOCAL_STORAGE="false"
   ```

2. Redémarrer le serveur backend

## Notes importantes

- **Persistance des données** : Sur Render, le système de fichiers peut être réinitialisé lors des redéploiements. Pour une solution production robuste, considère :
  - Cloudinary (gratuit jusqu'à 25 GB)
  - AWS S3
  - Render Disk (persistent storage)

- **Backup** : Pense à sauvegarder régulièrement le dossier `uploads/` si tu as des images importantes

## Test

Pour tester que tout fonctionne :

1. Démarre le backend : `cd backend && uvicorn server:app --reload`
2. Connecte-toi à l'admin : https://sophrologie.onrender.com/admin/login
3. Essaie d'uploader une image de profil
4. Vérifie que l'image s'affiche correctement
