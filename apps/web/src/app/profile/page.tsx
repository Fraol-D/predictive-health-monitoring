'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import PageLayout from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { 
    Settings, ShieldCheck, 
    LogOut, Bell, Palette, Languages, Share2 
} from 'lucide-react';
import Link from 'next/link';

// This should align with the Mongoose User schema
interface UserProfile {
  _id: string; // MongoDB ObjectId
  firebaseUID: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  profileImage?: string;
  createdAt: string;
}

const getInitials = (name?: string) => {
  return name ? name.split(' ').map((n) => n[0]).join('') : '';
};

// ============================================================================
// Optimized Profile Form Component
// ============================================================================
const ProfileFormCard = memo(({ profile, user, onProfileUpdate }: { profile: UserProfile | null, user: any, onProfileUpdate: (profile: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(!profile);

  useEffect(() => {
    // If there's no profile, default to editing mode.
    if (!profile) {
      setIsEditing(true);
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')) || undefined,
      gender: formData.get('gender') as string,
    };

    try {
      const url = profile
        ? `http://localhost:3001/api/users/${profile._id}`
        : 'http://localhost:3001/api/users';

      const method = profile ? 'PATCH' : 'POST';

      const body = profile
        ? JSON.stringify(updatedData)
        : JSON.stringify({ ...updatedData, firebaseUID: user.uid, email: user.email });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${profile ? 'update' : 'create'} profile.`);
      }

      const savedProfile: UserProfile = await response.json();
      onProfileUpdate(savedProfile);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      // Ideally, show a toast notification here
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className='text-2xl'>
            {isEditing ? 'Edit Profile' : 'Your Information'}
          </CardTitle>
          {!isEditing && profile && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={profile?.name || user.displayName || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" defaultValue={profile?.age} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" name="gender" defaultValue={profile?.gender} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {profile && <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
              <Button type="submit" className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
                Save Profile
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Name</Label>
              <p>{profile?.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Age</Label>
              <p>{profile?.age || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
              <p>{profile?.gender || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p>{profile?.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Joined On</Label>
              <p>{profile ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
ProfileFormCard.displayName = 'ProfileFormCard';

// ============================================================================
// Optimized Settings Component
// ============================================================================
const SettingsCard = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>App Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className="flex items-center">
            <Palette className="w-5 h-5 mr-4 text-muted-foreground" />
            <div>
              <h3 className='text-lg font-medium'>Theme</h3>
              <p className='text-sm text-muted-foreground'>Switch between light and dark mode.</p>
            </div>
          </div>
          <ThemeToggleButton />
        </div>
      </CardContent>
    </Card>
  );
});
SettingsCard.displayName = 'SettingsCard';

// ============================================================================
// Main Profile Page Component
// ============================================================================
export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userProfile = useMemo(() => profile, [profile]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/users/firebase/${user.uid}`);
        if (response.status === 404) {
          setProfile(null);
        } else if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        } else {
          const data: UserProfile = await response.json();
          setProfile(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading || authLoading) {
    return <PageLayout><div className="flex justify-center items-center h-full">Loading profile...</div></PageLayout>;
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center">
          <p>Please log in to view your profile.</p>
          <Link href="/auth/login" className="text-primary hover:underline">Go to Login</Link>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return <PageLayout><div className="text-center text-red-500">Error: {error}</div></PageLayout>;
  }

  return (
    <PageLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={profile?.profileImage || user.photoURL || ''} alt={profile?.name || ''} />
                <AvatarFallback className="text-3xl">{getInitials(profile?.name || user.displayName || '')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{profile?.name || 'New User'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/data-sharing" className="w-full flex items-center text-left p-3 rounded-lg hover:bg-muted transition-colors">
                <Share2 className="w-5 h-5 mr-4 text-primary" />
                <span>Share Your Data</span>
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center text-left p-3 rounded-lg hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5 mr-4 text-destructive" />
                <span className="text-destructive">Log Out</span>
              </button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <ProfileFormCard profile={profile} user={user} onProfileUpdate={setProfile} />
          <SettingsCard />
        </div>
      </div>
    </PageLayout>
  );
}