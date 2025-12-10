#!/bin/bash
BASE_URL="http://localhost:3000/api"

echo "1. Signup..."
curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
echo -e "\n"

echo "2. Login..."
LOGIN_RES=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}')
echo $LOGIN_RES
TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo -e "\n"

echo "3. Get Settings..."
curl -s $BASE_URL/game/settings
echo -e "\n"

echo "4. Start Game..."
GAME_RES=$(curl -s -X POST $BASE_URL/game/start \
  -H "Content-Type: application/json" \
  -d '{"gameMode": "walls"}')
echo $GAME_RES
GAME_ID=$(echo $GAME_RES | grep -o '"gameId":"[^"]*' | cut -d'"' -f4)
echo "Game ID: $GAME_ID"
echo -e "\n"

echo "5. Submit Score..."
# Assuming user id is generated as a number based on Date.now().
# Since I can't easily parse JSON with simple grep for dynamic IDs without jq (which might not be installed),
# I'll rely on the server returning success.
# Alternatively, I can cheat and just use the token which contains the ID in the payload, but the server needs the body.
# Let's just submit with a hardcoded ID or fetch from login response if possible.
# Wait, my server implementation for login returns the user object which has the ID.
# Let's try to parse ID from login response.
USER_ID=$(echo $LOGIN_RES | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "User ID: $USER_ID"

curl -s -X POST $BASE_URL/game/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\": $USER_ID, \"gameId\": \"$GAME_ID\", \"score\": 100, \"gameMode\": \"walls\", \"endedAt\": \"$(date -Iseconds)\"}"
echo -e "\n"

echo "6. Get Leaderboard..."
curl -s $BASE_URL/leaderboard
echo -e "\n"

echo "7. Start Watching..."
# Use user ID as target just to test
curl -s -X POST $BASE_URL/watching/$USER_ID/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
echo -e "\n"

echo "8. Get Watching Players..."
curl -s $BASE_URL/watching/players
echo -e "\n"
