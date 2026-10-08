// Abas compartilham o mesmo estado em memória: recarregar restaura o exemplo.
const data = window.AstraData;
const main = document.querySelector('#dashboard-main');
const homeTemplate = main.innerHTML;
const headerTitle = document.querySelector('.dashboard-header h1');
const headerSubtitle = document.querySelector('.dashboard-header p');
const sidebar = document.querySelector('#sidebar');
const menu = document.querySelector('.sidebar-toggle');
const names = {inicio:'Boa tarde, Anna!',disciplinas:'Disciplinas',atividades:'Minhas atividades',caminho:'Meu caminho',calendario:'Calendário',progresso:'Progresso',cursos:'Cursos online',configuracoes:'Configurações','nova-atividade':'Nova atividade'};
const subtitles = {inicio:'Vamos descobrir seu próximo passo?',caminho:'Sua jornada acadêmica, passo a passo',calendario:'Seus compromissos acadêmicos',progresso:'Sua evolução acadêmica no semestre',cursos:'Expanda seus conhecimentos além da sala de aula',configuracoes:'Deixe o ASTRA do seu jeito','nova-atividade':'Adicione ao seu caminho acadêmico'};
let view = 'inicio', filter = 'Todas', order = 'urgencia', category = 'Todos', search = '', nextId = 12;
let selectedDate = '2026-10-07', calendarYear = 2026, calendarMonth = 9, skipped = new Set();
let studyId = 1, elapsed = 0, running = false, timer, toastTimer, extraCompleted = 0;
const demoToday = '2026-08-27';
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e = escapeHTML;
const date = iso => new Date(iso + 'T12:00:00');
const dateLabel = iso => date(iso).toLocaleDateString('pt-BR');
const duration = min => min <= 0 ? 'Não estimado' : min >= 60 ? Math.floor(min / 60) + 'h' + (min % 60 || '') : min + 'min';
const priorityRank = {'Urgente':0,'Alta':1,'Média':2,'Baixa':3};
const badge = (text, light=false) => `<span class="task-priority ${light?'urgent-priority':''}">${e(text)}</span>`;
function closeSidebar(){sidebar.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
document.addEventListener('click',event=>{if(!sidebar.contains(event.target)&&!menu.contains(event.target))closeSidebar();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSidebar();});
window.matchMedia('(min-width:641px)').addEventListener('change',event=>{if(event.matches)closeSidebar();});
document.querySelectorAll('dialog .dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
function notify(text){const toast=document.querySelector('#toast');toast.textContent=text;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,4500);}
function navigate(section){location.hash=section; if(view===section)render();closeSidebar();}
function showInfo(title,text){document.querySelector('#info-title').textContent=title;document.querySelector('#info-content').textContent=text;document.querySelector('#info-dialog').showModal();}
document.querySelector('#close-info').addEventListener('click',()=>document.querySelector('#info-dialog').close());
function currentTask(){return data.tasks.find(t=>t.status!=='Concluída'&&!skipped.has(t.id))||data.tasks.find(t=>t.status!=='Concluída');}
function render(){
 view=Object.hasOwn(names,location.hash.slice(1))?location.hash.slice(1):'inicio';
 document.title=names[view]+' — ASTRA';headerTitle.textContent=view==='inicio'?'Boa tarde, '+profile.name.split(' ')[0]+'!':view==='nova-atividade'&&taskDraft.id?'Editar atividade':names[view];
 headerSubtitle.textContent=view==='disciplinas'?data.subjects.length+' disciplinas neste semestre':view==='atividades'?data.tasks.length+' atividades no total':subtitles[view];
 document.querySelectorAll('.sidebar [data-section]').forEach(b=>{b.classList.toggle('selected',b.dataset.section===view);if(b.dataset.section===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 document.querySelector('.date').hidden=view!=='inicio';document.querySelector('.header-star').hidden=view!=='inicio';
 let action=document.querySelector('#header-action');if(!action){action=document.createElement('div');action.id='header-action';document.querySelector('.dashboard-header').append(action);}
 action.innerHTML=view==='disciplinas'?'<button class="button button-light" data-action="add-subject">+ Adicionar disciplina</button>':view==='atividades'?'<button class="button button-light" data-action="add-task">+ Nova atividade</button>':view==='cursos'?'<span class="free-count">2 cursos gratuitos</span>':view==='calendario'?'<span class="calendar-legend">● Prova &nbsp; ● Trabalho &nbsp; ● Seminário &nbsp; ● Exercício</span>':'';
 main.className='dashboard-main section-'+view;document.querySelector('.dashboard-shell').classList.toggle('empty-dashboard',view==='inicio'&&!data.tasks.length);let back=document.querySelector('#activity-back');if(!back){back=document.createElement('button');back.id='activity-back';back.className='activity-back';back.dataset.action='cancel-task';back.textContent='‹ Voltar';document.querySelector('.dashboard-header>div:first-of-type').prepend(back);}back.hidden=view!=='nova-atividade';
 if(view==='inicio')renderHome();
 else if(view==='disciplinas')renderSubjects();
 else if(view==='atividades')renderActivities();
 else if(view==='caminho')renderPath();
 else if(view==='calendario')renderCalendar();
 else if(view==='progresso')renderProgress();
 else if(view==='cursos')renderCourses();else if(view==='configuracoes')renderSettings();else if(view==='nova-atividade')renderTaskPage();
}
function renderHome(){
 if(!data.tasks.length){main.innerHTML=`<section class="first-step"><span class="star" aria-hidden="true">✳</span><h2>Tudo começa com um primeiro passo.</h2><p>Adicione sua primeira atividade e deixe o ASTRA<br> encontrar seu caminho.</p><button class="button button-light" data-action="add-task">Adicionar atividade</button></section>`;return;}
 main.innerHTML=homeTemplate;
 document.querySelector('#new-activity').dataset.action='add-task';
 document.querySelector('#start-activity').dataset.action='start';
 document.querySelector('#completed-count').textContent=(exampleMode?5:0)+extraCompleted;
 document.querySelector('#pending-count').textContent=data.tasks.filter(t=>t.status==='Pendente').length;
 const task=currentTask();
 if(task){document.querySelector('.focus-copy h2').textContent=task.title;document.querySelector('.focus-tags small').textContent=task.subject;document.querySelector('.focus-details').textContent=dateLabel(task.due)+' · Tempo estimado: '+duration(task.minutes);document.querySelector('.focus-tags>span').textContent=task.priority+' prioridade';}
 const list=document.querySelector('#activity-list');
 list.innerHTML=data.tasks.filter(t=>t.status!=='Concluída').slice(1,5).map(t=>`<li><span class="task-dot"></span><div class="task-name"><strong>${e(t.title)}</strong><small>${e(t.subject)}</small></div>${badge(t.priority,t.priority==='Urgente')}<span class="task-date">${e(date(t.due).toLocaleDateString('pt-BR',{day:'numeric',month:'short'}))}</span><span class="task-duration">◴ ${duration(t.minutes)}</span></li>`).join('');
}
function renderSubjects(){main.innerHTML=`<div class="subject-grid">${data.subjects.map((s,i)=>`<button class="panel subject-card" data-action="subject-detail" data-index="${i}"><span class="subject-line"></span><h2>${e(s.name)}</h2><p>${e(s.teacher)}</p><div class="subject-numbers"><div><strong>${s.total}</strong><small>Total</small></div><div><strong>${s.pending}</strong><small>Pendentes</small></div><div><strong>${e(s.due)}</strong><small>Próx. prazo</small></div></div><div class="subject-progress"><span>Progresso</span><b>${s.progress}%</b></div><progress max="100" value="${s.progress}" aria-label="${e(s.name)}: ${s.progress}%">${s.progress}%</progress></button>`).join('')}<button class="add-subject-card" data-action="add-subject"><span>+</span>Adicionar disciplina</button></div>`;}
function matchesFilter(t){return filter==='Todas'||filter==='Hoje'&&t.due===demoToday&&t.status!=='Concluída'||filter==='Próximas'&&t.due>=demoToday&&t.status!=='Concluída'||filter==='Atrasadas'&&t.status==='Atrasada'||filter==='Concluídas'&&t.status==='Concluída';}
function renderActivities(){
 const filters=['Todas','Hoje','Próximas','Atrasadas','Concluídas'];const original=filter;
 const tabs=filters.map(f=>{filter=f;const count=data.tasks.filter(matchesFilter).length;return `<button data-filter="${f}" aria-pressed="${original===f}" class="${original===f?'active':''}">${f} <span>${count}</span></button>`;}).join('');filter=original;
 let tasks=data.tasks.filter(matchesFilter);tasks=[...tasks].sort((a,b)=>order==='prazo'?a.due.localeCompare(b.due):order==='titulo'?a.title.localeCompare(b.title):priorityRank[a.priority]-priorityRank[b.priority]);
 main.innerHTML=`<div class="activity-toolbar"><div class="filter-tabs" aria-label="Filtrar atividades">${tabs}</div><label class="sort-label">Ordenar por <select id="sort-tasks"><option value="urgencia">Mais urgente</option><option value="prazo">Prazo</option><option value="titulo">Título</option></select></label></div><div class="activity-rows">${tasks.map(t=>`<button class="panel activity-row ${t.status==='Concluída'?'completed':''}" data-action="task-detail" data-id="${t.id}"><span class="task-dot ${t.priority==='Urgente'?'urgent-dot':''}"></span><span class="task-name"><strong>${e(t.title)}</strong><small>${e(t.subject)}</small></span><span class="activity-type">${e(t.type)}</span><strong class="activity-date">▣ ${dateLabel(t.due)}</strong><span class="task-duration">◴ ${duration(t.minutes)}</span>${badge(t.priority)}${badge(t.status)}</button>`).join('')||'<div class="empty-state">Nenhuma atividade nesta categoria.</div>'}</div>`;
 document.querySelector('#sort-tasks').value=order;
}
function renderPath(){
 const available=data.tasks.filter(t=>t.status!=='Concluída'&&!skipped.has(t.id));
 main.innerHTML=`<div class="path-intro"><span class="star">✳</span><p>“Você não precisa enxergar todo o caminho.<br>Apenas o próximo passo.”</p></div><ol class="journey">${available.slice(0,6).map((t,i)=>`<li class="journey-step ${i===0?'now':''}"><article class="panel"><div class="journey-meta"><p>${['☆ Agora','Próximo','Depois','Futuramente'][Math.min(i,3)]}</p>${badge(t.priority,i===0)}</div><h2>${e(t.title)}</h2><div class="journey-sub"><span>${e(t.subject)}</span><span>▣ ${dateLabel(t.due)} · ◴ ${duration(t.minutes)}</span></div><p class="journey-description">${e(t.description)}</p>${i===0?`<div class="journey-actions"><button class="button" data-action="start" data-id="${t.id}">Começar agora</button><button class="button button-outline" data-action="skip" data-id="${t.id}">Pular por agora</button></div>`:''}</article></li>`).join('')||'<li class="empty-state">Seu caminho está livre. Adicione uma nova atividade.</li>'}</ol>${skipped.size?'<button class="text-button restore-path" data-action="restore-path">Mostrar atividades puladas</button>':''}`;
}
function calendarEvents(){return [...data.tasks.filter(t=>t.status!=='Concluída'),{id:101,title:'Seminário de SO',type:'Seminário',due:'2026-10-05'},{id:102,title:'Projeto Integrador',type:'Exercício',due:'2026-10-10'},{id:103,title:'Prova de Cálculo II',type:'Prova',due:'2026-10-15'}];}
function renderCalendar(){
 const monthLabel=new Date(calendarYear,calendarMonth,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
 const first=new Date(calendarYear,calendarMonth,1).getDay();const total=new Date(calendarYear,calendarMonth+1,0).getDate();const events=calendarEvents();
 const cells=Array.from({length:first},()=>'<span class="empty-day"></span>');
 for(let d=1;d<=total;d++){const iso=calendarYear+'-'+String(calendarMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');const dayEvents=events.filter(t=>t.due===iso);cells.push(`<button class="calendar-day ${iso===selectedDate?'selected-day':''}" data-date="${iso}" aria-pressed="${iso===selectedDate}" aria-label="${dateLabel(iso)}, ${dayEvents.length} eventos"><span>${d}</span><span class="day-dots">${dayEvents.slice(0,3).map(t=>`<i class="event-dot type-${t.type==='Prova'?'prova':t.type==='Seminário'?'seminario':'trabalho'}"></i>`).join('')}</span></button>`);}
 const selectedEvents=events.filter(t=>t.due===selectedDate);const next=events.filter(t=>t.due>=selectedDate).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5);
 main.innerHTML=`<div class="calendar-layout"><section class="panel month-panel"><div class="month-nav"><button data-action="prev-month" aria-label="Mês anterior">‹</button><h2>${e(monthLabel)}</h2><button data-action="next-month" aria-label="Próximo mês">›</button></div><div class="weekdays">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d=>`<span>${d}</span>`).join('')}</div><div class="month-grid">${cells.join('')}</div></section><aside class="panel calendar-agenda"><h2>${e(date(selectedDate).toLocaleDateString('pt-BR',{day:'numeric',month:'long'}))}</h2><p>${selectedEvents.length?selectedEvents.length+' evento(s)':'Nenhum evento'}</p><div class="day-agenda">${selectedEvents.length?selectedEvents.map(t=>`<button class="agenda-event" data-action="calendar-detail" data-id="${t.id}"><strong>${e(t.title)}</strong><small>${e(t.type)}</small></button>`).join(''):'<span class="free-day-icon">▦</span><span>Dia livre</span>'}</div><div class="next-events"><h3>Próximos eventos</h3>${next.map(t=>`<button class="agenda-event" data-action="calendar-detail" data-id="${t.id}"><span class="event-dot"></span><span><strong>${e(t.title)}</strong><small>${e(date(t.due).toLocaleDateString('pt-BR',{day:'numeric',month:'short'}))}</small></span></button>`).join('')||'<p>Nenhum evento próximo.</p>'}</div></aside></div>`;
}
function renderProgress(){
 const completed=(exampleMode?24:0)+extraCompleted,pending=(exampleMode?1:0)+data.tasks.filter(t=>t.status==='Pendente').length,late=data.tasks.filter(t=>t.status==='Atrasada').length,total=completed+pending+late,percent=total?Math.round(completed/total*100):0;
 const values=exampleMode?[3,2,4,1,3,2,0]:[0,0,extraCompleted,0,0,0,0];
 main.innerHTML=`<section class="progress-banner"><div><h2>Você já concluiu ${percent}% das suas atividades.</h2><p>Continue assim, Anna — você está no caminho certo.</p></div><div><strong>${percent}%</strong><small>concluído</small></div></section><section class="metric-grid progress-metrics"><article class="panel metric"><h2>Concluídas</h2><strong>${completed}</strong></article><article class="panel metric"><h2>Pendentes</h2><strong>${pending}</strong></article><article class="panel metric"><h2>Atrasadas</h2><strong>${data.tasks.filter(t=>t.status==='Atrasada').length}</strong></article></section><div class="progress-columns"><section class="panel weekly-panel"><h2>Evolução semanal</h2><div class="weekly-chart" aria-label="Evolução das atividades concluídas por dia da semana">${values.map((v,i)=>`<div><span class="bar ${i===2?'highlight':''}" style="height:${Math.max(3,v*22)}px" title="${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}: ${Math.round(v)} atividades"></span><small>${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][i]}</small></div>`).join('')}</div><div class="weekly-total"><span>Total esta semana</span><strong>${(exampleMode?15:0)+extraCompleted} atividades</strong></div></section><section class="panel progress-by-subject"><h2>Por disciplina</h2>${data.subjects.slice(0,6).map(s=>`<div class="discipline"><div><strong>${e(s.name)}</strong><b>${s.total-s.pending}/${s.total}</b></div><progress max="${s.total||1}" value="${s.total-s.pending}" aria-label="${e(s.name)}: ${s.total-s.pending} de ${s.total}"></progress></div>`).join('')}</section></div>`;
}
function renderCourses(){const featured=data.courses[0];main.innerHTML=`<section class="course-feature panel"><div><p class="eyebrow">Destaque da semana</p><h2>${e(featured.title)}</h2><p>Harvard · 4.9★ · Gratuito · 4.2 milhões de estudantes</p><div class="course-tags">${featured.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div></div><a href="${featured.url}" target="_blank" rel="noopener noreferrer" class="button button-light">Acessar curso</a></section><div class="course-toolbar"><label class="course-search"><span aria-hidden="true">⌕</span><input type="search" id="course-search" placeholder="Buscar por título, tecnologia..." aria-label="Buscar cursos" value="${e(search)}"></label><div class="filter-tabs course-filters">${['Todos','Programação','Dados & IA','Design','Habilidades'].map(c=>`<button data-category="${e(c)}" aria-pressed="${category===c}" class="${category===c?'active':''}">${e(c)}</button>`).join('')}</div></div><p class="course-count" id="course-count" aria-live="polite"></p><div class="course-grid" id="course-grid"></div><p class="dashboard-demo">Avaliações, duração e número de estudantes são exemplos do layout.</p>`;updateCourses();}
function updateCourses(){const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const courses=data.courses.filter(c=>(category==='Todos'||c.category===category)&&normalize([c.title,c.provider,...c.tags].join(' ')).includes(normalize(search)));document.querySelector('#course-count').textContent=courses.length+' cursos encontrados';document.querySelector('#course-grid').innerHTML=courses.map(c=>`<article class="panel course-card"><div class="course-badges">${badge(c.level)}${c.free?badge('Gratuito',true):''}</div><h2>${e(c.title)}</h2><p class="course-provider">${e(c.provider)}</p><p class="course-description">${e(c.description)}</p><div class="course-tags">${c.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div><div class="course-meta"><strong>${c.rating} <span>★★★★★</span></strong><small>◴ ${c.duration}</small><small>♙ ${c.students}</small></div><a href="${c.url}" target="_blank" rel="noopener noreferrer" class="quick-button">Ver curso</a></article>`).join('')||'<p class="empty-state">Nenhum curso encontrado. Tente outra busca.</p>';}
function subjectDetail(index){const s=data.subjects[index];document.querySelector('#detail-title').textContent=s.name;const tasks=data.tasks.filter(t=>t.subject===s.name);document.querySelector('#detail-content').innerHTML=`<p>${e(s.teacher)}</p><p>Progresso: ${s.progress}%</p><ul class="info-list">${tasks.map(t=>`<li>${e(t.title)} · ${e(t.status)}</li>`).join('')||'<li>Nenhuma atividade cadastrada nesta demonstração.</li>'}</ul><button class="button" data-action="add-task" data-subject="${e(s.name)}">Adicionar atividade</button>`;document.querySelector('#detail-dialog').showModal();}
function taskDetail(id){const t=data.tasks.find(t=>t.id===id);if(!t)return;document.querySelector('#detail-title').textContent=t.title;document.querySelector('#detail-content').innerHTML=`<p>${e(t.subject)} · ${e(t.type)}</p><p>${dateLabel(t.due)} · ${duration(t.minutes)} · ${e(t.priority)}</p><p>${e(t.description)}</p><div class="detail-actions"><button class="button" data-action="toggle-task" data-id="${id}">${t.status==='Concluída'?'Reabrir atividade':'Marcar como concluída'}</button><button class="button button-outline" data-action="edit-task" data-id="${id}">Editar</button></div>`;document.querySelector('#detail-dialog').showModal();}
function openTask(id,subject){
 document.querySelector('#detail-dialog').close();
 returnView=view==='nova-atividade'?returnView:view;
 taskDraft=id?{...data.tasks.find(t=>t.id===id)}:{id:null,title:'',subject:subject||'',type:'',due:'',minutes:0,priority:'Média',description:''};
 navigate('nova-atividade');
}
function updateClock(){document.querySelector('#study-time').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');}
function stopClock(){running=false;clearInterval(timer);document.querySelector('#pause-study').textContent='Continuar';}
function startClock(){running=true;document.querySelector('#pause-study').textContent='Pausar';timer=setInterval(()=>{elapsed++;updateClock();},1000);}
function startStudy(id){const t=data.tasks.find(t=>t.id===(id||currentTask()?.id));if(!t){notify('Todas as atividades foram concluídas.');return;}if(studyId!==t.id){elapsed=0;updateClock();}studyId=t.id;document.querySelector('#study-title').textContent=t.title;document.querySelector('#study-dialog>p:not(.eyebrow)').textContent=t.subject+' · '+duration(t.minutes);document.querySelector('#study-dialog').showModal();if(!running)startClock();}
function toggleTask(id){const t=data.tasks.find(t=>t.id===id);const wasCompleted=t.status==='Concluída';t.status=wasCompleted?'Pendente':'Concluída';extraCompleted+=wasCompleted?-1:1;const subject=data.subjects.find(s=>s.name===t.subject);if(subject){subject.pending=Math.max(0,Math.min(subject.total,subject.pending+(wasCompleted?1:-1)));subject.progress=Math.round((subject.total-subject.pending)/Math.max(1,subject.total)*100);}document.querySelector('#detail-dialog').close();render();notify(wasCompleted?'Atividade reaberta.':'Atividade concluída. Bom trabalho!');}
document.addEventListener('click',event=>{
 const section=event.target.closest('[data-section]');if(section){event.preventDefault();navigate(section.dataset.section);return;}
 const f=event.target.closest('[data-filter]');if(f){filter=f.dataset.filter;renderActivities();return;}
 const c=event.target.closest('[data-category]');if(c){category=c.dataset.category;renderCourses();return;}
 const day=event.target.closest('[data-date]');if(day){selectedDate=day.dataset.date;renderCalendar();return;}
 const button=event.target.closest('[data-action]');if(!button)return;const id=Number(button.dataset.id);
 switch(button.dataset.action){
 case 'cancel-task':taskDraft={};navigate(returnView);break;
 case 'clear-data':exampleMode=false;data.tasks.length=0;data.subjects.forEach(s=>{s.total=0;s.pending=0;s.progress=0;s.due='—';});extraCompleted=0;skipped.clear();stopClock();elapsed=0;updateClock();navigate('inicio');notify('Painel pronto para sua primeira atividade.');break;
 case 'restore-data':exampleMode=true;data.tasks=structuredClone(exampleData.tasks);data.subjects=structuredClone(exampleData.subjects);extraCompleted=0;skipped.clear();render();notify('Dados de exemplo restaurados.');break;
 case 'add-task':openTask(null,button.dataset.subject);break;
 case 'add-subject':document.querySelector('#subject-form').reset();document.querySelector('#subject-dialog').showModal();break;
 case 'subject-detail':subjectDetail(Number(button.dataset.index));break;
 case 'task-detail':taskDetail(id);break;
 case 'edit-task':openTask(id);break;
 case 'toggle-task':toggleTask(id);break;
 case 'start':startStudy(id);break;
 case 'skip':skipped.add(id);renderPath();break;
 case 'restore-path':skipped.clear();renderPath();break;
 case 'prev-month':case 'next-month':{const next=new Date(calendarYear,calendarMonth+(button.dataset.action==='prev-month'?-1:1),1);calendarYear=next.getFullYear();calendarMonth=next.getMonth();renderCalendar();break;}
 case 'calendar-detail':{const t=data.tasks.find(t=>t.id===id);if(t)taskDetail(id);else{const event=calendarEvents().find(t=>t.id===id);showInfo(event.title,dateLabel(event.due));}break;}
 }
});
document.addEventListener('change',event=>{if(event.target.name==='priority'){taskDraft.priority=event.target.value;document.querySelector('#priority-help').textContent=priorityHints[event.target.value];}if(event.target.id==='sort-tasks'){order=event.target.value;renderActivities();}});
document.addEventListener('input',event=>{if(event.target.id==='course-search'){search=event.target.value;updateCourses();}});
document.querySelector('#subject-form').addEventListener('submit',event=>{event.preventDefault();const name=document.querySelector('#subject-name').value.trim(),teacher=document.querySelector('#subject-teacher').value.trim();if(!name||!teacher)return;if(data.subjects.some(s=>s.name.toLowerCase()===name.toLowerCase())){notify('Esta disciplina já está cadastrada.');return;}data.subjects.push({name,teacher,total:0,pending:0,due:'—',progress:0});document.querySelector('#subject-dialog').close();render();notify('Disciplina adicionada.');});
document.querySelector('#pause-study').addEventListener('click',()=>running?stopClock():startClock());
document.querySelector('#study-dialog').addEventListener('close',stopClock);
document.querySelector('#complete-study').addEventListener('click',()=>{document.querySelector('#study-dialog').close();const t=data.tasks.find(t=>t.id===studyId);if(t&&t.status!=='Concluída')toggleTask(studyId);elapsed=0;updateClock();});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
const exampleData=structuredClone({tasks:data.tasks,subjects:data.subjects});
const profile={name:'Anna Silva',course:'Eng. de Software'};
let taskDraft={},returnView='atividades',exampleMode=true;
const priorityHints={'Urgente':'Precisa da sua atenção agora.','Alta':'Reserve um tempo o quanto antes.','Média':'Pode ser feito nos próximos dias.','Baixa':'Pode ser organizado com mais tranquilidade.'};
function renderTaskPage(){
 const subjects=[...new Set([...data.subjects.map(s=>s.name),...data.tasks.map(t=>t.subject)])];
 const types=['Prova','Lista','Trabalho','Relatório','Quiz','Leitura','Seminário','Exercício','Estudo','Trabalho em grupo'];
 main.innerHTML=`<form id="activity-page-form" class="activity-page-form"><label for="activity-title">Nome da atividade *</label><input id="activity-title" name="title" required maxlength="100" placeholder="Ex: Estudar para prova de Banco de Dados" value="${e(taskDraft.title||'')}"><div class="form-two-columns"><div><label for="activity-subject">Disciplina *</label><select id="activity-subject" name="subject" required><option value="">Selecionar...</option>${subjects.map(subject=>`<option ${taskDraft.subject===subject?'selected':''}>${e(subject)}</option>`).join('')}</select></div><div><label for="activity-type">Tipo *</label><select id="activity-type" name="type" required><option value="">Selecionar...</option>${types.map(type=>`<option ${taskDraft.type===type?'selected':''}>${type}</option>`).join('')}</select></div><div><label for="activity-due">Data de entrega *</label><input type="date" id="activity-due" name="due" required value="${e(taskDraft.due||'')}"></div><div><label for="activity-time">Tempo estimado</label><input id="activity-time" name="time" placeholder="Ex: 1h30, 45min, 2h" value="${taskDraft.minutes?duration(taskDraft.minutes):''}" aria-describedby="activity-error"></div></div><fieldset class="priority-field"><legend>Prioridade</legend><div class="priority-options">${['Urgente','Alta','Média','Baixa'].map((priority,i)=>`<label class="priority-choice"><input type="radio" name="priority" value="${priority}" ${(taskDraft.priority||'Média')===priority?'checked':''}><span><i class="priority-dot priority-${i}"></i><b>${priority}</b></span></label>`).join('')}</div><p id="priority-help">${priorityHints[taskDraft.priority||'Média']}</p></fieldset><label for="activity-description">Descrição</label><textarea id="activity-description" name="description" rows="4" maxlength="2000" placeholder="Anotações, links, detalhes sobre a atividade...">${e(taskDraft.description||'')}</textarea><p id="activity-error" role="alert" hidden></p><div class="activity-form-actions"><button class="button button-outline" type="button" data-action="cancel-task">Cancelar</button><button class="button button-light" type="submit">${taskDraft.id?'Salvar alterações':'Adicionar atividade'}</button></div></form>`;
}
function parseMinutes(value){
 const text=value.trim().toLowerCase().replace(/\s/g,'');if(!text)return 0;
 if(/^\d+(min|m)?$/.test(text))return Number(text.replace(/min|m/g,''));
 const match=text.match(/^(\d+)h(?:(\d{1,2})(?:min|m)?)?$/);if(match&&Number(match[2]||0)<60)return Number(match[1])*60+Number(match[2]||0);
 return NaN;
}
function renderSettings(){main.innerHTML=`<div class="settings-layout"><section class="panel settings-panel"><h2>Perfil acadêmico</h2><p>Personalize como você aparece no ASTRA.</p><form id="profile-form"><label for="profile-name">Nome</label><input id="profile-name" name="name" required maxlength="70" value="${e(profile.name)}"><label for="profile-course">Curso</label><input id="profile-course" name="course" required maxlength="70" value="${e(profile.course)}"><button type="submit" class="button button-light">Salvar alterações</button></form></section><section class="panel settings-panel"><h2>Seu painel</h2><p>Comece com uma lista vazia ou explore o ASTRA com os dados de exemplo.</p><div class="settings-actions"><button class="quick-button primary" data-action="clear-data">Começar do zero</button><button class="quick-button" data-action="restore-data">Restaurar dados de exemplo</button></div><p class="settings-note">Você pode restaurar os exemplos a qualquer momento. As alterações desta versão ficam disponíveis enquanto a página estiver aberta.</p></section></div>`;}
function syncSubject(name){const subject=data.subjects.find(s=>s.name===name);if(subject){subject.progress=Math.round((subject.total-subject.pending)/Math.max(1,subject.total)*100);const next=data.tasks.filter(t=>t.subject===name&&t.status!=='Concluída').sort((a,b)=>a.due.localeCompare(b.due))[0];subject.due=next?date(next.due).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):'—';}}
document.addEventListener('submit',event=>{
 if(event.target.id==='profile-form'){event.preventDefault();const name=document.querySelector('#profile-name').value.trim(),course=document.querySelector('#profile-course').value.trim();if(!name||!course)return;profile.name=name;profile.course=course;document.querySelector('.profile strong').textContent=name;document.querySelector('.profile small').textContent=course;document.querySelector('.avatar').textContent=name[0].toUpperCase();render();notify('Perfil atualizado.');return;}
 if(event.target.id!=='activity-page-form')return;
 event.preventDefault();const form=event.target;if(!form.reportValidity())return;
 const title=document.querySelector('#activity-title').value.trim();if(!title){document.querySelector('#activity-title').setCustomValidity('Digite o nome da atividade.');document.querySelector('#activity-title').reportValidity();return;}
 const minutes=parseMinutes(document.querySelector('#activity-time').value);const error=document.querySelector('#activity-error');if(!Number.isFinite(minutes)||minutes<0||minutes>1440){error.hidden=false;error.textContent='Informe um tempo como 1h30, 45min ou 2h (até 24 horas).';document.querySelector('#activity-time').focus();return;}
 const subject=document.querySelector('#activity-subject').value,fields={title,subject,type:document.querySelector('#activity-type').value,due:document.querySelector('#activity-due').value,minutes,priority:form.querySelector('input[name="priority"]:checked').value,description:document.querySelector('#activity-description').value.trim()};
 const editing=Boolean(taskDraft.id);
 if(editing){const task=data.tasks.find(t=>t.id===taskDraft.id);const oldSubject=task.subject;Object.assign(task,fields);if(oldSubject!==subject){const old=data.subjects.find(s=>s.name===oldSubject),next=data.subjects.find(s=>s.name===subject);if(old){old.total=Math.max(0,old.total-1);if(task.status!=='Concluída')old.pending=Math.max(0,old.pending-1);}if(next){next.total++;if(task.status!=='Concluída')next.pending++;}syncSubject(oldSubject);}}
 else{data.tasks.push({id:nextId++,...fields,status:'Pendente'});const s=data.subjects.find(s=>s.name===subject);if(s){s.total++;s.pending++;}}
 syncSubject(subject);taskDraft={};filter='Todas';navigate('atividades');notify(editing?'Atividade atualizada.':'Atividade adicionada ao seu caminho.');
});
document.addEventListener('input',event=>{if(event.target.id==='activity-title')event.target.setCustomValidity('');if(event.target.id==='activity-time')document.querySelector('#activity-error').hidden=true;});

render();