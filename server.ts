import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '5mb' }));

  // Initialize Gemini API client if key exists
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // AI Admissions Counselor API endpoint
  app.post('/api/counselor', async (req: Request, res: Response) => {
    try {
      const { prompt, collegesContext, userProfile } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!ai) {
        // Fallback response if API key is not configured in environment
        return res.json({
          reply: `Based on your query: "${prompt}", here is a structured counselor breakdown:\n\n` +
            `• **Academic Tier & Brand Power**: Consider that Tier-1 institutes (Top 7 IITs, IIM A/B/C, AIIMS Delhi, BITS Pilani) provide lifelong alumni leverage and global brand recognition.\n` +
            `• **Return on Investment (ROI)**: Government institutions like FMS Delhi, IITs, NITs, and Jadavpur offer unmatched ROI due to subsidized tuition fees against high median placement CTCs.\n` +
            `• **Branch vs. College Decision**: If you are passionate about a specific field (like CS or AI), choose the best college offering that stream. If undecided, prioritize the higher-tier college (e.g. Top 5 IITs) for flexible electives, superior peer groups, and non-tech placement opportunities.\n` +
            `• **Quota & State Optimization**: Take full advantage of Home State quotas (50% in NITs, 85% in DTU/NSUT/IPU) or category cutoffs to secure optimal branches.`,
          source: 'rule_fallback'
        });
      }

      const systemInstruction = `You are ShikshaSetu's Expert Admissions Counselor & Higher Education Strategist for Indian colleges and universities.
You have deep, authoritative knowledge of NIRF rankings, JEE Advanced, JEE Main, JoSAA/CSAB counseling, CAT/IIM criteria, NEET UG/PG, CUET, BITSAT, CLAT, fee structures, ROI, placement packages (CTC & median), hostel life, quota reservation rules (General, EWS, OBC-NCL, SC, ST, Home State vs Other State), and branch vs college dilemmas.

Guidelines:
1. Provide objective, well-structured, student-first advice.
2. When comparing colleges, analyze:
   - Placement CTC, median salary, and top tech/consulting/core recruiters
   - Tuition fees and ROI payback
   - Academic rigor, faculty, and research culture
   - Campus life, clubs, location advantage (e.g., Bangalore/Hyderabad tech hub vs remote)
   - Cutoff realism and practical advice
3. Use clean formatting with clear headings, bullet points, and actionable takeaways.
4. Keep the tone empathetic, practical, and highly informative.`;

      let contextText = '';
      if (collegesContext && collegesContext.length > 0) {
        contextText = `\nSelected Colleges for Context:\n${JSON.stringify(collegesContext, null, 2)}\n`;
      }
      if (userProfile) {
        contextText += `\nStudent Profile:\n${JSON.stringify(userProfile, null, 2)}\n`;
      }

      const fullPrompt = `${systemInstruction}\n${contextText}\n\nStudent Question / Dilemma: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
      });

      return res.json({
        reply: response.text || 'Unable to generate recommendation at this time.',
        source: 'gemini'
      });
    } catch (err: any) {
      console.error('Error generating counselor advice:', err);
      return res.status(500).json({
        error: 'Failed to generate counselor advice',
        details: err?.message || 'Unknown error'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
  });

  // Serve static files in production, or mount Vite middlewares in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShikshaSetu server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
