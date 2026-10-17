# 🌥️ Configuration Cloudinary pour le stockage des images

## 🎯 Pourquoi Cloudinary ?

- ✅ **Stockage permanent** : Aucune perte de données lors des redéploiements
- ✅ **CDN intégré** : Images servies depuis le CDN le plus proche (chargement ultra-rapide)
- ✅ **Gratuit** : 25 GB de stockage + 25 GB de bande passante/mois
- ✅ **Optimisation automatique** : Compression et format adapté au navigateur
- ✅ **Transformations** : Redimensionnement, recadrage, effets (si besoin)
- ✅ **Backups** : Vos images sont sauvegardées automatiquement

## 🚀 Configuration en 3 étapes (5 minutes)

### Étape 1 : Créer un compte Cloudinary (gratuit)

1. Va sur https://cloudinary.com/users/register_free
2. Remplis le formulaire :
   - **Email** : ton email
   - **Password** : choisis un mot de passe
   - **Cloud name** : choisis un nom unique (ex: `monateliersophro`)
3. Clique sur **"Create Account"**
4. Confirme ton email

### Étape 2 : Récupérer tes identifiants

1. Une fois connecté, tu arrives sur le **Dashboard**
2. Tu verras un encadré **"Account Details"** avec :
   - **Cloud name** : `monateliersophro` (ou ton choix)
   - **API Key** : `123456789012345` (exemple)
   - **API Secret** : `abcdefghijklmnopqrstuvwxyz` (exemple)

3. **Copie la ligne "API Environment variable"** qui ressemble à :
   ```
   CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@monateliersophro
   ```

⚠️ **Important** : Garde cette URL secrète, ne la partage jamais publiquement !

### Étape 3 : Configurer les variables d'environnement

#### A. Pour le développement local

Édite `backend/.env` :
```env
USE_CLOUDINARY="true"
USE_LOCAL_STORAGE="false"
CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@monateliersophro
```

Remplace par ta vraie URL Cloudinary copiée à l'étape 2.

#### B. Pour Render (production)

1. Va sur **Render Dashboard** → ton service Backend → **Environment**
2. Ajoute ces 2 variables :
   ```
   USE_CLOUDINARY=true
   USE_LOCAL_STORAGE=false
   CLOUDINARY_URL=cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@monateliersophro
   ```
3. **Save Changes**

Le service va redéployer automatiquement.

## ✅ Test

### 1. Installer la dépendance cloudinary

En local :
```bash
cd backend
pip install cloudinary
```

Sur Render, c'est automatique (requirements.txt déjà mis à jour).

### 2. Redémarrer le backend local

```bash
cd backend
uvicorn server:app --reload
```

Tu devrais voir dans les logs :
```
Using Cloudinary storage: monateliersophro
```

### 3. Tester l'upload

1. Va sur http://localhost:8000/admin/login (ou ton URL Render)
2. Login : `katia@monateliersophro.fr` / `AtelierSophro2026!`
3. Va dans **Paramètres** ou **Contenu du site**
4. Upload une image de test
5. L'image devrait s'uploader et s'afficher

### 4. Vérifier sur Cloudinary

1. Va sur ton Dashboard Cloudinary
2. Menu **"Media Library"**
3. Tu devrais voir ton image uploadée dans le dossier `mon-atelier-sophto`

## 📁 Structure dans Cloudinary

Tes images seront organisées comme ça :
```
mon-atelier-sophto/
  ├── uploads_profile_[uuid]
  ├── uploads_content_[uuid]
  └── ...
```

## 🔍 Comment ça marche ?

### Upload d'images

1. **Avant** : L'image était stockée dans `backend/uploads/` ou sur Emergent
2. **Maintenant** : L'image est uploadée sur Cloudinary via leur API
3. **Résultat** : Tu reçois une URL Cloudinary comme :
   ```
   https://res.cloudinary.com/monateliersophro/image/upload/v1234567890/mon-atelier-sophto/uploads_content_abc123.jpg
   ```

### Affichage des images

1. **Frontend** demande : `/api/files/https://res.cloudinary.com/...`
2. **Backend** redirige directement vers Cloudinary (pas de traitement)
3. **Cloudinary** sert l'image via son CDN (rapide !)

## 🌍 URLs des images

Les nouvelles images auront des URLs comme :
```
https://res.cloudinary.com/monateliersophro/image/upload/v1234567890/mon-atelier-sophto/uploads_content_abc123.jpg
```

Ces URLs sont **permanentes** et fonctionnent partout.

## 💰 Plan gratuit Cloudinary

- **Stockage** : 25 GB (~ 25 000 images de 1 MB)
- **Bande passante** : 25 GB/mois
- **Transformations** : 25 crédits/mois
- **Médias** : Illimité

Pour un site de sophrologie, c'est **largement suffisant**.

Si tu dépasses, Cloudinary te prévient. Pas de surprise de facturation.

## 🔧 Dépannage

### Erreur "Must supply api_key"

**Cause** : `CLOUDINARY_URL` n'est pas défini ou mal formaté.

**Solution** : Vérifie que tu as bien copié l'URL complète depuis le Dashboard Cloudinary.

### Images en 404

**Cause** : L'upload a échoué ou le format d'URL est incorrect.

**Solution** :
1. Vérifie les logs backend pour voir les erreurs
2. Teste l'URL Cloudinary directement dans ton navigateur

### "Invalid credentials"

**Cause** : API Secret ou API Key incorrects.

**Solution** : Re-copie la `CLOUDINARY_URL` depuis le Dashboard Cloudinary.

## 📊 Dashboard Cloudinary

Sur https://cloudinary.com/console :

- **Media Library** : Voir toutes tes images
- **Reports** : Usage (stockage, bande passante)
- **Settings** : Gérer ton compte

## 🔄 Migration depuis local/Emergent

⚠️ **Important** : Les anciennes images (Emergent ou local) ne seront plus accessibles une fois que tu actives Cloudinary.

**Solution** : Re-upload toutes les images importantes via l'interface admin une fois Cloudinary configuré.

## ✨ Fonctionnalités avancées (optionnel)

### Optimisation automatique

Tu peux demander à Cloudinary d'optimiser automatiquement les images :

Dans `server.py`, modifie l'upload :
```python
result = cloudinary.uploader.upload(
    io.BytesIO(data),
    public_id=public_id,
    folder=APP_NAME,
    resource_type="image",
    overwrite=True,
    quality="auto:best",  # Compression intelligente
    fetch_format="auto"    # Format adapté (WebP sur Chrome, etc.)
)
```

### Transformations d'images

Pour afficher une version miniature :
```
https://res.cloudinary.com/monateliersophro/image/upload/w_300,h_300,c_fill/v1234567890/mon-atelier-sophto/uploads_content_abc123.jpg
```

- `w_300` : largeur 300px
- `h_300` : hauteur 300px
- `c_fill` : recadrage intelligent

## 📝 Checklist finale

- [ ] Compte Cloudinary créé
- [ ] `CLOUDINARY_URL` récupérée
- [ ] Variable ajoutée dans `backend/.env` (local)
- [ ] Variables ajoutées sur Render (prod)
- [ ] `USE_CLOUDINARY=true` activé
- [ ] Backend redémarré
- [ ] Test d'upload réussi
- [ ] Image visible sur Cloudinary Dashboard
- [ ] Image accessible via URL Cloudinary

## 🎉 C'est terminé !

Tes images sont maintenant stockées sur Cloudinary :
- ✅ Stockage permanent
- ✅ CDN ultra-rapide
- ✅ Gratuit (25 GB)
- ✅ Backups automatiques

**Prochaine étape** : Re-upload toutes les images importantes du site via l'admin.
