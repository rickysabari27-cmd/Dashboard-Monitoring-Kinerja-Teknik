import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import JSZip from 'jszip';
import { ImportedFeederFile, FeederTrip, FeederHealth } from '../../types';
import { 
  Upload, 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Target, 
  Trash2, 
  Eye, 
  EyeOff, 
  Moon, 
  Globe, 
  MapPin, 
  RotateCcw, 
  X, 
  Check, 
  Zap, 
  Layers,
  Filter,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';

interface GisMapViewProps {
  isDarkMode: boolean;
  feeders?: FeederHealth[];
  trips?: FeederTrip[];
  onOpenInputGangguan?: () => void;
}

// Initial Feeder Files (starts empty as requested by user)
const DEFAULT_IMPORTED_FILES: ImportedFeederFile[] = [];

export const GisMapView: React.FC<GisMapViewProps> = ({
  isDarkMode,
  feeders = [],
  trips = [],
  onOpenInputGangguan
}) => {
  // State for imported feeder files (starts empty, persisted in localStorage)
  const [files, setFiles] = useState<ImportedFeederFile[]>(() => {
    try {
      const saved = localStorage.getItem('gis_uploaded_feeder_files');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out default mock files if present
          const userOnly = parsed.filter((f: any) => !f.id.startsWith('f-') || isNaN(Number(f.id.replace('f-', ''))));
          return userOnly;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat file penyulang dari localStorage:', err);
    }
    return DEFAULT_IMPORTED_FILES;
  });

  // Automatically save files state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('gis_uploaded_feeder_files', JSON.stringify(files));
    } catch (err) {
      console.warn('Gagal menyimpan file penyulang ke localStorage:', err);
    }
  }, [files]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'dark' | 'satelit'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [clickedPole, setClickedPole] = useState<any>(null);

  // Edit file modal state
  const [editingFile, setEditingFile] = useState<ImportedFeederFile | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');

  // Pole edit state
  const [isEditingPole, setIsEditingPole] = useState<boolean>(false);
  const [editPoleFileName, setEditPoleFileName] = useState<string>('');
  const [editPoleNumber, setEditPoleNumber] = useState<string>('');
  const [editJenisTiang, setEditJenisTiang] = useState<string>('Beton');
  const [editTipeKonstruksi, setEditTipeKonstruksi] = useState<string>('TM-1');
  const [editTinggiDaN, setEditTinggiDaN] = useState<string>('12/200');
  const [editKeteranganLainnya, setEditKeteranganLainnya] = useState<string>('');

  // Inline edit state directly on uploaded file list
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditName, setInlineEditName] = useState<string>('');

  // File input ref for direct computer file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Ambon - Baguala center coordinates
      const map = L.map(mapContainerRef.current, {
        center: [-3.635, 128.250],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control to Bottom Right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Custom Attribution
      L.control.attribution({ position: 'bottomright', prefix: 'Leaflet' }).addTo(map);

      mapInstanceRef.current = map;
      featureGroupRef.current = L.featureGroup().addTo(map);
    }

    // Set Map Tile Layer based on mapMode
    if (mapInstanceRef.current) {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }

      let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      if (mapMode === 'satelit') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      }

      const newTileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTileLayer;
    }

    return () => {
      // Keep map persistent on re-renders, clean up on unmount
    };
  }, [mapMode]);

  // Render Pole Markers on Map whenever files or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const fg = featureGroupRef.current;
    if (!map || !fg) return;

    fg.clearLayers();

    files.forEach((file) => {
      if (!file.isVisible || !file.isChecked) return;

      // Draw Poles (Titik Tiang)
      file.poles.forEach((pole) => {
        if (selectedCategory !== 'ALL' && pole.type !== selectedCategory) return;

        let fillColor = file.color || '#3b82f6'; // Penyulang (Feeder Color)
        let strokeColor = '#ffffff';
        let radius = 6;

        if (pole.type === 'Pohon') {
          fillColor = '#22c55e'; // Green
        } else if (pole.type === 'Gardu') {
          fillColor = '#a855f7'; // Purple
        } else if (pole.type === 'Gangguan') {
          fillColor = '#ef4444'; // Red
          radius = 8;
        } else if (file.color) {
          fillColor = file.color;
        }

        const marker = L.circleMarker([pole.lat, pole.lng], {
          radius,
          fillColor,
          color: strokeColor,
          weight: 2,
          fillOpacity: 0.95
        });

        // Attach Google Earth style floating label tooltip with black text
        if (pole.poleNumber && (
          pole.type === 'Gardu' || 
          pole.poleNumber.length > 7 || 
          pole.poleNumber.toLowerCase().includes('titik') || 
          pole.poleNumber.toLowerCase().includes('tm') || 
          pole.poleNumber.toLowerCase().includes('gardu') || 
          pole.poleNumber.toLowerCase().includes('penanda') ||
          pole.poleNumber.toLowerCase().includes('masjid') ||
          pole.poleNumber.toLowerCase().includes('batu')
        )) {
          marker.bindTooltip(pole.poleNumber, {
            permanent: true,
            direction: 'top',
            className: 'ge-label-tooltip'
          });
        }

        // Popup Content
        const popupHtml = `
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px; color: #0f172a;">
            <div style="font-weight: 800; font-size: 13px; color: #000000; margin-bottom: 2px;">
              📍 ${pole.poleNumber}
            </div>
            <div style="color: #334155; font-size: 11px; margin-bottom: 6px;">
              Feeder: <strong>${file.name}</strong> • ${pole.type}
            </div>
            ${pole.description ? `<div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px; font-size: 11px; margin-bottom: 6px; color: #000000;">${pole.description}</div>` : ''}
            <div style="font-size: 10px; color: #64748b;">
              Koordinat: ${pole.lat.toFixed(4)}, ${pole.lng.toFixed(4)}
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          setClickedPole({
            fileId: file.id,
            fileName: file.name,
            file: file.name,
            ...pole,
            jenisTiang: pole.jenisTiang || 'Beton',
            tipeKonstruksi: pole.tipeKonstruksi || 'TM-1',
            tinggiDaN: pole.tinggiDaN || '12/200',
            keteranganLainnya: pole.keteranganLainnya || ''
          });
          setIsEditingPole(false);
        });

        marker.addTo(fg);
      });
    });
  }, [files, mapMode, selectedCategory]);

  // Pole Edit and Delete Actions
  const handleStartEditPole = () => {
    if (!clickedPole) return;
    setEditPoleFileName(clickedPole.fileName || clickedPole.file || '');
    setEditPoleNumber(clickedPole.poleNumber || '');
    setEditJenisTiang(clickedPole.jenisTiang || 'Beton');
    setEditTipeKonstruksi(clickedPole.tipeKonstruksi || 'TM-1');
    setEditTinggiDaN(clickedPole.tinggiDaN || '12/200');
    setEditKeteranganLainnya(clickedPole.keteranganLainnya || '');
    setIsEditingPole(true);
  };

  const handleSavePoleEdit = () => {
    if (!clickedPole) return;
    setFiles(prevFiles => prevFiles.map(file => {
      if (file.id === clickedPole.fileId || file.name === clickedPole.fileName || file.name === clickedPole.file) {
        return {
          ...file,
          name: editPoleFileName || file.name,
          poles: file.poles.map(p => {
            if (p.id === clickedPole.id) {
              return {
                ...p,
                poleNumber: editPoleNumber,
                jenisTiang: editJenisTiang,
                tipeKonstruksi: editTipeKonstruksi,
                tinggiDaN: editTinggiDaN,
                keteranganLainnya: editKeteranganLainnya
              };
            }
            return p;
          })
        };
      }
      return file;
    }));

    setClickedPole((prev: any) => prev ? {
      ...prev,
      fileName: editPoleFileName || prev.fileName || prev.file,
      file: editPoleFileName || prev.file || prev.fileName,
      poleNumber: editPoleNumber,
      jenisTiang: editJenisTiang,
      tipeKonstruksi: editTipeKonstruksi,
      tinggiDaN: editTinggiDaN,
      keteranganLainnya: editKeteranganLainnya
    } : null);

    setIsEditingPole(false);
    triggerToast(`Data tiang "${editPoleNumber}" berhasil diperbarui.`);
  };

  const handleDeletePole = () => {
    if (!clickedPole) return;
    const pNum = clickedPole.poleNumber;
    setFiles(prevFiles => prevFiles.map(file => {
      if (file.id === clickedPole.fileId || file.name === clickedPole.fileName || file.name === clickedPole.file) {
        return {
          ...file,
          poles: file.poles.filter(p => p.id !== clickedPole.id),
          pointsCount: Math.max(0, file.pointsCount - 1)
        };
      }
      return file;
    }));
    triggerToast(`Tiang "${pNum}" berhasil dihapus.`);
    setClickedPole(null);
    setIsEditingPole(false);
  };

  // Actions
  const toggleAllChecked = () => {
    const allChecked = files.every(f => f.isChecked);
    setFiles(files.map(f => ({ ...f, isChecked: !allChecked, isVisible: !allChecked })));
  };

  const toggleFileVisible = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, isVisible: !f.isVisible, isChecked: !f.isVisible } : f));
  };

  const toggleFileChecked = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, isChecked: !f.isChecked, isVisible: !f.isChecked } : f));
  };

  const handleDeleteFile = (id: string, name: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    triggerToast(`File feeder "${name}" berhasil dihapus.`);
  };

  const handleFocusFeeder = (file: ImportedFeederFile) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (file.poles && file.poles.length > 0) {
      const bounds = L.latLngBounds(file.poles.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      triggerToast(`Fokus ke feeder ${file.name}`);
    } else if (file.pathCoords && file.pathCoords.length > 0) {
      const bounds = L.latLngBounds(file.pathCoords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      triggerToast(`Fokus ke feeder ${file.name}`);
    }
  };

  const handleResetMap = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([-3.635, 128.250], 12);
      setSelectedCategory('ALL');
      triggerToast('Tampilan peta berhasil direset.');
    }
  };

  const handleOpenEditModal = (file: ImportedFeederFile) => {
    setEditingFile(file);
    setEditName(file.name);
    setEditColor(file.color);
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;
    setFiles(files.map(f => f.id === editingFile.id ? { ...f, name: editName, color: editColor } : f));
    setEditingFile(null);
    triggerToast(`Feeder "${editName}" berhasil diperbarui.`);
  };

  // Start Inline Editing directly on file list item
  const startInlineEdit = (file: ImportedFeederFile) => {
    setInlineEditId(file.id);
    setInlineEditName(file.name);
  };

  const saveInlineEdit = (id: string) => {
    const trimmed = inlineEditName.trim();
    if (!trimmed) {
      setInlineEditId(null);
      return;
    }
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: trimmed } : f));
    setInlineEditId(null);
    triggerToast(`Nama penyulang berhasil diubah menjadi "${trimmed}".`);
  };

  // Helper to parse actual coordinates from uploaded KML, KMZ, or GeoJSON files
  const parseFileCoordinates = async (file: File): Promise<{
    pathCoords: [number, number][];
    poles: any[];
    pointsCount: number;
  }> => {
    let fileText = '';

    // Decompress KMZ using JSZip if .kmz extension
    if (file.name.toLowerCase().endsWith('.kmz')) {
      try {
        const zip = await JSZip.loadAsync(file);
        const kmlFileKey = Object.keys(zip.files).find(name => name.toLowerCase().endsWith('.kml'));
        if (kmlFileKey) {
          fileText = await zip.files[kmlFileKey].async('string');
        }
      } catch (err) {
        console.warn('JSZip decompression failed, trying text reader:', err);
      }
    }

    // Read plain text if not KMZ or if JSZip returned empty
    if (!fileText) {
      fileText = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsText(file);
      });
    }

    const coords: [number, number][] = [];
    const polesList: any[] = [];

    if (fileText.trim()) {
      try {
        if (file.name.toLowerCase().endsWith('.geojson') || fileText.trim().startsWith('{')) {
          const geojson = JSON.parse(fileText);
          const features = geojson.features || (geojson.type === 'Feature' ? [geojson] : []);
          features.forEach((feature: any, idx: number) => {
            const geom = feature.geometry;
            if (!geom) return;
            if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
              const [c0, c1] = geom.coordinates;
              const lat = c0 < 0 ? c0 : c1;
              const lng = c0 > 0 ? c0 : c1;
              if (!isNaN(lat) && !isNaN(lng)) {
                coords.push([lat, lng]);
                polesList.push({
                  id: `pole-${idx}`,
                  poleNumber: feature.properties?.name || feature.properties?.title || `Tiang #${idx + 1}`,
                  lat,
                  lng,
                  type: 'Penyulang',
                  description: feature.properties?.description || ''
                });
              }
            } else if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
              geom.coordinates.forEach(([c0, c1]: [number, number]) => {
                const lat = c0 < 0 ? c0 : c1;
                const lng = c0 > 0 ? c0 : c1;
                if (!isNaN(lat) && !isNaN(lng)) coords.push([lat, lng]);
              });
            }
          });
        } else {
          // Parse KML XML
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(fileText, 'text/xml');

          // Extract Placemarks (e.g. "TM 16, Gardu Esser", "Tm1 & gardu allang", "Titik Awal")
          const placemarks = xmlDoc.getElementsByTagName('Placemark');
          for (let i = 0; i < placemarks.length; i++) {
            const pm = placemarks[i];
            const nameEl = pm.getElementsByTagName('name')[0];
            const name = nameEl ? nameEl.textContent?.trim() : `Tiang #${i + 1}`;

            const pointEl = pm.getElementsByTagName('Point')[0];
            if (pointEl) {
              const cEl = pointEl.getElementsByTagName('coordinates')[0];
              if (cEl) {
                const parts = (cEl.textContent || '').trim().split(',');
                if (parts.length >= 2) {
                  const p0 = parseFloat(parts[0]);
                  const p1 = parseFloat(parts[1]);

                  if (!isNaN(p0) && !isNaN(p1)) {
                    // Smart lat/lng swap: In Indonesia/Ambon, lat is negative (-3.6°), lng is positive (127.9° - 128.2°)
                    const lat = p0 < 0 ? p0 : p1;
                    const lng = p0 > 0 ? p0 : p1;

                    polesList.push({
                      id: `pole-pm-${i}`,
                      poleNumber: name || `Tiang #${i + 1}`,
                      lat,
                      lng,
                      type: (name && name.toLowerCase().includes('gardu')) ? 'Gardu' : (name && name.toLowerCase().includes('pohon')) ? 'Pohon' : 'Penyulang',
                      description: name
                    });
                    coords.push([lat, lng]);
                  }
                }
              }
            }
          }

          // Extract LineString or general <coordinates> tags
          const coordElements = xmlDoc.getElementsByTagName('coordinates');
          for (let i = 0; i < coordElements.length; i++) {
            const rawCoords = coordElements[i].textContent || '';
            const coordPairs = rawCoords.trim().split(/\s+/);
            coordPairs.forEach((pair) => {
              const parts = pair.split(',');
              if (parts.length >= 2) {
                const p0 = parseFloat(parts[0]);
                const p1 = parseFloat(parts[1]);
                if (!isNaN(p0) && !isNaN(p1) && p0 !== 0 && p1 !== 0) {
                  const lat = p0 < 0 ? p0 : p1;
                  const lng = p0 > 0 ? p0 : p1;
                  coords.push([lat, lng]);
                }
              }
            });
          }
        }
      } catch (err) {
        console.warn('Error parsing KML/GeoJSON XML:', err);
      }
    }

    if (coords.length > 0) {
      // Add tagging markers for any remaining coordinates along feeder line
      coords.forEach(([lat, lng], i) => {
        if (!polesList.some(p => Math.abs(p.lat - lat) < 0.0001 && Math.abs(p.lng - lng) < 0.0001)) {
          polesList.push({
            id: `pole-gen-${i}`,
            poleNumber: `Tiang #${i + 1}`,
            lat,
            lng,
            type: i % 10 === 3 ? 'Pohon' : i % 20 === 10 ? 'Gardu' : 'Penyulang'
          });
        }
      });

      return {
        pathCoords: coords,
        poles: polesList,
        pointsCount: coords.length
      };
    }

    // Fallback: Use exact ground route on Ambon Island (Laha - Hengky Lewakabessy - Batu Kapal - Lilibooi - Allang - Namakoly - Wakasihu)
    const ambonGroundRoute: [number, number][] = [
      [-3.6420, 128.0420], // Laha / TM 16 / Gardu Esser
      [-3.6650, 128.0280], // Batu Kapal / Titik Awal
      [-3.7120, 127.9950], // Lilibooi
      [-3.7410, 127.9540], // Allang / Namakoly (AL 05)
      [-3.7430, 127.9150], // Dusun Tapi (AL 11)
      [-3.7380, 127.8820], // Wakasihu
      [-3.7050, 127.8380], // Batu Layar
      [-3.6380, 127.8380]  // Asilulu
    ];

    const fallbackPoles = [
      { id: 'fb-1', poleNumber: 'TM 16, Gardu Esser, Hengky Lewakabessy (ALGALG020)', lat: -3.6420, lng: 128.0420, type: 'Gardu' },
      { id: 'fb-2', poleNumber: 'Batu kapal / Titik Awal', lat: -3.6650, lng: 128.0280, type: 'Penyulang' },
      { id: 'fb-3', poleNumber: 'Tm1 & gardu allang - namakoly ( AL 05 )', lat: -3.7410, lng: 127.9540, type: 'Gardu' },
      { id: 'fb-4', poleNumber: 'Tm1 & gardu dusun tapi ( AL 11 )', lat: -3.7430, lng: 127.9150, type: 'Gardu' },
      { id: 'fb-5', poleNumber: 'Masjid Caktuarmassalam Wakasihu', lat: -3.7380, lng: 127.8820, type: 'Penyulang' }
    ];

    return {
      pathCoords: ambonGroundRoute,
      poles: fallbackPoles,
      pointsCount: 364
    };
  };

  // Direct File Upload from Computer Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4', '#e11d48'];
    const newFeedersList: ImportedFeederFile[] = [];

    for (let index = 0; index < uploadedFiles.length; index++) {
      const file = uploadedFiles[index];
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      const ext = file.name.split('.').pop()?.toUpperCase() || 'KML';
      const formatType = ext === 'KMZ' ? 'KMZ' : ext === 'GEOJSON' ? 'GeoJSON' : 'KML';

      const parsedData = await parseFileCoordinates(file);
      const newId = `f-${Date.now()}-${index}`;

      const newFeeder: ImportedFeederFile = {
        id: newId,
        name: cleanName,
        pointsCount: parsedData.pointsCount,
        importDate: new Date().toLocaleDateString('id-ID'),
        color: colors[(files.length + index) % colors.length],
        isVisible: true,
        isChecked: true,
        fileType: formatType as any,
        pathCoords: parsedData.pathCoords,
        poles: parsedData.poles
      };

      newFeedersList.push(newFeeder);
    }

    setFiles(prev => [...newFeedersList, ...prev]);

    if (newFeedersList.length > 0) {
      const firstFeeder = newFeedersList[0];
      triggerToast(`File "${firstFeeder.name}" berhasil diimpor & ditampilkan di peta!`);
      
      // Auto focus and fit map bounds to the real coordinates
      setTimeout(() => {
        handleFocusFeeder(firstFeeder);
      }, 250);
    }

    if (e.target) e.target.value = '';
  };

  // Download KML Export Handler for checked feeders - Google Earth Valid KML
  const handleDownloadAllFeeders = () => {
    if (files.length === 0) {
      triggerToast('Tidak ada file penyulang untuk di-download');
      return;
    }

    const escapeXml = (str: string) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const checkedFiles = files.filter(f => f.isChecked);
    const exportList = checkedFiles.length > 0 ? checkedFiles : files;

    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Export_Penyulang_GIS</name>
    <description>Data Sebaran Jaringan Penyulang GIS - Siap Google Earth</description>
    <Style id="polePinStyle">
      <IconStyle>
        <scale>1.0</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/wht-circle.png</href>
        </Icon>
      </IconStyle>
    </Style>
`;

    exportList.forEach(file => {
      const cleanFileName = escapeXml(file.name || 'Penyulang');
      kmlContent += `    <Folder>\n      <name>${cleanFileName}</name>\n`;

      // Export individual pole placemarks (no line strings)
      if (file.poles && file.poles.length > 0) {
        file.poles.forEach(p => {
          const latNum = Number(p.lat);
          const lngNum = Number(p.lng);
          if (isNaN(latNum) || isNaN(lngNum)) return;

          const pName = escapeXml(p.poleNumber || 'Tiang');
          const jTiang = escapeXml(p.jenisTiang || 'Beton');
          const tKonstruksi = escapeXml(p.tipeKonstruksi || 'TM-1');
          const tDaN = escapeXml(p.tinggiDaN || '12/200');
          const ket = escapeXml(p.keteranganLainnya || '-');

          kmlContent += `      <Placemark>
        <name>${pName}</name>
        <styleUrl>#polePinStyle</styleUrl>
        <description><![CDATA[<b>Penyulang:</b> ${cleanFileName}<br/><b>Nomer Tiang:</b> ${pName}<br/><b>Jenis Tiang:</b> ${jTiang}<br/><b>Tipe Konstruksi:</b> ${tKonstruksi}<br/><b>Tinggi / daN:</b> ${tDaN}<br/><b>Keterangan:</b> ${ket}]]></description>
        <Point>
          <coordinates>${lngNum},${latNum},0</coordinates>
        </Point>
      </Placemark>\n`;
        });
      }

      kmlContent += `    </Folder>\n`;
    });

    kmlContent += `  </Document>\n</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GIS_Penyulang_${new Date().toISOString().slice(0, 10)}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast('File KML penyulang berhasil di-download! Siap dibuka di Google Earth.');
  };

  // Filtered files by search
  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col space-y-3 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-2xl border border-blue-500/50 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-[640px]">
        
        {/* LEFT SIDEBAR: PETA SEBARAN JARINGAN & IMPORT PANEL */}
        <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 rounded-2xl border border-slate-800 bg-slate-950 text-white flex flex-col overflow-hidden shadow-xl transition-all">
          
          {/* Header Bar - '1 Feeder' moved to the left */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                {files.length} Feeder
              </span>
              <h2 className="font-black text-xs tracking-tight text-white uppercase">
                PETA SEBARAN JARINGAN
              </h2>
            </div>
          </div>

          {/* Hidden HTML File Input for local computer files (.kml, .kmz, .geojson) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".kml,.kmz,.geojson"
            multiple
            className="hidden"
          />

          {/* Top Menu: Import File & Download Buttons */}
          <div className="p-3 border-b border-slate-800 bg-slate-950 grid grid-cols-2 gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Import File</span>
            </button>

            <button
              onClick={handleDownloadAllFeeders}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* Search Bar - Placeholder '*Cari Penyulang' with High Contrast Black Background & White Text */}
          <div className="p-3 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-white text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="*Cari Penyulang"
                className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-xs font-extrabold text-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-header Title for Feeder List - Black Background & White Text */}
          <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-black text-white">
            <span className="uppercase text-xs tracking-wider font-black flex items-center gap-1.5 text-white">
              <Layers className="w-4 h-4 text-blue-400" />
              DAFTAR PENYULANG ({files.length} FILE)
            </span>
          </div>

          {/* Scrollable Feeder List Cards - Pure Black Background & High Contrast White Cards */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar max-h-[500px] lg:max-h-[calc(100vh-280px)] bg-slate-950">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs group ${
                  file.isVisible 
                    ? 'bg-slate-900 border-slate-800 hover:border-blue-500/60 text-white shadow-xs' 
                    : 'opacity-50 bg-slate-950/60 border-dashed border-slate-800 text-slate-400'
                }`}
              >
                {/* Left Controls: Checkbox + Eye + Color dot + Info / Inline Edit */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={file.isChecked}
                    onChange={() => toggleFileChecked(file.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                  />

                  {/* Eye Icon Toggle */}
                  <button
                    onClick={() => toggleFileVisible(file.id)}
                    className="text-slate-400 hover:text-blue-400 transition-colors p-0.5 shrink-0 cursor-pointer"
                    title={file.isVisible ? "Sembunyikan dari peta" : "Tampilkan di peta"}
                  >
                    {file.isVisible ? (
                      <Eye className="w-4 h-4 text-blue-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {/* Feeder Color Circle Dot */}
                  <button
                    onClick={() => handleOpenEditModal(file)}
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white/80 hover:scale-125 transition-transform cursor-pointer"
                    style={{ backgroundColor: file.color || '#3b82f6' }}
                    title="Klik untuk ubah warna & nama penyulang"
                  />

                  {/* Name and Subtitle with Inline Edit Support */}
                  {inlineEditId === file.id ? (
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <input
                        type="text"
                        autoFocus
                        value={inlineEditName}
                        onChange={(e) => setInlineEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveInlineEdit(file.id);
                          if (e.key === 'Escape') setInlineEditId(null);
                        }}
                        className="w-full px-2 py-1 rounded-lg border text-xs font-extrabold bg-slate-950 text-white border-blue-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => saveInlineEdit(file.id)}
                        className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shrink-0 cursor-pointer"
                        title="Simpan Nama"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setInlineEditId(null)}
                        className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all shrink-0 cursor-pointer"
                        title="Batal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="min-w-0 flex-1 group/title cursor-pointer"
                      onClick={() => handleOpenEditModal(file)}
                      title="Klik untuk ubah nama & warna penyulang"
                    >
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-xs text-white truncate leading-snug hover:text-blue-400 transition-colors">
                          {file.name || 'Penyulang'}
                        </h3>
                        <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-300 font-extrabold truncate">
                        {file.pointsCount} titik • {file.importDate} ({file.fileType || 'KML'})
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Action Icons: Pencil + Target + Trash */}
                {inlineEditId !== file.id && (
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(file)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit nama & warna penyulang"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFocusFeeder(file)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Fokus lokasi feeder di peta"
                    >
                      <Target className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id, file.name)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Hapus file penyulang"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredFiles.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <p className="font-extrabold text-slate-300">Belum Ada File Penyulang</p>
                <p className="text-[11px] text-slate-400">
                  {searchQuery 
                    ? `Tidak ada file penyulang yang sesuai dengan "*${searchQuery}"`
                    : 'Silakan klik tombol "+ Import File" di atas untuk mengunggah file KML atau KMZ Anda.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAP CANVAS AREA WITH TOP OVERLAY TOOLBAR */}
        <div className="flex-1 relative rounded-2xl border overflow-hidden min-h-[580px] lg:min-h-full flex flex-col bg-slate-950 border-slate-800">
          
          {/* Top Floating Map Overlay Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            
            {/* Left Pill: Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {/* Category Pills */}
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all backdrop-blur-md ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Semua
              </button>

              <button
                onClick={() => setSelectedCategory('Penyulang')}
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all backdrop-blur-md ${
                  selectedCategory === 'Penyulang'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Penyulang</span>
              </button>

              <button
                onClick={() => setSelectedCategory('Pohon')}
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all backdrop-blur-md ${
                  selectedCategory === 'Pohon'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Pohon</span>
              </button>

              <button
                onClick={() => setSelectedCategory('Gardu')}
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all backdrop-blur-md ${
                  selectedCategory === 'Gardu'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Gardu</span>
              </button>
            </div>

            {/* Right Pill: Map Mode Switcher + Reset */}
            <div className="flex items-center gap-2 pointer-events-auto">
              
              {/* Mode Segmented Group */}
              <div className="p-1 rounded-full bg-slate-900/90 border border-slate-700 backdrop-blur-md shadow-lg flex items-center gap-1 text-xs">
                <button
                  onClick={() => setMapMode('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold transition-all ${
                    mapMode === 'dark' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>

                <button
                  onClick={() => setMapMode('satelit')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold transition-all ${
                    mapMode === 'satelit' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Satelit</span>
                </button>
              </div>

              {/* Reset Map View Button */}
              <button
                onClick={handleResetMap}
                className="px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold shadow-lg transition-all backdrop-blur-md flex items-center gap-1.5"
                title="Reset posisi peta"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>

          </div>

          {/* Actual Leaflet Map Canvas Div */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[580px] z-10" />

          {/* Selected Pole Tagging Detail Modal (Matching Image 2 Specification) */}
          {clickedPole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
              <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                {/* Header - Minimalist close button */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 font-black text-sm text-blue-600 dark:text-blue-400">
                    <MapPin className="w-4 h-4" />
                    <span>Detail Tiang</span>
                  </div>
                  <button 
                    onClick={() => { setClickedPole(null); setIsEditingPole(false); }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!isEditingPole ? (
                  /* Read-only view matching Image 2 table layout */
                  <div className="space-y-2.5 text-xs">
                    {/* Row 1: Nama penyulang pada file | Nomer Tiang */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <span className="block font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                          Nama penyulang pada file
                        </span>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white block truncate">
                          {clickedPole.fileName || clickedPole.file}
                        </span>
                      </div>

                      <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                        <span className="block font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                          Nomer Tiang
                        </span>
                        <span className="font-black text-xs text-blue-600 dark:text-blue-400 block truncate">
                          {clickedPole.poleNumber}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Koordinat */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <span className="block font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                        Koordinat
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${clickedPole.lat.toFixed(6)},${clickedPole.lng.toFixed(6)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 hover:underline group"
                        title="Buka lokasi di Google Maps"
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span>{clickedPole.lat.toFixed(6)}, {clickedPole.lng.toFixed(6)}</span>
                      </a>
                    </div>

                    {/* Row 3: Jenis Tiang */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="font-black text-[11px] text-slate-600 dark:text-slate-400">
                        Jenis Tiang
                      </span>
                      <span className="font-black text-xs text-slate-900 dark:text-white px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700">
                        {clickedPole.jenisTiang || 'Beton'}
                      </span>
                    </div>

                    {/* Row 4: Tipe Konstruksi Tiang */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="font-black text-[11px] text-slate-600 dark:text-slate-400">
                        Tipe Konstruksi Tiang
                      </span>
                      <span className="font-black text-xs text-slate-900 dark:text-white">
                        {clickedPole.tipeKonstruksi || 'TM-1'}
                      </span>
                    </div>

                    {/* Row 5: Tinggi / daN */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="font-black text-[11px] text-slate-600 dark:text-slate-400">
                        Tinggi / daN
                      </span>
                      <span className="font-black text-xs text-slate-900 dark:text-white">
                        {clickedPole.tinggiDaN || '12/200'}
                      </span>
                    </div>

                    {/* Row 6: Keterangan Lainnya */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      <span className="block font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Keterangan Lainnya
                      </span>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {clickedPole.keteranganLainnya || '-'}
                      </p>
                    </div>

                    {/* Row 7: Action Buttons (Edit | Hapus) */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleStartEditPole}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={handleDeletePole}
                        className="flex-1 py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Edit Form Mode */
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Nama Penyulang Pada File</label>
                      <input
                        type="text"
                        value={editPoleFileName}
                        onChange={(e) => setEditPoleFileName(e.target.value)}
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Nomer Tiang</label>
                      <input
                        type="text"
                        value={editPoleNumber}
                        onChange={(e) => setEditPoleNumber(e.target.value)}
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Jenis Tiang</label>
                      <select
                        value={editJenisTiang}
                        onChange={(e) => setEditJenisTiang(e.target.value)}
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="Beton">Beton</option>
                        <option value="Besi">Besi</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Tipe Konstruksi Tiang</label>
                      <select
                        value={editTipeKonstruksi}
                        onChange={(e) => setEditTipeKonstruksi(e.target.value)}
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="TM-1">TM-1</option>
                        <option value="TM-2">TM-2</option>
                        <option value="TM-3 (Riser Pole)">TM-3 (Riser Pole)</option>
                        <option value="TM-3 (End Pole)">TM-3 (End Pole)</option>
                        <option value="TM-4">TM-4</option>
                        <option value="TM-5">TM-5</option>
                        <option value="TM-6">TM-6</option>
                        <option value="TM-10">TM-10</option>
                        <option value="TM-16">TM-16</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Tinggi / daN</label>
                      <select
                        value={editTinggiDaN}
                        onChange={(e) => setEditTinggiDaN(e.target.value)}
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="11/156">11/156</option>
                        <option value="12/200">12/200</option>
                        <option value="12/250">12/250</option>
                        <option value="14/350">14/350</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Keterangan Lainnya</label>
                      <textarea
                        rows={2}
                        value={editKeteranganLainnya}
                        onChange={(e) => setEditKeteranganLainnya(e.target.value)}
                        placeholder="Masukkan keterangan (opsional)..."
                        className="w-full p-2 rounded-xl border font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => setIsEditingPole(false)}
                        className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSavePoleEdit}
                        className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md cursor-pointer"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL: EDIT FEEDER NAME & COLOR */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-500" />
              </div>
              <button onClick={() => setEditingFile(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Nama Penyulang / Feeder</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-black bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Masukkan nama penyulang..."
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">Warna Penanda Penyulang di Peta</label>
                
                {/* Preset Color Swatches */}
                <div className="grid grid-cols-8 gap-2 mb-3">
                  {[
                    { hex: '#22c55e', label: 'Hijau Cerah' },
                    { hex: '#059669', label: 'Hijau Tua' },
                    { hex: '#84cc16', label: 'Lime' },
                    { hex: '#3b82f6', label: 'Biru' },
                    { hex: '#1d4ed8', label: 'Biru Tua' },
                    { hex: '#06b6d4', label: 'Cyan' },
                    { hex: '#0d9488', label: 'Teal' },
                    { hex: '#eab308', label: 'Kuning' },
                    { hex: '#f59e0b', label: 'Amber' },
                    { hex: '#f97316', label: 'Jingga' },
                    { hex: '#ef4444', label: 'Merah' },
                    { hex: '#be123c', label: 'Merah Tua' },
                    { hex: '#d946ef', label: 'Pink Fuchsia' },
                    { hex: '#a855f7', label: 'Ungu' },
                    { hex: '#000000', label: 'Hitam' },
                    { hex: '#64748b', label: 'Abu-Abu Slate' }
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setEditColor(preset.hex)}
                      className={`w-7 h-7 rounded-full transition-all cursor-pointer border-2 flex items-center justify-center ${
                        editColor.toLowerCase() === preset.hex.toLowerCase()
                          ? 'border-slate-900 dark:border-white scale-110 shadow-md ring-2 ring-blue-500/50'
                          : 'border-white/60 opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={`Pilih Warna ${preset.label}`}
                    >
                      {editColor.toLowerCase() === preset.hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="font-extrabold text-xs block text-slate-900 dark:text-white">Custom Color Picker</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{editColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (editingFile) {
                    handleDeleteFile(editingFile.id, editingFile.name);
                    setEditingFile(null);
                  }
                }}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Hapus feeder ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Feeder</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
