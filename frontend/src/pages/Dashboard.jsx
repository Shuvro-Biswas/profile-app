import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { logout } from '../store/slices/authSlice'
import { fetchUsers } from '../store/slices/userSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Users, User, Settings } from 'lucide-react'
import ProfileView from '../components/profile/ProfileView'
import ProfileEditForm from '../components/profile/ProfileEditForm'

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { users, isLoading } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleEditSuccess = () => {
    setIsEditing(false)
    // Optionally refresh user data
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">ProFile</h1>
              <span className="text-muted-foreground">Personal Profile Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.full_name}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>User Directory</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="space-y-6">
              {isEditing ? (
                <ProfileEditForm 
                  onCancel={handleCancelEdit}
                  onSuccess={handleEditSuccess}
                />
              ) : (
                <ProfileView onEdit={handleEditProfile} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="directory" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Public User Directory</span>
                </CardTitle>
                <CardDescription>
                  Browse and connect with other users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.full_name}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                              {user.bio && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </div>
                          {user.interests && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {JSON.parse(user.interests).slice(0, 3).map((interest, index) => (
                                <span 
                                  key={index}
                                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                                >
                                  {interest}
                                </span>
                              ))}
                              {JSON.parse(user.interests).length > 3 && (
                                <span className="inline-block px-2 py-1 text-xs text-muted-foreground">
                                  +{JSON.parse(user.interests).length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {!isLoading && users.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Account Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Your account was created on {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your profile is visible in the public directory. You can edit your profile information in the "My Profile" tab.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Your account is secured with JWT authentication. Always log out when using shared devices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

