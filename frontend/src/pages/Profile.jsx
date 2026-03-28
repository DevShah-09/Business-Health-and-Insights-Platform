import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, Check, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await api.put('/api/v1/auth/profile', {
        full_name: editName,
        email: editEmail
      });
      
      updateUser({
        name: response.data.full_name,
        email: response.data.email
      });
      
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-surface/40 border border-surface-border/40 p-10 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand/10 transition-colors duration-500"></div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-brand flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-brand/30 ring-4 ring-brand/10">
              {getInitials(user?.name)}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-3 bg-surface border border-surface-border/50 rounded-2xl shadow-xl text-surface-muted-foreground hover:text-brand transition-all hover:scale-110 active:scale-95"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-4xl font-headline font-bold text-surface-foreground bg-surface/50 border border-surface-border/50 rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand/50 italic"
                    placeholder="Full Name"
                  />
                  {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                </div>
              ) : (
                <h1 className="text-4xl font-headline font-bold text-surface-foreground tracking-tight italic">
                  {user?.name || 'User Profile'}
                </h1>
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider border border-brand/20">
                  Business Owner
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-muted text-surface-muted-foreground text-xs font-bold uppercase tracking-wider border border-surface-border/30">
                  Verified Account
                </span>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-center md:justify-start gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-surface-muted text-surface-foreground rounded-xl font-bold text-sm border border-surface-border/30 hover:bg-surface transition-all active:scale-95"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface/40 border border-surface-border/40 p-8 rounded-[2rem] backdrop-blur-md space-y-6 hover:border-surface-border transition-colors duration-300">
            <h3 className="text-lg font-bold text-surface-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand/10 text-brand">
                <User size={20} />
              </div>
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-surface-muted-foreground font-bold uppercase tracking-widest">Full Name</p>
                {isEditing ? (
                  <p className="text-surface-muted-foreground italic text-sm">Editing above...</p>
                ) : (
                  <p className="text-surface-foreground font-medium">{user?.name || 'Not Provided'}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs text-surface-muted-foreground font-bold uppercase tracking-widest">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="text-surface-foreground font-medium bg-surface/50 border border-surface-border/50 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-brand/30"
                    placeholder="Email Address"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-surface-foreground font-medium">
                    <Mail size={16} className="text-surface-muted-foreground" />
                    {user?.email || 'Not Provided'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface/40 border border-surface-border/40 p-8 rounded-[2rem] backdrop-blur-md space-y-6 hover:border-surface-border transition-colors duration-300">
            <h3 className="text-lg font-bold text-surface-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Shield size={20} />
              </div>
              Security & Role
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-surface-muted-foreground font-bold uppercase tracking-widest">Account Type</p>
                <p className="text-surface-foreground font-medium">Business Administration</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-surface-muted-foreground font-bold uppercase tracking-widest">Access Level</p>
                <div className="flex items-center gap-2 text-surface-foreground font-medium text-brand">
                  Full Administrative Access
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between p-6 bg-brand/5 rounded-3xl border border-brand/10">
          <div className="flex items-center gap-3 text-surface-muted-foreground">
            <Calendar size={18} />
            <span className="text-sm">Member since March 2026</span>
          </div>
          <button className="text-sm font-bold text-brand hover:underline underline-offset-4">
            Security Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
