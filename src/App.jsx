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
  const [calc, setCalc] = useState({
    quantity: 0,
    vatRate: 20,
    newLogo: false,
    printType: 'none',
    totalNet: null,
    vatAmount: null,
    totalGross: null
  });

  const addOrder = () => {
    setOrders([...orders, { ...form, id: Date.now() }]);
    setForm({customer:'',jobDate:'',dispatchDate:'',notes:'',positions:{leftChest:false,rightChest:false,leftSleeve:false,rightSleeve:false}});
  };
  const markDone = id => {
    const o = orders.find(o=>o.id===id);
    setDoneOrders([...doneOrders, o]);
    setOrders(orders.filter(o=>o.id!==id));
  };
  const deleteDone = id => setDoneOrders(doneOrders.filter(o=>o.id!==id));
  const filtered = orders.filter(o=>o.customer.toLowerCase().includes(search.toLowerCase()));

  const calculateTotals = () => {
    const q = calc.quantity;
    let embroideryPrice;
    if (q === 1) embroideryPrice = 6.50;
    else if (q <= 5) embroideryPrice = 5.95;
    else if (q <= 19) embroideryPrice = 4.27;
    else if (q <= 49) embroideryPrice = 3.43;
    else if (q <= 199) embroideryPrice = 1.89;
    else embroideryPrice = 1.69;

    let printPrice = 0;
    if (calc.printType === 'small') printPrice = 4.00;
    if (calc.printType === 'big') printPrice = 4.50;

    const logoFee = calc.newLogo ? 15 : 0;
    const net = q * embroideryPrice + q * printPrice + logoFee;
    const vatAmt = net * (calc.vatRate / 100);
    const gross = net + vatAmt;

    setCalc({ ...calc, totalNet: net, vatAmount: vatAmt, totalGross: gross });
  };

  const resetCalc = () => {
    setCalc({quantity:0,vatRate:20,newLogo:false,printType:'none',totalNet:null,vatAmount:null,totalGross:null});
  };

  const exportCSV = () => {
    const rows = [['Customer','Job','Scheduled','Dispatch'], ...doneOrders.map(o=>[o.customer,o.notes,o.jobDate,o.dispatchDate])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'done.csv';
    a.click();
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-black text-white p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">IA</div>
          <span className="text-xl font-semibold">ImpulseArt</span>
        </div>
        {tabs.map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)}
            className={`w-full text-left p-2 rounded-lg transition ${
              activeTab===tab? 'bg-green-600':'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >{tab}</button>
        ))}
      </aside>
      <main className="flex-1 bg-gray-100 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
          <span className="text-gray-600">info@impulseart.co.uk</span>
        </header>

        {activeTab==='Dashboard' && (
          <>
            <div className="mb-6"><input type="text" placeholder="Search..."
              className="w-full max-w-md px-4 py-2 rounded-full shadow focus:outline-none"
              value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50"><tr>
                  {['Customer','Job','Scheduled','Dispatch',''].map((h,i)=>(
                    <th key={i} className="px-6 py-4 text-left text-sm text-gray-700">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(o=>(
                    <tr key={o.id}>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.notes}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.jobDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{o.dispatchDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={()=>markDone(o.id)} className="text-green-600 hover:underline">Done</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab==='Price Calculator' && (
          <div className="space-y-6 max-w-md">
            <div><label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" min="1"
                className="w-full mt-1 p-2 border rounded"
                value={calc.quantity}
                onChange={e=>setCalc({...calc,quantity:+e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Embroidery price per garment:</p>
              <p className="text-lg font-semibold">
                {calc.quantity===1 && '£6.50 + VAT'}
                {calc.quantity>=2 && calc.quantity<=5 && '£5.95 + VAT each'}
                {calc.quantity>=6 && calc.quantity<=19 && '£4.27 + VAT each'}
                {calc.quantity>=20 && calc.quantity<=49 && '£3.43 + VAT each'}
                {calc.quantity>=50 && calc.quantity<=199 && '£1.89 + VAT each'}
                {calc.quantity>=200 && '£1.69 + VAT each'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Print option</label>
              <select className="w-full mt-1 p-2 border rounded"
                value={calc.printType}
                onChange={e=>setCalc({...calc,printType:e.target.value})}
              >
                <option value="none">No Print</option>
                <option value="small">Small print (£4 + VAT each)</option>
                <option value="big">Big print (£4.50 + VAT each)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input id="newLogo" type="checkbox" className="h-4 w-4 text-green-600"
                checked={calc.newLogo} onChange={e=>setCalc({...calc,newLogo:e.target.checked})} />
              <label htmlFor="newLogo" className="text-sm text-gray-700">Add new logo (£15 one-time)</label>
            </div>

            <div className="flex space-x-4">
              <button onClick={calculateTotals} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">Calculate</button>
              <button onClick={resetCalc} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded">Reset</button>
            </div>

            {calc.totalGross!=null && (
              <div className="bg-white p-4 rounded shadow space-y-1">
                <p className="text-sm text-gray-600">Net Total: £{calc.totalNet.toFixed(2)}</p>
                <p className="text-sm text-gray-600">VAT ({calc.vatRate}%): £{calc.vatAmount.toFixed(2)}</p>
                <p className="text-lg font-semibold">Gross Total: £{calc.totalGross.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {activeTab==='Done' && (
          <div className="space-y-4">
            <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">Export CSV</button>
            <button onClick={()=>window.location.href='mailto:info@impulseart.co.uk?subject=Orders Completed'} className="bg-blue-500 text-white px-4 py-2 rounded">Email</button>
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
