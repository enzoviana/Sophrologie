#!/bin/bash

# Test de l'endpoint /api/services/reorder
# Remplace l'URL par ton URL Render si besoin

API_URL="${1:-http://localhost:8001}"

echo "🧪 Test de l'endpoint /api/services/reorder"
echo "URL: $API_URL/api/services/reorder"
echo ""

# Test 1: Format correct
echo "📤 Test 1: Envoi du format correct"
curl -X PUT "$API_URL/api/services/reorder" \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_TOKEN" \
  -d '{"service_ids": ["id1", "id2", "id3"]}' \
  -w "\n📊 Status: %{http_code}\n" \
  -s

echo ""
echo "---"
echo ""

# Test 2: Format incorrect (array direct)
echo "📤 Test 2: Envoi d'un array direct (devrait échouer)"
curl -X PUT "$API_URL/api/services/reorder" \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_TOKEN" \
  -d '["id1", "id2", "id3"]' \
  -w "\n📊 Status: %{http_code}\n" \
  -s

echo ""
echo "---"
echo ""

# Test 3: Sans body
echo "📤 Test 3: Sans body (devrait échouer)"
curl -X PUT "$API_URL/api/services/reorder" \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=YOUR_TOKEN" \
  -w "\n📊 Status: %{http_code}\n" \
  -s
