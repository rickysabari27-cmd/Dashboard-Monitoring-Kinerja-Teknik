import React, { useState } from 'react';
import { UserAccess } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Key, 
  User, 
  Mail, 
  Building2, 
  Lock, 
  Plus, 
  X, 
  RefreshCw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface UserManagementViewProps {
  isDarkMode: boolean;
  users: UserAccess[];
  onSaveUser: (user: UserAccess) => void;
  onDeleteUser?: (userId: string) => void;
  currentUser: UserAccess | null;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  isDarkMode,
  users,
  onSaveUser,
  onDeleteUser,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add/Edit User Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccess | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccess | null>(null);

  // Form Fields
  const [nik, setNik] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserAccess['role']>('Team Leader');
  const [unitName, setUnitName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');
  const [passwordError, setPasswordError] = useState<string>('');

  const openAddUserModal = () => {
    setEditingUser(null);
    setNik('');
    setName('');
    setRole('Petugas Yantek');
    setUnitName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setStatus('Aktif');
    setPasswordError('');
    setIsModalOpen(true);
  };

  const openEditUserModal = (u: UserAccess) => {
    setEditingUser(u);
    setNik(u.nik);
    setName(u.name);
    setRole(u.role);
    setUnitName(u.unitName);
    setEmail(u.email);
    setPhone(u.phone || '');
    setPassword('');
    setStatus(u.status);
    setPasswordError('');
    setIsModalOpen(true);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!editingUser && password.length < 6) {
      setPasswordError('Gagal membuat user: Password minimal 6 karakter!');
      return;
    }

    if (editingUser && password.length > 0 && password.length < 6) {
      setPasswordError('Gagal memperbarui user: Password minimal 6 karakter!');
      return;
    }

    const newUser: UserAccess = {
      id: editingUser ? editingUser.id : `USR-${Date.now()}`,
      nik,
      name,
      role,
      unitName,
      email: email || `${nik.toLowerCase()}@gmail.co.id`,
      phone,
      status,
      lastActive: editingUser ? editingUser.lastActive : 'Baru Saja'
    };
    onSaveUser(newUser);
    setIsModalOpen(false);
  };

  const handleDeleteUserClick = (u: UserAccess) => {
    setUserToDelete(u);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.unitName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.filter(u => u.status === 'Aktif').length || users.length;
  const activeUsers = users.filter(u => u.status === 'Aktif').length || users.length;
  const supervisorCount = users.filter(u => u.role === 'Manager' || u.role === 'Team Leader' || u.role === 'Admin Yantek' || u.role === 'Admin').length;
  const yantekCount = users.filter(u => u.role === 'Petugas Yantek').length;

  const getRoleBadgeStyle = (r: UserAccess['role']) => {
    switch (r) {
      case 'Manager':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Team Leader':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Admin Yantek':
        return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
      case 'Admin':
        return 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20';
      case 'Petugas Yantek':
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                Kelola User & Hak Akses Akun PLN ULP Baguala
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                Akses Terpusat
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manajemen akun pegawai, petugas Yantek, pendaftaran NIP / ID Petugas, jabatan, dan izin akses fitur sistem
            </p>
          </div>
        </div>

        <button 
          onClick={openAddUserModal}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah User Baru</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs font-bold text-slate-400 mb-1">Total Pengguna Terdaftar</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <span>{totalUsers}</span>
            <span className="text-xs text-slate-400 font-normal">Akun</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Pegawai & Tenaga Alih Daya ULP</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs font-bold text-slate-400 mb-1">Pengguna Aktif (Online)</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>{activeUsers}</span>
            <span className="text-xs text-slate-400 font-normal">Aktif</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dapat mengakses sistem penuh</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs font-bold text-slate-400 mb-1">Structural & Admin</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <span>{supervisorCount}</span>
            <span className="text-xs text-slate-400 font-normal">Personel</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Manager, Team Leader & Admin</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs font-bold text-slate-400 mb-1">Petugas Lapangan Yantek</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
            <span>{yantekCount}</span>
            <span className="text-xs text-slate-400 font-normal">Tim</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Posko ULP Baguala</p>
        </div>

      </div>

      {/* FILTER & SEARCH BAR */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan User, Nama, Unit..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Filter Role */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`p-2 rounded-xl text-xs font-bold border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="ALL">Semua Jabatan</option>
              <option value="Manager">Manager</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Admin Yantek">Admin Yantek</option>
              <option value="Petugas Yantek">Petugas Yantek</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

        </div>

      </div>

      {/* USER LIST TABLE */}
      <div className={`p-5 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
      }`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            } uppercase font-bold text-[10px] tracking-wider`}>
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Jabatan</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Email</th>
                <th className="p-3">Nomor HP</th>
                <th className="p-3">Terakhir Aktif</th>
                <th className="p-3 text-center">Aksi Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    Tidak ditemukan data pengguna yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const isCurrent = currentUser?.nik === u.nik;

                  return (
                    <tr key={`${u.id || u.nik || 'user'}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      
                      {/* Name & NIK */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              <span>{u.name}</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-400">
                              {u.nik}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getRoleBadgeStyle(u.role)}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Unit Name */}
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        {u.unitName}
                      </td>

                      {/* Email */}
                      <td className="p-3 text-slate-500 dark:text-slate-400 font-medium">
                        {u.email}
                      </td>

                      {/* Nomor HP */}
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                        {u.phone || '-'}
                      </td>

                      {/* Last Active */}
                      <td className="p-3 text-slate-400 text-[11px]">
                        {u.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditUserModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Data User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUserClick(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Hapus Akun User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-blue-600 dark:text-cyan-400">
                    Input Data User
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Input Data
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitUser} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    NIP / ID Petugas
                  </label>
                  <input 
                    type="text"
                    required
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Contoh: 9218042PLN"
                    className={`w-full p-2.5 rounded-xl border font-extrabold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Jabatan
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserAccess['role'])}
                    className={`w-full p-2.5 rounded-xl border font-extrabold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Manager">Manager</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Admin Yantek">Admin Yantek</option>
                    <option value="Petugas Yantek">Petugas Yantek</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Nama
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: M. Ricky Sabary"
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <input 
                    type="text"
                    required
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="Contoh: Passo"
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    No. Hp
                  </label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: user@gmail.co.id"
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="Min 6 karakter"
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    passwordError 
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-200'
                      : isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                {passwordError && (
                  <p className="mt-1 text-xs font-bold text-rose-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Akun User</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden p-6 transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Apakah anda yakin menghapus user
              </h3>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 w-full text-xs text-slate-600 dark:text-slate-300 font-medium">
                <p className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{userToDelete.name}</p>
                <p>NIP / ID Petugas: {userToDelete.nik} | Jabatan: {userToDelete.role}</p>
                <p className="text-slate-400 text-[11px] mt-1">Tindakan ini tidak dapat dibatalkan.</p>
              </div>

              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteUser) {
                      onDeleteUser(userToDelete.id);
                    }
                    setUserToDelete(null);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Ya</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
