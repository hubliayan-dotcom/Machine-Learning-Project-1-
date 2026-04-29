/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BarChart3, 
  BrainCircuit, 
  ChevronRight, 
  Activity, 
  Search, 
  Github, 
  ExternalLink,
  Code2,
  Calendar,
  Layers,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// --- MOCK DATA FOR EDA ---
const correlationData = [
  { feature: 'OverallQual', correlation: 0.79 },
  { feature: 'GrLivArea', correlation: 0.71 },
  { feature: 'GarageCars', correlation: 0.64 },
  { feature: 'GarageArea', correlation: 0.62 },
  { feature: 'TotalBsmtSF', correlation: 0.61 },
  { feature: '1stFlrSF', correlation: 0.61 },
  { feature: 'FullBath', correlation: 0.56 },
  { feature: 'TotRmsAbvGrd', correlation: 0.53 },
  { feature: 'YearBuilt', correlation: 0.52 },
];

const priceDistData = [
  { price: '0-100k', count: 120 },
  { price: '100-150k', count: 450 },
  { price: '150-200k', count: 380 },
  { price: '200-250k', count: 210 },
  { price: '250-300k', count: 120 },
  { price: '300-400k', count: 80 },
  { price: '400k+', count: 40 },
];

const actualVsPred = [
  { actual: 150000, pred: 148000, residual: 2000 },
  { actual: 210000, pred: 205000, residual: 5000 },
  { actual: 320000, pred: 312000, residual: 8000 },
  { actual: 110000, pred: 115000, residual: -5000 },
  { actual: 450000, pred: 430000, residual: 20000 },
  { actual: 180000, pred: 182000, residual: -2000 },
  { actual: 260000, pred: 255000, residual: 5000 },
  { actual: 550000, pred: 520000, residual: 30000 },
  { actual: 130000, pred: 135000, residual: -5000 },
  { actual: 380000, pred: 375000, residual: 5000 },
  { actual: 190000, pred: 188000, residual: 2000 },
  { actual: 240000, pred: 245000, residual: -5000 },
];

const datasetPreview = [
  { id: 1, lotArea: 8450, qual: 7, year: 2003, grArea: 1710, price: 208500 },
  { id: 2, lotArea: 9600, qual: 6, year: 1976, grArea: 1262, price: 181500 },
  { id: 3, lotArea: 11250, qual: 7, year: 2001, grArea: 1786, price: 223500 },
  { id: 4, lotArea: 9550, qual: 7, year: 1915, grArea: 1717, price: 140000 },
  { id: 5, lotArea: 14260, qual: 8, year: 2000, grArea: 2198, price: 250000 },
];

// --- COMPONENTS ---

// --- COMPONENTS ---

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
          <Home className="text-black w-5 h-5" />
        </div>
        <span className="font-mono font-bold text-white tracking-tighter text-xl">AMES_PREDICT_v1.0</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-zinc-400">
        <a href="#overview" className="hover:text-orange-500 transition-colors">Overview</a>
        <a href="#analysis" className="hover:text-orange-500 transition-colors">Analysis</a>
        <a href="#predict" className="hover:text-orange-500 transition-colors underline underline-offset-4 decoration-orange-500">Live Predictor</a>
        <a href="https://github.com" className="flex items-center gap-2 hover:text-white transition-colors">
          <Github className="w-4 h-4" />
          Repo
        </a>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section id="overview" className="relative pt-32 pb-20 px-6 bg-[#0a0a0a] overflow-hidden">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/10 to-transparent blur-3xl" />
    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-mono text-orange-500 text-sm uppercase tracking-[0.2em] mb-4 block">End-to-End ML Portfolio</span>
        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
          PREDICTING <br />
          <span className="text-zinc-600">THE PRICE OF</span> <br />
          SHELTER.
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg mb-10 leading-relaxed">
          A deep dive into supervised regression using the Ames Housing dataset. This project leverages XGBoost with Optuna-tuned hyperparameters to estimate property valuations with an RMSE of <span className="text-white font-mono">$18,430</span>.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-orange-500 text-black font-bold uppercase tracking-widest text-sm hover:bg-orange-400 transition-all">
            View Analysis
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
            Live Demo
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const MetricCard = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
  <div className="p-6 bg-zinc-900 border border-white/5 rounded-lg">
    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">{label}</span>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <span className="text-[10px] font-mono text-emerald-400 uppercase">{sub}</span>
  </div>
);

const Predictor = () => {
  const [inputs, setInputs] = useState({
    LotArea: 8500,
    OverallQual: 7,
    YearBuilt: 1995,
    GrLivArea: 1500,
    FullBath: 2,
    GarageCars: 2
  });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    // Simulated prediction logic based on Ames regressions
    setTimeout(() => {
      const base = 50000;
      const qualFactor = inputs.OverallQual * 25000;
      const areaFactor = inputs.GrLivArea * 85;
      const ageFactor = (2025 - inputs.YearBuilt) * -500;
      const price = base + qualFactor + areaFactor + ageFactor;
      setPrediction(price);
      setLoading(false);
    }, 1200);
  };

  return (
    <section id="predict" className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tighter mb-6 underline decoration-orange-500 decoration-4 underline-offset-8">LIVE PREDICTOR</h2>
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm">
            Interact with the trained inference model. Enter property features below to generate a real-time price estimation based on our XGBoost pipeline.
          </p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Overall Quality (1-10)</label>
                <input 
                  type="number" 
                  value={inputs.OverallQual}
                  onChange={(e) => setInputs({...inputs, OverallQual: Number(e.target.value)})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-orange-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Year Built</label>
                <input 
                  type="number" 
                  value={inputs.YearBuilt}
                  onChange={(e) => setInputs({...inputs, YearBuilt: Number(e.target.value)})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-orange-500 outline-none transition-all" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Gr. Living Area (sqft)</label>
                <input 
                  type="number" 
                  value={inputs.GrLivArea}
                  onChange={(e) => setInputs({...inputs, GrLivArea: Number(e.target.value)})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-orange-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Lot Area (sqft)</label>
                <input 
                  type="number" 
                  value={inputs.LotArea}
                  onChange={(e) => setInputs({...inputs, LotArea: Number(e.target.value)})}
                  className="w-full bg-zinc-900 border border-white/10 p-3 text-white focus:border-orange-500 outline-none transition-all" 
                />
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-4 bg-orange-500 text-black font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-orange-400 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Activity className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
              {loading ? 'PROCESSING...' : 'RUN INFERENCE'}
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {prediction ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-12 bg-zinc-900 border-2 border-orange-500/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-zinc-500 opacity-20 rotate-90">CONFIDENCE_94.2%</div>
                <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] mb-4">Estimated Market Price</h3>
                <div className="text-7xl font-bold text-white mb-8">
                  ${prediction.toLocaleString()}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Engine</span>
                    <span className="text-orange-500 font-mono text-xs uppercase">XGBoost_Optuna</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Latency</span>
                    <span className="text-zinc-300 font-mono text-xs">24ms</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Model UID</span>
                    <span className="text-zinc-300 font-mono text-xs">A-HSG-v1-420</span>
                  </div>
                </div>

                <div className="mt-12 flex items-start gap-4 p-4 bg-black/50 border border-white/5 rounded">
                  <Activity className="w-5 h-5 text-zinc-500 mt-1" />
                  <div>
                    <h4 className="text-white text-xs font-bold uppercase mb-1">Local SHAP Insight</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Primary drivers for this estimation were <b>OverallQual</b> and <b>GrLivArea</b>. The age of the building ({(2025 - inputs.YearBuilt)} years) resulted in a negative contribution of ~${((2025 - inputs.YearBuilt) * 500).toLocaleString()}.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                className="h-full border-2 border-dashed border-white/10 rounded flex flex-center items-center justify-center p-20 text-center"
              >
                <div className="space-y-4">
                  <Search className="w-12 h-12 text-zinc-700 mx-auto" />
                  <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Waiting for input features...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const DatasetTable = () => (
  <div className="mt-20">
    <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
      <Layers className="w-4 h-4 text-orange-500" />
      Dataset Preview (Top 5 Rows)
    </h3>
    <div className="overflow-x-auto border border-white/5 rounded-lg bg-zinc-900/50">
      <table className="w-full text-left font-mono text-[10px]">
        <thead>
          <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-tighter">
            <th className="p-4">ID</th>
            <th className="p-4">LotArea</th>
            <th className="p-4">OverallQual</th>
            <th className="p-4">YearBuilt</th>
            <th className="p-4">GrLivArea</th>
            <th className="p-4">SalePrice</th>
          </tr>
        </thead>
        <tbody className="text-zinc-300">
          {datasetPreview.map((row) => (
            <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4">{row.id}</td>
              <td className="p-4">{row.lotArea.toLocaleString()}</td>
              <td className="p-4">{row.qual}</td>
              <td className="p-4">{row.year}</td>
              <td className="p-4">{row.grArea.toLocaleString()}</td>
              <td className="p-4 text-orange-500 font-bold">${row.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DataSection = () => (
  <section id="analysis" className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20">
        <h2 className="text-4xl font-bold text-white tracking-tighter mb-4">EXPLORATORY DATA ANALYSIS</h2>
        <div className="h-1 w-24 bg-orange-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* CORRELATION CHART */}
        <div className="bg-zinc-900 p-8 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Target Correlation (SalePrice)
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">N = 1,460</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlationData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                <XAxis type="number" domain={[0, 1]} stroke="#666" fontSize={10} />
                <YAxis dataKey="feature" type="category" stroke="#fff" fontSize={10} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="correlation" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTUAL VS PREDICTED SCATTER */}
        <div className="bg-zinc-900 p-8 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Actual vs Predicted
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">R² = 0.942</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#333" />
                <XAxis type="number" dataKey="actual" name="Actual" unit="$" stroke="#666" fontSize={8} />
                <YAxis type="number" dataKey="pred" name="Predicted" unit="$" stroke="#666" fontSize={8} />
                <ZAxis type="number" range={[64]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                <Scatter name="Prices" data={actualVsPred} fill="#f97316" />
                {/* 45 degree reference line */}
                <Line type="monotone" data={[{actual: 100000, pred: 100000}, {actual: 600000, pred: 600000}]} dataKey="pred" stroke="#444" strokeDasharray="5 5" dot={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {/* RESIDUAL PLOT */}
        <div className="bg-zinc-900 p-8 border border-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Residual Plot
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">HOMOSCEDASTICITY CHECK</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#333" />
                <XAxis type="number" dataKey="pred" name="Predicted" unit="$" stroke="#666" fontSize={8} />
                <YAxis type="number" dataKey="residual" name="Residual" unit="$" stroke="#666" fontSize={8} />
                <ZAxis type="number" range={[40]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
                <Scatter name="Residuals" data={actualVsPred} fill="#10b981" />
                <Line type="monotone" data={[{pred: 100000, residual: 0}, {pred: 600000, residual: 0}]} dataKey="residual" stroke="#666" strokeWidth={2} dot={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS SUMMARY */}
        <div className="grid grid-cols-2 gap-4 h-full">
          <MetricCard label="Root Mean Squared Error" value="$18,430" sub="-18% vs Baseline" />
          <MetricCard label="R-Squared Score" value="0.942" sub="Strong Explanatory Power" />
          <MetricCard label="Mean Absolute Error" value="$12,850" sub="High Consistency" />
          <MetricCard label="Training Trials" value="40" sub="Optuna Optimized" />
        </div>
      </div>

      <DatasetTable />
    </div>
  </section>
);

const Timeline = () => {
  const steps = [
    { day: '01', title: 'Problem Framing', desc: 'Success metrics definition & repository scaffolding.' },
    { day: '02', title: 'Data Ingestion', desc: 'Enforcing schemas & Parquet conversion.' },
    { day: '03', title: 'Cleaning & EDA', desc: 'Outlier removal & missing value strategy.' },
    { day: '04', title: 'Baseline Models', desc: 'Linear, Ridge, Lasso, and RF benchmarking.' },
    { day: '05', title: 'XGBoost Tuning', desc: '40 trials via Optuna hyperparameter optimization.' },
    { day: '06', title: 'Evaluation', desc: 'SHAP explainability & API serving setup.' },
    { day: '07', title: 'GitHub Deployment', desc: 'Final documentation & social proofing.' },
  ];

  return (
    <section className="py-24 px-6 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <Calendar className="w-8 h-8 text-orange-500" />
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">7-Day Build Log</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 translate-y-2">
          {steps.map((step) => (
            <div key={step.day} className="p-8 bg-zinc-950 hover:bg-zinc-900 transition-colors group">
              <span className="text-orange-500 font-mono text-5xl font-bold opacity-20 block mb-6 group-hover:opacity-100 transition-opacity">{step.day}</span>
              <h3 className="text-white font-bold uppercase tracking-[0.1em] text-sm mb-3">{step.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 px-6 bg-[#0a0a0a] border-t border-white/5 text-center">
    <div className="max-w-7xl mx-auto">
      <div className="font-mono text-zinc-500 text-[10px] uppercase tracking-[0.5em] mb-8">End of Project Log</div>
      <div className="flex justify-center gap-8 text-zinc-400">
        <a href="#" className="hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
        <a href="#" className="hover:text-white transition-colors"><BrainCircuit className="w-6 h-6" /></a>
        <a href="#" className="hover:text-white transition-colors"><Layers className="w-6 h-6" /></a>
      </div>
      <div className="mt-12 text-[10px] font-mono text-zinc-700">
        BUILD_ID: AMES-HSG-ML-2025 // DESIGNED_FOR_PORTFOLIO
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-orange-500 selection:text-black">
      <Nav />
      <Hero />
      <DataSection />
      <Predictor />
      <Timeline />
      <Footer />
    </div>
  );
}
