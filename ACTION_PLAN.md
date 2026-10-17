# 🎯 Plan d'action - Migration Persistent Disk

## ✅ Modifications effectuées (déjà fait)

1. ✅ Code backend modifié pour supporter Render Persistent Disk
2. ✅ Variable `PERSISTENT_DISK_PATH` ajoutée
3. ✅ Gestion automatique du chemin de stockage (local dev vs Render prod)
4. ✅ Amélioration des logs pour debug
5. ✅ Documentation complète créée

## 📝 Fichiers modifiés

- ✏️ `backend/server.py` - Support Persistent Disk
- ✏️ `backend/.env` - Ajout de `USE_LOCAL_STORAGE=true`
- 📄 `.gitignore` - Exclusion du dossier uploads
- 📁 `backend/uploads/` - Créé avec `.gitkeep`

## 📚 Documentation créée

- 📘 `RENDER_PERSISTENT_DISK.md` - Guide complet Persistent Disk
- 📗 `DEPLOY_RENDER.md` - Guide de déploiement complet sur Render
- 📙 `backend/.env.render.example` - Variables pour Render
- 📕 `MIGRATION_STORAGE.md` - Explication de la migration (legacy)

---

## 🚀 Actions à faire MAINTENANT

### 1. Commit et push les modifications

```bash
cd /Volumes/SSD_ENZO/Sophro/Sophrologie-main

# Vérifie les changements
git status

# Ajoute tous les fichiers
git add .

# Commit
git commit -m "Ajout support Render Persistent Disk pour stockage images

- Migration du stockage Emergent vers stockage local/Persistent Disk
- Support automatique dev (./uploads) et prod (Persistent Disk)
- Documentation complète déploiement Render
- Correction bug double https:// dans APP_URL"

# Push vers GitHub
git push origin main
```

### 2. Configuration sur Render (dans l'ordre)

#### A. Créer le Persistent Disk

1. Dashboard Render → **Disks** → **New Disk**
2. Name: `sophrologie-uploads`
3. Size: `1 GB` (gratuit)
4. Region: Même que ton service backend
5. **Create**

#### B. Attacher le Disk au service Backend

1. Ton service Backend → **Disks** (menu gauche)
2. **Add Disk**
3. Sélectionne `sophrologie-uploads`
4. Mount Path: `/data/uploads`
5. **Save**

#### C. Ajouter les variables d'environnement

1. Service Backend → **Environment**
2. Ajoute ces 2 variables :
   ```
   USE_LOCAL_STORAGE=true
   PERSISTENT_DISK_PATH=/data/uploads
   ```
3. **Save** (le service va redéployer)

### 3. Attendre le redéploiement

- Le service va redéployer automatiquement
- Attends que le status passe à "Live" (~ 2-5 min)
- Surveille les logs pour vérifier qu'il n'y a pas d'erreur

### 4. Test final

#### A. Test d'upload

1. Va sur `https://sophrologie.onrender.com/admin/login`
2. Login: `katia@monateliersophro.fr` / `AtelierSophro2026!`
3. Va dans **"Paramètres"** ou **"Contenu du site"**
4. Upload une image de test
5. Vérifie qu'elle s'affiche correctement

#### B. Test de persistance

1. Sur Render, va dans **Manual Deploy**
2. Clique sur **"Deploy latest commit"**
3. Attends le redéploiement
4. Vérifie que l'image uploadée est toujours là

---

## 🆘 Si ça ne marche pas

### Erreur lors de l'upload

**Regarde les logs** :
- Render Dashboard → ton service → **Logs**
- Cherche les lignes avec `ERROR` ou `Using local storage at:`

**Vérifie** :
```bash
# Dans le Shell Render
ls -la /data/uploads
# Tu devrais voir le dossier sans erreur "Permission denied"
```

### Images uploadées mais 404

**Vérifie dans les logs** que tu vois :
```
Using local storage at: /data/uploads
```

Si tu vois `Using local storage at: /opt/render/project/src/backend/uploads`, c'est que `PERSISTENT_DISK_PATH` n'est pas défini.

### Le service ne démarre pas

**Check les variables** :
- Toutes les variables de `.env.render.example` sont bien dans Render ?
- `MONGO_URL` est correct ?

---

## 📞 Besoin d'aide ?

Envoie-moi :
1. Capture d'écran de tes variables d'environnement Render
2. Capture d'écran de la config du Disk (mount path)
3. Les dernières lignes des logs (les erreurs en rouge)

---

## ✨ Après validation

Une fois que tout fonctionne :

1. **Re-upload toutes les images importantes** car les anciennes (Emergent) ne sont plus accessibles
2. **Test complet du site** pour vérifier que toutes les images s'affichent
3. **Configure un domaine personnalisé** (optionnel) : `monateliersophro.fr`
4. **Configure Google Search Console** pour améliorer le SEO

---

## 🎉 Checklist finale

- [ ] Code pushé sur GitHub
- [ ] Persistent Disk créé sur Render
- [ ] Disk attaché au service backend
- [ ] Variables d'environnement configurées
- [ ] Service redéployé avec succès
- [ ] Test d'upload réussi
- [ ] Test de persistance réussi
- [ ] Toutes les images importantes re-uploadées
- [ ] Site testé au complet

**Bonne chance ! 🚀**
