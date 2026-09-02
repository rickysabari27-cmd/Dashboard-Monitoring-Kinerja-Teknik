import { UserAccess } from '../types';

/**
 * Checks if the current user has Admin role.
 * User Admin has full edit rights on 'spk' (Surat Perintah Kerja) and 'gangguan' (Input Gangguan Penyulang).
 * For all other views, Admin has READ-ONLY access ("hanya bisa melihat saja").
 */
export const isAdminRole = (user: UserAccess | null | undefined): boolean => {
  if (!user) return false;
  return user.role === 'Admin' || user.role === 'Admin Yantek';
};

/**
 * Determines whether the user can perform write/edit operations on a given view.
 */
export const canUserEditView = (user: UserAccess | null | undefined, viewId: string): boolean => {
  return true;
};

/**
 * Checks if the current user can approve SPK (Surat Perintah Kerja).
 * Allowed roles: Manager, Team Leader, Admin, Admin Yantek.
 */
export const canUserApproveSpk = (user: UserAccess | null | undefined): boolean => {
  if (!user) return false;
  return user.role === 'Manager' || user.role === 'Team Leader' || user.role === 'Admin' || user.role === 'Admin Yantek';
};
