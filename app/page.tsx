"use client";
import {useMemo,useState} from "react";
import rows from "../data/demo_ledger.json";

type Row=(typeof rows)[number];
type Finding={order_id:string;channel:string;code:string;label:string;amount:number;days:number;evidence:string[]};
const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});

function reconcile(input:Row[],tolerance:number):Finding[]{
  return input.flatMap((row)=>{
    const gap=Number((row.expected_payout-row.actual_payout).toFixed(2));
    if(row.actual_payout===0&&row.expected_payout>0)return [{order_id:row.order_id,channel:row.channel,code:"MISSING_PAYOUT",label:"Delivered order has no payout",amount:row.expected_payout,days:row.claim_days_left,evidence:["order status","expected payout","settlement export"]}];
    if(gap>tolerance)return [{order_id:row.order_id,channel:row.channel,code:"PAYOUT_VARIANCE",label:row.status==="returned"?"Return adjustment needs evidence":"Fee exceeds tolerance",amount:gap,days:row.claim_days_left,evidence:["order total","fee schedule","payout line"]}];
    return [];
  }).sort((a,b)=>a.days-b.days||b.amount-a.amount);
}

export default function Home(){
  const [channel,setChannel]=useState("All channels");
  const [tolerance,setTolerance]=useState(5);
  const [findings,setFindings]=useState<Finding[]|null>(null);
  const [running,setRunning]=useState(false);
  const filtered=useMemo(()=>channel==="All channels"?rows:rows.filter(r=>r.channel===channel),[channel]);
  const total=findings?.reduce((sum,f)=>sum+f.amount,0)??0;
  function run(){setRunning(true);setFindings(null);window.setTimeout(()=>{setFindings(reconcile(filtered,tolerance));setRunning(false)},350)}
  return <main>
    <header><a className="brand" href="#top">ClaimLens<span>β</span></a><div className="demo">Fictional demo data · no claims are filed</div></header>
    <section id="top" className="hero"><div><p className="eyebrow">CROSS-CHANNEL RECOVERY DESK</p><h1>Find the money that fell between marketplaces.</h1><p className="lead">Reconcile orders, fulfillment, returns, and payouts in one explainable audit—before the claim window closes.</p></div><div className="heroStat"><span>Audit window</span><strong>60 days</strong><small>Read-only prototype</small></div></section>
    <section className="workbench" aria-labelledby="audit-title">
      <div className="sectionHead"><div><p className="eyebrow">DEMO AUDIT</p><h2 id="audit-title">Payout exception workbench</h2></div><p>{filtered.length} fictional orders ready</p></div>
      <div className="controls">
        <label>Channel<select value={channel} onChange={e=>{setChannel(e.target.value);setFindings(null)}}><option>All channels</option>{rows.map(r=><option key={r.order_id}>{r.channel}</option>)}</select></label>
        <label>Variance tolerance <strong>{money.format(tolerance)}</strong><input aria-label="Variance tolerance" type="range" min="0" max="25" step="1" value={tolerance} onChange={e=>{setTolerance(Number(e.target.value));setFindings(null)}}/></label>
        <button onClick={run} disabled={running}>{running?"Reconciling…":"Run 60-day audit"}</button>
      </div>
      <div className="tableWrap" tabIndex={0} aria-label="Order ledger, horizontally scrollable"><table><thead><tr><th>Order</th><th>Channel</th><th>Status</th><th>Expected</th><th>Paid</th><th>Window</th></tr></thead><tbody>{filtered.map(r=><tr key={r.order_id}><td><code>{r.order_id}</code></td><td>{r.channel}</td><td><span className={`pill ${r.status}`}>{r.status}</span></td><td>{money.format(r.expected_payout)}</td><td>{money.format(r.actual_payout)}</td><td>{r.claim_days_left}d</td></tr>)}</tbody></table></div>
      {running&&<div className="state" role="status">Joining order, payout, and return lines…</div>}
      {findings&&findings.length===0&&<div className="state success" role="status"><strong>No exceptions above {money.format(tolerance)}</strong><span>Try another channel or lower the tolerance.</span></div>}
      {findings&&findings.length>0&&<section className="results" aria-live="polite"><div className="resultSummary"><div><span>Potentially recoverable</span><strong>{money.format(total)}</strong></div><div><span>Exceptions</span><strong>{findings.length}</strong></div><div><span>Most urgent</span><strong>{Math.min(...findings.map(f=>f.days))} days</strong></div></div><div className="findingList">{findings.map(f=><article key={f.order_id}><div className="urgency">{f.days}d left</div><div><code>{f.code}</code><h3>{f.label}</h3><p>{f.order_id} · {f.channel}</p><small>Evidence: {f.evidence.join(" · ")}</small></div><strong>{money.format(f.amount)}</strong></article>)}</div><p className="notice">Review required. Amounts are rule-based demo estimates, not guaranteed reimbursements.</p></section>}
    </section>
    <section className="how"><p className="eyebrow">THE NARROW WEDGE</p><h2>Explain one discrepancy. Prove one claim.</h2><div className="steps"><article><b>01</b><h3>Normalize</h3><p>Map each order, payout, refund, and fulfillment event to one timeline.</p></article><article><b>02</b><h3>Reconcile</h3><p>Run deterministic rules with visible codes, dollar gaps, and deadlines.</p></article><article><b>03</b><h3>Package</h3><p>Give a human reviewer the source lines needed for a claim-ready packet.</p></article></div></section>
    <footer><span>ClaimLens prototype · Oct 12, 2026</span><a href="https://www.ideabrowser.com/hub/ideas/today">Source idea ↗</a></footer>
  </main>
}
