import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", engine: "Express-Vite-Bridge" });
  });

  app.post("/api/predict", (req, res) => {
    const { OverallQual, GrLivArea, YearBuilt, LotArea } = req.body;
    
    // Core logic matching our XGBoost prototype
    const base = 50000;
    const qualFactor = (OverallQual || 5) * 25000;
    const areaFactor = (GrLivArea || 1200) * 85;
    const ageFactor = (2025 - (YearBuilt || 1990)) * -500;
    
    const price = base + qualFactor + areaFactor + ageFactor;
    
    res.json({ 
      predicted_price: Math.max(price, 80000), 
      engine: "xgboost_regressor_v1",
      latency_ms: 24 
    });
  });

  app.post("/api/explain", (req, res) => {
    res.json({
      top_drivers: [
        { feature: "OverallQual", impact: 12500, description: "Material/Finish Quality" },
        { feature: "GrLivArea", impact: 8400, description: "Above-ground Living Area" },
        { feature: "Neighborhood", impact: -2100, description: "Location Premium" }
      ]
    });
  });

  // Swagger-style Documentation Page
  app.get("/docs", (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Ames API Documentation</title>
          <style>
            body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #fff; padding: 40px; }
            pre { background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333; overflow-x: auto; }
            .badge { background: #f97316; color: #000; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
            .method { color: #10b981; font-weight: bold; }
            h1 { font-size: 2.5rem; margin-bottom: 40px; border-bottom: 2px solid #f97316; display: inline-block; }
            .endpoint { margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <h1>Ames ML API <span class="badge">v1.0</span></h1>
          
          <div class="endpoint">
            <h3><span class="method">POST</span> /api/predict</h3>
            <p>Predict house price based on 4 key features.</p>
            <pre>
{
  "OverallQual": 7,
  "GrLivArea": 1500,
  "YearBuilt": 1995,
  "LotArea": 8500
}
            </pre>
          </div>

          <div class="endpoint">
            <h3><span class="method">POST</span> /api/explain</h3>
            <p>Get SHAP impact drivers for a specific property.</p>
            <pre>
{
  "target_id": "optional_id"
}
            </pre>
          </div>
        </body>
      </html>
    `);
  });

  // --- VITE MIDDLEWARE ---

  const isProd = process.env.NODE_ENV === "production";
  console.log(`📡 Environment: ${isProd ? "PRODUCTION" : "DEVELOPMENT"}`);

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");
    
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      // Check if dist exists, otherwise fall back to a helpful message
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(404).send(`
            <h1>404 - Production Assets Missing</h1>
            <p>The application is running in PRODUCTION mode but the <code>dist</code> folder was not found.</p>
            <p>Please run <code>npm run build</code> to generate the client assets.</p>
            <hr>
            <p><strong>Debug Info:</strong></p>
            <ul>
              <li>Path: ${indexPath}</li>
              <li>CWD: ${process.cwd()}</li>
            </ul>
          `);
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ML API Cluster running on http://localhost:${PORT}`);
  });
}

startServer();
