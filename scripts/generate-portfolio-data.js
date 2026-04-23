const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(root, '..');
const sourceCertDir = path.join(repoRoot, 'certificaciones');
const sourceMapDir = path.join(repoRoot, 'mapas');
const destCertDir = path.join(root, 'img', 'certificaciones');
const destMapDir = path.join(root, 'img', 'mapas');
const dataDir = path.join(root, 'data');
const outputFile = path.join(dataDir, 'portfolio-data.js');

const allowedExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
const captionMap = {
  'arcgispro.jpg': 'ArcGIS Pro Avanzado',
  'diplomado.png': 'Diplomado en Análisis Espacial de Datos',
  'fotogrametria.jpg': 'Fotogrametría RPA',
  'infraworks.png': 'InfraWorks',
  'OPERADOR.jpg': 'Operador RPA',
};
const descriptionMap = {
  'arcgispro.jpg': 'Especialización en sistemas SIG y análisis espacial con ArcGIS Pro.',
  'diplomado.png': 'Formación en análisis y visualización de datos georreferenciados con Python, R y QGIS.',
  'fotogrametria.jpg': 'Certificación en procesamiento de datos fotogramétricos y análisis de vuelo con drones.',
  'infraworks.png': 'Modelación 3D y diseño de infraestructura con herramientas geoespaciales avanzadas.',
  'OPERADOR.jpg': 'Automatización de procesos repetitivos y optimización de flujos de trabajo GIS.',
};
const projectCaptionMap = {
  'ndvi.jpg': 'Detección de vegetación (NDVI)',
  'savi.png': 'Cobertura vegetal mejorada (SAVI)',
  'dnbr.jpg': 'Análisis de perturbaciones (dNBR)',
  'valpo.jpg': 'Estudio territorial Valparaíso',
  'calor1.jpg': 'Mapa de calor espacial',
  'calor2.jpg': 'Mapa de calor espacial 2',
  'dsas.png': 'Análisis costero DSAS',
  'genero.png': 'Mapa temático género y territorio',
};
const projectDescMap = {
  'ndvi.jpg': 'Mapeo de salud de cobertura vegetal para análisis ambiental y monitoreo de cambio.',
  'savi.png': 'Estudio de vegetación con corrección de suelo para terrenos agrícolas y forestales.',
  'dnbr.jpg': 'Evaluación de impactos en cubierta terrestre tras eventos ambientales o incendios.',
  'valpo.jpg': 'Cartografía de uso del suelo y análisis de sectores urbanos y patrimoniales.',
  'calor1.jpg': 'Visualización de intensidad de variables geoespaciales para toma de decisiones.',
  'calor2.jpg': 'Análisis espacial de patrones de calor para planificación territorial.',
  'dsas.png': 'Estudio costero y proyección de dinámicas de erosión con DSAS.',
  'genero.png': 'Cartografía aplicada a indicadores sociales y desigualdad territorial.',
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => allowedExt.includes(path.extname(file).toLowerCase()));
}

function copyFiles(sourceDir, destDir) {
  ensureDir(destDir);
  const files = getImages(sourceDir);
  files.forEach(file => {
    const src = path.join(sourceDir, file);
    const dst = path.join(destDir, file);
    fs.copyFileSync(src, dst);
    console.log('Copied', file);
  });
  return files;
}

function buildEntries(files, subfolder, captionMap, descriptionMap) {
  return files.map(file => ({
    src: `img/${subfolder}/${file}`,
    caption: captionMap[file] || file.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, ''),
    description: descriptionMap[file] || 'Proyecto geoespacial destacado.',
  }));
}

function serialize(obj) {
  return JSON.stringify(obj, null, 2);
}

function main() {
  ensureDir(dataDir);
  const certFiles = copyFiles(sourceCertDir, destCertDir);
  const projectFiles = copyFiles(sourceMapDir, destMapDir);

  const data = {
    profile: {
      github: 'tamarasgeo',
      youtubeChannel: '@TAMYGEO',
    },
    tutorials: [
      { title: 'ÍNDICE DE HUMEDAD - TWI - AUTOMATIZADO', id: 'OYF1IKq5cy0&t=1s', tags:['Python','TWI','Humedad'], description: 'Cálculo del Topographic Wetness Index para análisis de humedad del terreno.' },
      { title: 'NDWI AUTOMATIZADO', id: 'xGUOOMXPv5M', tags:['Python','NDWI','Humedad'], description: 'Índice de agua normalizado automatizado para seguimiento de cuerpos de agua.' },
      { title: '¿QUÉ ES UN SIG?', id: '-L1KcItYbLQ', tags:['GIS'], description: 'Explicación clara sobre los Sistemas de Información Geográfica y su impacto en decisiones territoriales.' },
    ],
    certifications: buildEntries(certFiles, 'certificaciones', captionMap, descriptionMap),
    projects: buildEntries(projectFiles, 'mapas', projectCaptionMap, projectDescMap),
  };

  const jsContent = `const profile = ${serialize(data.profile)};
const tutorials = ${serialize(data.tutorials)};
const certifications = ${serialize(data.certifications)};
const projects = ${serialize(data.projects)};
`;

  fs.writeFileSync(outputFile, jsContent, 'utf8');
  console.log('Generated', outputFile);
  console.log('Certifications:', data.certifications.length, 'projects:', data.projects.length);
}

main();
