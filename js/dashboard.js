// Dados ilustrativos dos prints. Estado compartilhado entre as abas, apenas em memória.
window.AstraData = {
  subjects: [
    {name:'Banco de Dados',teacher:'Prof. Marcelo Rodrigues',total:8,pending:3,due:'29/08',progress:65},
    {name:'PWEBD',teacher:'Prof.ª Helena Costa',total:6,pending:2,due:'28/08',progress:40},
    {name:'Estrutura de Dados',teacher:'Prof. Carlos Mendes',total:10,pending:1,due:'27/08',progress:80},
    {name:'Sistemas Operacionais',teacher:'Prof. Renato Figueiredo',total:5,pending:2,due:'05/09',progress:55},
    {name:'Cálculo II',teacher:'Prof.ª Fernanda Lopes',total:7,pending:1,due:'10/09',progress:72},
    {name:'Estatística',teacher:'Prof. João Alves',total:4,pending:2,due:'31/08',progress:30},
    {name:'Projeto Integrador',teacher:'Equipe docente',total:3,pending:1,due:'10/09',progress:20}
  ],
  tasks: [
    {id:1,title:'Estudar para prova de Banco de Dados',subject:'Banco de Dados',type:'Prova',due:'2026-08-29',minutes:90,priority:'Urgente',status:'Pendente',description:'Revisar joins complexos e normalização'},
    {id:2,title:'Lista de Exercícios — Estrutura de Dados',subject:'Estrutura de Dados',type:'Lista',due:'2026-08-27',minutes:45,priority:'Urgente',status:'Pendente',description:'Exercícios de árvores AVL e heaps'},
    {id:3,title:'Trabalho final de PWEBD',subject:'PWEBD',type:'Trabalho',due:'2026-08-28',minutes:180,priority:'Alta',status:'Pendente',description:'Finalizar integração com o banco de dados'},
    {id:4,title:'Relatório de Lab de Redes',subject:'Lab de Redes',type:'Relatório',due:'2026-08-30',minutes:60,priority:'Média',status:'Pendente',description:'Organizar resultados do laboratório'},
    {id:5,title:'Quiz de Estatística',subject:'Estatística',type:'Quiz',due:'2026-08-31',minutes:30,priority:'Média',status:'Pendente',description:'Revisar probabilidade'},
    {id:6,title:'Leitura de Artigo — IA',subject:'Inteligência Artificial',type:'Leitura',due:'2026-09-02',minutes:40,priority:'Baixa',status:'Pendente',description:'Ler o artigo e destacar os conceitos principais'},
    {id:7,title:'Apresentação de Seminário de SO',subject:'Sistemas Operacionais',type:'Seminário',due:'2026-09-05',minutes:120,priority:'Média',status:'Pendente',description:'Preparar slides e ensaiar a apresentação'},
    {id:8,title:'Trabalho em Grupo — PI',subject:'Projeto Integrador',type:'Trabalho em grupo',due:'2026-09-10',minutes:300,priority:'Alta',status:'Pendente',description:'Alinhar as entregas com a equipe'},
    {id:9,title:'Exercício de Cálculo II',subject:'Cálculo II',type:'Exercício',due:'2026-08-22',minutes:60,priority:'Urgente',status:'Atrasada',description:'Resolver a lista de integrais'},
    {id:10,title:'Revisão de Algoritmos',subject:'Algoritmos',type:'Estudo',due:'2026-08-20',minutes:60,priority:'Média',status:'Concluída',description:'Revisar complexidade'},
    {id:11,title:'Exercícios de Banco de Dados',subject:'Banco de Dados',type:'Exercício',due:'2026-08-21',minutes:45,priority:'Média',status:'Concluída',description:'Praticar consultas SQL'}
  ],
  courses: [
    {title:'CS50: Introduction to Computer Science',provider:'Harvard · edX',category:'Programação',level:'Iniciante',free:true,tags:['C','Python','Algoritmos'],description:'O curso de ciência da computação mais famoso do mundo. Gratuito, rigoroso e transformador.',rating:'4.9',duration:'12 semanas',students:'4.2M',url:'https://cs50.harvard.edu/x/'},
    {title:'Estruturas de Dados e Algoritmos',provider:'Coursera · UC San Diego',category:'Programação',level:'Intermediário',tags:['Algoritmos','Complexidade','Python'],description:'Domínio profundo de estruturas de dados essenciais com implementações práticas.',rating:'4.7',duration:'6 semanas',students:'890k',url:'https://www.coursera.org/specializations/data-structures-algorithms'},
    {title:'Machine Learning Specialization',provider:'Coursera · Stanford',category:'Dados & IA',level:'Intermediário',tags:['ML','Python','TensorFlow'],description:'Andrew Ng ensina os fundamentos do aprendizado de máquina de forma didática e rigorosa.',rating:'4.9',duration:'3 meses',students:'1.3M',url:'https://www.coursera.org/specializations/machine-learning-introduction'},
    {title:'SQL para Análise de Dados',provider:'Mode Analytics · Gratuito',category:'Dados & IA',level:'Iniciante',free:true,tags:['SQL','Dados','Análise'],description:'Aprenda SQL do zero com exercícios práticos em datasets reais. Perfeito para BD.',rating:'4.8',duration:'4 semanas',students:'350k',url:'https://mode.com/sql-tutorial/'},
    {title:'Python para Todos',provider:'Coursera · Univ. de Michigan',category:'Programação',level:'Iniciante',tags:['Python','Programação'],description:'Fundamentos de Python com projetos reais. Um dos cursos mais acessíveis e completos.',rating:'4.8',duration:'8 semanas',students:'2M',url:'https://www.coursera.org/specializations/python'},
    {title:'Redes de Computadores',provider:'Coursera · Univ. do Colorado',category:'Programação',level:'Intermediário',tags:['Redes','TCP/IP'],description:'Explore os protocolos e os fundamentos da comunicação entre computadores.',rating:'4.7',duration:'6 semanas',students:'220k',url:'https://www.coursera.org/specializations/computer-communications'},
    {title:'Google UX Design',provider:'Coursera · Google',category:'Design',level:'Iniciante',tags:['UX','Figma','Design'],description:'Conheça o processo de design e crie experiências centradas nas pessoas.',rating:'4.8',duration:'6 meses',students:'980k',url:'https://www.coursera.org/professional-certificates/google-ux-design'},
    {title:'Wireframes e Protótipos',provider:'Coursera · Google',category:'Design',level:'Iniciante',tags:['Figma','Protótipos'],description:'Transforme ideias em wireframes e protótipos de baixa fidelidade.',rating:'4.8',duration:'4 semanas',students:'180k',url:'https://www.coursera.org/learn/wireframes-low-fidelity-prototypes'},
    {title:'Aprendendo a Aprender',provider:'Coursera · Deep Teaching Solutions',category:'Habilidades',level:'Iniciante',tags:['Estudo','Aprendizagem'],description:'Desenvolva técnicas para aprender melhor e organizar seus estudos.',rating:'4.8',duration:'4 semanas',students:'3M',url:'https://www.coursera.org/learn/learning-how-to-learn'}
  ]
};