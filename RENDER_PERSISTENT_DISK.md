# Configuration Render Persistent Disk pour le stockage des images

## 🎯 Objectif

Utiliser Render Persistent Disk pour stocker les images uploadées de manière **permanente**, même après les redéploiements.

## 📋 Étapes de configuration sur Render

### 1. Créer un Persistent Disk

1. Va sur ton **Dashboard Render** (https://dashboard.render.com)
2. Dans le menu de gauche, clique sur **"Disks"**
3. Clique sur **"New Disk"**
4. Configure le disk :
   - **Name** : `sophrologie-uploads`
   - **Size** : `1 GB` (gratuit) ou plus selon tes besoins
   - **Region** : Choisis la même région que ton service backend
5. Clique sur **"Create Disk"**

### 2. Attacher le Disk à ton service Backend

1. Va dans ton service **Backend** (celui qui exécute FastAPI)
2. Va dans l'onglet **"Disks"** (dans le menu de gauche)
3. Clique sur **"Add Disk"**
4. Sélectionne le disk `sophrologie-uploads` que tu viens de créer
5. Configure le mount path :
   - **Mount Path** : `/data/uploads`
   - ⚠️ **Important** : Note bien ce chemin, tu en auras besoin
6. Clique sur **"Save"**

### 3. Configurer les variables d'environnement

1. Dans ton service Backend, va dans **"Environment"**
2. Ajoute/Modifie ces variables :
   ```
   USE_LOCAL_STORAGE=true
   PERSISTENT_DISK_PATH=/data/uploads
   ```
3. **Important** : Le `PERSISTENT_DISK_PATH` doit correspondre EXACTEMENT au "Mount Path" de l'étape 2
4. Clique sur **"Save Changes"**

### 4. Redéployer le service

Render va automatiquement redéployer après avoir modifié les variables d'environnement.

Ou force le redéploiement :
- Va dans l'onglet **"Manual Deploy"**
- Clique sur **"Deploy latest commit"**

## 🧪 Vérification

### Test 1 : Vérifier que le disk est monté

Via le Shell Render :
```bash
ls -la /data/uploads
```

Tu devrais voir le dossier sans erreur.

### Test 2 : Upload une image

1. Va sur https://sophrologie.onrender.com/admin/login
2. Connecte-toi avec : `katia@monateliersophro.fr` / `AtelierSophro2026!`
3. Va dans **Paramètres** ou **Contenu du site**
4. Upload une image
5. Vérifie qu'elle s'affiche correctement

### Test 3 : Vérifier la persistance

1. Dans Render, force un redéploiement manuel
2. Une fois redéployé, vérifie que les images uploadées sont toujours accessibles

## 📁 Structure du Persistent Disk

Après quelques uploads, ton disk aura cette structure :

```
/data/uploads/
  └── mon-atelier-sophto/
      └── uploads/
          ├── profile/
          │   └── [uuid].jpg
          └── content/
              ├── [uuid].jpg
              ├── [uuid].png
              └── ...
```

## 💰 Coûts

- **Free Tier** : 1 GB gratuit
- **Paid** : Au-delà de 1 GB, environ $0.25/GB/mois

Pour un site de sophrologie avec quelques dizaines d'images, 1 GB est largement suffisant.

## 🔧 Configuration locale (développement)

Pour le développement local, le code utilise automatiquement `backend/uploads/` si `PERSISTENT_DISK_PATH` n'est pas défini.

Ton `.env` local :
```env
USE_LOCAL_STORAGE=true
# PERSISTENT_DISK_PATH n'est pas défini = utilise ./uploads
```

## 🚨 Troubleshooting

### Erreur "Permission denied" sur /data/uploads

**Solution** : Vérifie que le Mount Path est correct dans la config du Disk sur Render.

### Images uploadées mais 404 lors de l'affichage

**Solution** :
1. Vérifie les logs backend : `heroku logs --tail` ou dans Render Dashboard → Logs
2. Vérifie que `PERSISTENT_DISK_PATH` est bien défini
3. Teste dans le Shell Render :
   ```bash
   ls -la /data/uploads/mon-atelier-sophto/uploads/content/
   ```

### Le disk se vide après un redéploiement

**Solution** :
- Tu n'as probablement pas attaché le Persistent Disk correctement
- Re-fais l'étape 2 (Attacher le Disk au service)

## 📝 URLs des fichiers

Les URLs des images restent identiques :
```
https://sophrologie.onrender.com/api/files/mon-atelier-sophto/uploads/content/[uuid].jpg
https://sophrologie.onrender.com/api/files/mon-atelier-sophto/uploads/profile/[uuid].jpg
```

## 🔄 Migration depuis les anciennes images

Si tu as des anciennes images sur Emergent Object Storage :

1. **Option 1 - Re-upload manuel** (recommandé pour quelques images) :
   - Connecte-toi à l'admin
   - Re-upload toutes les images une par une

2. **Option 2 - Script de migration** :
   - Si tu as beaucoup d'images et accès aux anciennes URLs
   - Contacte-moi pour créer un script de migration

## ✅ Checklist finale

- [ ] Persistent Disk créé sur Render
- [ ] Disk attaché au service Backend avec mount path `/data/uploads`
- [ ] Variables d'environnement configurées (`USE_LOCAL_STORAGE=true`, `PERSISTENT_DISK_PATH=/data/uploads`)
- [ ] Service redéployé
- [ ] Test d'upload réussi
- [ ] Images accessibles via URL
- [ ] Test de persistance après redéploiement réussi

## 📞 Support

Si tu rencontres des problèmes, envoie-moi :
- Les logs du backend (Render Dashboard → Logs)
- L'URL de test qui ne fonctionne pas
- Une capture d'écran de ta config Disk sur Render
