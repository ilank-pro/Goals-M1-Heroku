#!/bin/bash

# Set the backend URL
BACKEND_URL="https://goals-app-m1-docker-backend-da63a4170bf6.herokuapp.com"

echo "Creating CEO..."
CEO_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name": "Mark Zuckerberg", "position": "Chief Executive Officer", "parent_id": null}' \
  $BACKEND_URL/api/persons/)
CEO_ID=$(echo $CEO_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "Creating C-Level executives..."
# Create CFO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Susan Li\", \"position\": \"Chief Financial Officer\", \"parent_id\": $CEO_ID}" \
  $BACKEND_URL/api/persons/

# Create CTO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Andrew Bosworth\", \"position\": \"Chief Technology Officer\", \"parent_id\": $CEO_ID}" \
  $BACKEND_URL/api/persons/

# Create CPO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Chris Cox\", \"position\": \"Chief Product Officer\", \"parent_id\": $CEO_ID}" \
  $BACKEND_URL/api/persons/

# Create COO and get ID
COO_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Javier Olivan\", \"position\": \"Chief Operating Officer\", \"parent_id\": $CEO_ID}" \
  $BACKEND_URL/api/persons/)
COO_ID=$(echo $COO_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

echo "Creating COO's direct reports..."
# Create CRO and get ID
CRO_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Monetization\", \"position\": \"Chief Revenue Officer\", \"parent_id\": $COO_ID}" \
  $BACKEND_URL/api/persons/)
CRO_ID=$(echo $CRO_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

# Create other VPs under COO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Product\", \"position\": \"VP, Product Management\", \"parent_id\": $COO_ID}" \
  $BACKEND_URL/api/persons/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Infrastructure\", \"position\": \"VP, Infrastructure\", \"parent_id\": $COO_ID}" \
  $BACKEND_URL/api/persons/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"GBU\", \"position\": \"VP, Global Business Group\", \"parent_id\": $COO_ID}" \
  $BACKEND_URL/api/persons/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Marketing\", \"position\": \"VP, Analytics & CMO\", \"parent_id\": $COO_ID}" \
  $BACKEND_URL/api/persons/

echo "Creating CRO's direct reports..."
# Create VPs under CRO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Business AI\", \"position\": \"VP, Business AI\", \"parent_id\": $CRO_ID}" \
  $BACKEND_URL/api/persons/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Sales\", \"position\": \"VP, Sales\", \"parent_id\": $CRO_ID}" \
  $BACKEND_URL/api/persons/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Product\", \"position\": \"VP, Monetization Product Management\", \"parent_id\": $CRO_ID}" \
  $BACKEND_URL/api/persons/

# Create Engineering VP with documents and goals
ENG_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Engineering\", \"position\": \"VP, Engineering\", \"parent_id\": $CRO_ID}" \
  $BACKEND_URL/api/persons/)
ENG_ID=$(echo $ENG_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

# Add documents for Engineering VP
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"title\": \"H1'25 Priorities\", \"link\": \"https://about.fb.com/news/\", \"description\": \"\", \"person_id\": $ENG_ID, \"is_private\": false}" \
  $BACKEND_URL/api/documents/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"title\": \"H1'25 Roadmap\", \"link\": \"https://www.meta.com/ai-glasses/?utm_content=60956_v0&utm_source=about.meta.com&utm_medium=organicsearch\", \"description\": \"\", \"person_id\": $ENG_ID, \"is_private\": false}" \
  $BACKEND_URL/api/documents/

# Add goals for Engineering VP
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"EYS\", \"current_value\": 24.0, \"target\": 153.0, \"is_private\": true, \"person_id\": $ENG_ID}" \
  $BACKEND_URL/api/goals/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"iRev\", \"current_value\": 0.73, \"target\": 2.4, \"is_private\": false, \"person_id\": $ENG_ID}" \
  $BACKEND_URL/api/goals/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"Experiences\", \"position\": \"VP, New Monetization Experiences\", \"parent_id\": $CRO_ID}" \
  $BACKEND_URL/api/persons/

# Add goals for CEO and COO
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"iRev\", \"current_value\": 0.73, \"target\": 2.4, \"is_private\": false, \"person_id\": $CEO_ID}" \
  $BACKEND_URL/api/goals/

curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"name\": \"iRev\", \"current_value\": 0.73, \"target\": 2.4, \"is_private\": false, \"person_id\": $COO_ID}" \
  $BACKEND_URL/api/goals/

echo "Database initialization completed!" 