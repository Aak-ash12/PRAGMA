import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Power, UserPlus, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const users = [
  { id: 1, name: 'Arun Kumar', role: 'Administrator', dept: 'IT Operations', status: 'Active', login: '10m ago' },
  { id: 2, name: 'Dr. Priya V.', role: 'Analyst', dept: 'Health Dept', status: 'Active', login: '1h ago' },
  { id: 3, name: 'Rajesh S.', role: 'Govt Official', dept: 'Finance', status: 'Active', login: '3h ago' },
  { id: 4, name: 'Meena K.', role: 'District Collector', dept: 'Chennai Admin', status: 'Suspended', login: '2d ago' },
  { id: 5, name: 'Vijay P.', role: 'Dept Officer', dept: 'Water Board', status: 'Active', login: '5m ago' },
];

export default function UserManagement() {
  const [term, setTerm] = useState('');

  return (
    <div className="glass-card h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-white font-poppins font-medium">User & Role Management</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Access Control Center</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="bg-black/30 border border-white/10 text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-primary/50 w-48"
            />
          </div>
          <button className="bg-black/30 border border-white/10 text-gray-300 p-2 rounded-lg hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
          <button className="bg-primary/20 border border-primary/50 text-primary p-2 rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase"><UserPlus className="w-4 h-4" /> Add User</button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-gray-500 bg-black/20">
              <th className="p-3 font-medium">User Name</th>
              <th className="p-3 font-medium">Role</th>
              <th className="p-3 font-medium">Department</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Last Login</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-3 font-bold text-white">{u.name}</td>
                <td className="p-3"><span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-wider text-primary">{u.role}</span></td>
                <td className="p-3 text-gray-400">{u.dept}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-wider font-bold ${u.status === 'Active' ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>{u.status}</span>
                </td>
                <td className="p-3 text-[10px] font-mono text-gray-500">{u.login}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-warning" title="Reset Password"><Key className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-secondary" title="Suspend"><Power className="w-4 h-4" /></button>
                    <button className="p-1 hover:text-danger" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
