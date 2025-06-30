import React, { useState } from 'react';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [done, setDone] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ customer:'', jobDate:'', dispatchDate:'', notes:'', positions:{leftChest:false, rightChest:false, leftSleeve:false, rightSleeve:false}, photo:null });
  const [calc, setCalc] = useState({quantity:0, unitPrice:0, newLogo:false, total:0});

  const addOrder = () => {
    setOrders([...orders, {...form, id:Date.now()}]);
    setForm({ customer:'', jobDate:'', dispatchDate:'', notes:'', positions:{leftChest:false, rightChest:false, leftSleeve:false, rightSleeve:false}, photo:null });
  };
  const markDone = id => {
    const o = orders.find(x=>x.id===id);
    setDone([...done, o]);
    setOrders(orders.filter(x=>x.id!==id));
  };
  const delDone = id => setDone(done.filter(x=>x.id!==id));
  const filtered = orders.filter(o=>o.customer.toLowerCase().includes(search.toLowerCase()));
  const calcTotal = () => {
    let t = calc.quantity*calc.unitPrice;
    if(calc.newLogo) t+=15;
    setCalc({...calc, total:t});
  };
  const exportCSV = () => {
    const rows = [['Customer','Job Date','Dispatch','Notes','Positions'],...done.map(o=>[o.customer,o.jobDate,o.dispatchDate,o.notes,Object.entries(o.positions).filter(([,v])=>v).map(([k])=>k).join(' ')])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'}), url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='done.csv';a.click();
  };
  return (
    <div style={{fontFamily:'Arial,sans-serif',padding:20}}>
      <h1>ImpulseArt Orders</h1>
      <nav style={{marginBottom:20}}>
        {['dashboard','add','calculator','done'].map(t=>
          <button key={t} onClick={()=>setTab(t)} style={{marginRight:10,padding:10,background:tab===t?'#36aa46':'#ccc',color:'#fff',border:'none'}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </nav>
      {tab==='dashboard' && (
        <div>
          <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
          {filtered.map(o=>(
            <div key={o.id} style={{border:'1px solid #ddd',padding:10,margin:10}}>
              <div><strong>{o.customer}</strong></div>
              <div>{o.jobDate} → {o.dispatchDate}</div>
              <div>{o.notes}</div>
              <div>Positions: {Object.entries(o.positions).filter(([,v])=>v).map(([k])=>k).join(', ')}</div>
              <button onClick={()=>markDone(o.id)}>Mark as Done</button>
            </div>
          ))}
        </div>
      )}
      {tab==='add' && (
        <div>
          <input placeholder="Customer" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} /><br/>
          <input type="date" value={form.jobDate} onChange={e=>setForm({...form,jobDate:e.target.value})} />
          <input type="date" value={form.dispatchDate} onChange={e=>setForm({...form,dispatchDate:e.target.value})} /><br/>
          <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /><br/>
          {['leftChest','rightChest','leftSleeve','rightSleeve'].map(p=>(
            <label key={p}><input type="checkbox" checked={form.positions[p]} onChange={e=>setForm({...form,positions:{...form.positions,[p]:e.target.checked}})} /> {p}</label>))}
          <br/><button onClick={addOrder}>Add Order</button>
        </div>
      )}
      {tab==='calculator' && (
        <div>
          <input type="number" placeholder="Qty" value={calc.quantity} onChange={e=>setCalc({...calc,quantity:+e.target.value})} />
          <input type="number" placeholder="Unit Price" value={calc.unitPrice} onChange={e=>setCalc({...calc,unitPrice:+e.target.value})} />
          <label><input type="checkbox" checked={calc.newLogo} onChange={e=>setCalc({...calc,newLogo:e.target.checked})} /> New Logo (£15)</label><br/>
          <button onClick={calcTotal}>Calculate</button>
          <div>Total: £{calc.total.toFixed(2)}</div>
        </div>
      )}
      {tab==='done' && (
        <div>
          <button onClick={exportCSV}>Export CSV</button>
          <button onClick={()=>window.location.href='mailto:info@impulseart.co.uk?subject=Orders Done&body=Your orders are completed'}>Email Notification</button>
          {done.map(o=>(
            <div key={o.id} style={{border:'1px solid #ddd',padding:10,margin:10}}>
              <div><strong>{o.customer}</strong></div>
              <div>{o.jobDate} → {o.dispatchDate}</div>
              <button onClick={()=>delDone(o.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
