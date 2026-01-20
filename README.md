# Niche Hackathon - Phone Agent

Create and manage phone agents using the Niche API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Get an OAuth token using your client credentials:

```bash
curl -X POST https://app.nicheandleads.com/api/partner/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret"
  }'
```

3. Set your environment variables:

```bash
export NICHE_OAUTH_TOKEN="your-oauth-token-from-step-2"
export NICHE_BUSINESS_ID="your-business-id"
```

## Running

```bash
# Run the phone agent script
npm start

# Run with watch mode (auto-reload on changes)
npm run dev
```

## What the Script Does

1. Lists existing voice agents for your business
2. Creates a new inbound phone agent with:
   - Custom instructions
   - Friendly personality
   - Business hours (Mon-Fri 9am-5pm EST)
   - Fields to collect (name, phone, email)
3. Deploys the agent to get a phone number
4. Lists agents again to show the new one

## Available Commands

```bash
npm start        # Run src/index.ts
npm run dev      # Run with watch mode
npm run typecheck # Check types
npm run build    # Compile to JavaScript
```
