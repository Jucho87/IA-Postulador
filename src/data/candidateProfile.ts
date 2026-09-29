import { CandidateProfile, FormAnswerTemplate } from '../types';

export const CANDIDATE_PROFILE: CandidateProfile = {
  nombre: 'Juan Carlos Soza Calderon',
  titular:
    'Director de Fábrica de Desarrollo de Software | Especialista en Project Turnaround y Gestión de Datos',
  ubicacion: 'Bogotá, Distrito Capital, Colombia',
  telefono: '+573108102533',
  email: 'monjsoza@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/juan-carlos-soza-calderon-b0ba9725',
  resumenProfesional:
    'Líder senior en tecnología con más de 15 años de trayectoria dirigiendo operaciones tecnológicas complejas, transformando datos en activos estratégicos y rescatando iniciativas tecnológicas en riesgo ("Project Turnaround"). Mi carrera se caracteriza por integrar la maestría técnica en arquitecturas de infraestructura y datos con una sólida capacidad ejecutiva para liderar fábricas de software y proyectos de misión crítica. Experto en alinear equipos multidisciplinarios, estabilizar operaciones en entornos de alta incertidumbre y garantizar que los proyectos superen los desafíos técnicos y presupuestarios para cumplir con los objetivos de negocio globales.',
  rolesObjetivo: [
    'Director de Fábrica de Desarrollo de Software',
    'Especialista en Project Turnaround',
    'Director de Proyectos / Project Manager (PMI, Scrum, PRINCE2)',
    'Gerente de Gestión de Proyectos',
    'Director de Sistemas de Datos',
    'Gerente de Datos y Gobernanza',
    'Coordinador de Desarrollo de Proyectos',
    'Senior Data Engineer / Especialista de Base de Datos',
  ],
  keywordsPrincipales: [
    'Director de proyectos',
    'Project Turnaround',
    'Data Engineer',
    'Gerente de datos',
    'Database',
    'Gestión de proyectos',
    'Cloud',
  ],
  keywordsAmpliadas: [
    'Director de fábrica de software',
    'Scrum Master',
    'PostgreSQL avanzado',
    'Oracle PL/SQL',
    'ETL Spark',
    'Gobernanza de datos',
    'Coordinador de proyectos',
    'Arquitectura de software',
  ],
  aptitudesPrincipales: {
    gestionYProyectos: [
      'Dirección de Proyectos TI',
      'Metodologías: Scrum, PMI, PRINCE2',
      'Gestión de Stakeholders y Riesgos',
      'Project Turnaround',
    ],
    gerenciaDatosYBases: [
      'Estrategia y Gobernanza de Datos',
      'Oracle PL/SQL, PostgreSQL, SQL Server',
      'ETL/ELT, Big Data (Spark)',
      'Cumplimiento Normativo (GDPR/HIPAA)',
    ],
    infraDevOps: [
      'Arquitectura Cloud (AWS, GCP, Azure)',
      'DevOps y Despliegues Activos',
      'Linux y Windows Server',
      'Active Directory (Microsoft Entra)',
    ],
  },
  habilidades: {
    cloud: ['AWS (Aurora, S3)', 'Azure (Data Lake)', 'Google Cloud (BigQuery, GCP)'],
    basesDeDatos: [
      'PostgreSQL',
      'Oracle PL/SQL',
      'SQL Server',
      'MySQL',
      'MongoDB',
      'Snowflake',
    ],
    etlYDatos: [
      'Apache Spark',
      'Apache NiFi',
      'ETL / ELT',
      'Python',
      'Big Data Pipelines',
      'Airflow',
    ],
    gestionYSeguridad: [
      'Jira, Trello, Asana, MS Project',
      'OneTrust',
      'FireEye',
      'Splunk',
      'GDPR & HIPAA',
      'Active Directory (Microsoft Entra)',
    ],
    metodologias: ['Scrum (SMPC®)', 'PMI', 'PRINCE2', 'Project Turnaround', 'Híbridas'],
  },
  experiencia: [
    {
      empresa: 'Q-Vision Technologies',
      cargo: 'Coordinador de Desarrollo de Proyectos',
      periodo: 'Abr 2025 - May 2026',
      destacados: [
        'Dirección de Iniciativas: Dirigí la ejecución de múltiples iniciativas tecnológicas simultáneas, garantizando la entrega de proyectos en los plazos y presupuestos establecidos mediante el uso de metodologías ágiles y tradicionales (Scrum, PMI, PRINCE2).',
        'Liderazgo de Equipos: Lideré equipos multidisciplinarios (desarrollo, QA, infraestructura), eliminando cuellos de botella operativos y asegurando el flujo continuo de despliegues y configuración de sistemas.',
      ],
    },
    {
      empresa: 'UTSCD',
      cargo: 'Gerente de Gestión de Proyectos',
      periodo: 'Ago 2024 - Ene 2025',
      destacados: [
        'Gestión y Dirección de Proyectos: Planifiqué, dirigí y supervisé la ejecución integral de iniciativas estratégicas, definiendo metodologías y estructuras de gestión para garantizar el cumplimiento de objetivos, plazos y presupuestos corporativos.',
        'Metodologías Ágiles y Tradicionales: Apliqué buenas prácticas en metodologías Scrum, PMI y PRINCE2, adaptando el enfoque según el alcance de cada iniciativa.',
        'Control y Riesgos: Gestioné riesgos de manera proactiva y optimicé recursos mediante herramientas como Jira, Trello, Microsoft Project y Asana, asegurando la toma de decisiones oportuna por parte de los comités de dirección.',
      ],
    },
    {
      empresa: 'THOMAS PROCESSING & SYSTEMS S.A.S',
      cargo: 'Especialista de Base de Datos',
      periodo: 'Ago 2024 - Dic 2024',
      destacados: [
        'Arquitectura Cloud: Diseñé e implementé arquitecturas de datos escalables en AWS, Azure y Google Cloud, optimizando el rendimiento de bases de datos SQL/NoSQL.',
      ],
    },
    {
      empresa: 'Tiglobal',
      cargo: 'Director de Proyectos',
      periodo: 'Jun 2023 - Sep 2024',
      destacados: [
        'Liderazgo Estratégico de Proyectos: Planifiqué y dirigí iniciativas estratégicas, coordinando equipos multidisciplinarios y asegurando la colaboración entre áreas técnicas, operativas y de negocio.',
        'Eficiencia Operativa: Establecí mecanismos de seguimiento y control con herramientas de gestión (Jira, Asana, MS Project), optimizando el uso de recursos humanos, técnicos y financieros para garantizar la entrega exitosa.',
      ],
    },
    {
      empresa: 'Aria PSW',
      cargo: 'Director de Sistemas de Datos & Senior Data Engineer',
      periodo: 'May 2022 - Jun 2024',
      destacados: [
        'Gerencia y Gobernanza de Datos: Fui responsable de supervisar, gobernar y maximizar el valor estratégico de los datos dentro de la organización, asegurando su disponibilidad, calidad y alineación con los objetivos corporativos.',
        'Estrategia Cloud y Liderazgo: Desarrollé e implementé estrategias integrales de recolección y análisis en plataformas de nube (AWS, Azure, GCP), liderando y supervisando al equipo de ingeniería de datos.',
        'Pipelines y Cumplimiento Normativo: Construí pipelines eficientes con Apache NiFi y Spark, y aseguré el estricto cumplimiento de normativas como GDPR y HIPAA mediante el uso de herramientas especializadas (OneTrust, FireEye, Splunk).',
      ],
    },
    {
      empresa: 'S&R Soluciones IT',
      cargo: 'Director de Proyecto',
      periodo: 'Feb 2020 - Dic 2023',
      destacados: [
        'Dirección y Project Turnaround: Lidero la planificación, gestión y supervisión integral de iniciativas estratégicas. Implemento metodologías de gestión de proyectos (ágiles, tradicionales o híbridas) estableciendo procesos claros de control, seguimiento y mitigación de riesgos.',
      ],
    },
    {
      empresa: 'KLYM',
      cargo: 'Senior Data Engineer',
      periodo: 'Dic 2020 - Mar 2023',
      destacados: [
        'Optimización y Disponibilidad: Administré de manera avanzada bases de datos críticas (PostgreSQL, Oracle, SQL Server), ejecutando tuning de consultas SQL y planes de recuperación ante incidentes para asegurar la continuidad operativa.',
      ],
    },
  ],
  trayectoriaAnterior: [
    {
      categoria: 'Ingeniero de Desarrollo y Datos',
      empresas:
        'Zencillo Software (2020), Gml Software Oficial (2019-2020), UT-ICOM2018 (2019), SONDA (2018), Business Intelligence Software Assesor Corp (2017-2018).',
    },
    {
      categoria: 'Gestión de Proyectos',
      empresas:
        'Origen Soluciones SAS (2017-2019), Task Force Consulting (2017), Servicios Medicos Integra (2013-2017), Grupo Tecnologico Jexo (2011-2013).',
    },
    {
      categoria: 'Soporte y Sistemas Operativos',
      empresas:
        'CS&S (HP) (2010-2011), FONEP (2008-2009), JAP Ingenieros Consultores (2008).',
    },
  ],
  educacion: [
    {
      titulo: 'Ingeniero en Informática',
      institucion: 'Universidad Alejandro de Humbolt',
      periodo: '2006 - 2013',
      anio: 2013,
    },
    {
      titulo: 'Diplomado en Gerencia de Proyectos',
      institucion: 'Politécnico de Colombia',
      periodo: 'Ene 2024 - Feb 2024',
      anio: 2024,
    },
    {
      titulo: 'Diplomado en Programación en Java',
      institucion: 'Politécnico de Colombia',
      periodo: 'Ene 2024 - Feb 2024',
      anio: 2024,
    },
  ],
  certificaciones: [
    'Scrum Master Professional Certification (SMPC®) - CertiProf',
    'PostgreSQL avanzado',
    'SQL Server 2016: Administración y configuración',
    'Arquitectura de software: De desarrollador a arquitecto',
  ],
  certificacionesDetalle: [
    {
      nombre: 'Scrum Master Professional Certification (SMPC®)',
      emisor: 'CertiProf',
    },
    {
      nombre: 'PostgreSQL avanzado',
      emisor: 'Certificación Especializada',
    },
    {
      nombre: 'SQL Server 2016: Administración y configuración',
      emisor: 'Microsoft Certified Specialist',
    },
    {
      nombre: 'Arquitectura de software: De desarrollador a arquitecto',
      emisor: 'Certificación de Arquitectura Técnica',
    },
  ],
  preferencias: {
    ubicacion: 'Bogotá, Distrito Capital, Colombia',
    modalidad: 'Presencial Bogotá / Híbrido / Remoto Colombia',
    nivelExperiencia: 'Senior / Director / Especialista Turnaround (15+ años)',
    salarioMin: 8000000,
    salarioMax: 15000000,
    salarioMoneda: 'COP',
    autorizacionColombia: true,
    disponibilidad: 'Inmediata',
    idiomas: [
      { idioma: 'Español', nivel: 'Nativo' },
      { idioma: 'Inglés', nivel: 'Intermedio-Avanzado Profesional' },
    ],
  },
  cvFile: {
    nombre: 'Hoja de vida ATS JCSC.pdf',
    ruta: '/home/ubuntu/shared/Hoja de vida ATS JCSC.pdf',
    tamanio: '248 KB',
    tipo: 'PDF (ATS Formato Oficial 4 Páginas)',
  },
};

export const FORM_ANSWER_TEMPLATES: FormAnswerTemplate[] = [
  {
    pregunta: '¿Cuántos años de experiencia total tienes en tecnología y proyectos?',
    categoria: 'Experiencia General',
    respuesta_es: 'Más de 15 años de trayectoria profesional ininterrumpida.',
    respuesta_en: 'Over 15 years of uninterrupted professional experience.',
    regla: 'Trayectoria técnica y directiva demostrada desde 2008 en dirección de fábricas de software, infraestructura, datos y gestión de proyectos.',
  },
  {
    pregunta: '¿Experiencia en Project Turnaround / Recuperación de Proyectos?',
    categoria: 'Liderazgo & Turnaround',
    respuesta_es: 'Experto en Project Turnaround rescatando iniciativas tecnológicas en riesgo, estabilizando operaciones en entornos de alta incertidumbre y alineando cronogramas y presupuestos (S&R Soluciones IT, Tiglobal).',
    respuesta_en: 'Expert in Project Turnaround rescuing high-risk technology initiatives, stabilizing operations under high uncertainty, and re-aligning schedules and budgets (S&R Soluciones IT, Tiglobal).',
    regla: 'Especialidad nuclear destacada en el extracto profesional y roles de dirección.',
  },
  {
    pregunta: '¿Metodologías de gestión y certificaciones que manejas?',
    categoria: 'Metodologías & Agile',
    respuesta_es: 'Scrum (Scrum Master SMPC® por CertiProf), PMI y PRINCE2. Enfoques ágiles, tradicionales e híbridos adaptados a cada iniciativa.',
    respuesta_en: 'Scrum (Scrum Master SMPC® by CertiProf), PMI, and PRINCE2. Agile, traditional, and hybrid management frameworks.',
    regla: 'Certificación oficial SMPC® y diplomado en Gerencia de Proyectos.',
  },
  {
    pregunta: '¿Experiencia en Bases de Datos (SQL / NoSQL / Cloud)?',
    categoria: 'Técnico Bases de Datos',
    respuesta_es: 'Maestría técnica en PostgreSQL avanzado, Oracle PL/SQL, SQL Server 2016 y arquitecturas cloud de datos en AWS, Azure y Google Cloud (KLYM, Thomas Processing, Aria PSW).',
    respuesta_en: 'Deep technical mastery in advanced PostgreSQL, Oracle PL/SQL, SQL Server 2016, and cloud data architectures across AWS, Azure, and GCP.',
    regla: 'Certificaciones en PostgreSQL avanzado y SQL Server 2016.',
  },
  {
    pregunta: '¿Experiencia en Data Engineering, Big Data y ETL?',
    categoria: 'Data Pipelines',
    respuesta_es: 'Construcción de pipelines eficientes con Apache NiFi, Spark, ETL/ELT y cumplimiento estricto de normativas como GDPR y HIPAA (OneTrust, FireEye, Splunk).',
    respuesta_en: 'Building scalable pipelines with Apache NiFi, Spark, ETL/ELT, and strict compliance with GDPR and HIPAA standards.',
    regla: 'Experiencia contrastada en Aria PSW como Director de Sistemas de Datos.',
  },
  {
    pregunta: '¿Está legalmente autorizado para trabajar en Colombia?',
    categoria: 'Legal / Permisos',
    respuesta_es: 'Sí, ciudadano con residencia y plena autorización laboral en Colombia.',
    respuesta_en: 'Yes, full legal authorization to work in Colombia.',
    regla: 'Residencia en Bogotá, Colombia.',
  },
  {
    pregunta: '¿Requiere patrocinio de visa para este empleo?',
    categoria: 'Legal / Permisos',
    respuesta_es: 'No',
    respuesta_en: 'No',
    regla: 'No requiere sponsorship ni trámites migratorios en Colombia.',
  },
  {
    pregunta: '¿Cuál es su formación académica y educación formal?',
    categoria: 'Educación',
    respuesta_es: 'Ingeniero en Informática (Universidad Alejandro de Humbolt, 2013), Diplomado en Gerencia de Proyectos (Politécnico de Colombia, 2024) y Diplomado en Programación en Java (Politécnico de Colombia, 2024).',
    respuesta_en: 'B.S. in Computer Science (Universidad Alejandro de Humbolt, 2013), Postgraduate Diploma in Project Management and Postgraduate Diploma in Java Programming (Politécnico de Colombia, 2024).',
    regla: 'Títulos oficiales exactos consignados en la hoja de vida.',
  },
  {
    pregunta: '¿Cuál es su disponibilidad para incorporarse?',
    categoria: 'Disponibilidad',
    respuesta_es: 'Disponibilidad inmediata.',
    respuesta_en: 'Immediate availability.',
    regla: 'Listo para incorporarse a nuevos retos técnicos y de dirección.',
  },
  {
    pregunta: '¿Cuál es su aspiración salarial mensual en COP?',
    categoria: 'Compensación',
    respuesta_es: '8.000.000 – 15.000.000 COP (Negociable según esquema contractual y beneficios)',
    respuesta_en: '8,000,000 – 15,000,000 COP (Negotiable based on total compensation package)',
    regla: 'Solo diligenciar en formularios donde sea campo mandatorio.',
  },
  {
    pregunta: '¿Nivel de inglés y otros idiomas?',
    categoria: 'Idiomas',
    respuesta_es: 'Español (Nativo) e Inglés (Intermedio - Avanzado Profesional B2/C1 para gestión técnica y coordinación internacional).',
    respuesta_en: 'Spanish (Native) and English (Professional Working Proficiency B2/C1 for international technical leadership).',
    regla: 'Comunicación fluida en entornos multiculturales.',
  },
  {
    pregunta: '¿Carta de presentación / Resumen de valor para este rol?',
    categoria: 'Cover Letter',
    respuesta_es:
      'Líder senior en tecnología con más de 15 años de trayectoria dirigiendo operaciones tecnológicas complejas, transformando datos en activos estratégicos y rescatando iniciativas tecnológicas en riesgo ("Project Turnaround"). Mi carrera se caracteriza por integrar la maestría técnica en arquitecturas de infraestructura y datos (AWS/Azure/GCP, PostgreSQL, Oracle, Spark) con una sólida capacidad ejecutiva bajo metodologías Scrum, PMI y PRINCE2 para liderar fábricas de software y proyectos de misión crítica.',
    respuesta_en:
      'Senior Technology Leader with over 15 years of experience managing complex IT operations, transforming data into strategic assets, and rescuing mission-critical projects ("Project Turnaround"). I bridge hands-on cloud and data engineering mastery (AWS/Azure/GCP, PostgreSQL, Oracle, Spark) with executive project governance under Scrum, PMI, and PRINCE2 frameworks.',
    regla: 'Texto exacto alineado con el extracto profesional del CV oficial.',
  },
];
