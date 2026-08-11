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
  Sparkles
} from 'lucide-react';

interface UserManagementViewProps {
  isDarkMode: boolean;
  users: UserAccess[];
  onSaveUser: (user: UserAccess) => void;
  currentUser: UserAccess | null;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  isDarkMode,
  users,
  onSaveUser,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add/Edit User Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccess | null>(null);

  // Form Fields
  const [nik, setNik] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<UserAccess['role']>('Supervisor Teknik');
  const [unitName, setUnitName] = useState<string>('PLN ULP Baguala');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('pln12345');
  const [status, setStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  const openAddUserModal = () => {
    setEditingUser(null);
    setNik(`99${Math.floor(10000 + Math.random() * 90000)}PLN`);
    setName('');
    setRole('Petugas Yantek');
    setUnitName('PLN ULP Baguala');
    setEmail('');
    setPassword('pln12345');
    setStatus('Aktif');
    setIsModalOpen(true);
  };

  const openEditUserModal = (u: UserAccess) => {
    setEditingUser(u);
    setNik(u.nik);
    setName(u.name);
    setRole(u.role);
    setUnitName(u.unitName);
    setEmail(u.email);
    setPassword('******');
    setStatus(u.status);
    setIsModalOpen(true);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccess = {
      id: editingUser ? editingUser.id : `USR-${Date.now()}`,
      nik,
      name,
      role,
      unitName,
      email: email || `${nik.toLowerCase()}@pln.co.id`,
      status,
      lastActive: editingUser ? editingUser.lastActive : 'Baru Saja'
    };
    onSaveUser(newUser);
    setIsModalOpen(false);
  };

  const toggleUserStatus = (u: UserAccess) => {
    const updated: UserAccess = {
      ...u,
      status: u.status === 'Aktif' ? 'Non-Aktif' : 'Aktif',
      lastActive: 'Diperbarui'
    };
    onSaveUser(updated);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.unitName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Aktif').length;
  const supervisorCount = users.filter(u => u.role === 'Supervisor Teknik' || u.role === 'Team Leader').length;
  const yantekCount = users.filter(u => u.role === 'Petugas Yantek').length;

  const getRoleBadgeStyle = (r: UserAccess['role']) => {
    switch (r) {
      case 'Team Leader':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Supervisor Teknik':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Admin':
        return 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20';
      case 'Operator SCADA':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
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
              Manajemen akun pegawai, petugas Yantek, pendaftaran NIK, role jabatan, dan izin akses fitur sistem
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
          <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
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
          <div className="text-xs font-bold text-slate-400 mb-1">Structural & Supervisor</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <span>{supervisorCount}</span>
            <span className="text-xs text-slate-400 font-normal">Personel</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Team Leader & Spv Teknik</p>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-xs font-bold text-slate-400 mb-1">Petugas Lapangan Yantek</div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
            <span>{yantekCount}</span>
            <span className="text-xs text-slate-400 font-normal">Tim</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Posko Passo, Tulehu & Liang</p>
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
            placeholder="Cari berdasarkan NIK, Nama, Email, atau Unit..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Filter Role & Status */}
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
              <option value="ALL">Semua Role / Jabatan</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Supervisor Teknik">Supervisor Teknik</option>
              <option value="Petugas Yantek">Petugas Yantek</option>
              <option value="Operator SCADA">Operator SCADA</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`p-2 rounded-xl text-xs font-bold border ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="ALL">Semua Status</option>
              <option value="Aktif">Status Aktif</option>
              <option value="Non-Aktif">Status Non-Aktif</option>
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
                <th className="p-3">User & NIK</th>
                <th className="p-3">Role / Jabatan</th>
                <th className="p-3">Unit / Posko Kerja</th>
                <th className="p-3">Email Kontak</th>
                <th className="p-3">Status Akun</th>
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
                filteredUsers.map((u) => {
                  const isCurrent = currentUser?.nik === u.nik;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      
                      {/* Name & NIK */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-400/30">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400">
                              NIK: {u.nik}
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

                      {/* Status */}
                      <td className="p-3">
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                            u.status === 'Aktif'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                          title="Klik untuk mengubah status aktif/non-aktif"
                        >
                          {u.status === 'Aktif' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-500" />
                              <span>Non-Aktif</span>
                            </>
                          )}
                        </button>
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Data User"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Toggle Status Akun"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
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
                    {editingUser ? 'Edit Data User PLN' : 'Tambah User & Akses Baru'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Input rincian NIK, nama, role jabatan, dan email personel
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
                    NIK PLN / ID Petugas
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
                    Status Akun
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Non-Aktif')}
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Nama Lengkap Pegawai / Petugas
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
                    Role / Jabatan
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserAccess['role'])}
                    className={`w-full p-2.5 rounded-xl border font-extrabold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="Team Leader">Team Leader</option>
                    <option value="Supervisor Teknik">Supervisor Teknik</option>
                    <option value="Petugas Yantek">Petugas Yantek</option>
                    <option value="Operator SCADA">Operator SCADA</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Unit / Posko Kerja
                  </label>
                  <input 
                    type="text"
                    required
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="Contoh: PLN ULP Baguala / Posko Passo"
                    className={`w-full p-2.5 rounded-xl border font-bold ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Email PLN / Kontak
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contoh: user@pln.co.id"
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Password Awal Login
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 karakter"
                  className={`w-full p-2.5 rounded-xl border font-bold ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
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

    </div>
  );
};
