import React,{useState} from 'react';
export default function App(){
 const[t,st]=useState('dashboard');
 const[o,so]=useState([]),[d,sd]=useState([]);
 const[s,ss]=useState('');const[f,setf]=useState({customer:'',jobDate:'',dispatchDate:'',notes:'',positions:{leftChest:false,rightChest:false,leftSleeve:false,rightSleeve:false},photo:null});
 const[c,sc]=useState({quantity:0,unitPrice:0,newLogo:false,total:0});
 const add=()=>{so([...o,{...f,id:Date.now()}]);setf({customer:'',jobDate:'',dispatchDate:'',notes:'',positions:{leftChest:false,rightChest:false,leftSleeve:false,rightSleeve:false},photo:null});};
 const done=u=>{const x=o.find(v=>v.id===u);sd([...d,x]);so(o.filter(v=>v.id!==u));};
 const del=u=>sd(d.filter(v=>v.id!==u));
 const fil=o.filter(v=>v.customer.toLowerCase().includes(s.toLowerCase()));
 const calc=()=>{let t=c.quantity*c.unitPrice; if(c.newLogo)t+=15; sc({...c,total:t});};
 const exportCSV=()=>{const r=[['Customer','JobDate','Dispatch','Notes','Pos'],...d.map(v=>[v.customer,v.jobDate,v.dispatchDate,v.notes,Object.keys(v.positions).filter(k=>v.positions[k]).join(';')])]; const b=new Blob([r.map(a=>a.join(',')).join('\n')],{type:'text/csv'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='done.csv';a.click();};
 return <div style={{fontFamily:'Arial,sans-serif',padding:20}}>
 <h1>ImpulseArt Orders</h1>
 <div>{['dashboard','add','calculator','done'].map(v=> <button key={v}onClick={()=>st(v)} style={{marginRight:10,padding:10,backgroundColor:t===v?'#36aa46':'#ccc',color:'#fff',border:'none'}}>{v.charAt(0).toUpperCase()+v.slice(1)}</button>)}</div><hr/>
 {t==='dashboard' && <div><input placeholder="Search..."value={s}onChange={e=>ss(e.target.value)}/>{fil.map(v=> <div key={v.id}style={{border:'1px solid #ddd',padding:10,margin:10}}><strong>{v.customer}</strong><br/>{v.jobDate}→{v.dispatchDate}<br/>{v.notes}<br/>Pos:{Object.keys(v.positions).filter(k=>v.positions[k]).join(', ')}<button onClick={()=>done(v.id)}>Mark as Done</button></div>)}</div>}
 {t==='add' && <div><input placeholder="Customer"value={f.customer}onChange={e=>setf({...f,customer:e.target.value})}/><br/><input type="date"value={f.jobDate}onChange={e=>setf({...f,jobDate:e.target.value})}/><input type="date"value={f.dispatchDate}onChange={e=>setf({...f,dispatchDate:e.target.value})}/><br/><textarea placeholder="Notes"value={f.notes}onChange={e=>setf({...f,notes:e.target.value})}/><br/>{['leftChest','rightChest','leftSleeve','rightSleeve'].map(p=> <label key={p}><input type="checkbox"checked={f.positions[p]}onChange={e=>setf({...f,positions:{...f.positions,[p]:e.target.checked}})}/> {p}</label>)}<br/><button onClick={add}>Add Order</button></div>}
 {t==='calculator' && <div><input type="number"placeholder="Qty"value={c.quantity}onChange={e=>sc({...c,quantity:+e.target.value})}/><br/><input type="number"placeholder="Unit Price"value={c.unitPrice}onChange={e=>sc({...c,unitPrice:+e.target.value})}/><br/><label><input type="checkbox"checked={c.newLogo}onChange={e=>sc({...c,newLogo:e.target.checked})}/> New Logo (£15)</label><br/><button onClick={calc}>Calculate</button><br/><strong>Total:£{c.total.toFixed(2)}</strong></div>}
 {t==='done' && <div><button onClick={exportCSV}style={{marginRight:10}}>Export CSV</button><button onClick={()=>window.location.href='mailto:info@impulseart.co.uk?subject=Orders Completed'}>Email Notification</button>{d.map(v=> <div key={v.id}style={{border:'1px solid #ddd',padding:10,margin:10}}><strong>{v.customer}</strong><br/>{v.jobDate}→{v.dispatchDate}<br/><button onClick={()=>del(v.id)}>Delete</button></div>)}</div>}
 </div>;
}