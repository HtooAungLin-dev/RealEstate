import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { SINGAPORE_PROPERTIES, SINGAPORE_DISTRICTS, SINGAPORE_MRT_LINES } from './src/data/properties.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent fallback store for development/server sessions
let savedSearchesStore: any[] = [
  {
    id: 'search-1',
    title: 'Condos in Orchard / River Valley (D09)',
    filters: { district: 'D09', category: 'condo', minPrice: 2000000, maxPrice: 4000000 },
    frequency: 'instant',
    createdAt: new Date().toISOString(),
    matchCount: 2,
    active: true,
  },
];

let messagesStore: any[] = [];

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Property search and filters
app.get('/api/properties', (req: Request, res: Response) => {
  try {
    const {
      keyword = '',
      transactionType = 'all',
      category = 'all',
      minPrice,
      maxPrice,
      bedrooms = 'all',
      bathrooms = 'all',
      district = 'all',
      mrtLine = 'all',
      tenure = 'any',
      furnishing = 'any',
      verifiedOnly,
      virtualTourOnly,
      sortBy = 'recommended',
    } = req.query;

    let filtered = [...SINGAPORE_PROPERTIES];

    if (transactionType && transactionType !== 'all') {
      filtered = filtered.filter((p) => p.transactionType === transactionType);
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (keyword) {
      const q = String(keyword).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.project.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.districtName.toLowerCase().includes(q) ||
          p.mrtStation.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      const min = Number(minPrice);
      filtered = filtered.filter((p) => p.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      filtered = filtered.filter((p) => p.price <= max);
    }

    if (bedrooms && bedrooms !== 'all') {
      if (bedrooms === 'studio') {
        filtered = filtered.filter((p) => p.bedrooms === 0);
      } else if (bedrooms === '5') {
        filtered = filtered.filter((p) => p.bedrooms >= 5);
      } else {
        const beds = Number(bedrooms);
        filtered = filtered.filter((p) => p.bedrooms === beds);
      }
    }

    if (bathrooms && bathrooms !== 'all') {
      const baths = Number(bathrooms);
      filtered = filtered.filter((p) => p.bathrooms >= baths);
    }

    if (district && district !== 'all') {
      filtered = filtered.filter((p) => p.district === district);
    }

    if (mrtLine && mrtLine !== 'all') {
      filtered = filtered.filter((p) => p.mrtLines.includes(mrtLine as any));
    }

    if (tenure && tenure !== 'any') {
      filtered = filtered.filter((p) => p.tenure.toLowerCase().includes(String(tenure).toLowerCase()));
    }

    if (furnishing && furnishing !== 'any') {
      filtered = filtered.filter((p) => p.furnishing.toLowerCase().includes(String(furnishing).toLowerCase()));
    }

    if (verifiedOnly === 'true') {
      filtered = filtered.filter((p) => p.verifiedListing);
    }

    if (virtualTourOnly === 'true') {
      filtered = filtered.filter((p) => p.virtualTourAvailable);
    }

    // Sort
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'psf_asc') {
      filtered.sort((a, b) => a.pricePerSqft - b.pricePerSqft);
    } else if (sortBy === 'size_desc') {
      filtered.sort((a, b) => b.floorAreaSqft - a.floorAreaSqft);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    }

    res.json({
      total: filtered.length,
      properties: filtered,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch properties' });
  }
});

// Single property detail
app.get('/api/properties/:id', (req: Request, res: Response) => {
  const property = SINGAPORE_PROPERTIES.find((p) => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json(property);
});

// Reference data
app.get('/api/districts', (req: Request, res: Response) => {
  res.json(SINGAPORE_DISTRICTS);
});

app.get('/api/mrt-lines', (req: Request, res: Response) => {
  res.json(SINGAPORE_MRT_LINES);
});

// Saved searches & alerts
app.get('/api/saved-searches', (req: Request, res: Response) => {
  res.json(savedSearchesStore);
});

app.post('/api/saved-searches', (req: Request, res: Response) => {
  const { title, filters, frequency } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Alert title is required' });
  }
  const newSearch = {
    id: `search-${Date.now()}`,
    title,
    filters: filters || {},
    frequency: frequency || 'instant',
    createdAt: new Date().toISOString(),
    matchCount: SINGAPORE_PROPERTIES.length,
    active: true,
  };
  savedSearchesStore.unshift(newSearch);
  res.status(201).json(newSearch);
});

app.delete('/api/saved-searches/:id', (req: Request, res: Response) => {
  savedSearchesStore = savedSearchesStore.filter((s) => s.id !== req.params.id);
  res.json({ success: true });
});

// Direct Messaging API
app.get('/api/messages', (req: Request, res: Response) => {
  const { propertyId } = req.query;
  if (propertyId) {
    const thread = messagesStore.filter((m) => m.propertyId === propertyId);
    return res.json(thread);
  }
  res.json(messagesStore);
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { propertyId, propertyTitle, agentId, text, sender = 'user' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const userMsg = {
    id: `msg-${Date.now()}`,
    propertyId,
    propertyTitle,
    agentId,
    sender,
    text,
    timestamp: new Date().toISOString(),
  };
  messagesStore.push(userMsg);

  // Generate automated agent response after user sends an inquiry
  let agentReply = null;
  if (sender === 'user') {
    const replies = [
      `Hello! Thank you for inquiring about ${propertyTitle || 'this listing'}. The unit is available for viewings this week. Would Saturday afternoon 2:00 PM or Sunday 11:00 AM work for you?`,
      `Hi there! Marcus here from PropNex. I'd be happy to arrange a private walkthrough for you and share the latest bank indicative valuation and floorplan. Let me know your available slots!`,
      `Good day! Yes, this high-floor unit is still on the market. The seller is keen and there is slight room for negotiation. Let's schedule an in-person viewing soon!`,
    ];
    const chosenReply = replies[Math.floor(Math.random() * replies.length)];
    agentReply = {
      id: `msg-${Date.now() + 1}`,
      propertyId,
      propertyTitle,
      agentId,
      sender: 'agent',
      text: chosenReply,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      suggestedViewingSlots: ['Sat 2:00 PM', 'Sat 4:30 PM', 'Sun 11:00 AM'],
    };
    messagesStore.push(agentReply);
  }

  res.status(201).json({
    message: userMsg,
    agentReply,
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// If run directly (e.g. `node server.ts` or `tsx server.ts`)
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PropertyGuru Singapore API Server running on port ${PORT}`);
  });
}
