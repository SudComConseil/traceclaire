// The database belongs to this site's origin and this browser profile.
const database = new Promise((resolve, reject) => {
  const request = indexedDB.open('TraceClaireWeb', 1);
  request.onupgradeneeded = () => {
    request.result.createObjectStore('projects', {keyPath: 'id'});
    request.result.createObjectStore('media', {keyPath: 'id'});
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
async function record(store, action, value) {
  const db = await database;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, action === 'put' ? 'readwrite' : 'readonly');
    const request = tx.objectStore(store)[action](value);
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(tx.error || Error('Sauvegarde interrompue'));
    tx.onerror = () => reject(tx.error || Error('Stockage indisponible'));
  });
}
async function libraryJSON(action, body, id) {
  if (action === 'list') {
    const projects = await record('projects', 'getAll');
    return {projects: projects.map(p => ({id:p.id, title:p.title}))};
  }
  if (action === 'create') {
    const project = {id:crypto.randomUUID(), title:body.title, format:'TraceClaireLocal', version:1, tracks:[]};
    await record('projects', 'put', project);
    return project;
  }
  if (action === 'save') {
    await record('projects', 'put', {...body, id});
    return {ok:true};
  }
  if (action === 'load') {
    const project = await record('projects', 'get', id);
    if (!project) throw Error('Voyage introuvable');
    return project;
  }
  throw Error('Action inconnue');
}
async function storeMedia(file) {
  if (!(file instanceof Blob)) throw Error('Fichier média invalide');
  const id = crypto.randomUUID();
  await record('media', 'put', {id, file});
  return {id};
}
async function restoreMedia(id, name, type) {
  const media = await record('media', 'get', id);
  if (!media) throw Error('Média absent : '+name);
  return new File([media.file], name, {type});
}
async function searchPOIs(point, radius, provider, key, signal) {
  const {lat,lon} = point;
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal.aborted) controller.abort();
  signal.addEventListener('abort', abort, {once:true});
  const timer = setTimeout(abort, 28000);
  try {
    let response;
    if (provider === 'geoapify') {
      const params = new URLSearchParams({categories:'tourism.attraction,tourism.sights,entertainment.museum,catering.restaurant,catering.cafe,accommodation.hotel,accommodation.camping,service.vehicle.fuel,commercial.supermarket,natural', filter:`circle:${lon},${lat},${radius}`, limit:'150', apiKey:key});
      response = await fetch('https://api.geoapify.com/v2/places?'+params, {signal:controller.signal});
    } else {
      const around = `around:${radius},${lat},${lon}`;
      const filters = ['"tourism"','"natural"','"amenity"~"restaurant|cafe|fast_food|fuel"','"shop"="supermarket"'];
      const query = '[out:json][timeout:25];('+filters.map(f=>`node(${around})[${f}];`).join('')+');out body;';
      response = await fetch('https://overpass-api.de/api/interpreter', {method:'POST', body:new URLSearchParams({data:query}), signal:controller.signal});
    }
    if (!response.ok) throw Error('Fournisseur POI : HTTP '+response.status);
    const data = await response.json();
    if (provider !== 'geoapify') return data;
    return {elements:(data.features||[]).map((feature,i)=>{
      const p = feature.properties||{}, c = p.categories||[], coordinates = feature.geometry?.coordinates||[];
      const tags = {name:p.name||p.formatted||'POI'};
      if(c.some(x=>x.startsWith('catering.'))) tags.amenity='restaurant';
      else if(c.some(x=>x.startsWith('accommodation.'))) tags.tourism='hotel';
      else if(c.some(x=>x.startsWith('service.vehicle.fuel'))) tags.amenity='fuel';
      else if(c.some(x=>x.startsWith('natural'))) tags.natural='peak';
      else tags.tourism='attraction';
      return {type:'geoapify',id:p.place_id||i,lat:coordinates[1],lon:coordinates[0],tags};
    })};
  } catch(error) {
    if (controller.signal.aborted && !signal.aborted) throw Error('Délai de recherche dépassé. Réessaie sur une zone plus petite.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort',abort);
  }
}
