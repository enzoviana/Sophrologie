# 🚀 Déploiement sur Render avec Persistent Disk

Guide complet pour déployer le site de sophrologie sur Render avec stockage permanent des images.

## 📋 Prérequis

- Compte Render (gratuit) : https://dashboard.render.com
- Repository GitHub du projet
- Les credentials MongoDB et admin

## 🎯 Déploiement en 5 étapes

### Étape 1 : Créer le Persistent Disk

1. Va sur https://dashboard.render.com
2. Menu gauche → **"Disks"** → **"New Disk"**
3. Configure :
   - **Name** : `sophrologie-uploads`
   - **Size** : `1 GB` (gratuit)
   - **Region** : Choisis la même que ton service (ex: Frankfurt)
4. **Create Disk**

### Étape 2 : Créer le service Backend

1. Dashboard → **"New +"** → **"Web Service"**
2. Connecte ton repository GitHub
3. Configure :
   - **Name** : `sophrologie-backend` (ou ton choix)
   - **Region** : Même que le disk
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan** : `Free` (ou selon tes besoins)
4. **Create Web Service**

### Étape 3 : Attacher le Disk au Backend

1. Dans ton service Backend → onglet **"Disks"**
2. **"Add Disk"**
3. Sélectionne `sophrologie-uploads`
4. **Mount Path** : `/data/uploads`
5. **Save**

### Étape 4 : Configurer les variables d'environnement

1. Service Backend → **"Environment"**
2. Copie toutes les variables du fichier `backend/.env.render.example` :

```env
MONGO_URL=mongodb+srv://contact_db_user:xCzHXEqpj1mfsdpt@cluster0.olqgk5t.mongodb.net/?appName=Cluster0
DB_NAME=app
CORS_ORIGINS=*
APP_URL=https://ton-service.onrender.com
JWT_SECRET=f510c9ff1461a165be4e9e98caef29c600d370ef663b60c97731a902049ef493
ADMIN_EMAIL=katia@monateliersophro.fr
ADMIN_PASSWORD=AtelierSophro2026!
USE_LOCAL_STORAGE=true
PERSISTENT_DISK_PATH=/data/uploads
EMERGENT_LLM_KEY=sk-emergent-407110a192706Ec3f0
Username=contact_db_user
Password=xCzHXEqpj1mfsdpt
```

⚠️ **Important** : Remplace `APP_URL` par l'URL réelle de ton service Render

3. **Save Changes** (le service va redéployer automatiquement)

### Étape 5 : Déployer le Frontend

#### Option A : Vercel (recommandé, gratuit)

1. Va sur https://vercel.com
2. Import ton repository GitHub
3. Configure :
   - **Root Directory** : `frontend`
   - **Framework Preset** : `Vite`
   - **Build Command** : `yarn build` (ou laisse auto-detect)
   - **Output Directory** : `dist`
4. Variables d'environnement :
   ```
   VITE_API_URL=https://ton-backend.onrender.com
   ```
5. Deploy

#### Option B : Render Static Site

1. Dashboard → **"New +"** → **"Static Site"**
2. Connecte le même repository
3. Configure :
   - **Name** : `sophrologie-frontend`
   - **Branch** : `main`
   - **Root Directory** : `frontend`
   - **Build Command** : `yarn install && yarn build`
   - **Publish Directory** : `dist`
4. Variables d'environnement :
   ```
   VITE_API_URL=https://ton-backend.onrender.com
   ```
5. Create Static Site

## ✅ Vérification

### 1. Backend fonctionne

```bash
curl https://ton-backend.onrender.com/api/status
```

Tu devrais recevoir une réponse JSON.

### 2. Frontend fonctionne

Ouvre https://ton-frontend.onrender.com (ou ton domaine Vercel)

### 3. Admin login

1. Va sur `https://ton-frontend/admin/login`
2. Connecte-toi : `katia@monateliersophro.fr` / `AtelierSophro2026!`

### 4. Upload d'images

1. Dans l'admin, va dans **"Contenu du site"** ou **"Paramètres"**
2. Upload une image
3. Vérifie qu'elle s'affiche

### 5. Test de persistance

1. Sur Render, force un redéploiement : **"Manual Deploy"** → **"Deploy latest commit"**
2. Attends que le service redémarre
3. Vérifie que les images uploadées sont toujours là

## 🔧 Configuration du frontend

Assure-toi que le frontend utilise la bonne URL backend :

**frontend/src/lib/api.ts** :
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**frontend/vite.config.ts** :
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8001',
      changeOrigin: true,
    },
  },
},
```

## 🌐 Domaine personnalisé (optionnel)

### Pour le backend

1. Service Backend → **"Settings"** → **"Custom Domains"**
2. Ajoute ton domaine : `api.monateliersophro.fr`
3. Configure les DNS :
   ```
   Type: CNAME
   Name: api
   Value: ton-service.onrender.com
   ```

### Pour le frontend (Vercel)

1. Project Settings → **"Domains"**
2. Ajoute `monateliersophro.fr` et `www.monateliersophro.fr`
3. Configure les DNS selon les instructions Vercel

## 🚨 Dépannage

### Le backend ne démarre pas

**Logs** : Dashboard Render → Logs

Erreurs communes :
- `ModuleNotFoundError` : Vérifie `requirements.txt`
- `Connection refused MongoDB` : Vérifie `MONGO_URL`

### Images en 404

**Vérifie** :
1. Variables : `USE_LOCAL_STORAGE=true` et `PERSISTENT_DISK_PATH=/data/uploads`
2. Le disk est bien attaché au service
3. Les logs backend pour voir le chemin utilisé

### CORS errors

**Vérifie** :
1. `CORS_ORIGINS=*` dans les variables backend
2. Ou spécifie ton domaine : `CORS_ORIGINS=https://ton-frontend.vercel.app`

## 💰 Coûts

**Gratuit** :
- Backend Render Free : ✅ (dort après 15 min d'inactivité)
- Frontend Vercel : ✅
- Persistent Disk 1 GB : ✅

**Upgrade optionnel** :
- Render Starter ($7/mois) : Backend toujours actif, plus rapide
- Plus de storage : $0.25/GB/mois

## 📝 Commandes utiles

### Voir les logs backend
```bash
# Via Render Dashboard → Logs
# Ou via CLI si installé
render logs -s ton-service-id
```

### Shell backend Render
```bash
# Dashboard → Shell
ls -la /data/uploads
```

### Tester l'API localement
```bash
cd backend
uvicorn server:app --reload
# http://localhost:8000
```

## 🎉 C'est terminé !

Ton site est maintenant déployé avec :
- ✅ Backend FastAPI sur Render
- ✅ Frontend React sur Vercel/Render
- ✅ Images stockées sur Persistent Disk (permanentes)
- ✅ Base de données MongoDB Atlas
- ✅ Admin fonctionnel

Prochaines étapes recommandées :
1. Configurer un domaine personnalisé
2. Activer HTTPS (automatique sur Render/Vercel)
3. Configurer Google Search Console pour le SEO
4. Sauvegarder régulièrement les images du persistent disk
