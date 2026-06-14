# StayFinder — Hotel Search App

A hotel search web app built with HTML, CSS, JavaScript, and a serverless backend powered by the Anthropic API.

## Live Demo
Deploy this on Vercel and search hotels by city/location — get real hotel details with ratings, prices, amenities, and more.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import this repo.
3. In **Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key (get one at console.anthropic.com)
4. Deploy. Vercel will detect `/api/hotels.js` as a serverless function automatically.
5. Your app is live — no API key needed by users, it's safely stored on the server.

## Project Structure
```
index.html      → Frontend (search UI, hotel cards, filters)
api/hotels.js   → Serverless function that calls Anthropic API securely
```
