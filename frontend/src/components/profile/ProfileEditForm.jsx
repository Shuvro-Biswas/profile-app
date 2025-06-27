import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../../store/slices/userSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Please select a gender',
  }),
  interests: z.array(z.string()).optional(),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional(),
})

const interestOptions = [
  'Music',
  'Sports',
  'Tech',
  'Travel',
  'Reading',
  'Gaming',
  'Cooking',
  'Art',
]

export default function ProfileEditForm({ onCancel, onSuccess }) {
  const [selectedInterests, setSelectedInterests] = useState([])
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isLoading, error } = useSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '',
      gender: user?.gender || '',
      interests: [],
      bio: user?.bio || '',
    },
  })

  const bio = watch('bio', '')

  useEffect(() => {
    if (user) {
      // Parse interests from JSON string
      const userInterests = user.interests ? JSON.parse(user.interests) : []
      setSelectedInterests(userInterests)
      setValue('interests', userInterests)
      setValue('gender', user.gender)
    }
  }, [user, setValue])

  useEffect(() => {
    setValue('interests', selectedInterests)
  }, [selectedInterests, setValue])

  const handleInterestChange = (interest, checked) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interest])
    } else {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    }
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUserProfile({ 
        userId: user.id, 
        userData: data 
      })).unwrap()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      // Error is handled by Redux
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                {...register('full_name')}
                className={errors.full_name ? 'border-destructive' : ''}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                placeholder="Enter your phone number"
                {...register('phone_number')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <Input
                id="date_of_birth"
                type="date"
                {...register('date_of_birth')}
                className={errors.date_of_birth ? 'border-destructive' : ''}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-destructive">{errors.date_of_birth.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Gender *</Label>
            <RadioGroup
              value={watch('gender')}
              onValueChange={(value) => setValue('gender', value)}
              className="flex flex-row space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Male" id="edit-male" />
                <Label htmlFor="edit-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Female" id="edit-female" />
                <Label htmlFor="edit-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Other" id="edit-other" />
                <Label htmlFor="edit-other">Other</Label>
              </div>
            </RadioGroup>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Interests</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${interest}`}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                  />
                  <Label htmlFor={`edit-${interest}`} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself..."
              {...register('bio')}
              className={`resize-none ${errors.bio ? 'border-destructive' : ''}`}
              rows={3}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{errors.bio && <span className="text-destructive">{errors.bio.message}</span>}</span>
              <span>{bio.length}/300</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

