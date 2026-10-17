# ⚡ Cloudinary - Guide ultra-rapide (3 minutes)

## 🎯 Actions à faire

### 1️⃣ Créer le compte Cloudinary (1 min)

1. Va sur https://cloudinary.com/users/register_free
2. Remplis : email, password, cloud name (ex: `monateliersophro`)
3. **Create Account** → Confirme l'email

### 2️⃣ Récupérer la clé (30 sec)

1. Dashboard Cloudinary → **Account Details**
2. Copie la ligne **"API Environment variable"** :
   ```
   CLOUDINARY_URL=cloudinary://123456789012345:abcdef...@monateliersophro
   ```

### 3️⃣ Configurer Render (1 min)

1. **Render Dashboard** → ton service Backend → **Environment**
2. Ajoute 3 variables :
   ```
   USE_CLOUDINARY=true
   USE_LOCAL_STORAGE=false
   CLOUDINARY_URL=cloudinary://[ta clé copiée ci-dessus]
   ```
3. **Save** (redéploiement automatique)

### 4️⃣ Installer localement (30 sec)

```bash
cd backend
pip install cloudinary
```

Édite `backend/.env` :
```env
USE_CLOUDINARY="true"
USE_LOCAL_STORAGE="false"
CLOUDINARY_URL=cloudinary://[ta clé]
```

### 5️⃣ Tester (30 sec)

```bash
cd backend
uvicorn server:app --reload
```

Logs → Tu devrais voir :
```
Using Cloudinary storage: monateliersophro
```

Admin → Upload une image → ça marche ! ✅

---

## 📖 Documentation complète

Pour plus de détails, ouvre **`CLOUDINARY_SETUP.md`**

---

## 🆘 Problèmes ?

**Erreur "Must supply api_key"**
→ Vérifie que `CLOUDINARY_URL` est bien définie dans Render Environment

**Images en 404**
→ Regarde les logs backend pour voir l'erreur exacte

---

## ✨ Avantages

- ✅ Gratuit (25 GB)
- ✅ CDN ultra-rapide
- ✅ Permanent (pas de perte lors des redéploiements)
- ✅ Backup automatique

---

## 📋 Checklist

- [ ] Compte Cloudinary créé
- [ ] `CLOUDINARY_URL` copiée
- [ ] Variables Render configurées
- [ ] `pip install cloudinary` fait
- [ ] Test d'upload OK

**C'est tout ! 🎉**
