const fs = require('node:fs');
const url = 'https://science.nasa.gov/moon/facts/';
const definitions = [
 ['cover-centered','月球保存了太陽系的歷史','從地月尺度、形成過程到水的證據','岩石與冰共同留下歷史線索。','Moon Facts / Introduction',[
  ['地月關係','尺度','月球是地球唯一的天然衛星並持續繞行地球。','先看位置'],
  ['地質紀錄','撞擊','撞擊坑與冷卻熔岩保存了太陽系早期的線索。','再讀地表'],
  ['水的證據','極區','極區陰影與日照區的水證據改變乾燥的印象。','辨識證據']]],
 ['matrix-table-split','平均地月距離遠大於月球本身','半徑與距離分開比較，避免尺度混淆','地月間約可容納三十個地球。','Size and Distance',[
  ['月球半徑','1,740 km','月球的寬度小於地球三分之一，可依半徑比較。','大小'],
  ['平均距離','384,400 km','地月平均相距約三十八萬四千四百公里。','遠近'],
  ['持續遠離','每年約1吋','月球每年遠離地球約一英吋，軌道並非固定不變。','變化']]],
 ['three-col-defense','同一面朝向地球，不代表背面永遠黑暗','同步自轉與月相是兩件不同的事','月相反映日照方向與觀測位置。','Orbit and Rotation',[
  ['同步自轉','約27天','月球自轉與繞地球公轉速率相同，因此同面朝向地球。','同面可見'],
  ['月相週期','約29天','地球也繞太陽運動，使我們看到的月相週期較長。','分清週期'],
  ['背面日照','也有白晝','月球背面同樣會受到太陽照射，不能稱為永暗的一面。','避免誤稱']]],
 ['horizontal-timeline','撞擊後的碎屑逐步形成月球外殼','形成機制仍是科學推論，保留來源的不確定語氣','巨撞擊是月球形成的可能解釋。','Formation',[
  ['巨大撞擊','數十億年前','一個火星大小天體可能撞上地球，留下大量碎屑。','保留可能'],
  ['碎屑聚合','形成月球','地球與撞擊天體的碎屑聚集，初生月球處於熔融狀態。','辨識來源'],
  ['岩漿結晶','約一億年內','全球岩漿海大多結晶，低密度岩石上浮形成月殼。','形成外殼']]],
 ['matrix-table-split','亮暗地形記錄不同的月球地質歷程','高地、月海與撞擊坑提供互補證據','地形反映成分與年代差異。','Surface',[
  ['明亮高地','古老月殼','月球亮區稱為高地，岩石成分與暗色月海有所不同。','對照地形'],
  ['暗色月海','熔岩充填','撞擊盆地曾在四十二億至十二億年前被熔岩填滿。','非海水'],
  ['撞擊紀錄','保存數十億年','長期留存的撞擊坑記錄月球與內太陽系天體的撞擊史。','閱讀歷史']]],
 ['horizontal-timeline','水的發現讓月球不再只是乾燥世界','區分早期推定、極區證據與日照區分子水','探測補足了水分布的認識。','Water on the Moon',[
  ['早期判讀','初期探月','早期研究阿波羅與月球號帶回的樣本，認為月面乾燥。','樣本有限'],
  ['極區證據','2008年','月船一號偵測月面羥基分子，且在兩極更為集中。','區分羥基'],
  ['日照區水','2020年','空中天文台確認日照下的克拉維斯坑存在水分子。','並非僅極區']]],
 ['three-col-defense','月面缺乏地球式的環境保護','水的存在不等於已發現生命或適居環境','探月須防範稀薄大氣與溫差','Atmosphere; Surface; Potential for Life',[
  ['稀薄外氣','無法呼吸','月球外氣層極為稀薄，不能防護太陽輻射與流星體撞擊。','需要防護'],
  ['劇烈溫差','127至−173°C','月面日照區與黑暗區溫差劇烈，須辨別量測條件。','溫差'],
  ['生命證據','尚未發現','至今探月任務未發現月球有自身生命存在的證據。','慎推定']]]
];
const deck = {id:'moon-md-trial',shortLabel:'月球事實',label:'月球事實・MD獨立試作（7頁）',title:'月球保存了太陽系的歷史',preferredStyle:'academic-thesis',sources:[{url,title:'NASA Moon Facts',accessed:'2026-11-17',sections:['Size and Distance','Orbit and Rotation','Formation','Surface','Water on the Moon','Atmosphere','Potential for Life'],excerpt:'The Moon is Earth’s only natural satellite.',paraphrase:'以繁體中文重述尺度、同步自轉、形成假說、地形、水與環境；沒有逐段全文翻譯。'}],workflow:{planning:'先讀AGENTS第1、3、5、6、7節與DESIGN_CATALOG，再讀NASA原始網頁；獨立規劃7頁：開場→尺度→運動→形成→地表→水→環境。',layoutDecision:'兩頁數值／分類資料採矩陣，兩頁演變採時間軸，兩頁並列概念採三欄；封面居中。不同單位不用比例條。',generation:'每頁3點，標題2–6字，說明18–25字，正文80–120字；不使用無關圖片。',validation:'語法、專案契約、自訂主題四風格渲染與瀏覽器截圖；PowerPoint另交主代理獨立驗收。'},pages:definitions.map(([mode,title,sub,summary,section,pts],i)=>({mode,kicker:i===0?'NASA · MOON FACTS':`${String(i).padStart(2,'0')} · 月球事實`,title,sub,summary,points:pts.map(([title,stat,desc,action],j)=>({num:String(j+1).padStart(2,'0'),title,stat,desc,action})),image:null,notes:`來源：${url}；段落：${section}。中文為AI依原始資料整理；數值沿用來源近似值。`}))};
for(const [i,p] of deck.pages.entries()){
 for(const point of p.points) if(point.desc.length<18 || point.desc.length>25) console.log('DESC',i,point.title,point.desc.length);
 const n=p.summary.length+p.points.reduce((n,x)=>n+(x.title+x.stat+x.desc+x.action).length,0);console.log('BODY',i,n);
}
fs.writeFileSync('examples/moon-md-trial.json',JSON.stringify(deck,null,2)+'\n');
