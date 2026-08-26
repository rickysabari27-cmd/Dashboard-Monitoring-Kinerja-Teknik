import { getAccessToken } from './googleAuth';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  parents?: string[];
  shared?: boolean;
  trashed?: boolean;
  owners?: Array<{
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }>;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveAboutInfo {
  user?: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota?: DriveStorageQuota;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

// Helper to get authenticated headers
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum terhubung atau token kadaluarsa. Silakan Login dengan Google.');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Fetch user profile and storage quota from Google Drive API
export async function getDriveAbout(): Promise<DriveAboutInfo> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink),storageQuota`, {
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil info Drive (${res.status})`);
  }

  return await res.json();
}

// List files and folders with query, folder navigation, and pagination
export async function listDriveFiles(options: {
  folderId?: string;
  searchQuery?: string;
  mimeTypeFilter?: string;
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
  includeTrash?: boolean;
} = {}): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  const headers = await getAuthHeaders();
  const {
    folderId = 'root',
    searchQuery = '',
    mimeTypeFilter = '',
    pageSize = 30,
    pageToken = '',
    orderBy = 'folder,modifiedTime desc',
    includeTrash = false,
  } = options;

  const queryParts: string[] = [];

  if (!includeTrash) {
    queryParts.push('trashed = false');
  }

  if (folderId && !searchQuery) {
    queryParts.push(`'${folderId}' in parents`);
  }

  if (searchQuery) {
    // Sanitize query
    const cleanQuery = searchQuery.replace(/'/g, "\\'");
    queryParts.push(`name contains '${cleanQuery}'`);
  }

  if (mimeTypeFilter) {
    if (mimeTypeFilter === 'folder') {
      queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
    } else if (mimeTypeFilter === 'document') {
      queryParts.push("(mimeType contains 'document' or mimeType contains 'sheet' or mimeType contains 'presentation' or mimeType = 'application/pdf')");
    } else if (mimeTypeFilter === 'image') {
      queryParts.push("mimeType contains 'image/'");
    } else if (mimeTypeFilter === 'gis') {
      queryParts.push("(name contains '.kml' or name contains '.kmz' or name contains '.geojson' or mimeType contains 'xml' or mimeType contains 'json')");
    }
  }

  const q = queryParts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink, parents, owners, shared, trashed)';

  const params = new URLSearchParams({
    q,
    fields,
    pageSize: String(pageSize),
    orderBy,
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const res = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil daftar file Drive (${res.status})`);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
}

// Create a new folder in Google Drive
export async function createDriveFolder(name: string, parentFolderId: string = 'root'): Promise<DriveFile> {
  const headers = await getAuthHeaders();
  const body = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : ['root'],
  };

  const res = await fetch(`${DRIVE_API_BASE}/files?supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal membuat folder di Drive (${res.status})`);
  }

  return await res.json();
}

// Upload a file (Blob or File) using multipart/related upload to Google Drive
export async function uploadFileToDrive(
  file: File | Blob,
  fileName: string,
  mimeType: string,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Sesi Google Drive belum terhubung. Silakan Login dengan Google.');
  }

  const metadata = {
    name: fileName,
    mimeType: mimeType || (file as File).type || 'application/octet-stream',
    parents: parentFolderId ? [parentFolderId] : ['root'],
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Read file as ArrayBuffer or text
  const fileArrayBuffer = await file.arrayBuffer();

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaHeader = `--${boundary}\r\nContent-Type: ${metadata.mimeType}\r\n\r\n`;

  const encoder = new TextEncoder();
  const metadataBuffer = encoder.encode(metadataPart);
  const mediaHeaderBuffer = encoder.encode(mediaHeader);
  const closeBuffer = encoder.encode(closeDelimiter);

  // Combine into a single binary payload
  const fullPayload = new Uint8Array(
    metadataBuffer.byteLength + mediaHeaderBuffer.byteLength + fileArrayBuffer.byteLength + closeBuffer.byteLength
  );

  let offset = 0;
  fullPayload.set(metadataBuffer, offset);
  offset += metadataBuffer.byteLength;
  fullPayload.set(mediaHeaderBuffer, offset);
  offset += mediaHeaderBuffer.byteLength;
  fullPayload.set(new Uint8Array(fileArrayBuffer), offset);
  offset += fileArrayBuffer.byteLength;
  fullPayload.set(closeBuffer, offset);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,iconLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: fullPayload,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengunggah file ke Drive (${res.status})`);
  }

  return await res.json();
}

// Export arbitrary application JSON or text data directly to a Drive file
export async function exportJsonToDrive(
  data: any,
  fileName: string,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return await uploadFileToDrive(blob, fileName, 'application/json', parentFolderId);
}

// Export CSV data directly to a Drive file
export async function exportCsvToDrive(
  csvContent: string,
  fileName: string,
  parentFolderId: string = 'root'
): Promise<DriveFile> {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return await uploadFileToDrive(blob, fileName, 'text/csv', parentFolderId);
}

// Download / Read text content of a Drive file (e.g. for KML, GeoJSON, or JSON backup)
export async function fetchDriveFileText(fileId: string): Promise<string> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengunduh file dari Drive (${res.status})`);
  }

  return await res.text();
}

// Delete / Trash a Drive file (MUST be preceded by UI user confirmation as mandated in workspace integration guidelines)
export async function deleteDriveFile(fileId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?supportsAllDrives=true`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal menghapus file dari Drive (${res.status})`);
  }
}
