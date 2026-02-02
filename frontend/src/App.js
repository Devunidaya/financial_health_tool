import { useState } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  BarChart, Bar,
  ResponsiveContainer
} from "recharts";

import "./index.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [lang, setLang] = useState("en");

  const upload = async () => {
    if (!file) return alert("Please upload a file");
    const f = new FormData();
    f.append("file", file);

    const r = await fetch(`http://127.0.0.1:8000/analyze?lang=${lang}`, {
      method: "POST",
      body: f
    });
    setData(await r.json());
  };

  return (
    <div className="container">

      {/* ================= HEADER ================= */}
      <div className="header">
        <div>
          <h1>📊 Financial Health Dashboard</h1>
          <p>AI-powered financial analysis & insights</p>
        </div>

        <div className="lang-switch">
          <button onClick={() => setLang("en")}>EN</button>
          <button onClick={() => setLang("hi")}>हिंदी</button>
        </div>
      </div>

      {/* ================= UPLOAD ================= */}
      <div className="card upload-box">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={upload}>Analyze Report</button>
      </div>

      {data && (
        <>
          {/* ================= SUMMARY ================= */}
          <div className="grid">
            <div className="stat-card green">
              <h3>Revenue</h3>
              <p>₹{data.revenue}</p>
            </div>
            <div className="stat-card red">
              <h3>Expense</h3>
              <p>₹{data.expense}</p>
            </div>
            <div className="stat-card blue">
              <h3>Profit</h3>
              <p>₹{data.profit}</p>
            </div>
            <div className="stat-card purple">
              <h3>Health Score</h3>
              <p>{data.health_score}/100</p>
            </div>
          </div>

          {/* ================= CREDIT SCORE ================= */}
          <div className="card">
            <h2>⭐ Credit Score</h2>
            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${data.credit_score}%` }}
              >
                {data.credit_score}/100
              </div>
            </div>
          </div>

          {/* ================= FORECAST ================= */}
          <div className="card">
            <h2>📈 Forecast & Benchmark</h2>
            <p><b>Next Month Revenue:</b> ₹{data.forecast}</p>
            <p><b>{data.industry} Benchmark:</b> {data.benchmark}</p>
          </div>

          {/* ================= RISK ================= */}
          <div className={`card risk ${data.risk_level.toLowerCase()}`}>
            <h2>⚠ Risk Level</h2>
            <b>{data.risk_level}</b>
          </div>

          {/* ================= AREA CHART ================= */}
          <div className="card">
            <h2>📊 Revenue vs Expense</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.chart_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4CAF50" fill="#4CAF50" />
                <Area type="monotone" dataKey="expense" stroke="#F44336" fill="#F44336" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ================= EXPENSE CATEGORY ================= */}
          {data.expense_categories && (
            <div className="card">
              <h2>📊 Expense Categories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(data.expense_categories)
                    .map(([k, v]) => ({ name: k, value: v }))}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2196F3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ================= DETAILS ================= */}
          <div className="card grid">
            <p>Receivable: ₹{data.receivable}</p>
            <p>Payable: ₹{data.payable}</p>
            <p>Inventory: ₹{data.inventory}</p>
            <p>Total Loan: ₹{data.loan_total}</p>
            <p>GST Collected: ₹{data.gst_collected}</p>
            <p>GST Paid: ₹{data.gst_paid}</p>
          </div>

          {/* ================= SUGGESTIONS ================= */}
          <div className="card">
            <h2>💡 Cost Suggestions</h2>
            {data.suggestions?.map((s, i) => (
              <div key={i}>• {s}</div>
            ))}
          </div>

          {/* ================= AI ================= */}
          <div className="card ai-box">
            <h2>🤖 AI Insights</h2>
            <p>{data.ai_insights}</p>
          </div>

          {/* ================= EXPORT ================= */}
          <div className="card center">
            <button onClick={() => fetch("http://127.0.0.1:8000/export")}>
              📄 Export PDF Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
