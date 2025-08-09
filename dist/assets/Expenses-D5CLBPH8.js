import{c as g,E as m,l as e,r as E,Q as O,J as C,o as lt,a as it,k as f,H as h,z as x,q as p,R as y,W as K,M as G,S as D,F as dt,y as ut,p as pt,b as ct,x as gt}from"./vendor-Cn5j0SEu.js";import{b as mt,u as bt,f as yt,e as xt}from"./index-GcpNd-v9.js";import{e as _}from"./export-DbUzqSZp.js";import{r as vt}from"./DocumentArrowDownIcon-CfkQcPq0.js";import{r as ft}from"./PlusIcon-Hols0ICP.js";import{r as ht}from"./ClockIcon-A7fuk63B.js";import{r as kt}from"./CheckCircleIcon-9dtlsCvY.js";import{f as wt,l as Dt}from"./index-BoRhMNJp.js";import"./excel-C9Ruqv6W.js";function _t(J,d){return m(),g("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true","data-slot":"icon"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"})])}const $t={class:"space-y-6"},Pt={class:"flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"},St={class:"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"},Tt={class:"relative"},Et={key:0,class:"absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-10"},Ct={class:"py-1"},Kt={class:"border-t border-gray-100 mt-1"},jt={class:"border-t border-gray-100 mt-1"},Lt={class:"grid grid-cols-1 md:grid-cols-4 gap-6"},Ft={class:"card p-6"},Mt={class:"flex items-center"},It={class:"p-2 bg-red-100 rounded-lg"},zt={class:"ml-4"},Bt={class:"text-2xl font-semibold text-gray-900"},Ht={class:"card p-6"},Rt={class:"flex items-center"},Ut={class:"p-2 bg-warning-100 rounded-lg"},At={class:"ml-4"},Vt={class:"text-2xl font-semibold text-gray-900"},Ot={class:"card p-6"},Gt={class:"flex items-center"},Jt={class:"p-2 bg-success-100 rounded-lg"},Nt={class:"ml-4"},qt={class:"text-2xl font-semibold text-gray-900"},Qt={class:"card p-6"},Wt={class:"flex items-center"},Yt={class:"p-2 bg-gray-100 rounded-lg"},Xt={class:"ml-4"},Zt={class:"text-2xl font-semibold text-gray-900"},te={class:"card p-6"},ee={class:"grid grid-cols-1 md:grid-cols-4 gap-4"},ae={class:"card p-6"},se={class:"overflow-x-auto"},oe={class:"min-w-full divide-y divide-gray-200"},ne={class:"bg-white divide-y divide-gray-200"},re={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-900"},le={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},ie={class:"inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"},de={class:"px-6 py-4 text-sm text-gray-500"},ue={key:0,class:"text-xs text-gray-400 mt-1"},pe={class:"px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600"},ce={class:"px-6 py-4 whitespace-nowrap"},ge={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},me={key:0},be={class:"font-medium"},ye={class:"text-xs text-gray-400"},xe={key:1,class:"text-gray-400"},ve={class:"px-6 py-4 whitespace-nowrap text-sm font-medium"},fe={class:"flex items-center space-x-2"},he=["onClick"],ke=["onClick"],we=["onClick"],De=["onClick"],_e={key:0,class:"text-center py-8"},$e={key:0,class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"},Pe={class:"bg-white rounded-lg max-w-md w-full p-6"},Se={class:"text-lg font-semibold text-gray-900 mb-4"},Te={key:0},Ee={class:"flex justify-end space-x-3 pt-4"},Ce=["disabled"],Ue={__name:"Expenses",setup(J){const d=mt(),l=bt(),j=E(!1),k=E(null),P=E(!1),b=E(!1),n=O({status:"",category:"",dateFrom:"",dateTo:""}),o=O({category:"",amount:0,description:"",notes:"",status:"pending",approved_by:""}),v=C(()=>d.expenses.filter(s=>s.status==="approved").reduce((s,t)=>s+t.amount,0)),L=C(()=>d.expenses.filter(s=>s.status==="pending")),w=C(()=>d.expenses.filter(s=>s.status==="approved")),c=C(()=>{let s=[...d.expenses];return n.status&&(s=s.filter(t=>t.status===n.status)),n.category&&(s=s.filter(t=>t.category===n.category)),n.dateFrom&&(s=s.filter(t=>new Date(t.created_at)>=new Date(n.dateFrom))),n.dateTo&&(s=s.filter(t=>new Date(t.created_at)<=new Date(n.dateTo+"T23:59:59"))),s.sort((t,a)=>new Date(a.created_at)-new Date(t.created_at))}),u=s=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(s),S=s=>wt(new Date(s),"dd MMM yyyy HH:mm",{locale:Dt}),$=s=>({kegiatan:"Kegiatan Kelas",perlengkapan:"Perlengkapan",konsumsi:"Konsumsi",transport:"Transport",lainnya:"Lainnya"})[s]||s,T=s=>({pending:"Menunggu Persetujuan",approved:"Disetujui",rejected:"Ditolak"})[s]||s,N=s=>{const t={pending:"inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800",approved:"inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800",rejected:"inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800"};return t[s]||t.pending},q=s=>{k.value=s,o.category=s.category,o.amount=s.amount,o.description=s.description,o.notes=s.notes||"",o.status=s.status,o.approved_by=s.approved_by||""},Q=async s=>{try{const t=prompt("Masukkan nama yang menyetujui:","Admin");t&&(await d.updateExpense(s.id,{status:"approved",approved_by:t,approved_at:new Date().toISOString()}),l.success("Pengeluaran berhasil disetujui"))}catch(t){l.error("Gagal menyetujui pengeluaran"),console.error("Error approving expense:",t)}},W=async s=>{if(confirm("Apakah Anda yakin ingin menolak pengeluaran ini?"))try{await d.updateExpense(s.id,{status:"rejected"}),l.success("Pengeluaran berhasil ditolak")}catch(t){l.error("Gagal menolak pengeluaran"),console.error("Error rejecting expense:",t)}},B=()=>{j.value=!1,k.value=null,Y()},Y=()=>{o.category="",o.amount=0,o.description="",o.notes="",o.status="pending",o.approved_by=""},X=async()=>{try{P.value=!0;const s={category:o.category,amount:o.amount,description:o.description,notes:o.notes,status:o.status,created_at:new Date().toISOString()};o.status==="approved"&&(s.approved_by=o.approved_by||"Admin",s.approved_at=new Date().toISOString()),k.value?(await d.updateExpense(k.value.id,s),l.success("Pengeluaran berhasil diupdate")):(await d.addExpense(s),l.success("Pengeluaran baru berhasil ditambahkan")),B()}catch(s){l.error("Gagal menyimpan pengeluaran"),console.error("Error saving expense:",s)}finally{P.value=!1}},Z=async s=>{if(confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?"))try{await d.deleteExpense(s.id),l.success("Pengeluaran berhasil dihapus")}catch(t){l.error("Gagal menghapus pengeluaran"),console.error("Error deleting expense:",t)}},tt=()=>{_.exportExpenses(c.value),b.value=!1,l.success("Data pengeluaran berhasil di-export")},et=()=>{_.exportExpensesByCategory(d.expenses),b.value=!1,l.success("Data pengeluaran per kategori berhasil di-export")},at=()=>{const s=["Tanggal","Kategori","Keterangan","Catatan","Jumlah (IDR)","Status","Disetujui Oleh","Tanggal Disetujui"],t=c.value.map(i=>[_.formatDate(i.created_at),$(i.category),i.description,i.notes||"",_.formatCurrency(i.amount),T(i.status),i.approved_by||"",i.approved_at?_.formatDate(i.approved_at):""]),a=[];n.status&&a.push(`status-${n.status}`),n.category&&a.push(`kategori-${n.category}`),n.dateFrom&&a.push(`dari-${n.dateFrom}`),n.dateTo&&a.push(`sampai-${n.dateTo}`);const r=`pengeluaran_terfilter${a.length?"_"+a.join("_"):""}_${new Date().toISOString().slice(0,10)}`;_.downloadCSV(s,t,r),b.value=!1,l.success("Data pengeluaran terfilter berhasil di-export")},st=()=>{try{const s=M();try{U(s,"Lengkap"),l.success("PDF Laporan Pengeluaran berhasil di-generate!")}catch{F(s,"laporan_lengkap_pengeluaran"),l.success("PDF dibuka sebagai file HTML karena popup diblokir")}b.value=!1}catch(s){console.error("Error generating PDF:",s),l.error("Gagal generate PDF Laporan Pengeluaran")}},ot=()=>{try{const s=I();try{U(s,"Summary"),l.success("PDF Summary Pengeluaran berhasil di-generate!")}catch{F(s,"summary_pengeluaran"),l.success("PDF dibuka sebagai file HTML karena popup diblokir")}b.value=!1}catch(s){console.error("Error generating Summary PDF:",s),l.error("Gagal generate PDF Summary Pengeluaran")}},F=(s,t)=>{const a=new Blob([s],{type:"text/html;charset=utf-8"}),r=URL.createObjectURL(a),i=document.createElement("a");i.href=r,i.download=`${t}_${new Date().toISOString().slice(0,10)}.html`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r)},nt=(s,t)=>{const a=window.open("about:blank","_blank");if(a)a.document.write(s),a.document.close(),a.document.title=`Laporan Pengeluaran ${t} - ${new Date().toLocaleDateString("id-ID")}`;else throw new Error("Unable to open new tab")},H=()=>`
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.4;
      color: #333;
      background: white;
      margin: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border-radius: 8px;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header h2 { font-size: 1.2rem; margin-bottom: 1rem; opacity: 0.9; }
    .header p { font-size: 0.9rem; opacity: 0.8; }
    .section { margin-bottom: 30px; }
    .section-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e5e7eb;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .table th, .table td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }
    .table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }
    .table td { font-size: 0.9rem; }
    .expense-amount { color: #dc2626; font-weight: 600; }
    .status-approved { color: #059669; font-weight: 500; }
    .status-pending { color: #d97706; font-weight: 500; }
    .status-rejected { color: #dc2626; font-weight: 500; }
    .highlight { background-color: #fef2f2; }
    .summary-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #dc2626;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 0.8rem;
    }
    .category-tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      background: #f3f4f6;
      color: #374151;
    }
    @media print {
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .header {
        background: #dc2626 !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        break-inside: avoid;
      }
      .section {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .table {
        page-break-inside: auto;
      }
      .table tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .summary-box {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      * {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
    }
    @page {
      margin: 1in;
      size: A4;
    }
  </style>
`,M=()=>{const s=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Laporan Lengkap Pengeluaran Kas Kelas</title>
      ${H()}
    </head>
    <body>
      <div class="header">
        <h1>💸 Laporan Lengkap Pengeluaran</h1>
        <h2>SD Islam Al Husna - Kelas 1B</h2>
        <p>Komplek Keuangan, Jl. Guntur I</p>
        <p>Tanggal Cetak: ${s}</p>
        ${n.dateFrom||n.dateTo?`<p>Periode: ${n.dateFrom||"Awal"} - ${n.dateTo||"Sekarang"}</p>`:""}
      </div>

      <!-- Executive Summary -->
      <div class="summary-box">
        <h3 style="margin-bottom: 15px; color: #1f2937;">📊 Ringkasan Pengeluaran</h3>
        <div class="grid-3">
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #dc2626;">${u(v.value)}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Total Pengeluaran</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #d97706;">${L.value.length}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Menunggu Persetujuan</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: #059669;">${w.value.length}</div>
            <div style="font-size: 0.9rem; color: #6b7280;">Disetujui</div>
          </div>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div class="section">
        <h3 class="section-title">📈 Pengeluaran per Kategori</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah Item</th>
              <th>Total Pengeluaran</th>
              <th>Persentase</th>
            </tr>
          </thead>
          <tbody>
            ${R()}
          </tbody>
        </table>
      </div>

      <!-- Detailed Expenses -->
      <div class="section">
        <h3 class="section-title">📋 Detail Pengeluaran</h3>
        <table class="table">
          <thead>
            <tr>
              <th style="width: 12%">Tanggal</th>
              <th style="width: 15%">Kategori</th>
              <th style="width: 30%">Keterangan</th>
              <th style="width: 15%">Jumlah</th>
              <th style="width: 12%">Status</th>
              <th style="width: 16%">Disetujui Oleh</th>
            </tr>
          </thead>
          <tbody>
            ${c.value.map((t,a)=>`
              <tr ${a%2===0?'class="highlight"':""}>
                <td>${S(t.created_at)}</td>
                <td><span class="category-tag">${$(t.category)}</span></td>
                <td>
                  ${t.description}
                  ${t.notes?`<br><small style="color: #6b7280;">${t.notes}</small>`:""}
                </td>
                <td class="expense-amount">${u(t.amount)}</td>
                <td class="status-${t.status}">${T(t.status)}</td>
                <td>${t.approved_by||"-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Financial Impact -->
      <div class="section">
        <h3 class="section-title">💰 Dampak Keuangan</h3>
        <div class="grid-2">
          <div class="card">
            <h4 style="color: #059669; margin-bottom: 10px;">💵 Saldo Kas</h4>
            <table class="table">
              <tr>
                <td><strong>Saldo Saat Ini</strong></td>
                <td style="color: ${d.currentBalance>=0?"#059669":"#dc2626"}; font-weight: bold;">
                  ${u(d.currentBalance)}
                </td>
              </tr>
              <tr>
                <td><strong>Total Pemasukan</strong></td>
                <td style="color: #059669;">${u(d.totalIncome)}</td>
              </tr>
              <tr>
                <td><strong>Total Pengeluaran</strong></td>
                <td style="color: #dc2626;">${u(v.value)}</td>
              </tr>
            </table>
          </div>

          <div class="card">
            <h4 style="color: #6b7280; margin-bottom: 10px;">📊 Statistik</h4>
            <table class="table">
              <tr>
                <td><strong>Total Item Pengeluaran</strong></td>
                <td>${c.value.length}</td>
              </tr>
              <tr>
                <td><strong>Rata-rata per Item</strong></td>
                <td>${c.value.length>0?u(v.value/w.value.length):"Rp 0"}</td>
              </tr>
              <tr>
                <td><strong>Item Terbesar</strong></td>
                <td>${c.value.length>0?u(Math.max(...c.value.filter(t=>t.status==="approved").map(t=>t.amount))):"Rp 0"}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
        <p>Laporan Pengeluaran dibuat pada ${new Date().toLocaleString("id-ID")}</p>
        <p style="margin-top: 5px;">📍 Komplek Keuangan, Jl. Guntur I | 📞 (021) 7654-321</p>
      </div>
    </body>
    </html>
  `},I=()=>{const s=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});return`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Summary Pengeluaran Kas Kelas</title>
      ${H()}
    </head>
    <body>
      <div class="header">
        <h1>📋 Summary Pengeluaran</h1>
        <h2>SD Islam Al Husna - Kelas 1B</h2>
        <p>Komplek Keuangan, Jl. Guntur I</p>
        <p>Tanggal Cetak: ${s}</p>
      </div>

      <!-- Key Metrics -->
      <div class="summary-box">
        <h3 style="margin-bottom: 15px; color: #1f2937;">🎯 Key Metrics</h3>
        <div class="grid-3">
          <div style="text-align: center; padding: 15px; background: #fef2f2; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #dc2626;">${u(v.value)}</div>
            <div style="font-size: 0.9rem; color: #991b1b; margin-top: 5px;">Total Pengeluaran</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #fefbeb; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #d97706;">${L.value.length}</div>
            <div style="font-size: 0.9rem; color: #92400e; margin-top: 5px;">Pending</div>
          </div>
          <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
            <div style="font-size: 1.8rem; font-weight: bold; color: #059669;">${w.value.length}</div>
            <div style="font-size: 0.9rem; color: #047857; margin-top: 5px;">Disetujui</div>
          </div>
        </div>
      </div>

      <!-- Category Summary -->
      <div class="section">
        <h3 class="section-title">📊 Summary per Kategori</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            ${R()}
          </tbody>
        </table>
      </div>

      <!-- Recent Expenses -->
      <div class="section">
        <h3 class="section-title">🕒 Pengeluaran Terbaru</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${c.value.slice(0,10).map((t,a)=>`
              <tr ${a%2===0?'class="highlight"':""}>
                <td>${S(t.created_at)}</td>
                <td><span class="category-tag">${$(t.category)}</span></td>
                <td>${t.description}</td>
                <td class="expense-amount">${u(t.amount)}</td>
                <td class="status-${t.status}">${T(t.status)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <!-- Financial Health -->
      <div class="grid-2">
        <div class="card">
          <h4 style="color: #059669; margin-bottom: 15px;">💰 Kesehatan Keuangan</h4>
          <table class="table">
            <tr>
              <td><strong>Saldo Kas</strong></td>
              <td style="color: ${d.currentBalance>=0?"#059669":"#dc2626"}; font-weight: bold;">
                ${u(d.currentBalance)}
              </td>
            </tr>
            <tr>
              <td><strong>Rasio Pengeluaran</strong></td>
              <td>${d.totalIncome>0?Math.round(v.value/d.totalIncome*100):0}%</td>
            </tr>
          </table>
        </div>

        <div class="card">
          <h4 style="color: #6b7280; margin-bottom: 15px;">📈 Quick Stats</h4>
          <table class="table">
            <tr>
              <td><strong>Rata-rata Pengeluaran</strong></td>
              <td>${w.value.length>0?u(v.value/w.value.length):"Rp 0"}</td>
            </tr>
            <tr>
              <td><strong>Pengeluaran Terbesar</strong></td>
              <td>${c.value.length>0?u(Math.max(...c.value.filter(t=>t.status==="approved").map(t=>t.amount))):"Rp 0"}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
        <p>Summary Pengeluaran dibuat pada ${new Date().toLocaleString("id-ID")}</p>
      </div>
    </body>
    </html>
  `},R=()=>{const s={};c.value.filter(a=>a.status==="approved").forEach(a=>{const r=$(a.category);s[r]||(s[r]={count:0,amount:0}),s[r].count+=1,s[r].amount+=a.amount});const t=Object.values(s).reduce((a,r)=>a+r.amount,0);return Object.entries(s).sort((a,r)=>r[1].amount-a[1].amount).map(([a,r])=>{const i=t>0?(r.amount/t*100).toFixed(1):0;return`
        <tr>
          <td><span class="category-tag">${a}</span></td>
          <td>${r.count} item</td>
          <td class="expense-amount">${u(r.amount)}</td>
          <td>${i}%</td>
        </tr>
      `}).join("")},U=(s,t)=>{const a=window.open("","_blank");if(!a)throw new Error("Popup blocked. Please allow popups for this site.");a.document.write(s),a.document.close();const r=()=>{setTimeout(()=>{a.focus();const i=()=>{setTimeout(()=>{a.closed||a.close()},2e3)};a.matchMedia&&a.matchMedia("print").addEventListener("change",rt=>{rt.matches||i()}),a.addEventListener("afterprint",i),a.print(),setTimeout(()=>{a.closed||a.close()},3e4)},1e3)};a.document.readyState==="complete"?r():(a.addEventListener("load",r),setTimeout(r,2e3))},z=s=>{try{const t=s==="lengkap"?M():I();F(t,s==="lengkap"?"laporan_lengkap_pengeluaran":"summary_pengeluaran"),b.value=!1,l.success(`Laporan ${s} berhasil didownload sebagai HTML!`)}catch(t){console.error("Error downloading HTML report:",t),l.error("Gagal download laporan HTML")}},A=s=>{try{const t=s==="lengkap"?M():I();nt(t,s),b.value=!1,l.success(`Laporan ${s} berhasil dibuka di tab baru!`)}catch(t){console.error("Error opening report in new tab:",t),z(s),l.info("Dibuka sebagai download HTML karena tab baru diblokir")}},V=s=>{b.value&&!s.target.closest(".relative")&&(b.value=!1)};return lt(()=>{document.addEventListener("click",V)}),it(()=>{document.removeEventListener("click",V)}),(s,t)=>(m(),g("div",$t,[e("div",Pt,[t[23]||(t[23]=e("div",null,[e("h1",{class:"text-xl sm:text-2xl font-semibold text-gray-900"},"Pengeluaran"),e("p",{class:"text-sm text-gray-500 mt-1"},"Kelola semua pengeluaran kas kelas")],-1)),e("div",St,[e("div",Tt,[e("button",{onClick:t[0]||(t[0]=a=>b.value=!b.value),class:"btn-secondary w-full sm:w-auto"},[h(x(vt),{class:"w-4 h-4 mr-2"}),t[16]||(t[16]=e("span",{class:"hidden sm:inline"},"Export Data",-1)),t[17]||(t[17]=e("span",{class:"sm:hidden"},"Export",-1)),h(x(_t),{class:"w-4 h-4 ml-1"})]),b.value?(m(),g("div",Et,[e("div",Ct,[t[20]||(t[20]=e("div",{class:"px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100"}," CSV Export ",-1)),e("button",{onClick:tt,class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 📊 Export Pengeluaran "),e("button",{onClick:et,class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 📈 Export per Kategori "),e("button",{onClick:at,class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 🔍 Export Data Terfilter "),e("div",Kt,[t[19]||(t[19]=e("div",{class:"px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"}," PDF Download ",-1)),e("button",{onClick:st,class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 📄 Download PDF Lengkap "),e("button",{onClick:ot,class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 📋 Download PDF Summary "),e("div",jt,[t[18]||(t[18]=e("div",{class:"px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"}," Alternative Format ",-1)),e("button",{onClick:t[1]||(t[1]=a=>z("lengkap")),class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 🌐 Download HTML Lengkap "),e("button",{onClick:t[2]||(t[2]=a=>z("summary")),class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 🌐 Download HTML Summary "),e("button",{onClick:t[3]||(t[3]=a=>A("lengkap")),class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 🗂️ Buka di Tab Baru (Lengkap) "),e("button",{onClick:t[4]||(t[4]=a=>A("summary")),class:"block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"}," 🗂️ Buka di Tab Baru (Summary) ")])])])])):f("",!0)]),e("button",{onClick:t[5]||(t[5]=a=>j.value=!0),class:"btn-primary w-full sm:w-auto"},[h(x(ft),{class:"w-4 h-4 mr-2"}),t[21]||(t[21]=e("span",{class:"hidden sm:inline"},"Tambah Pengeluaran",-1)),t[22]||(t[22]=e("span",{class:"sm:hidden"},"Tambah",-1))])])]),e("div",Lt,[e("div",Ft,[e("div",Mt,[e("div",It,[h(x(yt),{class:"w-6 h-6 text-red-600"})]),e("div",zt,[t[24]||(t[24]=e("p",{class:"text-sm font-medium text-gray-600"},"Total Pengeluaran",-1)),e("p",Bt,p(u(v.value)),1)])])]),e("div",Ht,[e("div",Rt,[e("div",Ut,[h(x(ht),{class:"w-6 h-6 text-warning-600"})]),e("div",At,[t[25]||(t[25]=e("p",{class:"text-sm font-medium text-gray-600"},"Menunggu Persetujuan",-1)),e("p",Vt,p(L.value.length),1)])])]),e("div",Ot,[e("div",Gt,[e("div",Jt,[h(x(kt),{class:"w-6 h-6 text-success-600"})]),e("div",Nt,[t[26]||(t[26]=e("p",{class:"text-sm font-medium text-gray-600"},"Disetujui",-1)),e("p",qt,p(w.value.length),1)])])]),e("div",Qt,[e("div",Wt,[e("div",Yt,[h(x(xt),{class:"w-6 h-6 text-gray-600"})]),e("div",Xt,[t[27]||(t[27]=e("p",{class:"text-sm font-medium text-gray-600"},"Sisa Saldo",-1)),e("p",Zt,p(u(x(d).currentBalance)),1)])])])]),e("div",te,[e("div",ee,[e("div",null,[t[29]||(t[29]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Filter Status",-1)),y(e("select",{"onUpdate:modelValue":t[6]||(t[6]=a=>n.status=a),class:"input-field"},t[28]||(t[28]=[e("option",{value:""},"Semua Status",-1),e("option",{value:"pending"},"Menunggu Persetujuan",-1),e("option",{value:"approved"},"Disetujui",-1),e("option",{value:"rejected"},"Ditolak",-1)]),512),[[K,n.status]])]),e("div",null,[t[31]||(t[31]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Filter Kategori",-1)),y(e("select",{"onUpdate:modelValue":t[7]||(t[7]=a=>n.category=a),class:"input-field"},t[30]||(t[30]=[G('<option value="">Semua Kategori</option><option value="kegiatan">Kegiatan Kelas</option><option value="perlengkapan">Perlengkapan</option><option value="konsumsi">Konsumsi</option><option value="transport">Transport</option><option value="lainnya">Lainnya</option>',6)]),512),[[K,n.category]])]),e("div",null,[t[32]||(t[32]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Dari Tanggal",-1)),y(e("input",{"onUpdate:modelValue":t[8]||(t[8]=a=>n.dateFrom=a),type:"date",class:"input-field"},null,512),[[D,n.dateFrom]])]),e("div",null,[t[33]||(t[33]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Sampai Tanggal",-1)),y(e("input",{"onUpdate:modelValue":t[9]||(t[9]=a=>n.dateTo=a),type:"date",class:"input-field"},null,512),[[D,n.dateTo]])])])]),e("div",ae,[e("div",se,[e("table",oe,[t[34]||(t[34]=e("thead",{class:"bg-gray-50"},[e("tr",null,[e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Tanggal "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Kategori "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Keterangan "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Jumlah "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Status "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Persetujuan "),e("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Aksi ")])],-1)),e("tbody",ne,[(m(!0),g(dt,null,ut(c.value,a=>(m(),g("tr",{key:a.id},[e("td",re,p(S(a.created_at)),1),e("td",le,[e("span",ie,p($(a.category)),1)]),e("td",de,[pt(p(a.description)+" ",1),a.notes?(m(),g("div",ue,p(a.notes),1)):f("",!0)]),e("td",pe,p(u(a.amount)),1),e("td",ce,[e("span",{class:ct(N(a.status))},p(T(a.status)),3)]),e("td",ge,[a.status==="approved"?(m(),g("div",me,[e("div",be,p(a.approved_by||"Admin"),1),e("div",ye,p(a.approved_at?S(a.approved_at):""),1)])):(m(),g("span",xe,"-"))]),e("td",ve,[e("div",fe,[a.status==="pending"?(m(),g("button",{key:0,onClick:r=>Q(a),class:"text-success-600 hover:text-success-900"}," Setujui ",8,he)):f("",!0),a.status==="pending"?(m(),g("button",{key:1,onClick:r=>W(a),class:"text-red-600 hover:text-red-900"}," Tolak ",8,ke)):f("",!0),e("button",{onClick:r=>q(a),class:"text-primary-600 hover:text-primary-900"}," Edit ",8,we),e("button",{onClick:r=>Z(a),class:"text-red-600 hover:text-red-900"}," Hapus ",8,De)])])]))),128))])]),c.value.length===0?(m(),g("div",_e,t[35]||(t[35]=[e("p",{class:"text-sm text-gray-500"},"Tidak ada pengeluaran yang ditemukan",-1)]))):f("",!0)])]),j.value||k.value?(m(),g("div",$e,[e("div",Pe,[e("h3",Se,p(k.value?"Edit Pengeluaran":"Tambah Pengeluaran Baru"),1),e("form",{onSubmit:gt(X,["prevent"]),class:"space-y-4"},[e("div",null,[t[37]||(t[37]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Kategori",-1)),y(e("select",{"onUpdate:modelValue":t[10]||(t[10]=a=>o.category=a),required:"",class:"input-field"},t[36]||(t[36]=[G('<option value="">Pilih Kategori</option><option value="kegiatan">Kegiatan Kelas</option><option value="perlengkapan">Perlengkapan</option><option value="konsumsi">Konsumsi</option><option value="transport">Transport</option><option value="lainnya">Lainnya</option>',6)]),512),[[K,o.category]])]),e("div",null,[t[38]||(t[38]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Jumlah",-1)),y(e("input",{"onUpdate:modelValue":t[11]||(t[11]=a=>o.amount=a),type:"number",min:"1",required:"",class:"input-field",placeholder:"Masukkan jumlah"},null,512),[[D,o.amount,void 0,{number:!0}]])]),e("div",null,[t[39]||(t[39]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Keterangan",-1)),y(e("input",{"onUpdate:modelValue":t[12]||(t[12]=a=>o.description=a),type:"text",required:"",class:"input-field",placeholder:"Contoh: Pembelian alat tulis"},null,512),[[D,o.description]])]),e("div",null,[t[40]||(t[40]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Catatan (Opsional)",-1)),y(e("textarea",{"onUpdate:modelValue":t[13]||(t[13]=a=>o.notes=a),rows:"3",class:"input-field",placeholder:"Catatan tambahan"},null,512),[[D,o.notes]])]),e("div",null,[t[42]||(t[42]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Status",-1)),y(e("select",{"onUpdate:modelValue":t[14]||(t[14]=a=>o.status=a),class:"input-field"},t[41]||(t[41]=[e("option",{value:"pending"},"Menunggu Persetujuan",-1),e("option",{value:"approved"},"Disetujui",-1),e("option",{value:"rejected"},"Ditolak",-1)]),512),[[K,o.status]])]),o.status==="approved"?(m(),g("div",Te,[t[43]||(t[43]=e("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Disetujui Oleh",-1)),y(e("input",{"onUpdate:modelValue":t[15]||(t[15]=a=>o.approved_by=a),type:"text",class:"input-field",placeholder:"Nama yang menyetujui"},null,512),[[D,o.approved_by]])])):f("",!0),e("div",Ee,[e("button",{type:"button",onClick:B,class:"btn-secondary"}," Batal "),e("button",{type:"submit",disabled:P.value,class:"btn-primary"},p(P.value?"Menyimpan...":"Simpan"),9,Ce)])],32)])])):f("",!0)]))}};export{Ue as default};
