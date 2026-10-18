# 🔧 Bouton de Migration de la Base de Données

## ✅ Ce qui a été ajouté

### Backend (`server.py`)
Nouvel endpoint **`POST /api/admin/migrate`** qui :
- ✅ Vérifie tous les services et ajoute `display_order` s'il manque
- ✅ Vérifie tous les rendez-vous et ajoute `status` et `created_at` s'ils manquent
- ✅ Vérifie tous les témoignages et ajoute `created_at` s'il manque
- ✅ Vérifie toutes les FAQs et ajoute `created_at` s'il manque
- ✅ Retourne un rapport détaillé des corrections effectuées

### Frontend (`SettingsPage.tsx`)
Nouvelle section **"Outils de maintenance"** avec :
- 🟡 Zone jaune visible pour attirer l'attention
- 🔘 Bouton "Migrer la base de données"
- ⚠️ Confirmation avant exécution
- 📊 Toast de succès/erreur avec rapport dans la console

---

## 🎯 Quand utiliser ce bouton ?

### Cas d'usage :

1. **Après un déploiement** avec changement de schéma
2. **Erreur 422 "Field required"** sur certaines opérations
3. **Données corrompues** ou incomplètes
4. **Migration de version** après une mise à jour majeure
5. **Import de données** depuis une ancienne version

---

## 🚀 Comment utiliser

### 1. Se connecter en admin
```
https://sophrologie.onrender.com/admin/login
katia@monateliersophro.fr / AtelierSophro2026!
```

### 2. Aller dans Paramètres
Menu Admin → **Paramètres**

### 3. Défiler en bas de page
Section jaune **"Outils de maintenance"**

### 4. Cliquer sur le bouton
**"Migrer la base de données"**

### 5. Confirmer
Popup de confirmation → **OK**

### 6. Vérifier le résultat
- ✅ Toast de succès : "Migration terminée avec succès"
- 📊 Console (F12) : Voir le rapport détaillé

---

## 📊 Rapport de migration

Le rapport dans la console ressemble à :
```json
{
  "ok": true,
  "message": "Migration terminée avec succès",
  "report": {
    "services_fixed": 4,
    "appointments_fixed": 0,
    "testimonials_fixed": 0,
    "faqs_fixed": 0,
    "errors": []
  }
}
```

**Interprétation** :
- `services_fixed: 4` → 4 services ont été corrigés (display_order ajouté)
- `appointments_fixed: 0` → Aucun rendez-vous à corriger
- `errors: []` → Aucune erreur

---

## 🧪 Test de la migration

### Avant de déployer :

**Local** :
```bash
cd backend
uvicorn server:app --reload
```

**Test manuel** :
```bash
curl -X POST "http://localhost:8001/api/admin/migrate" \
  -H "Cookie: access_token=TON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Après déploiement :

```bash
git add .
git commit -m "Ajout bouton migration DB pour maintenance"
git push origin main
```

Attends le redéploiement Render (2-3 min).

---

## 🔍 Ce que la migration corrige

### Services
```python
# Ajoute display_order si manquant
if "display_order" not in service:
    service["display_order"] = index
```

### Rendez-vous
```python
# Ajoute status et created_at si manquants
if "status" not in appointment:
    appointment["status"] = "pending"
if "created_at" not in appointment:
    appointment["created_at"] = datetime.now().isoformat()
```

### Témoignages & FAQs
```python
# Ajoute created_at si manquant
if "created_at" not in item:
    item["created_at"] = datetime.now().isoformat()
```

---

## 🛡️ Sécurité

- ✅ **Route protégée** : Nécessite authentification admin
- ✅ **Confirmation** : Popup avant exécution
- ✅ **Logs** : Toutes les actions sont loggées côté backend
- ✅ **Rapport** : Retour détaillé de ce qui a été fait
- ✅ **Non destructif** : Ajoute des champs manquants, ne supprime rien

---

## 🚨 Que faire si la migration échoue ?

### Erreur 401 Unauthorized
**Cause** : Token expiré
**Solution** : Déconnexion → Reconnexion

### Erreur 500 Internal Server Error
**Cause** : Problème dans le code backend
**Solution** :
1. Regarde les logs Render
2. Copie l'erreur exacte
3. Envoie-la moi

### Erreur dans le rapport
**Exemple** :
```json
{
  "errors": ["Duplicate key error on service xyz"]
}
```
**Solution** : Envoie-moi le rapport complet

---

## ✅ Checklist après migration

- [ ] Toast de succès affiché
- [ ] Console (F12) : rapport sans erreurs
- [ ] Services : réorganisation fonctionne
- [ ] Rendez-vous : affichage normal
- [ ] Témoignages : affichage normal
- [ ] FAQs : affichage normal

---

## 🔄 Migration automatique au démarrage (optionnel)

Si tu veux que la migration se lance automatiquement au démarrage du backend :

**Dans `server.py`** :
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    await ensure_indexes()
    await seed_admin()
    await seed_data()
    await migrate_database_auto()  # ← Ajoute ça
    yield
    client.close()
```

Mais **attention** : cela peut ralentir le démarrage si la BDD est grande.

---

## 📝 Logs backend

Les logs Render afficheront :
```
INFO: Reorder services called with 4 services
INFO: Migration complete: {'services_fixed': 4, 'appointments_fixed': 0, ...}
```

---

## 🎯 Résumé

**Problème** : Erreur 422 "Field required" après mise à jour

**Solution** : Bouton de migration dans Admin → Paramètres

**Action** : Clic → Confirmation → Migration → Succès ✅

---

**Le bouton est maintenant disponible dans l'admin !** 🎉
