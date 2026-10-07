import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import bcrypt
import jwt
import requests
from fastapi import APIRouter, Body, Depends, FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from fastapi.responses import Response as RawResponse
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

from lib.db import client, db, ensure_indexes

logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
ACCESS_MINUTES = 60 * 12
REFRESH_DAYS = 7

APP_NAME = "mon-atelier-sophto"
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
storage_key: Optional[str] = None


def init_storage(force: bool = False) -> str:
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": init_storage(), "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str) -> tuple[bytes, str]:
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------- Auth ----------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str, token_type: str) -> str:
    delta = timedelta(minutes=ACCESS_MINUTES) if token_type == "access" else timedelta(days=REFRESH_DAYS)
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + delta, "type": token_type}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str) -> None:
    response.set_cookie("access_token", create_token(user_id, email, "access"), httponly=True, secure=True, samesite="none", max_age=ACCESS_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", create_token(user_id, email, "refresh"), httponly=True, secure=True, samesite="none", max_age=REFRESH_DAYS * 86400, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth_header = request.headers.get("Authorization", "")
    if not token and auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"]}


async def seed_admin() -> None:
    email = os.environ["ADMIN_EMAIL"].lower().strip()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Katia Guijarro",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded: %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Admin password refreshed: %s", email)


SEED_SERVICES = [
    {"name": "Séance individuelle", "duration_min": 60, "price": 55, "price_note": None, "highlight": False,
     "description": "Un temps rien qu'à vous, à votre rythme, dans le confort de votre maison.",
     "features": ["Entretien personnalisé", "Respiration & relaxations dynamiques", "Visualisation positive guidée"]},
    {"name": "Forfait Sérénité", "duration_min": 60, "price": 250, "price_note": "5 séances, soit 50 € la séance", "highlight": True,
     "description": "Le cheminement complet pour ancrer durablement les bienfaits de la sophrologie.",
     "features": ["Suivi progressif sur 5 semaines", "Carnet offert", "Priorité sur les créneaux"]},
    {"name": "Enfants & ados", "duration_min": 45, "price": 45, "price_note": None, "highlight": False,
     "description": "Gestion des émotions, confiance en soi, préparation des examens, en douceur.",
     "features": ["Approche ludique et adaptée", "Parent présent si souhaité", "Outils réutilisables à l'école"]},
    {"name": "Groupes & entreprises", "duration_min": 60, "price": 0, "price_note": "Sur devis", "highlight": False,
     "description": "Ateliers collectifs, gestion du stress au travail, séances en petits groupes.",
     "features": ["Comités d'entreprise, associations", "Jusqu'à 10 personnes", "Déplacement dans tout le Comminges"]},
]

SEED_TESTIMONIALS = [
    {"quote": "Après quelques séances, mes crises d'angoisse se sont espacées. Katia vient chez moi, je suis dans mon cocon, tout devient plus simple.",
     "author": "Marie L.", "context": "Gestion de l'anxiété · Aspet"},
    {"quote": "Je dormais mal depuis des années. Les exercices de respiration du soir ont tout changé. Une approche douce, jamais intrusive.",
     "author": "Thomas R.", "context": "Troubles du sommeil · Saint-Gaudens"},
    {"quote": "Ma fille préparait son bac et n'arrivait plus à gérer la pression. Elle a abordé les épreuves avec un calme que je ne lui connaissais pas.",
     "author": "Sophie D.", "context": "Préparation aux examens · Salies-du-Salat"},
    {"quote": "En plein burn-out, je n'avais plus la force de me déplacer. La séance à domicile, sans avoir à reprendre la voiture après, c'est précieux.",
     "author": "Nathalie B.", "context": "Accompagnement burn-out · Arbas"},
]

SEED_FAQS = [
    {"question": "Les séances sont-elles remboursées ?",
     "answer": "La sophrologie n'est pas prise en charge par la Sécurité sociale, mais de nombreuses mutuelles remboursent tout ou partie des séances. Une facture vous est remise après chaque rendez-vous."},
    {"question": "Faut-il du matériel particulier chez moi ?",
     "answer": "Non. Une chaise, un fauteuil ou un tapis suffisent, avec un espace calme d'environ 2 m². La séance s'adapte à votre intérieur, simplement."},
    {"question": "Quelle fréquence est recommandée ?",
     "answer": "Pour un objectif précis, une séance par semaine pendant 4 à 5 semaines donne les meilleurs résultats, puis un rythme d'entretien mensuel. Chaque parcours reste adapté à vos besoins."},
    {"question": "Vous déplacez-vous vraiment partout ?",
     "answer": "Oui, dans un rayon de 20 km autour d'Arguenos (31160), sans frais supplémentaires. Au-delà, un déplacement reste possible sur simple demande, avec un léger supplément kilométrique."},
]

DEFAULT_SETTINGS = {"open_days": [0, 1, 2, 3, 4, 5], "start_time": "09:00", "end_time": "19:00", "gap_minutes": 15, "max_per_day": 5}
DEFAULT_PROFILE = {
    "display_name": "Katia Guijarro",
    "title": "Sophrologue passionnée",
    "bio": "Sophrologue itinérante dans le Comminges, je vous accompagne chez vous vers plus de calme et d'équilibre.",
    "phone": "06 72 11 11 53",
    "email": "contact@monateliersophro.fr",
    "zone": "20 km autour d'Arguenos (31160)",
    "photo_path": None,
}

DEFAULT_CONTENT = {
    "hero_surtitre": "Sophrologue itinérante · Comminges & Pyrénées",
    "hero_line1": "Retrouvez votre",
    "hero_line2_accent": "souffle",
    "hero_line2_rest": ", sans quitter",
    "hero_line3": "votre maison.",
    "hero_paragraph": "Katia se déplace chez vous, dans un rayon de 20 km autour d'Arguenos, pour des séances de sophrologie sur mesure : gestion du stress, sommeil, confiance en soi. Vous n'avez rien à préparer — juste à respirer.",
    "hero_rating": "20+",
    "hero_rating_text": "ans d'accompagnement individuel et de groupe",
    "hero_image": None,
    "marquee_items": ["Gestion du stress", "Sommeil réparateur", "Respiration contrôlée", "Écoute bienveillante", "À domicile · 20 km", "Enfants & adultes", "Astro-sophro bientôt", "Préparation mentale"],
    "about_title": "Katia Guijarro, une sophrologie qui vient à vous",
    "about_paragraph1": "Après un burn-out et un bilan de compétences, Katia s'est tournée vers ce qui l'anime depuis toujours : l'accompagnement. Elle lance son activité de sophrologie d'abord bénévolement, en mai 2025, puis officiellement le 17 septembre 2025 — séances individuelles et suivis, à domicile ou en distanciel, et ateliers collectifs en structures.",
    "about_paragraph2": "Sophrologue passionnée, forte de plus de 20 ans d'accompagnement individuel et de groupe, elle prépare aujourd'hui une longue formation d'astrologie pour ouvrir bientôt des ateliers d'astro-sophrologie — d'où les étoiles qui veillent sur l'atelier.",
    "about_badges": ["Sophrologue passionnée", "+ de 20 ans d'accompagnement individuel et de groupe", "Astro-sophrologie en formation"],
    "about_quote": "« La sophrologie n'ajoute rien de plus à votre vie. Elle vous aide simplement à retrouver ce qui est déjà là : votre capacité à respirer, à relâcher, à habiter le moment. »",
    "about_quote_author": "Katia Guijarro",
    "about_image": None,
    "services_title": "Des formules simples, le déplacement inclus",
    "services_subtitle": "Toutes les séances ont lieu à votre domicile, sans frais de déplacement dans un rayon de 20 km autour d'Arguenos.",
    "timeline_title": "Une heure suspendue, quatre temps doux",
    "timeline_steps": [
        {"title": "L'accueil & l'échange", "duration": "15 min", "text": "Un temps de parole pour poser votre besoin du jour, installer le cadre et la confiance."},
        {"title": "Respiration & relaxations dynamiques", "duration": "20 min", "text": "Des mouvements doux guidés par la voix, pour relâcher les tensions du corps et apaiser le mental."},
        {"title": "Visualisation positive guidée", "duration": "15 min", "text": "Confortablement installé·e, vous explorez une image ressource qui ancre le calme en profondeur."},
        {"title": "Clôture & phénodescription", "duration": "10 min", "text": "Un retour en douceur, un échange sur vos ressentis et des exercices simples à refaire chez vous."},
    ],
    "timeline_note": "Et le plus beau : une fois la séance terminée, vous restez chez vous. Pas de route, pas de stress — le calme continue.",
    "zone_title": "20 km autour d'Arguenos, au cœur du Comminges",
    "zone_text": "Des vallées de la Garonne aux premiers contreforts des Pyrénées, Katia parcourt les routes du Comminges pour vous rejoindre. Le déplacement est inclus dans le tarif — aucun frais caché.",
    "zone_note": "Votre commune n'apparaît pas ? Contactez Katia — un déplacement au-delà de 20 km reste possible sur demande.",
    "zone_image": None,
    "communes": ["Arguenos", "Aspet", "Salies-du-Salat", "Saint-Gaudens", "Moncaup", "Arbas", "Cazaunous", "Sengouagnet", "Juzet-d'Izaut", "Saint-Béat", "Montréjeau", "Encausse-les-Thermes", "Cazaux-Layrisse"],
    "testimonials_title": "Ils ont retrouvé leur calme, chez eux",
    "booking_title": "Réservez votre séance à domicile",
    "booking_subtitle": "Choisissez votre formule, votre créneau, et Katia vient à vous. Chaque demande est confirmée personnellement sous 24 h.",
    "faq_title": "Tout ce que vous vous demandez",
    "contact_title": "Une question, une envie ? Écrivez-lui",
    "contact_phone": "06 72 11 11 53",
    "contact_email": "contact@monateliersophro.fr",
    "contact_note": "Katia vous répond sous 24 h, du lundi au samedi. Premier échange téléphonique gratuit et sans engagement, pour faire connaissance et poser votre besoin.",
    "footer_line1": "Respirez.",
    "footer_line2": "Ancrez-vous.",
    "footer_line3": "Le reste peut attendre.",
    "sections_order": ["about", "services", "timeline", "zone", "astro", "testimonials", "cta"],
    "astro_title": "L'astro-sophrologie, quand le ciel rencontre le souffle",
    "astro_intro": "Après sa formation de sophrologie, Katia poursuit son chemin vers les étoiles : elle se forme actuellement à l'astrologie — un long cursus de trois années — pour créer des ateliers uniques mêlant la lecture symbolique du ciel et les pratiques corporelles de la sophrologie.",
    "astro_points": ["Ateliers collectifs à domicile ou en structures", "Des thèmes guidés par les cycles du ciel et les saisons", "Des pratiques de sophrologie adaptées à chacun"],
    "astro_note": "Katia est en cours de formation : les ateliers d'astro-sophrologie ouvriront prochainement. Contactez-la pour être informée du lancement.",
}


async def seed_data() -> None:
    now = datetime.now(timezone.utc).isoformat()
    if await db.services.count_documents({}) == 0:
        await db.services.insert_many([{"id": str(uuid.uuid4()), **s, "active": True, "created_at": now} for s in SEED_SERVICES])
        logger.info("Services seeded")
    if await db.testimonials.count_documents({}) == 0:
        await db.testimonials.insert_many([{"id": str(uuid.uuid4()), **t, "created_at": now} for t in SEED_TESTIMONIALS])
        logger.info("Testimonials seeded")
    if await db.faqs.count_documents({}) == 0:
        await db.faqs.insert_many([{"id": str(uuid.uuid4()), **f, "created_at": now} for f in SEED_FAQS])
        logger.info("FAQs seeded")
    await db.settings.update_one({"key": "booking"}, {"$setOnInsert": {"key": "booking", **DEFAULT_SETTINGS}}, upsert=True)
    await db.profile.update_one({"key": "profile"}, {"$setOnInsert": {"key": "profile", **DEFAULT_PROFILE}}, upsert=True)
    await db.content.update_one({"key": "site"}, {"$setOnInsert": {"key": "site", **DEFAULT_CONTENT}}, upsert=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index_task = asyncio.create_task(ensure_indexes())
    await seed_admin()
    await seed_data()
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as exc:
        logger.error("Storage init failed: %s", exc)
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ---------------- Models ----------------

class LoginBody(BaseModel):
    email: str
    password: str


class ServiceIn(BaseModel):
    name: str
    description: str = ""
    duration_min: int = 60
    price: float = 0
    price_note: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    highlight: bool = False
    active: bool = True


class ServiceOut(ServiceIn):
    id: str


class AppointmentIn(BaseModel):
    service_id: str
    service_name: str
    date: str
    time: str
    client_name: str
    phone: str
    address: str
    email: Optional[str] = None
    message: str = ""


class AppointmentOut(AppointmentIn):
    id: str
    status: str
    created_at: str


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None


class SettingsBody(BaseModel):
    open_days: List[int]
    start_time: str
    end_time: str
    gap_minutes: int
    max_per_day: int


class ProfileBody(BaseModel):
    display_name: str
    title: str = ""
    bio: str = ""
    phone: str = ""
    email: str = ""
    zone: str = ""


class TestimonialIn(BaseModel):
    quote: str
    author: str
    context: str = ""


class TestimonialOut(TestimonialIn):
    id: str


class FaqIn(BaseModel):
    question: str
    answer: str


class FaqOut(FaqIn):
    id: str


class BlockedPeriodIn(BaseModel):
    start_date: str
    end_date: str
    label: str = ""


class BlockedPeriodOut(BlockedPeriodIn):
    id: str


# ---------------- Helpers ----------------

def to_min(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


async def get_settings() -> dict:
    doc = await db.settings.find_one({"key": "booking"})
    merged = dict(DEFAULT_SETTINGS)
    if doc:
        merged.update({k: doc[k] for k in DEFAULT_SETTINGS if k in doc})
    return merged


async def is_day_blocked(day_str: str) -> bool:
    doc = await db.blocked_periods.find_one({"start_date": {"$lte": day_str}, "end_date": {"$gte": day_str}})
    return doc is not None


async def compute_day_slots(day_str: str, weekday: int, duration_min: int, settings: dict, exclude_id: Optional[str] = None) -> Optional[List[str]]:
    """None = journée fermée ou complète, sinon liste de créneaux 'HH:MM'. exclude_id ignore un RDV (replanification)."""
    if weekday not in settings["open_days"]:
        return None
    start = to_min(settings["start_time"])
    end = to_min(settings["end_time"])
    gap = settings["gap_minutes"]
    existing = await db.appointments.find({"date": day_str, "status": {"$in": ["pending", "confirmed"]}}).to_list(200)
    if exclude_id:
        existing = [a for a in existing if a["id"] != exclude_id]
    if len(existing) >= settings["max_per_day"]:
        return None
    service_ids = list({a["service_id"] for a in existing})
    durations: dict[str, int] = {}
    async for svc in db.services.find({"id": {"$in": service_ids}}):
        durations[svc["id"]] = svc["duration_min"]
    intervals = []
    for a in existing:
        s = to_min(a["time"])
        intervals.append((s, s + durations.get(a["service_id"], 60) + gap))
    now = datetime.now()
    today_str = now.date().isoformat()
    slots = []
    t = start
    while t + duration_min <= end:
        overlap = any(t < e and s < t + duration_min + gap for s, e in intervals)
        is_past = day_str == today_str and t <= now.hour * 60 + now.minute
        if not overlap and not is_past:
            slots.append(f"{t // 60:02d}:{t % 60:02d}")
        t += 30
    return slots


def pick(model: type[BaseModel], doc: dict):
    return model(**{k: v for k, v in doc.items() if k in model.model_fields})


# ---------------- Auth routes ----------------

@api_router.post("/auth/login")
async def login(body: LoginBody, request: Request, response: Response):
    email = body.email.lower().strip()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Trop de tentatives, réessayez dans quelques minutes")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, user["id"], email)
    return {"id": user["id"], "email": email, "name": user["name"], "role": user["role"]}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return user


# ---------------- Services ----------------

@api_router.get("/services", response_model=List[ServiceOut])
async def list_services():
    docs = await db.services.find({}, {"_id": 0}).to_list(200)
    return [pick(ServiceOut, d) for d in docs]


@api_router.post("/services", response_model=ServiceOut)
async def create_service(body: ServiceIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.services.insert_one(doc)
    return ServiceOut(**body.model_dump(), id=doc["id"])


@api_router.put("/services/{service_id}", response_model=ServiceOut)
async def update_service(service_id: str, body: ServiceIn, user: dict = Depends(get_current_user)):
    result = await db.services.update_one({"id": service_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service introuvable")
    return ServiceOut(**body.model_dump(), id=service_id)


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(get_current_user)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service introuvable")
    return {"ok": True}


# ---------------- Availability & appointments ----------------

@api_router.get("/availability")
async def availability(date: str, duration_min: int = 60, exclude_id: Optional[str] = None):
    try:
        day = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Date invalide")
    if await is_day_blocked(day.isoformat()):
        return {"slots": [], "closed": True, "full": False, "reason": "vacation"}
    settings = await get_settings()
    slots = await compute_day_slots(day.isoformat(), day.weekday(), duration_min, settings, exclude_id)
    if slots is None:
        closed = day.weekday() not in settings["open_days"]
        return {"slots": [], "closed": closed, "full": not closed, "reason": "weekly" if closed else "full"}
    return {"slots": slots, "closed": False, "full": False, "reason": None}


@api_router.post("/appointments", response_model=AppointmentOut)
async def create_appointment(body: AppointmentIn):
    if not body.client_name.strip() or not body.phone.strip() or not body.address.strip():
        raise HTTPException(status_code=400, detail="Nom, téléphone et adresse sont requis")
    try:
        day = datetime.strptime(body.date, "%Y-%m-%d").date()
        to_min(body.time)
    except ValueError:
        raise HTTPException(status_code=400, detail="Date ou heure invalide")
    if await is_day_blocked(body.date):
        raise HTTPException(status_code=409, detail="Cette période est fermée (congés)")
    settings = await get_settings()
    svc = await db.services.find_one({"id": body.service_id})
    duration = svc["duration_min"] if svc else 60
    service_name = svc["name"] if svc else body.service_name
    slots = await compute_day_slots(body.date, day.weekday(), duration, settings)
    if slots is None:
        raise HTTPException(status_code=409, detail="Cette journée n'est pas disponible")
    if body.time not in slots:
        raise HTTPException(status_code=409, detail="Ce créneau vient d'être pris")
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "service_id": body.service_id,
        "service_name": service_name,
        "date": body.date,
        "time": body.time,
        "client_name": body.client_name.strip(),
        "phone": body.phone.strip(),
        "address": body.address.strip(),
        "email": body.email,
        "message": body.message,
        "status": "pending",
        "created_at": now,
    }
    await db.appointments.insert_one(doc)
    existing_client = await db.clients.find_one({"phone": doc["phone"]})
    if existing_client:
        await db.clients.update_one(
            {"id": existing_client["id"]},
            {"$set": {"name": doc["client_name"], "address": doc["address"], "email": doc["email"]}, "$inc": {"appointments_count": 1}},
        )
    else:
        await db.clients.insert_one({
            "id": str(uuid.uuid4()),
            "name": doc["client_name"],
            "phone": doc["phone"],
            "address": doc["address"],
            "email": doc["email"],
            "notes": "",
            "appointments_count": 1,
            "created_at": now,
        })
    return pick(AppointmentOut, doc)


@api_router.get("/appointments", response_model=List[AppointmentOut])
async def list_appointments(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    query = {"status": status} if status else {}
    docs = await db.appointments.find(query, {"_id": 0}).to_list(1000)
    docs.sort(key=lambda d: (d["date"], d["time"]))
    return [pick(AppointmentOut, d) for d in docs]


@api_router.patch("/appointments/{appointment_id}", response_model=AppointmentOut)
async def update_appointment(appointment_id: str, body: AppointmentUpdate, user: dict = Depends(get_current_user)):
    doc = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Rendez-vous introuvable")
    updates = {}
    if body.status is not None:
        if body.status not in ("pending", "confirmed", "refused"):
            raise HTTPException(status_code=400, detail="Statut invalide")
        updates["status"] = body.status
    if body.date is not None or body.time is not None:
        new_date = body.date or doc["date"]
        new_time = body.time or doc["time"]
        try:
            day = datetime.strptime(new_date, "%Y-%m-%d").date()
            to_min(new_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Date ou heure invalide")
        if await is_day_blocked(new_date):
            raise HTTPException(status_code=409, detail="Cette période est fermée (congés)")
        settings = await get_settings()
        svc = await db.services.find_one({"id": doc["service_id"]})
        duration = svc["duration_min"] if svc else 60
        slots = await compute_day_slots(new_date, day.weekday(), duration, settings, exclude_id=appointment_id)
        if slots is None:
            raise HTTPException(status_code=409, detail="Cette journée n'est pas disponible")
        if new_time not in slots:
            raise HTTPException(status_code=409, detail="Ce créneau n'est pas disponible")
        updates["date"] = new_date
        updates["time"] = new_time
    if not updates:
        raise HTTPException(status_code=400, detail="Aucune modification")
    await db.appointments.update_one({"id": appointment_id}, {"$set": updates})
    doc = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    return pick(AppointmentOut, doc)


# ---------------- Blocked periods (congés) ----------------

@api_router.get("/blocked-periods", response_model=List[BlockedPeriodOut])
async def list_blocked_periods():
    docs = await db.blocked_periods.find({}, {"_id": 0}).to_list(200)
    docs.sort(key=lambda d: d["start_date"])
    return [pick(BlockedPeriodOut, d) for d in docs]


@api_router.post("/blocked-periods", response_model=BlockedPeriodOut)
async def create_blocked_period(body: BlockedPeriodIn, user: dict = Depends(get_current_user)):
    try:
        start = datetime.strptime(body.start_date, "%Y-%m-%d").date()
        end = datetime.strptime(body.end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Dates invalides")
    if end < start:
        raise HTTPException(status_code=400, detail="La date de fin doit être après la date de début")
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.blocked_periods.insert_one(doc)
    return BlockedPeriodOut(**body.model_dump(), id=doc["id"])


@api_router.delete("/blocked-periods/{period_id}")
async def delete_blocked_period(period_id: str, user: dict = Depends(get_current_user)):
    result = await db.blocked_periods.delete_one({"id": period_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Période introuvable")
    return {"ok": True}


# ---------------- Clients ----------------

@api_router.get("/clients")
async def list_clients(user: dict = Depends(get_current_user)):
    docs = await db.clients.find({}, {"_id": 0}).to_list(1000)
    docs.sort(key=lambda d: d.get("created_at", ""), reverse=True)
    return docs


# ---------------- Settings & profile ----------------

@api_router.get("/settings")
async def read_settings():
    return await get_settings()


@api_router.put("/settings")
async def write_settings(body: SettingsBody, user: dict = Depends(get_current_user)):
    if not body.open_days or any(d < 0 or d > 6 for d in body.open_days):
        raise HTTPException(status_code=400, detail="Jours d'ouverture invalides")
    try:
        if to_min(body.start_time) >= to_min(body.end_time):
            raise ValueError
    except ValueError:
        raise HTTPException(status_code=400, detail="Horaires invalides")
    if body.gap_minutes < 0 or body.max_per_day < 1:
        raise HTTPException(status_code=400, detail="Paramètres invalides")
    await db.settings.update_one({"key": "booking"}, {"$set": body.model_dump()}, upsert=True)
    return await get_settings()


@api_router.get("/profile")
async def read_profile():
    doc = await db.profile.find_one({"key": "profile"}, {"_id": 0, "key": 0})
    return doc or DEFAULT_PROFILE


@api_router.put("/profile")
async def write_profile(body: ProfileBody, user: dict = Depends(get_current_user)):
    await db.profile.update_one({"key": "profile"}, {"$set": body.model_dump()}, upsert=True)
    return await read_profile()


ALLOWED_IMAGE_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}


async def store_image(file: UploadFile, folder: str) -> str:
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Format non supporté (jpg, png, webp)")
    data = await file.read()
    if len(data) > 5_000_000:
        raise HTTPException(status_code=400, detail="Image trop lourde (5 Mo max)")
    result = put_object(f"{APP_NAME}/uploads/{folder}/{uuid.uuid4()}.{ext}", data, ALLOWED_IMAGE_TYPES[ext])
    return result["path"]


@api_router.post("/profile/photo")
async def upload_profile_photo(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    path = await store_image(file, "profile")
    await db.profile.update_one({"key": "profile"}, {"$set": {"photo_path": path}}, upsert=True)
    return {"photo_path": path}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    try:
        data, content_type = get_object(path)
    except requests.HTTPError as exc:
        status = exc.response.status_code if exc.response is not None else 500
        raise HTTPException(status_code=status, detail="Fichier indisponible")
    return RawResponse(content=data, media_type=content_type)


# ---------------- Site content (CMS) ----------------

@api_router.get("/content")
async def read_content():
    doc = await db.content.find_one({"key": "site"}, {"_id": 0, "key": 0})
    merged = dict(DEFAULT_CONTENT)
    if doc:
        merged.update({k: doc[k] for k in DEFAULT_CONTENT if k in doc})
    return merged


@api_router.put("/content")
async def write_content(body: dict = Body(...), user: dict = Depends(get_current_user)):
    updates = {}
    for key, value in body.items():
        if key not in DEFAULT_CONTENT:
            continue
        default = DEFAULT_CONTENT[key]
        if isinstance(default, str) and isinstance(value, str):
            updates[key] = value
        elif isinstance(default, list) and isinstance(value, list):
            updates[key] = value
    if not updates:
        raise HTTPException(status_code=400, detail="Aucun champ valide")
    await db.content.update_one({"key": "site"}, {"$set": updates}, upsert=True)
    return await read_content()


CONTENT_IMAGE_FIELDS = {"hero_image", "about_image", "zone_image"}


@api_router.post("/content/image")
async def upload_content_image(field: str = Form(...), file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    if field not in CONTENT_IMAGE_FIELDS:
        raise HTTPException(status_code=400, detail="Champ image inconnu")
    path = await store_image(file, "content")
    await db.content.update_one({"key": "site"}, {"$set": {field: path}}, upsert=True)
    return {"field": field, "path": path}


# ---------------- Testimonials ----------------

@api_router.get("/testimonials", response_model=List[TestimonialOut])
async def list_testimonials():
    docs = await db.testimonials.find({}, {"_id": 0}).to_list(200)
    return [pick(TestimonialOut, d) for d in docs]


@api_router.post("/testimonials", response_model=TestimonialOut)
async def create_testimonial(body: TestimonialIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.testimonials.insert_one(doc)
    return TestimonialOut(**body.model_dump(), id=doc["id"])


@api_router.put("/testimonials/{testimonial_id}", response_model=TestimonialOut)
async def update_testimonial(testimonial_id: str, body: TestimonialIn, user: dict = Depends(get_current_user)):
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Témoignage introuvable")
    return TestimonialOut(**body.model_dump(), id=testimonial_id)


@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: dict = Depends(get_current_user)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Témoignage introuvable")
    return {"ok": True}


# ---------------- FAQs ----------------

@api_router.get("/faqs", response_model=List[FaqOut])
async def list_faqs():
    docs = await db.faqs.find({}, {"_id": 0}).to_list(200)
    return [pick(FaqOut, d) for d in docs]


@api_router.post("/faqs", response_model=FaqOut)
async def create_faq(body: FaqIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), **body.model_dump(), "created_at": datetime.now(timezone.utc).isoformat()}
    await db.faqs.insert_one(doc)
    return FaqOut(**body.model_dump(), id=doc["id"])


@api_router.put("/faqs/{faq_id}", response_model=FaqOut)
async def update_faq(faq_id: str, body: FaqIn, user: dict = Depends(get_current_user)):
    result = await db.faqs.update_one({"id": faq_id}, {"$set": body.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Question introuvable")
    return FaqOut(**body.model_dump(), id=faq_id)


@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, user: dict = Depends(get_current_user)):
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question introuvable")
    return {"ok": True}


# ---------------- Misc ----------------

@api_router.get("/")
async def root():
    return {"message": "Mon Atelier Sophto API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
