import{J as D,c as v,E as y,l as t,f as W,z as $,b as F,q as g,e as J,F as z,y as Y,r as tt,Q as vt,o as ft,H as A,k as et,R as at,W as wt,S as dt}from"./vendor-Cn5j0SEu.js";import{b as _t,u as kt,e as $t,f as St,g as Dt,h as Pt}from"./index-Dl3Gqoma.js";import{u as S,w as st}from"./excel-C9Ruqv6W.js";import"./export-DbUzqSZp.js";import{C as Tt,a as Et,L as Bt,P as Kt,b as At,B as It,p as Mt,c as Ct,d as Ft,A as Lt,e as ut,f as Rt,D as jt,g as Nt}from"./charts-D38yv1J6.js";import{r as G,t as N,a as ct,f as R,l as lt}from"./index-BoRhMNJp.js";import{r as nt}from"./DocumentArrowDownIcon-CfkQcPq0.js";import{r as ot}from"./PrinterIcon-F7orX_Kk.js";function Ot(k,d){G(2,arguments);var c=N(k),b=ct(d);if(isNaN(b))return new Date(NaN);if(!b)return c;var m=c.getDate(),h=new Date(c.getTime());h.setMonth(c.getMonth()+b+1,0);var x=h.getDate();return m>=x?h:(c.setFullYear(h.getFullYear(),h.getMonth(),m),c)}function V(k){G(1,arguments);var d=N(k),c=d.getMonth();return d.setFullYear(d.getFullYear(),c+1,0),d.setHours(23,59,59,999),d}function zt(k){G(1,arguments);var d=k||{},c=N(d.start),b=N(d.end),m=b.getTime(),h=[];if(!(c.getTime()<=m))throw new RangeError("Invalid interval");var x=c;for(x.setHours(0,0,0,0),x.setDate(1);x.getTime()<=m;)h.push(N(x)),x.setMonth(x.getMonth()+1);return h}function q(k){G(1,arguments);var d=N(k);return d.setDate(1),d.setHours(0,0,0,0),d}function Yt(k){G(1,arguments);var d=N(k),c=d.getFullYear();return d.setFullYear(c+1,0,0),d.setHours(23,59,59,999),d}function Gt(k){G(1,arguments);var d=N(k),c=new Date(0);return c.setFullYear(d.getFullYear(),0,1),c.setHours(0,0,0,0),c}function pt(k,d){G(2,arguments);var c=ct(d);return Ot(k,-c)}const Ht={class:"space-y-6"},Wt={class:"card p-6"},Ut={class:"h-80"},Jt={key:1,class:"h-full flex items-center justify-center bg-gray-50 rounded-lg"},Vt={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},qt={class:"card p-6"},Zt={class:"h-64"},Qt={key:1,class:"h-full flex items-center justify-center bg-gray-50 rounded-lg"},Xt={class:"card p-6"},te={class:"h-64"},ee={key:1,class:"h-full flex items-center justify-center bg-gray-50 rounded-lg"},ae={class:"card p-6"},se={class:"h-64"},ne={key:1,class:"h-full flex items-center justify-center bg-gray-50 rounded-lg"},oe={class:"card p-6"},le={class:"h-80"},re={key:1,class:"h-full flex items-center justify-center bg-gray-50 rounded-lg"},ie={__name:"FinancialCharts",props:{transactions:{type:Array,default:()=>[]},expenses:{type:Array,default:()=>[]},students:{type:Array,default:()=>[]},period:{type:Object,default:()=>({from:"",to:""})}},setup(k){Tt.register(Et,Bt,Kt,At,It,Mt,Ct,Ft,Lt);const d=k,c=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(n),b=D(()=>{const n=new Date,l=pt(n,5),i=zt({start:l,end:n}),p=i.map(w=>R(w,"MMM yyyy",{locale:lt})),f=i.map(w=>{const j=q(w),O=V(w);return d.transactions.filter(K=>{const C=new Date(K.created_at);return K.type==="income"&&K.status==="completed"&&C>=j&&C<=O}).reduce((K,C)=>K+C.amount,0)}),L=i.map(w=>{const j=q(w),O=V(w);return d.expenses.filter(K=>{const C=new Date(K.created_at);return K.status==="approved"&&C>=j&&C<=O}).reduce((K,C)=>K+C.amount,0)});return{labels:p,datasets:[{label:"Pemasukan",data:f,borderColor:"rgb(34, 197, 94)",backgroundColor:"rgba(34, 197, 94, 0.1)",tension:.4,fill:!0},{label:"Pengeluaran",data:L,borderColor:"rgb(239, 68, 68)",backgroundColor:"rgba(239, 68, 68, 0.1)",tension:.4,fill:!0}]}}),m=D(()=>{const n=d.transactions.filter(i=>i.type==="income"&&i.status==="completed").reduce((i,p)=>i+p.amount,0),l=d.expenses.filter(i=>i.status==="approved").reduce((i,p)=>i+p.amount,0);return{labels:["Periode Saat Ini"],datasets:[{label:"Pemasukan",data:[n],backgroundColor:"rgba(34, 197, 94, 0.8)",borderColor:"rgb(34, 197, 94)",borderWidth:1},{label:"Pengeluaran",data:[l],backgroundColor:"rgba(239, 68, 68, 0.8)",borderColor:"rgb(239, 68, 68)",borderWidth:1}]}}),h=D(()=>{const n={};d.transactions.filter(f=>f.type==="income"&&f.status==="completed").forEach(f=>{const L=f.payment_method||"Manual";n[L]=(n[L]||0)+1});const l=Object.keys(n),i=Object.values(n);return{labels:l,datasets:[{data:i,backgroundColor:["rgba(59, 130, 246, 0.8)","rgba(34, 197, 94, 0.8)","rgba(245, 158, 11, 0.8)","rgba(239, 68, 68, 0.8)","rgba(168, 85, 247, 0.8)","rgba(236, 72, 153, 0.8)"].slice(0,l.length),borderWidth:2,borderColor:"#ffffff"}]}}),x=D(()=>{const n=d.transactions.filter(f=>f.type==="income"&&f.status==="completed").map(f=>f.student_id),l=[...new Set(n)].length,p=d.students.length-l;return{labels:["Sudah Bayar","Belum Bayar"],datasets:[{data:[l,p],backgroundColor:["rgba(34, 197, 94, 0.8)","rgba(239, 68, 68, 0.8)"],borderWidth:2,borderColor:"#ffffff"}]}}),I=D(()=>{const n=[...d.transactions.map(w=>({date:new Date(w.created_at),amount:w.type==="income"&&w.status==="completed"?w.amount:0,type:"income"})),...d.expenses.map(w=>({date:new Date(w.created_at),amount:w.status==="approved"?-w.amount:0,type:"expense"}))].sort((w,j)=>w.date-j.date),l=[],i=[];let p=0;n.forEach(w=>{p+=w.amount,l.push(R(w.date,"dd MMM",{locale:lt})),i.push(p)});const L=Math.max(0,l.length-30);return{labels:l.slice(L),datasets:[{label:"Saldo Kas",data:i.slice(L),borderColor:"rgb(59, 130, 246)",backgroundColor:"rgba(59, 130, 246, 0.1)",tension:.4,fill:!0,pointBackgroundColor:"rgb(59, 130, 246)",pointBorderColor:"#ffffff",pointBorderWidth:2}]}}),M={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(n){return`${n.dataset.label}: ${c(n.parsed.y)}`}}}},scales:{y:{beginAtZero:!0,ticks:{callback:function(n){return c(n)}}}}},H={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(n){return`${n.dataset.label}: ${c(n.parsed.y)}`}}}},scales:{y:{beginAtZero:!0,ticks:{callback:function(n){return c(n)}}}}},B={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:function(n){const l=n.dataset.data.reduce((p,f)=>p+f,0),i=Math.round(n.parsed/l*100);return`${n.label}: ${n.parsed} (${i}%)`}}}}},a={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"},tooltip:{callbacks:{label:function(n){const l=n.dataset.data.reduce((p,f)=>p+f,0),i=Math.round(n.parsed/l*100);return`${n.label}: ${n.parsed} siswa (${i}%)`}}}}},o={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(n){return`${n.dataset.label}: ${c(n.parsed.y)}`}}}},scales:{y:{ticks:{callback:function(n){return c(n)}}}}};return(n,l)=>(y(),v("div",Ht,[t("div",Wt,[l[1]||(l[1]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Trend Keuangan Bulanan",-1)),t("div",Ut,[b.value.datasets.length>0?(y(),W($(ut),{key:0,data:b.value,options:M},null,8,["data"])):(y(),v("div",Jt,l[0]||(l[0]=[t("p",{class:"text-gray-500"},"Tidak ada data untuk ditampilkan",-1)])))])]),t("div",Vt,[t("div",qt,[l[3]||(l[3]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Perbandingan Pemasukan vs Pengeluaran",-1)),t("div",Zt,[m.value.datasets.length>0?(y(),W($(Rt),{key:0,data:m.value,options:H},null,8,["data"])):(y(),v("div",Qt,l[2]||(l[2]=[t("p",{class:"text-gray-500"},"Tidak ada data",-1)])))])]),t("div",Xt,[l[5]||(l[5]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Distribusi Metode Pembayaran",-1)),t("div",te,[h.value.datasets.length>0?(y(),W($(jt),{key:0,data:h.value,options:B},null,8,["data"])):(y(),v("div",ee,l[4]||(l[4]=[t("p",{class:"text-gray-500"},"Tidak ada data",-1)])))])])]),t("div",ae,[l[7]||(l[7]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Tingkat Pembayaran Siswa",-1)),t("div",se,[x.value.datasets.length>0?(y(),W($(Nt),{key:0,data:x.value,options:a},null,8,["data"])):(y(),v("div",ne,l[6]||(l[6]=[t("p",{class:"text-gray-500"},"Tidak ada data",-1)])))])]),t("div",oe,[l[9]||(l[9]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Trend Saldo Kas",-1)),t("div",le,[I.value.datasets.length>0?(y(),W($(ut),{key:0,data:I.value,options:o},null,8,["data"])):(y(),v("div",re,l[8]||(l[8]=[t("p",{class:"text-gray-500"},"Tidak ada data untuk ditampilkan",-1)])))])])]))}},de={class:"space-y-6"},ue={class:"card p-6"},ce={class:"grid grid-cols-1 md:grid-cols-2 gap-6"},pe={class:"space-y-4"},ge={class:"flex items-center space-x-3"},me={class:"text-sm text-gray-600"},he={class:"bg-gray-50 p-3 rounded-lg"},ye={class:"text-sm"},xe={class:"flex justify-between"},be={class:"font-medium"},ve={class:"space-y-4"},fe={class:"flex items-center space-x-3"},we={class:"text-sm text-gray-600"},_e={class:"bg-gray-50 p-3 rounded-lg"},ke={class:"text-sm"},$e={class:"flex justify-between"},Se={class:"font-medium"},De={class:"card p-6"},Pe={class:"grid grid-cols-1 lg:grid-cols-3 gap-6"},Te={class:"space-y-3"},Ee={class:"space-y-2"},Be={class:"flex justify-between text-sm"},Ke={class:"font-medium text-green-600"},Ae={class:"flex justify-between text-sm"},Ie={class:"font-medium text-red-600"},Me={class:"flex justify-between text-sm border-t pt-2"},Ce={class:"space-y-3"},Fe={class:"space-y-2"},Le={class:"flex justify-between text-sm"},Re={class:"font-medium"},je={class:"flex justify-between text-sm"},Ne={class:"w-full bg-gray-200 rounded-full h-2"},Oe={class:"space-y-3"},ze={class:"space-y-2"},Ye={class:"text-sm text-gray-600"},Ge={class:"card p-6"},He={class:"grid grid-cols-1 md:grid-cols-2 gap-6"},We={class:"space-y-4"},Ue={class:"space-y-3"},Je={class:"flex items-center space-x-3"},Ve={class:"text-sm text-gray-700"},qe={class:"text-right"},Ze={class:"text-sm font-medium text-gray-900"},Qe={class:"text-xs text-gray-500"},Xe={class:"space-y-4"},ta={class:"space-y-3"},ea={class:"flex justify-between text-sm"},aa={class:"text-gray-600"},sa={class:"font-medium"},na={class:"w-full bg-gray-200 rounded-full h-2"},oa={__name:"AnalyticsInsights",props:{transactions:{type:Array,default:()=>[]},expenses:{type:Array,default:()=>[]},students:{type:Array,default:()=>[]},period:{type:Object,default:()=>({from:"",to:""})}},setup(k){const d=k,c=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(a),b=D(()=>{const a=d.transactions.filter(i=>i.type==="income"&&i.status==="completed").reduce((i,p)=>i+p.amount,0),o=d.expenses.filter(i=>i.status==="approved").reduce((i,p)=>i+p.amount,0),n=o>0?(a/o).toFixed(2):"N/A",l=a-o;return l>a*.5?{status:"excellent",label:"Sangat Sehat",description:"Kas sangat stabil dengan surplus tinggi",ratio:n}:l>0?{status:"good",label:"Sehat",description:"Kas dalam kondisi baik dengan surplus",ratio:n}:l>-a*.2?{status:"warning",label:"Perlu Perhatian",description:"Kas hampir defisit, perlu monitoring",ratio:n}:{status:"critical",label:"Kritis",description:"Kas defisit, perlu tindakan segera",ratio:n}}),m=D(()=>{const a=d.transactions.filter(i=>i.type==="income"&&i.status==="completed").map(i=>i.student_id),o=[...new Set(a)].length,n=d.students.length,l=n>0?Math.round(o/n*100):0;return l>=90?{status:"excellent",label:"Sangat Baik",description:"Tingkat pembayaran sangat tinggi",percentage:l}:l>=75?{status:"good",label:"Baik",description:"Tingkat pembayaran cukup baik",percentage:l}:l>=50?{status:"warning",label:"Perlu Ditingkatkan",description:"Masih banyak siswa yang belum bayar",percentage:l}:{status:"critical",label:"Rendah",description:"Tingkat pembayaran sangat rendah",percentage:l}}),h=D(()=>{const a=d.transactions.filter(p=>p.type==="income"&&p.status==="completed").reduce((p,f)=>p+f.amount,0),o=d.expenses.filter(p=>p.status==="approved").reduce((p,f)=>p+f.amount,0),n=a*1.1,l=o*1.05,i=n-l;return{nextMonthIncome:n,nextMonthExpense:l,nextMonthBalance:i}}),x=D(()=>{const a=d.transactions.filter(l=>l.type==="income"&&l.status==="completed").reduce((l,i)=>l+i.amount,0),o=d.students.length*25e3,n=o>0?Math.round(a/o*100):0;return{monthlyTarget:o,achievementRate:n,currentIncome:a}}),I=D(()=>{const a=[];return m.value.percentage<75&&a.push({id:1,priority:"high",text:"Tingkatkan follow-up pembayaran siswa yang belum bayar"}),(b.value.status==="warning"||b.value.status==="critical")&&a.push({id:2,priority:"high",text:"Tinjau dan kurangi pengeluaran yang tidak penting"}),x.value.achievementRate<100&&a.push({id:3,priority:"medium",text:"Pertimbangkan strategi untuk mencapai target bulanan"}),a.length===0&&a.push({id:4,priority:"low",text:"Kondisi keuangan baik, pertahankan manajemen yang konsisten"}),a}),M=D(()=>{const a={},o=d.expenses.filter(i=>i.status==="approved").reduce((i,p)=>i+p.amount,0);d.expenses.filter(i=>i.status==="approved").forEach(i=>{const p=B(i.category);a[p]=(a[p]||0)+i.amount});const n=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6"];return{categories:Object.entries(a).map(([i,p],f)=>({name:i,amount:p,percentage:o>0?Math.round(p/o*100):0,color:n[f%n.length]})).sort((i,p)=>p.amount-i.amount),total:o}}),H=D(()=>Object.entries({Kegiatan:2e5,Perlengkapan:15e4,Konsumsi:1e5,Transport:75e3,Lainnya:5e4}).map(([o,n])=>{var i;const l=((i=M.value.categories.find(p=>p.name===o))==null?void 0:i.amount)||0;return{category:o,budget:n,actual:l,percentage:n>0?Math.round(l/n*100):0}})),B=a=>({kegiatan:"Kegiatan",perlengkapan:"Perlengkapan",konsumsi:"Konsumsi",transport:"Transport",lainnya:"Lainnya"})[a]||a;return(a,o)=>(y(),v("div",de,[t("div",ue,[o[4]||(o[4]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Insight Keuangan",-1)),t("div",ce,[t("div",pe,[o[1]||(o[1]=t("h4",{class:"text-md font-medium text-gray-700"},"Status Arus Kas",-1)),t("div",ge,[t("div",{class:F(["w-4 h-4 rounded-full",b.value.status==="excellent"?"bg-green-500":b.value.status==="good"?"bg-blue-500":b.value.status==="warning"?"bg-yellow-500":"bg-red-500"])},null,2),t("span",{class:F(["text-sm font-medium",[b.value.status==="excellent"?"text-green-700":b.value.status==="good"?"text-blue-700":b.value.status==="warning"?"text-yellow-700":"text-red-700"]])},g(b.value.label),3)]),t("p",me,g(b.value.description),1),t("div",he,[t("div",ye,[t("div",xe,[o[0]||(o[0]=t("span",null,"Rasio Pemasukan/Pengeluaran:",-1)),t("span",be,g(b.value.ratio),1)])])])]),t("div",ve,[o[3]||(o[3]=t("h4",{class:"text-md font-medium text-gray-700"},"Tingkat Penagihan",-1)),t("div",fe,[t("div",{class:F(["w-4 h-4 rounded-full",m.value.status==="excellent"?"bg-green-500":m.value.status==="good"?"bg-blue-500":m.value.status==="warning"?"bg-yellow-500":"bg-red-500"])},null,2),t("span",{class:F(["text-sm font-medium",[m.value.status==="excellent"?"text-green-700":m.value.status==="good"?"text-blue-700":m.value.status==="warning"?"text-yellow-700":"text-red-700"]])},g(m.value.label),3)]),t("p",we,g(m.value.description),1),t("div",_e,[t("div",ke,[t("div",$e,[o[2]||(o[2]=t("span",null,"Siswa yang sudah bayar:",-1)),t("span",Se,g(m.value.percentage)+"%",1)])])])])])]),t("div",De,[o[13]||(o[13]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Prediksi Keuangan",-1)),t("div",Pe,[t("div",Te,[o[8]||(o[8]=t("h4",{class:"text-md font-medium text-gray-700"},"Proyeksi Bulan Depan",-1)),t("div",Ee,[t("div",Be,[o[5]||(o[5]=t("span",{class:"text-gray-600"},"Pemasukan Estimasi:",-1)),t("span",Ke,g(c(h.value.nextMonthIncome)),1)]),t("div",Ae,[o[6]||(o[6]=t("span",{class:"text-gray-600"},"Pengeluaran Estimasi:",-1)),t("span",Ie,g(c(h.value.nextMonthExpense)),1)]),t("div",Me,[o[7]||(o[7]=t("span",{class:"text-gray-700 font-medium"},"Saldo Akhir:",-1)),t("span",{class:F(["font-semibold",[h.value.nextMonthBalance>=0?"text-green-600":"text-red-600"]])},g(c(h.value.nextMonthBalance)),3)])])]),t("div",Ce,[o[11]||(o[11]=t("h4",{class:"text-md font-medium text-gray-700"},"Target Pencapaian",-1)),t("div",Fe,[t("div",Le,[o[9]||(o[9]=t("span",{class:"text-gray-600"},"Target Bulanan:",-1)),t("span",Re,g(c(x.value.monthlyTarget)),1)]),t("div",je,[o[10]||(o[10]=t("span",{class:"text-gray-600"},"Pencapaian:",-1)),t("span",{class:F(["font-medium",[x.value.achievementRate>=100?"text-green-600":x.value.achievementRate>=75?"text-blue-600":"text-yellow-600"]])},g(x.value.achievementRate)+"%",3)]),t("div",Ne,[t("div",{class:F(["h-2 rounded-full",[x.value.achievementRate>=100?"bg-green-500":x.value.achievementRate>=75?"bg-blue-500":"bg-yellow-500"]]),style:J({width:Math.min(x.value.achievementRate,100)+"%"})},null,6)])])]),t("div",Oe,[o[12]||(o[12]=t("h4",{class:"text-md font-medium text-gray-700"},"Rekomendasi",-1)),t("div",ze,[(y(!0),v(z,null,Y(I.value,n=>(y(),v("div",{key:n.id,class:"flex items-start space-x-2"},[t("div",{class:F(["w-2 h-2 rounded-full mt-2 flex-shrink-0",n.priority==="high"?"bg-red-500":n.priority==="medium"?"bg-yellow-500":"bg-green-500"])},null,2),t("p",Ye,g(n.text),1)]))),128))])])])]),t("div",Ge,[o[16]||(o[16]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Analisis Pengeluaran",-1)),t("div",He,[t("div",We,[o[14]||(o[14]=t("h4",{class:"text-md font-medium text-gray-700"},"Trend Pengeluaran",-1)),t("div",Ue,[(y(!0),v(z,null,Y(M.value.categories,n=>(y(),v("div",{key:n.name,class:"flex items-center justify-between"},[t("div",Je,[t("div",{class:"w-3 h-3 rounded-full",style:J({backgroundColor:n.color})},null,4),t("span",Ve,g(n.name),1)]),t("div",qe,[t("div",Ze,g(c(n.amount)),1),t("div",Qe,g(n.percentage)+"%",1)])]))),128))])]),t("div",Xe,[o[15]||(o[15]=t("h4",{class:"text-md font-medium text-gray-700"},"Budget vs Aktual",-1)),t("div",ta,[(y(!0),v(z,null,Y(H.value,n=>(y(),v("div",{key:n.category,class:"space-y-2"},[t("div",ea,[t("span",aa,g(n.category),1),t("span",sa,g(c(n.actual))+" / "+g(c(n.budget)),1)]),t("div",na,[t("div",{class:F(["h-2 rounded-full",[n.percentage<=100?"bg-green-500":n.percentage<=125?"bg-yellow-500":"bg-red-500"]]),style:J({width:Math.min(n.percentage,100)+"%"})},null,6)]),t("div",{class:F(["text-xs",[n.percentage<=100?"text-green-600":n.percentage<=125?"text-yellow-600":"text-red-600"]])},g(n.percentage>100?"Melebihi budget ":"Dalam budget ")+" ("+g(n.percentage)+"%) ",3)]))),128))])])])])]))}},la={class:"space-y-6"},ra={class:"flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"},ia={class:"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"},da={class:"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"},ua={class:"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"},ca={class:"relative group"},pa={class:"relative group"},ga={class:"relative group"},ma={class:"card p-4 sm:p-6"},ha={class:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"},ya={key:0},xa={key:1},ba={class:"grid grid-cols-1 md:grid-cols-4 gap-6"},va={class:"card p-6"},fa={class:"flex items-center"},wa={class:"p-2 bg-success-100 rounded-lg"},_a={class:"ml-4"},ka={class:"text-2xl font-semibold text-gray-900"},$a={class:"card p-6"},Sa={class:"flex items-center"},Da={class:"p-2 bg-red-100 rounded-lg"},Pa={class:"ml-4"},Ta={class:"text-2xl font-semibold text-gray-900"},Ea={class:"card p-6"},Ba={class:"flex items-center"},Ka={class:"p-2 bg-primary-100 rounded-lg"},Aa={class:"ml-4"},Ia={class:"text-2xl font-semibold text-gray-900"},Ma={class:"card p-6"},Ca={class:"flex items-center"},Fa={class:"p-2 bg-warning-100 rounded-lg"},La={class:"ml-4"},Ra={class:"text-2xl font-semibold text-gray-900"},ja={class:"grid grid-cols-1 md:grid-cols-3 gap-6"},Na={class:"card p-6"},Oa={class:"space-y-3"},za={class:"flex justify-between items-center"},Ya={class:"text-lg font-semibold text-primary-600"},Ga={class:"w-full bg-gray-200 rounded-full h-2"},Ha={class:"text-xs text-gray-500"},Wa={class:"card p-6"},Ua={class:"space-y-2"},Ja={class:"text-2xl font-bold text-gray-900"},Va={class:"text-xs text-gray-400"},qa={class:"card p-6"},Za={class:"space-y-2"},Qa={class:"text-sm text-gray-600"},Xa={class:"text-sm font-medium text-gray-900"},ts={key:0,class:"text-sm text-gray-500 text-center py-4"},es={class:"card p-6"},as={class:"grid grid-cols-1 md:grid-cols-2 gap-6"},ss={class:"text-md font-medium text-success-600 mb-3"},ns={class:"space-y-2 max-h-64 overflow-y-auto"},os={class:"text-sm font-medium text-success-900"},ls={class:"text-xs text-success-600"},rs={class:"text-md font-medium text-red-600 mb-3"},is={class:"space-y-2 max-h-64 overflow-y-auto"},ds={class:"text-sm font-medium text-red-900"},us={class:"card p-6"},cs={class:"overflow-x-auto"},ps={class:"min-w-full divide-y divide-gray-200"},gs={class:"bg-white divide-y divide-gray-200"},ms={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-900"},hs={class:"px-6 py-4 whitespace-nowrap text-sm text-gray-500"},ys={class:"px-6 py-4 text-sm text-gray-500"},xs={class:"px-6 py-4 whitespace-nowrap text-sm font-medium text-success-600"},bs={class:"px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600"},vs={class:"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"},Ts={__name:"Reports",setup(k){const d=_t(),c=kt(),b=tt("thisMonth"),m=tt(""),h=tt(""),x=D(()=>{if(!m.value||!h.value)return[];const s=new Date(m.value),e=new Date(h.value+"T23:59:59");return d.transactions.filter(r=>{const _=new Date(r.created_at);return _>=s&&_<=e})}),I=D(()=>{if(!m.value||!h.value)return[];const s=new Date(m.value),e=new Date(h.value+"T23:59:59");return d.expenses.filter(r=>{const _=new Date(r.created_at);return _>=s&&_<=e})}),M=D(()=>d.students.length===0?0:Math.round(a.paidStudents.length/d.students.length*100)),H=D(()=>a.paidStudents.length===0?0:a.totalIncome/a.paidStudents.length),B=D(()=>{const s={};return I.value.filter(e=>e.status==="approved").forEach(e=>{const r=j(e.category);s[r]=(s[r]||0)+e.amount}),Object.entries(s).map(([e,r])=>({name:e,amount:r})).sort((e,r)=>r.amount-e.amount).slice(0,5)}),a=vt({totalIncome:0,totalExpenses:0,balance:0,transactionCount:0,paidStudents:[],unpaidStudents:[],detailedTransactions:[]}),o=s=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(s),n=s=>R(new Date(s),"dd MMM yyyy",{locale:lt}),l=()=>{const s=new Date;switch(b.value){case"thisMonth":m.value=R(q(s),"yyyy-MM-dd"),h.value=R(V(s),"yyyy-MM-dd");break;case"lastMonth":const e=pt(s,1);m.value=R(q(e),"yyyy-MM-dd"),h.value=R(V(e),"yyyy-MM-dd");break;case"thisYear":m.value=R(Gt(s),"yyyy-MM-dd"),h.value=R(Yt(s),"yyyy-MM-dd");break}b.value!=="custom"&&i()},i=()=>{if(!m.value||!h.value)return;a.totalIncome=x.value.filter(u=>u.type==="income"&&u.status==="completed").reduce((u,E)=>u+E.amount,0),a.totalExpenses=I.value.filter(u=>u.status==="approved").reduce((u,E)=>u+E.amount,0),a.balance=a.totalIncome-a.totalExpenses,a.transactionCount=x.value.length+I.value.length;const s=x.value.filter(u=>u.type==="income"&&u.status==="completed").map(u=>u.student_id),e={};x.value.filter(u=>u.type==="income"&&u.status==="completed").forEach(u=>{e[u.student_id]||(e[u.student_id]=0),e[u.student_id]+=u.amount}),a.paidStudents=d.students.filter(u=>s.includes(u.id)).map(u=>({...u,totalPaid:e[u.id]||0})),a.unpaidStudents=d.students.filter(u=>!s.includes(u.id));const r=[...x.value.map(u=>{var E;return{date:u.created_at,type:u.type,description:u.description+((E=u.student)!=null&&E.name?` - ${u.student.name}`:""),amount:u.amount}}),...I.value.map(u=>({date:u.created_at,type:"expense",description:u.description,amount:u.amount}))].sort((u,E)=>new Date(u.date)-new Date(E.date));let _=0;a.detailedTransactions=r.map(u=>(u.type==="income"?_+=u.amount:_-=u.amount,{...u,balance:_}))},p=()=>{try{const s=S.book_new(),e=[["RINGKASAN KEUANGAN KAS KELAS 1B"],["SD Islam Al Husna - Tahun Ajaran 2025/2026"],["Periode: "+m.value+" s/d "+h.value],["Tanggal Export: "+new Date().toLocaleDateString("id-ID")],[],["Keterangan","Jumlah (IDR)","Detail"],["Total Pemasukan",a.totalIncome,`${a.paidStudents.length} siswa`],["Total Pengeluaran",a.totalExpenses,w()],["Saldo Akhir",a.balance,a.balance>=0?"Surplus":"Defisit"],["Total Transaksi",a.transactionCount,"Semua jenis"],["Siswa Sudah Bayar",a.paidStudents.length,`${Math.round(a.paidStudents.length/(a.paidStudents.length+a.unpaidStudents.length)*100)}%`],["Siswa Belum Bayar",a.unpaidStudents.length,`${Math.round(a.unpaidStudents.length/(a.paidStudents.length+a.unpaidStudents.length)*100)}%`]],r=S.aoa_to_sheet(e);r["!cols"]=[{width:25},{width:20},{width:30}];const _={numFmt:"#,##0"};r.B7&&(r.B7.z="#,##0"),r.B8&&(r.B8.z="#,##0"),r.B9&&(r.B9.z="#,##0"),S.book_append_sheet(s,r,"Ringkasan");const u=`Ringkasan_Keuangan_${O()}.xlsx`;st(s,u),c.success("📊 Ringkasan keuangan Excel berhasil di-export!")}catch(s){console.error("Error exporting summary Excel:",s),c.error("❌ Gagal export ringkasan Excel")}},f=()=>{try{const s=S.book_new(),e=[["DETAIL TRANSAKSI KAS KELAS 1B"],["SD Islam Al Husna - Tahun Ajaran 2025/2026"],["Periode: "+m.value+" s/d "+h.value],["Tanggal Export: "+new Date().toLocaleDateString("id-ID")],[]],r=["Tanggal","Jenis","Keterangan","Siswa/Kategori","Pemasukan (IDR)","Pengeluaran (IDR)","Saldo (IDR)","Status","Metode Pembayaran"],_=a.detailedTransactions.map(T=>[n(T.date),T.type==="income"?"Pemasukan":"Pengeluaran",T.description,T.student_name||T.category||"",T.type==="income"?T.amount:"",T.type==="expense"?T.amount:"",T.balance,T.status||"",T.payment_method||""]),u=[...e,r,..._],E=S.aoa_to_sheet(u);E["!cols"]=[{width:12},{width:12},{width:30},{width:20},{width:15},{width:15},{width:15},{width:12},{width:15}],S.book_append_sheet(s,E,"Detail Transaksi");const U=`Detail_Transaksi_${O()}.xlsx`;st(s,U),c.success("📋 Detail transaksi Excel berhasil di-export!")}catch(s){console.error("Error exporting detailed Excel:",s),c.error("❌ Gagal export detail Excel")}},L=()=>{try{const s=S.book_new(),e=[["LAPORAN LENGKAP KAS KELAS 1B"],["SD Islam Al Husna - Tahun Ajaran 2025/2026"],["Periode: "+m.value+" s/d "+h.value],["Tanggal Export: "+new Date().toLocaleDateString("id-ID")],[],["RINGKASAN KEUANGAN"],["Total Pemasukan",a.totalIncome],["Total Pengeluaran",a.totalExpenses],["Saldo Akhir",a.balance],["Total Transaksi",a.transactionCount],["Rate Pembayaran",`${M.value}%`],[],["STATUS PEMBAYARAN"],["Siswa Sudah Bayar",a.paidStudents.length],["Siswa Belum Bayar",a.unpaidStudents.length],["Total Siswa",d.students.length]],r=S.aoa_to_sheet(e);r["!cols"]=[{width:25},{width:20}],S.book_append_sheet(s,r,"Ringkasan");const _=[["SISWA SUDAH BAYAR"],[],["Nama Siswa","Total Pembayaran"],...a.paidStudents.map(P=>[P.name,P.totalPaid])],u=S.aoa_to_sheet(_);u["!cols"]=[{width:30},{width:20}],S.book_append_sheet(s,u,"Sudah Bayar");const E=[["SISWA BELUM BAYAR"],[],["Nama Siswa","No. HP Orang Tua"],...a.unpaidStudents.map(P=>[P.name,P.phone])],U=S.aoa_to_sheet(E);U["!cols"]=[{width:30},{width:20}],S.book_append_sheet(s,U,"Belum Bayar");const T=[["DETAIL TRANSAKSI LENGKAP"],[],["Tanggal","Jenis","Keterangan","Pemasukan","Pengeluaran","Saldo"],...a.detailedTransactions.map(P=>[n(P.date),P.type==="income"?"Pemasukan":"Pengeluaran",P.description,P.type==="income"?P.amount:"",P.type==="expense"?P.amount:"",P.balance])],rt=S.aoa_to_sheet(T);if(rt["!cols"]=[{width:12},{width:12},{width:35},{width:15},{width:15},{width:15}],S.book_append_sheet(s,rt,"Detail Transaksi"),B.value.length>0){const P=[["KATEGORI PENGELUARAN"],[],["Kategori","Total Pengeluaran","Persentase"],...B.value.map(X=>{const bt=a.totalExpenses>0?(X.amount/a.totalExpenses*100).toFixed(1):0;return[X.name,X.amount,bt+"%"]})],it=S.aoa_to_sheet(P);it["!cols"]=[{width:25},{width:20},{width:15}],S.book_append_sheet(s,it,"Kategori Pengeluaran")}const xt=`Laporan_Lengkap_Kas_${O()}.xlsx`;st(s,xt),c.success("📈 Laporan lengkap Excel berhasil di-export!")}catch(s){console.error("Error exporting complete Excel:",s),c.error("❌ Gagal export laporan lengkap Excel")}},w=()=>{const s={};return d.expenses.filter(e=>e.status==="approved").forEach(e=>{s[e.category]=(s[e.category]||0)+e.amount}),Object.entries(s).map(([e,r])=>`${j(e)}: ${o(r)}`).join("; ")},j=s=>({kegiatan:"Kegiatan",perlengkapan:"Perlengkapan",konsumsi:"Konsumsi",transport:"Transport",lainnya:"Lainnya"})[s]||s,O=()=>{const s=m.value.replace(/-/g,""),e=h.value.replace(/-/g,"");return`${s}_${e}`},K=()=>{try{const s=mt();Q(s,"Detail"),c.success("PDF Detail berhasil di-generate! Window baru terbuka.")}catch(s){console.error("Error generating Detail PDF:",s),c.error("Gagal generate PDF Detail")}},C=()=>{try{const s=ht();Q(s,"Summary"),c.success("PDF Summary berhasil di-generate! Window baru terbuka.")}catch(s){console.error("Error generating Summary PDF:",s),c.error("Gagal generate PDF Summary")}},gt=()=>{try{const s=yt();Q(s,"Lengkap"),c.success("PDF Lengkap berhasil di-generate! Window baru terbuka.")}catch(s){console.error("Error generating Complete PDF:",s),c.error("Gagal generate PDF Lengkap")}},Z=()=>`
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.4;
      color: #333;
      background: white;
      margin: 20px;
      min-height: 100vh;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Improved print styles */
    @page {
      size: A4;
      margin: 1.5cm;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
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
    .positive { color: #059669; font-weight: 500; }
    .negative { color: #dc2626; font-weight: 500; }
    .highlight { background-color: #f0f9ff; }
    .summary-box {
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #2563eb;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
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
    @media print {
      body { margin: 0; }
      .header { background: #2563eb !important; -webkit-print-color-adjust: exact; }
    }
  </style>
`,mt=()=>`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Detail Keuangan Kas Kelas</title>
    ${Z()}
  </head>
  <body>
    <div class="header">
      <h1>📊 Laporan Detail Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${n(m.value)} - ${n(h.value)}</p>
      <p>Tanggal Cetak: ${n(new Date().toISOString().split("T")[0])}</p>
    </div>

    <div class="section">
      <h3 class="section-title">📋 Detail Transaksi Lengkap</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 12%">Tanggal</th>
            <th style="width: 10%">Jenis</th>
            <th style="width: 30%">Keterangan</th>
            <th style="width: 15%">Pemasukan</th>
            <th style="width: 15%">Pengeluaran</th>
            <th style="width: 18%">Saldo Running</th>
          </tr>
        </thead>
        <tbody>
          ${a.detailedTransactions.map((s,e)=>`
            <tr ${e%2===0?'class="highlight"':""}>
              <td>${n(s.date)}</td>
              <td><strong>${s.type==="income"?"💰 Masuk":"💸 Keluar"}</strong></td>
              <td>${s.description}</td>
              <td class="${s.type==="income"?"positive":""}">${s.type==="income"?o(s.amount):"-"}</td>
              <td class="${s.type==="expense"?"negative":""}">${s.type==="expense"?o(s.amount):"-"}</td>
              <td class="${s.balance>=0?"positive":"negative"}"><strong>${o(s.balance)}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4 style="color: #059669; margin-bottom: 10px;">✅ Siswa Sudah Bayar (${a.paidStudents.length})</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>Total Bayar</th>
            </tr>
          </thead>
          <tbody>
            ${a.paidStudents.map(s=>`
              <tr>
                <td>${s.name}</td>
                <td class="positive">${o(s.totalPaid)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="card">
        <h4 style="color: #dc2626; margin-bottom: 10px;">❌ Siswa Belum Bayar (${a.unpaidStudents.length})</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${a.unpaidStudents.map(s=>`
              <tr>
                <td>${s.name}</td>
                <td class="negative">Belum Bayar</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Laporan ini dibuat secara otomatis pada ${new Date().toLocaleString("id-ID")}</p>
    </div>
  </body>
  </html>
`,ht=()=>`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Summary Keuangan Kas Kelas</title>
    ${Z()}
  </head>
  <body>
    <div class="header">
      <h1>📈 Laporan Summary Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${n(m.value)} - ${n(h.value)}</p>
      <p>Tanggal Cetak: ${n(new Date().toISOString().split("T")[0])}</p>
    </div>

    <div class="summary-box">
      <h3 style="margin-bottom: 15px; color: #1f2937;">💰 Ringkasan Keuangan</h3>
      <table class="table">
        <tr>
          <td style="width: 40%"><strong>💵 Total Pemasukan</strong></td>
          <td class="positive" style="font-size: 1.1rem;"><strong>${o(a.totalIncome)}</strong></td>
        </tr>
        <tr>
          <td><strong>💸 Total Pengeluaran</strong></td>
          <td class="negative" style="font-size: 1.1rem;"><strong>${o(a.totalExpenses)}</strong></td>
        </tr>
        <tr style="background: #f0f9ff;">
          <td><strong>🏦 Saldo Akhir</strong></td>
          <td class="${a.balance>=0?"positive":"negative"}" style="font-size: 1.2rem;">
            <strong>${o(a.balance)}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>📊 Total Transaksi</strong></td>
          <td style="font-weight: 600;">${a.transactionCount} transaksi</td>
        </tr>
      </table>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4 style="color: #2563eb; margin-bottom: 10px;">👥 Status Pembayaran</h4>
        <table class="table">
          <tr>
            <td><strong>✅ Sudah Bayar</strong></td>
            <td class="positive">${a.paidStudents.length} siswa (${M.value}%)</td>
          </tr>
          <tr>
            <td><strong>❌ Belum Bayar</strong></td>
            <td class="negative">${a.unpaidStudents.length} siswa (${100-M.value}%)</td>
          </tr>
          <tr>
            <td><strong>💰 Rata-rata Bayar</strong></td>
            <td>${o(H.value)}</td>
          </tr>
        </table>
      </div>

      <div class="card">
        <h4 style="color: #059669; margin-bottom: 10px;">📈 Kategori Pengeluaran</h4>
        <table class="table">
          ${B.value.map(s=>`
            <tr>
              <td>${s.name}</td>
              <td class="negative">${o(s.amount)}</td>
            </tr>
          `).join("")}
          ${B.value.length===0?'<tr><td colspan="2" style="text-align: center; color: #6b7280;">Belum ada pengeluaran</td></tr>':""}
        </table>
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Summary dibuat pada ${new Date().toLocaleString("id-ID")}</p>
    </div>
  </body>
  </html>
`,yt=()=>`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Laporan Lengkap Keuangan Kas Kelas</title>
    ${Z()}
  </head>
  <body>
    <div class="header">
      <h1>📋 Laporan Lengkap Keuangan</h1>
      <h2>SD Islam Al Husna - Kelas 1B</h2>
      <p>Komplek Keuangan, Jl. Guntur I</p>
      <p>Periode: ${n(m.value)} - ${n(h.value)}</p>
      <p>Tanggal Cetak: ${n(new Date().toISOString().split("T")[0])}</p>
    </div>

    <!-- Executive Summary -->
    <div class="summary-box">
      <h3 style="margin-bottom: 15px; color: #1f2937;">🎯 Executive Summary</h3>
      <table class="table">
        <tr>
          <td style="width: 40%"><strong>💵 Total Pemasukan</strong></td>
          <td class="positive" style="font-size: 1.1rem;"><strong>${o(a.totalIncome)}</strong></td>
        </tr>
        <tr>
          <td><strong>💸 Total Pengeluaran</strong></td>
          <td class="negative" style="font-size: 1.1rem;"><strong>${o(a.totalExpenses)}</strong></td>
        </tr>
        <tr style="background: #f0f9ff;">
          <td><strong>🏦 Saldo Akhir</strong></td>
          <td class="${a.balance>=0?"positive":"negative"}" style="font-size: 1.2rem;">
            <strong>${o(a.balance)}</strong>
          </td>
        </tr>
        <tr>
          <td><strong>📊 Total Transaksi</strong></td>
          <td style="font-weight: 600;">${a.transactionCount} transaksi</td>
        </tr>
        <tr>
          <td><strong>👥 Rate Pembayaran</strong></td>
          <td style="font-weight: 600;">${M.value}% (${a.paidStudents.length}/${d.students.length} siswa)</td>
        </tr>
      </table>
    </div>

    <!-- Payment Status -->
    <div class="section">
      <h3 class="section-title">👥 Status Pembayaran Siswa</h3>
      <div class="grid-2">
        <div class="card">
          <h4 style="color: #059669; margin-bottom: 10px;">✅ Sudah Bayar (${a.paidStudents.length} siswa)</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Total Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              ${a.paidStudents.map(s=>`
                <tr>
                  <td>${s.name}</td>
                  <td class="positive">${o(s.totalPaid)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="card">
          <h4 style="color: #dc2626; margin-bottom: 10px;">❌ Belum Bayar (${a.unpaidStudents.length} siswa)</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${a.unpaidStudents.map(s=>`
                <tr>
                  <td>${s.name}</td>
                  <td class="negative">Belum Bayar</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detailed Transactions -->
    <div class="section">
      <h3 class="section-title">📋 Detail Transaksi Lengkap</h3>
      <table class="table">
        <thead>
          <tr>
            <th style="width: 12%">Tanggal</th>
            <th style="width: 10%">Jenis</th>
            <th style="width: 30%">Keterangan</th>
            <th style="width: 15%">Pemasukan</th>
            <th style="width: 15%">Pengeluaran</th>
            <th style="width: 18%">Saldo Running</th>
          </tr>
        </thead>
        <tbody>
          ${a.detailedTransactions.map((s,e)=>`
            <tr ${e%2===0?'class="highlight"':""}>
              <td>${n(s.date)}</td>
              <td><strong>${s.type==="income"?"💰 Masuk":"💸 Keluar"}</strong></td>
              <td>${s.description}</td>
              <td class="${s.type==="income"?"positive":""}">${s.type==="income"?o(s.amount):"-"}</td>
              <td class="${s.type==="expense"?"negative":""}">${s.type==="expense"?o(s.amount):"-"}</td>
              <td class="${s.balance>=0?"positive":"negative"}"><strong>${o(s.balance)}</strong></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Expense Categories -->
    ${B.value.length>0?`
    <div class="section">
      <h3 class="section-title">📈 Kategori Pengeluaran</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Total Pengeluaran</th>
            <th>Persentase</th>
          </tr>
        </thead>
        <tbody>
          ${B.value.map(s=>{const e=a.totalExpenses>0?(s.amount/a.totalExpenses*100).toFixed(1):0;return`
              <tr>
                <td>${s.name}</td>
                <td class="negative">${o(s.amount)}</td>
                <td>${e}%</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
    `:""}

    <div class="footer">
      <p>© ${new Date().getFullYear()} SD Islam Al Husna - Sistem Kas Digital Kelas 1B</p>
      <p>Laporan lengkap dibuat pada ${new Date().toLocaleString("id-ID")}</p>
      <p style="margin-top: 5px;">📍 Komplek Keuangan, Jl. Guntur I | 📞 (021) 7654-321</p>
    </div>
  </body>
  </html>
`,Q=(s,e)=>{const r=window.open("","_blank");if(!r)throw new Error("Popup blocked. Please allow popups for this site.");r.document.write(s),r.document.close(),r.document.title=`Laporan ${e} - Kas Kelas 1B`,r.addEventListener("load",()=>{setTimeout(()=>{r.focus(),r.console.log("PDF siap! Gunakan Ctrl+P untuk print atau Ctrl+S untuk save as PDF");const _=r.document.createElement("div");_.innerHTML=`
        <div style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: #2563eb; color: white; padding: 10px 15px; border-radius: 8px; font-family: Arial; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onclick="window.print()">
          🖨️ Print / Save PDF
        </div>
        <div style="position: fixed; top: 60px; right: 10px; z-index: 9999; background: #059669; color: white; padding: 8px 12px; border-radius: 6px; font-family: Arial; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-size: 12px;" onclick="window.close()">
          ✕ Tutup
        </div>
      `,r.document.body.appendChild(_)},1e3)})};return ft(()=>{l()}),(s,e)=>(y(),v("div",la,[t("div",ra,[e[18]||(e[18]=t("div",null,[t("h1",{class:"text-xl sm:text-2xl font-semibold text-gray-900"},"Laporan Keuangan"),t("p",{class:"text-sm text-gray-500 mt-1"},"Analisis dan laporan keuangan kas kelas")],-1)),t("div",ia,[t("div",da,[t("button",{onClick:p,class:"btn-secondary w-full sm:w-auto"},[A($(nt),{class:"w-4 h-4 mr-2"}),e[3]||(e[3]=t("span",{class:"hidden sm:inline"},"Export Summary Excel",-1)),e[4]||(e[4]=t("span",{class:"sm:hidden"},"Summary",-1))]),t("button",{onClick:f,class:"btn-secondary w-full sm:w-auto"},[A($(nt),{class:"w-4 h-4 mr-2"}),e[5]||(e[5]=t("span",{class:"hidden sm:inline"},"Export Detail Excel",-1)),e[6]||(e[6]=t("span",{class:"sm:hidden"},"Detail",-1))]),t("button",{onClick:L,class:"btn-primary w-full sm:w-auto"},[A($(nt),{class:"w-4 h-4 mr-2"}),e[7]||(e[7]=t("span",{class:"hidden sm:inline"},"Export Lengkap Excel",-1)),e[8]||(e[8]=t("span",{class:"sm:hidden"},"Lengkap",-1))])]),t("div",ua,[t("div",ca,[t("button",{onClick:K,class:"btn-outline w-full sm:w-auto"},[A($(ot),{class:"w-4 h-4 mr-2"}),e[9]||(e[9]=t("span",{class:"hidden sm:inline"},"PDF Detail",-1)),e[10]||(e[10]=t("span",{class:"sm:hidden"},"Detail PDF",-1))]),e[11]||(e[11]=t("div",{class:"absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"}," Buka di window baru untuk print/save ",-1))]),t("div",pa,[t("button",{onClick:C,class:"btn-outline w-full sm:w-auto"},[A($(ot),{class:"w-4 h-4 mr-2"}),e[12]||(e[12]=t("span",{class:"hidden sm:inline"},"PDF Summary",-1)),e[13]||(e[13]=t("span",{class:"sm:hidden"},"Summary PDF",-1))]),e[14]||(e[14]=t("div",{class:"absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"}," Ringkasan keuangan dalam PDF ",-1))]),t("div",ga,[t("button",{onClick:gt,class:"btn-primary w-full sm:w-auto"},[A($(ot),{class:"w-4 h-4 mr-2"}),e[15]||(e[15]=t("span",{class:"hidden sm:inline"},"PDF Lengkap",-1)),e[16]||(e[16]=t("span",{class:"sm:hidden"},"Lengkap PDF",-1))]),e[17]||(e[17]=t("div",{class:"absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"}," Laporan lengkap dengan semua detail ",-1))])])])]),t("div",ma,[t("div",ha,[t("div",null,[e[20]||(e[20]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Periode Laporan",-1)),at(t("select",{"onUpdate:modelValue":e[0]||(e[0]=r=>b.value=r),onChange:l,class:"input-field"},e[19]||(e[19]=[t("option",{value:"thisMonth"},"Bulan Ini",-1),t("option",{value:"lastMonth"},"Bulan Lalu",-1),t("option",{value:"thisYear"},"Tahun Ini",-1),t("option",{value:"custom"},"Kustom",-1)]),544),[[wt,b.value]])]),b.value==="custom"?(y(),v("div",ya,[e[21]||(e[21]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Dari Tanggal",-1)),at(t("input",{"onUpdate:modelValue":e[1]||(e[1]=r=>m.value=r),type:"date",class:"input-field",onChange:i},null,544),[[dt,m.value]])])):et("",!0),b.value==="custom"?(y(),v("div",xa,[e[22]||(e[22]=t("label",{class:"block text-sm font-medium text-gray-700 mb-2"},"Sampai Tanggal",-1)),at(t("input",{"onUpdate:modelValue":e[2]||(e[2]=r=>h.value=r),type:"date",class:"input-field",onChange:i},null,544),[[dt,h.value]])])):et("",!0)])]),t("div",ba,[t("div",va,[t("div",fa,[t("div",wa,[A($($t),{class:"w-6 h-6 text-success-600"})]),t("div",_a,[e[23]||(e[23]=t("p",{class:"text-sm font-medium text-gray-600"},"Total Pemasukan",-1)),t("p",ka,g(o(a.totalIncome)),1)])])]),t("div",$a,[t("div",Sa,[t("div",Da,[A($(St),{class:"w-6 h-6 text-red-600"})]),t("div",Pa,[e[24]||(e[24]=t("p",{class:"text-sm font-medium text-gray-600"},"Total Pengeluaran",-1)),t("p",Ta,g(o(a.totalExpenses)),1)])])]),t("div",Ea,[t("div",Ba,[t("div",Ka,[A($(Dt),{class:"w-6 h-6 text-primary-600"})]),t("div",Aa,[e[25]||(e[25]=t("p",{class:"text-sm font-medium text-gray-600"},"Saldo Akhir",-1)),t("p",Ia,g(o(a.balance)),1)])])]),t("div",Ma,[t("div",Ca,[t("div",Fa,[A($(Pt),{class:"w-6 h-6 text-warning-600"})]),t("div",La,[e[26]||(e[26]=t("p",{class:"text-sm font-medium text-gray-600"},"Transaksi",-1)),t("p",Ra,g(a.transactionCount),1)])])])]),A(ie,{transactions:x.value,expenses:I.value,students:$(d).students,period:{from:m.value,to:h.value}},null,8,["transactions","expenses","students","period"]),t("div",ja,[t("div",Na,[e[28]||(e[28]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Tingkat Pembayaran",-1)),t("div",Oa,[t("div",za,[e[27]||(e[27]=t("span",{class:"text-sm text-gray-600"},"Rate Pembayaran",-1)),t("span",Ya,g(M.value)+"%",1)]),t("div",Ga,[t("div",{class:"bg-primary-600 h-2 rounded-full",style:J({width:M.value+"%"})},null,4)]),t("div",Ha,g(a.paidStudents.length)+" dari "+g($(d).students.length)+" siswa ",1)])]),t("div",Wa,[e[30]||(e[30]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Rata-rata Pembayaran",-1)),t("div",Ua,[t("div",Ja,g(o(H.value)),1),e[29]||(e[29]=t("div",{class:"text-sm text-gray-500"}," Per siswa yang sudah bayar ",-1)),t("div",Va," Total: "+g(o(a.totalIncome)),1)])]),t("div",qa,[e[31]||(e[31]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Kategori Pengeluaran",-1)),t("div",Za,[(y(!0),v(z,null,Y(B.value,r=>(y(),v("div",{key:r.name,class:"flex justify-between items-center"},[t("span",Qa,g(r.name),1),t("span",Xa,g(o(r.amount)),1)]))),128)),B.value.length===0?(y(),v("div",ts," Belum ada pengeluaran ")):et("",!0)])])]),A(oa,{transactions:x.value,expenses:I.value,students:$(d).students,period:{from:m.value,to:h.value}},null,8,["transactions","expenses","students","period"]),t("div",es,[e[33]||(e[33]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Status Pembayaran Siswa",-1)),t("div",as,[t("div",null,[t("h4",ss,"Sudah Bayar ("+g(a.paidStudents.length)+")",1),t("div",ns,[(y(!0),v(z,null,Y(a.paidStudents,r=>(y(),v("div",{key:r.id,class:"flex items-center justify-between p-3 bg-success-50 rounded-lg"},[t("span",os,g(r.name),1),t("span",ls,g(o(r.totalPaid)),1)]))),128))])]),t("div",null,[t("h4",rs,"Belum Bayar ("+g(a.unpaidStudents.length)+")",1),t("div",is,[(y(!0),v(z,null,Y(a.unpaidStudents,r=>(y(),v("div",{key:r.id,class:"flex items-center justify-between p-3 bg-red-50 rounded-lg"},[t("span",ds,g(r.name),1),e[32]||(e[32]=t("span",{class:"text-xs text-red-600"},"Belum Bayar",-1))]))),128))])])])]),t("div",us,[e[35]||(e[35]=t("h3",{class:"text-lg font-semibold text-gray-900 mb-4"},"Detail Transaksi",-1)),t("div",cs,[t("table",ps,[e[34]||(e[34]=t("thead",{class:"bg-gray-50"},[t("tr",null,[t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Tanggal "),t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Jenis "),t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Keterangan "),t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Pemasukan "),t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Pengeluaran "),t("th",{class:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}," Saldo ")])],-1)),t("tbody",gs,[(y(!0),v(z,null,Y(a.detailedTransactions,(r,_)=>(y(),v("tr",{key:_},[t("td",ms,g(n(r.date)),1),t("td",hs,g(r.type==="income"?"Pemasukan":"Pengeluaran"),1),t("td",ys,g(r.description),1),t("td",xs,g(r.type==="income"?o(r.amount):"-"),1),t("td",bs,g(r.type==="expense"?o(r.amount):"-"),1),t("td",vs,g(o(r.balance)),1)]))),128))])])])])]))}};export{Ts as default};
