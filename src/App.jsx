import React, { useState } from 'react';

export default function App() {
  const tabs = ['Dashboard','New Order','Price Calculator','Done'];
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [orders, setOrders] = useState([]);
  const [doneOrders, setDoneOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    customer:'', jobDate:'', dispatchDate:'', notes:'',
    positions:{leftChest:false,rightChest:false,leftSleeve:false,rightSleeve:false}
  });
  const [calc, setCalc] = useState({quantity:0, unitPrice:0, newLogo:false, total:0});

  const addOrder = () => {
    setOrders([...orders, {...form, id: Date.now()}]);
    setForm({customer:'',jobDate:'',dispatchDate:'',notes:'',positions:{leftChest:false,rightChest:false,leftSleeve:false,rightSleeve:false}});
  };
  const markDone = id => {
    const o = orders.find(o => o.id===id);
    setDoneOrders([...doneOrders, o]);
    setOrders(orders.filter(o=>o.id!==id));
  };
  const deleteDone = id => setDoneOrders(doneOrders.filter(o=>o.id!==id));
  const filtered = orders.filter(o=>o.customer.toLowerCase().includes(search.toLowerCase()));
  const calcTotal = () => {
    let t = calc.quantity*calc.unitPrice + (calc.newLogo?15:0);
    setCalc({...calc, total:t});
  };
  const exportCSV = () => {
    const rows = [['Customer','Job','Scheduled','Dispatch'], ...doneOrders.map(o=>[o.customer,o.notes,o.jobDate,o.dispatchDate])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'}); const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='done.csv'; a.click();
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            IA
          </div>
          <span className="text-xl font-semibold">ImpulseArt</span>
        </div>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={()=>setActiveTab(tab)}
            className={`flex items-center p-2 rounded-lg transition ${
              activeTab===tab ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>
      {/* Main */}
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <span className="text-gray-600">info@impulseart.co.uk</span>
        </header>
        {activeTab==='Dashboard' && (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-full max-w-md px-4 py-2 rounded-full shadow focus:outline-none"
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Customer','Job','Scheduled','Dispatch',''].map((h,i)=>(
                      <th key={i} className="px-6 py-4 text-left text-sm font-medium text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(o=>(
                    <tr key={o.id}>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.notes}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.jobDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.dispatchDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={()=>markDone(o.id)} className="text-green-600 hover:underline">
                          Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeTab==='New Order' && (
          <div className="space-y-4">
            <input type="text" placeholder="Customer" className="w-full p-2 border rounded" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}/>
            <input type="date" className="p-2 border rounded" value={form.jobDate} onChange={e=>setForm({...form,jobDate:e.target.value})}/>
            <input type="date" className="p-2 border rounded" value={form.dispatchDate} onChange={e=>setForm({...form,dispatchDate:e.target.value})}/>
            <textarea placeholder="Notes" className="w-full p-2 border rounded" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
            <div className="space-x-4">
              {['leftChest','rightChest','leftSleeve','rightSleeve'].map(p=>(
                <label key={p}>
                  <input type="checkbox" checked={form.positions[p]} onChange={e=>setForm({...form,positions:{...form.positions,[p]:e.target.checked}})}/> {p}
                </label>
              ))}
            </div>
            <button onClick={addOrder} className="bg-green-500 text-white px-4 py-2 rounded">Add Order</button>
          </div>
        )}
        {activeTab==='Price Calculator' && (
          <div className="space-y-4">
            <input type="number" placeholder="Quantity" className="w-full p-2 border rounded" value={calc.quantity} onChange={e=>setCalc({...calc,quantity:+e.target.value})}/>
            <input type="number" placeholder="Unit Price" className="w-full p-2 border rounded" value={calc.unitPrice} onChange={e=>setCalc({...calc,unitPrice:+e.target.value})}/>
            <label>
              <input type="checkbox" checked={calc.newLogo} onChange={e=>setCalc({...calc,newLogo:e.target.checked})}/> New Logo (£15)
            </label>
            <button onClick={calcTotal} className="bg-green-500 text-white px-4 py-2 rounded">Calculate</button>
            <div><strong>Total: £{calc.total.toFixed(2)}</strong></div>
          </div>
        )}
        {activeTab==='Done' && (
          <div className="space-y-4">
            <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">Export CSV</button>
            <button onClick={()=>window.location.href='mailto:info@impulseart.co.uk?subject=Orders%20Completed'} className="bg-blue-500 text-white px-4 py-2 rounded">Email</button>
            {doneOrders.map(o=>(
              <div key={o.id} className="flex justify-between bg-white p-4 rounded shadow">
                <span>{o.customer}</span>
                <button onClick={()=>deleteDone(o.id)} className="text-red-500">Delete</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
