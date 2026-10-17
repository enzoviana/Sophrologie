# 🚨 CORRECTION DU BUG 403 - RÉSUMÉ RAPIDE

## ✅ Ce qui a été fait

Le problème était que le site utilisait **Emergent Object Storage** (incompatible avec Render).

**Solution** : Migration vers **Render Persistent Disk** (stockage permanent).

---

## 🎯 CE QU'IL TE RESTE À FAIRE (5 minutes)

### 1️⃣ PUSHER LE CODE

```bash
cd /Volumes/SSD_ENZO/Sophro/Sophrologie-main
git add .
git commit -m "Fix: Migration stockage vers Render Persistent Disk"
git push origin main
```

### 2️⃣ CRÉER LE PERSISTENT DISK SUR RENDER

1. Va sur https://dashboard.render.com
2. Menu **"Disks"** → **"New Disk"**
3. Remplis :
   - Name: `sophrologie-uploads`
   - Size: `1 GB` (gratuit)
4. **Create Disk**

### 3️⃣ ATTACHER LE DISK AU SERVICE BACKEND

1. Va dans ton service Backend (celui qui fait tourner FastAPI)
2. Menu **"Disks"** → **"Add Disk"**
3. Sélectionne `sophrologie-uploads`
4. **Mount Path** : `/data/uploads` (copie exactement ça ⚠️)
5. **Save**

### 4️⃣ AJOUTER LES VARIABLES D'ENVIRONNEMENT

1. Service Backend → **"Environment"**
2. Ajoute ces 2 variables :

```
USE_LOCAL_STORAGE=true
PERSISTENT_DISK_PATH=/data/uploads
```

3. **Save Changes**

Le service va redéployer automatiquement (attends 2-3 min).

### 5️⃣ TESTER

1. Va sur `https://sophrologie.onrender.com/admin/login`
2. Login : `katia@monateliersophro.fr` / `AtelierSophro2026!`
3. Upload une image dans **Paramètres** ou **Contenu**
4. Vérifie qu'elle s'affiche ✅

---

## 📖 Documentation complète

Si tu veux plus de détails, ouvre :
- **`ACTION_PLAN.md`** - Plan d'action détaillé
- **`DEPLOY_RENDER.md`** - Guide complet de déploiement
- **`RENDER_PERSISTENT_DISK.md`** - Tout sur le Persistent Disk

---

## 🆘 Si ça ne marche pas

**Vérifie les logs** :
- Render Dashboard → ton service → **Logs**
- Tu devrais voir : `Using local storage at: /data/uploads`

**Si tu vois une erreur**, envoie-moi :
1. Les dernières lignes des logs (copie-colle)
2. Capture d'écran de tes variables Render

---

## 💡 Différence Dev vs Prod

**En local (dev)** :
- Les images vont dans `backend/uploads/`

**Sur Render (prod)** :
- Les images vont dans `/data/uploads` (Persistent Disk)
- Elles persistent même après redéploiement 🎉

---

## ✨ Après validation

⚠️ **IMPORTANT** : Les anciennes images sur Emergent ne sont plus accessibles.

Tu dois **re-uploader** :
- Logo
- Photos de Katia
- Photos du site (hero, about, etc.)
- Toutes les images du contenu

Fais ça depuis l'interface admin une fois que l'upload fonctionne.

---

**Temps estimé : 5 minutes**
**Coût : Gratuit (1 GB inclus)**

Bonne chance ! 🚀
