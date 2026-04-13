This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file from `.env.example` and set your keys:

```bash
cp .env.example .env.local
```

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

## Free map + geocoding

The app uses:

- OpenStreetMap tiles via Leaflet (free)
- Nominatim geocoding endpoint (free) for place name to coordinates

Nominatim public endpoint:

- `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=YOUR_PLACE`

## API Route

`POST /api/generate`

Request body:

```json
{
  "destination": "Bali",
  "budget": 1200,
  "days": 5,
  "style": "adventure",
  "interests": ["food", "nature"]
}
```

Response shape:

```json
{
  "dayWisePlan": [
    {
      "day": 1,
      "title": "...",
      "activities": ["..."],
      "places": ["..."]
    }
  ],
  "budgetBreakdown": {
    "stay": "...",
    "food": "...",
    "transport": "..."
  },
  "reelIdeas": [
    {
      "hook": "...",
      "caption": "...",
      "hashtags": ["#..."]
    }
  ],
  "blogContent": {
    "title": "...",
    "preview": "..."
  }
}
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
