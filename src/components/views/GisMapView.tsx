import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
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
  Square
} from 'lucide-react';

interface GisMapViewProps {
  isDarkMode: boolean;
  feeders?: FeederHealth[];
  trips?: FeederTrip[];
  onOpenInputGangguan?: () => void;
}

// Initial 23 Feeder Files matching user reference image
const DEFAULT_IMPORTED_FILES: ImportedFeederFile[] = [
  {
    id: 'f-1',
    name: 'LATERI 2',
    pointsCount: 198,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.640, 128.220], [-3.642, 128.225], [-3.645, 128.230], [-3.648, 128.235], [-3.652, 128.242]
    ],
    poles: [
      { id: 'lat2-1', poleNumber: 'Tiang #10 LATERI 2', lat: -3.640, lng: 128.220, type: 'Penyulang' },
      { id: 'lat2-2', poleNumber: 'Tiang #25 LATERI 2', lat: -3.642, lng: 128.225, type: 'Pohon', description: 'Pohon Sagu < 1.2m' },
      { id: 'lat2-3', poleNumber: 'Tiang #40 LATERI 2', lat: -3.645, lng: 128.230, type: 'Penyulang' },
      { id: 'lat2-4', poleNumber: 'Tiang #62 LATERI 2', lat: -3.648, lng: 128.235, type: 'Gangguan', description: 'Titik Trip GFR' },
      { id: 'lat2-5', poleNumber: 'Tiang #88 LATERI 2', lat: -3.652, lng: 128.242, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-2',
    name: 'ALLANG',
    pointsCount: 364,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.720, 128.050], [-3.735, 128.080], [-3.750, 128.110], [-3.765, 128.135], [-3.780, 128.150]
    ],
    poles: [
      { id: 'all-1', poleNumber: 'Tiang #01 ALLANG', lat: -3.720, lng: 128.050, type: 'Penyulang' },
      { id: 'all-2', poleNumber: 'Tiang #50 ALLANG', lat: -3.735, lng: 128.080, type: 'Pohon', description: 'Dahan pohon kelapa' },
      { id: 'all-3', poleNumber: 'Tiang #120 ALLANG', lat: -3.750, lng: 128.110, type: 'Penyulang' },
      { id: 'all-4', poleNumber: 'Tiang #210 ALLANG', lat: -3.765, lng: 128.135, type: 'Penyulang' },
      { id: 'all-5', poleNumber: 'Tiang #364 ALLANG', lat: -3.780, lng: 128.150, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-3',
    name: 'Passo',
    pointsCount: 92,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.620, 128.240], [-3.625, 128.248], [-3.630, 128.252], [-3.635, 128.260]
    ],
    poles: [
      { id: 'pas-1', poleNumber: 'Tiang #05 PASSO', lat: -3.620, lng: 128.240, type: 'Penyulang' },
      { id: 'pas-2', poleNumber: 'Tiang #30 PASSO', lat: -3.625, lng: 128.248, type: 'Pohon', description: 'Pohon mangga dekat SUTM' },
      { id: 'pas-3', poleNumber: 'Tiang #60 PASSO', lat: -3.630, lng: 128.252, type: 'Penyulang' },
      { id: 'pas-4', poleNumber: 'Tiang #92 PASSO', lat: -3.635, lng: 128.260, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-4',
    name: 'Waiheru 1 & Waiheru 3',
    pointsCount: 391,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.610, 128.200], [-3.615, 128.208], [-3.620, 128.215], [-3.625, 128.220], [-3.630, 128.225]
    ],
    poles: [
      { id: 'wai-1', poleNumber: 'Tiang #12 WAIHERU', lat: -3.610, lng: 128.200, type: 'Penyulang' },
      { id: 'wai-2', poleNumber: 'Tiang #80 WAIHERU', lat: -3.615, lng: 128.208, type: 'Pohon' },
      { id: 'wai-3', poleNumber: 'Tiang #150 WAIHERU', lat: -3.620, lng: 128.215, type: 'Penyulang' },
      { id: 'wai-4', poleNumber: 'Tiang #280 WAIHERU', lat: -3.625, lng: 128.220, type: 'Gangguan', description: 'Overcurrent fault' },
      { id: 'wai-5', poleNumber: 'Tiang #391 WAIHERU', lat: -3.630, lng: 128.225, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-5',
    name: 'Hutumuri',
    pointsCount: 296,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.670, 128.270], [-3.680, 128.280], [-3.690, 128.292], [-3.700, 128.300], [-3.710, 128.310]
    ],
    poles: [
      { id: 'hut-1', poleNumber: 'Tiang #15 HUTUMURI', lat: -3.670, lng: 128.270, type: 'Penyulang' },
      { id: 'hut-2', poleNumber: 'Tiang #90 HUTUMURI', lat: -3.680, lng: 128.280, type: 'Pohon', description: 'Bambu rawan roboh' },
      { id: 'hut-3', poleNumber: 'Tiang #180 HUTUMURI', lat: -3.690, lng: 128.292, type: 'Penyulang' },
      { id: 'hut-4', poleNumber: 'Tiang #296 HUTUMURI', lat: -3.710, lng: 128.310, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-6',
    name: 'Wayame 1',
    pointsCount: 327,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.650, 128.180], [-3.655, 128.190], [-3.660, 128.200], [-3.665, 128.210]
    ],
    poles: [
      { id: 'way-1', poleNumber: 'Tiang #08 WAYAME', lat: -3.650, lng: 128.180, type: 'Penyulang' },
      { id: 'way-2', poleNumber: 'Tiang #110 WAYAME', lat: -3.655, lng: 128.190, type: 'Pohon' },
      { id: 'way-3', poleNumber: 'Tiang #210 WAYAME', lat: -3.660, lng: 128.200, type: 'Penyulang' },
      { id: 'way-4', poleNumber: 'Tiang #327 WAYAME', lat: -3.665, lng: 128.210, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-7',
    name: 'Poka',
    pointsCount: 215,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.640, 128.190], [-3.645, 128.195], [-3.650, 128.200], [-3.655, 128.205]
    ],
    poles: [
      { id: 'pok-1', poleNumber: 'Tiang #04 POKA', lat: -3.640, lng: 128.190, type: 'Penyulang' },
      { id: 'pok-2', poleNumber: 'Tiang #95 POKA', lat: -3.645, lng: 128.195, type: 'Pohon' },
      { id: 'pok-3', poleNumber: 'Tiang #160 POKA', lat: -3.650, lng: 128.200, type: 'Penyulang' },
      { id: 'pok-4', poleNumber: 'Tiang #215 POKA', lat: -3.655, lng: 128.205, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-8',
    name: 'Tulehu',
    pointsCount: 410,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.580, 128.300], [-3.585, 128.312], [-3.590, 128.325], [-3.595, 128.332], [-3.600, 128.340]
    ],
    poles: [
      { id: 'tul-1', poleNumber: 'Tiang #10 TULEHU', lat: -3.580, lng: 128.300, type: 'Penyulang' },
      { id: 'tul-2', poleNumber: 'Tiang #140 TULEHU', lat: -3.585, lng: 128.312, type: 'Pohon', description: 'Ranting sukun sentuh SUTM' },
      { id: 'tul-3', poleNumber: 'Tiang #250 TULEHU', lat: -3.590, lng: 128.325, type: 'Gangguan', description: 'Arrester bocor' },
      { id: 'tul-4', poleNumber: 'Tiang #410 TULEHU', lat: -3.600, lng: 128.340, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-9',
    name: 'Liang',
    pointsCount: 310,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.520, 128.330], [-3.530, 128.340], [-3.540, 128.350], [-3.550, 128.360]
    ],
    poles: [
      { id: 'lia-1', poleNumber: 'Tiang #01 LIANG', lat: -3.520, lng: 128.330, type: 'Penyulang' },
      { id: 'lia-2', poleNumber: 'Tiang #100 LIANG', lat: -3.530, lng: 128.340, type: 'Pohon' },
      { id: 'lia-3', poleNumber: 'Tiang #310 LIANG', lat: -3.550, lng: 128.360, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-10',
    name: 'Suli',
    pointsCount: 185,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [
      [-3.610, 128.280], [-3.618, 128.290], [-3.625, 128.300], [-3.630, 128.310]
    ],
    poles: [
      { id: 'sul-1', poleNumber: 'Tiang #05 SULI', lat: -3.610, lng: 128.280, type: 'Penyulang' },
      { id: 'sul-2', poleNumber: 'Tiang #80 SULI', lat: -3.618, lng: 128.290, type: 'Pohon' },
      { id: 'sul-3', poleNumber: 'Tiang #185 SULI', lat: -3.630, lng: 128.310, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-11',
    name: 'Lateri 1',
    pointsCount: 210,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.635, 128.215], [-3.640, 128.225], [-3.645, 128.232]],
    poles: [
      { id: 'lat1-1', poleNumber: 'Tiang #02 LATERI 1', lat: -3.635, lng: 128.215, type: 'Penyulang' },
      { id: 'lat1-2', poleNumber: 'Tiang #120 LATERI 1', lat: -3.640, lng: 128.225, type: 'Pohon' },
    ]
  },
  {
    id: 'f-12',
    name: 'Lateri 3',
    pointsCount: 175,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.642, 128.235], [-3.648, 128.242], [-3.655, 128.250]],
    poles: [
      { id: 'lat3-1', poleNumber: 'Tiang #04 LATERI 3', lat: -3.642, lng: 128.235, type: 'Penyulang' },
      { id: 'lat3-2', poleNumber: 'Tiang #90 LATERI 3', lat: -3.648, lng: 128.242, type: 'Pohon' },
    ]
  },
  {
    id: 'f-13',
    name: 'Passo Kota',
    pointsCount: 140,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.628, 128.245], [-3.632, 128.250], [-3.638, 128.255]],
    poles: [
      { id: 'pask-1', poleNumber: 'Tiang #10 PASSO KOTA', lat: -3.628, lng: 128.245, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-14',
    name: 'Halong',
    pointsCount: 260,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.655, 128.210], [-3.660, 128.218], [-3.665, 128.225]],
    poles: [
      { id: 'hal-1', poleNumber: 'Tiang #15 HALONG', lat: -3.655, lng: 128.210, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-15',
    name: 'Laha',
    pointsCount: 380,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.700, 128.080], [-3.708, 128.095], [-3.715, 128.110]],
    poles: [
      { id: 'lah-1', poleNumber: 'Tiang #01 LAHA', lat: -3.700, lng: 128.080, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-16',
    name: 'Tawiri',
    pointsCount: 205,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.690, 128.100], [-3.695, 128.110], [-3.700, 128.120]],
    poles: [
      { id: 'taw-1', poleNumber: 'Tiang #05 TAWIRI', lat: -3.690, lng: 128.100, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-17',
    name: 'Hitu',
    pointsCount: 290,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.560, 128.180], [-3.550, 128.190], [-3.540, 128.200]],
    poles: [
      { id: 'hit-1', poleNumber: 'Tiang #02 HITU', lat: -3.560, lng: 128.180, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-18',
    name: 'Mamala',
    pointsCount: 195,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.540, 128.210], [-3.535, 128.220], [-3.530, 128.230]],
    poles: [
      { id: 'mam-1', poleNumber: 'Tiang #10 MAMALA', lat: -3.540, lng: 128.210, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-19',
    name: 'Morela',
    pointsCount: 220,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.530, 128.230], [-3.525, 128.240], [-3.520, 128.250]],
    poles: [
      { id: 'mor-1', poleNumber: 'Tiang #12 MORELA', lat: -3.530, lng: 128.230, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-20',
    name: 'Waai',
    pointsCount: 275,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.560, 128.320], [-3.565, 128.330], [-3.570, 128.340]],
    poles: [
      { id: 'waa-1', poleNumber: 'Tiang #08 WAAI', lat: -3.560, lng: 128.320, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-21',
    name: 'Telaga Kodok',
    pointsCount: 165,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.600, 128.190], [-3.605, 128.198], [-3.610, 128.205]],
    poles: [
      { id: 'tk-1', poleNumber: 'Tiang #05 TELAGA KODOK', lat: -3.600, lng: 128.190, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-22',
    name: 'Nania',
    pointsCount: 190,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.615, 128.230], [-3.620, 128.238], [-3.625, 128.245]],
    poles: [
      { id: 'nan-1', poleNumber: 'Tiang #01 NANIA', lat: -3.615, lng: 128.230, type: 'Penyulang' },
    ]
  },
  {
    id: 'f-23',
    name: 'Rumahtiga',
    pointsCount: 230,
    importDate: '10/8/2026',
    color: '#3b82f6',
    isVisible: true,
    isChecked: true,
    fileType: 'KML',
    pathCoords: [[-3.645, 128.185], [-3.650, 128.192], [-3.655, 128.200]],
    poles: [
      { id: 'rum-1', poleNumber: 'Tiang #10 RUMAHTIGA', lat: -3.645, lng: 128.185, type: 'Penyulang' },
    ]
  }
];

export const GisMapView: React.FC<GisMapViewProps> = ({
  isDarkMode,
  feeders = [],
  trips = [],
  onOpenInputGangguan
}) => {
  // State for imported feeder files
  const [files, setFiles] = useState<ImportedFeederFile[]>(DEFAULT_IMPORTED_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'dark' | 'satelit' | 'street'>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [clickedPole, setClickedPole] = useState<any>(null);

  // Edit file modal state
  const [editingFile, setEditingFile] = useState<ImportedFeederFile | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#3b82f6');

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [importFileType, setImportFileType] = useState<'KML' | 'KMZ' | 'GeoJSON'>('KML');

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
      } else if (mapMode === 'street') {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
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

  // Render Polylines and Pole Markers on Map whenever files or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const fg = featureGroupRef.current;
    if (!map || !fg) return;

    fg.clearLayers();

    files.forEach((file) => {
      if (!file.isVisible || !file.isChecked) return;

      // Draw Polyline for Feeder Line
      if (file.pathCoords && file.pathCoords.length > 1) {
        const polyline = L.polyline(file.pathCoords, {
          color: file.color || '#3b82f6',
          weight: 4,
          opacity: 0.85,
          smoothFactor: 1
        });
        polyline.addTo(fg);
      }

      // Draw Poles (Titik Tiang)
      file.poles.forEach((pole) => {
        if (selectedCategory !== 'ALL' && pole.type !== selectedCategory) return;

        let fillColor = '#3b82f6'; // Penyulang (Blue)
        let strokeColor = '#ffffff';
        let radius = 6;

        if (pole.type === 'Pohon') {
          fillColor = '#22c55e'; // Green
        } else if (pole.type === 'Gardu') {
          fillColor = '#a855f7'; // Purple
        } else if (pole.type === 'Gangguan') {
          fillColor = '#ef4444'; // Red
          radius = 8;
        }

        const marker = L.circleMarker([pole.lat, pole.lng], {
          radius,
          fillColor,
          color: strokeColor,
          weight: 2,
          fillOpacity: 0.95
        });

        // Popup Content
        const popupHtml = `
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px; color: #0f172a;">
            <div style="font-weight: 800; font-size: 13px; color: #1e3a8a; margin-bottom: 2px;">
              📍 ${pole.poleNumber}
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              Feeder: <strong>${file.name}</strong> • ${pole.type}
            </div>
            ${pole.description ? `<div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px; font-size: 11px; margin-bottom: 6px;">${pole.description}</div>` : ''}
            <div style="font-size: 10px; color: #94a3b8;">
              Koordinat: ${pole.lat.toFixed(4)}, ${pole.lng.toFixed(4)}
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          setClickedPole({
            file: file.name,
            ...pole
          });
        });

        marker.addTo(fg);
      });
    });
  }, [files, mapMode, selectedCategory]);

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
    if (window.confirm(`Hapus file feeder "${name}" dari GIS import?`)) {
      setFiles(files.filter(f => f.id !== id));
      triggerToast(`File feeder "${name}" berhasil dihapus.`);
    }
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

  // Import New KML File Handler
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFileName.trim()) return;

    const newId = `f-${Date.now()}`;
    const generatedPoints = Math.floor(Math.random() * 250 + 100);
    const baseLat = -3.630 - (files.length * 0.008);
    const baseLng = 128.220 + (files.length * 0.010);

    const newFeeder: ImportedFeederFile = {
      id: newId,
      name: importFileName.trim(),
      pointsCount: generatedPoints,
      importDate: new Date().toLocaleDateString('id-ID'),
      color: '#3b82f6',
      isVisible: true,
      isChecked: true,
      fileType: importFileType,
      pathCoords: [
        [baseLat, baseLng],
        [baseLat - 0.005, baseLng + 0.012],
        [baseLat - 0.012, baseLng + 0.020]
      ],
      poles: [
        { id: `${newId}-1`, poleNumber: `Tiang #01 ${importFileName}`, lat: baseLat, lng: baseLng, type: 'Penyulang' },
        { id: `${newId}-2`, poleNumber: `Tiang #45 ${importFileName}`, lat: baseLat - 0.005, lng: baseLng + 0.012, type: 'Pohon', description: 'Potensi ROW Ranting' },
        { id: `${newId}-3`, poleNumber: `Tiang #${generatedPoints} ${importFileName}`, lat: baseLat - 0.012, lng: baseLng + 0.020, type: 'Penyulang' }
      ]
    };

    setFiles([newFeeder, ...files]);
    setIsImportModalOpen(false);
    setImportFileName('');
    triggerToast(`File KML/KMZ "${importFileName}" (245 titik) berhasil diimpor!`);

    setTimeout(() => {
      handleFocusFeeder(newFeeder);
    }, 200);
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
        <div className={`w-full lg:w-[360px] xl:w-[380px] shrink-0 rounded-2xl border flex flex-col overflow-hidden shadow-sm transition-all ${
          isDarkMode ? 'bg-slate-900/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {/* Header Bar */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white uppercase">
                PETA SEBARAN JARINGAN
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {files.length} Feeder
              </span>
            </div>
          </div>

          {/* Top Import Quick Buttons */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Impor</span>
            </button>
            <button
              onClick={() => { setImportFileType('KML'); setIsImportModalOpen(true); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>.KML</span>
            </button>
            <button
              onClick={() => { setImportFileType('KMZ'); setIsImportModalOpen(true); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-500" />
              <span>.KMZ</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari file feeder import..."
                className="w-full bg-transparent focus:outline-none placeholder:text-slate-400 text-xs font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sub-header Title for Feeder List */}
          <div className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="uppercase text-[10px] tracking-wider font-extrabold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              PETA FEEDER IMPORT ({files.length} FILE)
            </span>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-bold"
            >
              + Impor KML/KMZ
            </button>
          </div>

          {/* Scrollable Feeder List Cards */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar max-h-[500px] lg:max-h-[calc(100vh-280px)]">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs group ${
                  file.isVisible 
                    ? isDarkMode 
                      ? 'bg-slate-800/80 border-slate-700/80 hover:border-blue-500/50' 
                      : 'bg-white border-slate-200 hover:border-blue-400 shadow-2xs'
                    : 'opacity-50 bg-slate-100/50 dark:bg-slate-950/30 border-dashed border-slate-300 dark:border-slate-800'
                }`}
              >
                {/* Left Controls: Checkbox + Eye + Color dot + Info */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={file.isChecked}
                    onChange={() => toggleFileChecked(file.id)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />

                  {/* Eye Icon Toggle */}
                  <button
                    onClick={() => toggleFileVisible(file.id)}
                    className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    title={file.isVisible ? "Sembunyikan dari peta" : "Tampilkan di peta"}
                  >
                    {file.isVisible ? (
                      <Eye className="w-4 h-4 text-blue-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {/* Feeder Color Circle Dot */}
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs border border-white/50"
                    style={{ backgroundColor: file.color || '#3b82f6' }}
                  />

                  {/* Name and Subtitle */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white truncate leading-snug">
                      {file.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {file.pointsCount} titik • {file.importDate}
                    </p>
                  </div>
                </div>

                {/* Right Action Icons: Pencil + Target + Trash */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(file)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Edit nama / warna feeder"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFocusFeeder(file)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Fokus lokasi feeder di peta"
                  >
                    <Target className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.id, file.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    title="Hapus file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredFiles.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada file feeder yang sesuai dengan pencarian.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAP CANVAS AREA WITH TOP OVERLAY TOOLBAR */}
        <div className="flex-1 relative rounded-2xl border overflow-hidden min-h-[580px] lg:min-h-full flex flex-col bg-slate-950 border-slate-800">
          
          {/* Top Floating Map Overlay Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            
            {/* Left Pill: Click Pole Instruction + Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
              {/* Click Pole Badge */}
              <div className="px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Klik Tiang di Peta:</span>
              </div>

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

                <button
                  onClick={() => setMapMode('street')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold transition-all ${
                    mapMode === 'street' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Street Map</span>
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

          {/* Selected Pole Detail Floating Drawer */}
          {clickedPole && (
            <div className="absolute bottom-4 left-4 z-30 max-w-sm p-4 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-sm text-blue-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {clickedPole.poleNumber}
                </span>
                <button onClick={() => setClickedPole(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>Feeder: <strong className="text-white">{clickedPole.file}</strong></div>
                <div>Kategori: <strong className="text-emerald-400">{clickedPole.type}</strong></div>
              </div>
              {clickedPole.description && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  ⚠️ {clickedPole.description}
                </div>
              )}
              <div className="pt-2 flex items-center gap-2">
                <button 
                  onClick={onOpenInputGangguan}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-center text-[11px]"
                >
                  Lapor Gangguan
                </button>
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
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-500" />
                Edit Data Feeder Import
              </h3>
              <button onClick={() => setEditingFile(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Nama Feeder / File</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border font-extrabold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Warna Garis Feeder di Peta</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <span className="font-mono text-xs text-slate-400">{editColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setEditingFile(null)}
                className="px-4 py-2 rounded-xl border font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT KML / KMZ FILE */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`w-full max-w-lg p-5 rounded-2xl border shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Impor File Peta Feeder (KML/KMZ)</h3>
                  <p className="text-[11px] text-slate-400">Tambahkan sebaran koordinat tiang & SUTM ke GIS</p>
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              
              {/* Drag & Drop Simulation Zone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 text-center space-y-2">
                <FileText className="w-8 h-8 text-blue-500 mx-auto" />
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Tarik & Lepas File .KML, .KMZ, atau .GeoJSON ke sini
                </div>
                <p className="text-[11px] text-slate-400">Atau ketik nama feeder di bawah untuk mengimpor data spasial</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-500 block mb-1">Nama Feeder / Penyulang</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PASSO 2 atau NATSEPA"
                    value={importFileName}
                    onChange={(e) => setImportFileName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Format File</label>
                  <select
                    value={importFileType}
                    onChange={(e) => setImportFileType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border font-bold bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="KML">.KML</option>
                    <option value="KMZ">.KMZ</option>
                    <option value="GeoJSON">.GeoJSON</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Mulai Impor File</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
