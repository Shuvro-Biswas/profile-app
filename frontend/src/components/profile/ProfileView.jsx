import { useSelector } from 'react-redux'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CalendarDays, Mail, Phone, User, Edit, MapPin } from 'lucide-react'

export default function ProfileView({ onEdit }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No profile data available</p>
        </CardContent>
      </Card>
    )
  }

  const interests = user.interests ? JSON.parse(user.interests) : []
  const initials = user.full_name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U'

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user.full_name}</CardTitle>
              <CardDescription className="text-base">
                Member since {formatDate(user.created_at)}
              </CardDescription>
            </div>
          </div>
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {user.phone_number && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date of Birth</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.date_of_birth)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-sm text-muted-foreground">{user.gender || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {interests.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.bio && (
              <div>
                <p className="text-sm font-medium mb-2">Bio</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        {(!user.phone_number || !user.bio || interests.length === 0) && (
          <div className="border-t pt-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Complete your profile:</strong> Add missing information like phone number, bio, or interests to make your profile more engaging.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

