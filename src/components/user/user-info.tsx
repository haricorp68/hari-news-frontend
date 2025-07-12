"use client"

import { User } from "@/lib/modules/user/user.interface"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Mail, MapPin, Phone } from "lucide-react"

interface UserInfoProps {
  user: User
  className?: string
  showEmail?: boolean
  showPhone?: boolean
  showLocation?: boolean
}

export function UserInfo({ 
  user, 
  className, 
  showEmail = true, 
  showPhone = false, 
  showLocation = false 
}: UserInfoProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        {user.isVerified && (
          <CheckCircle className="h-5 w-5 text-blue-500" />
        )}
        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
          {user.status}
        </Badge>
        <Badge variant="outline">
          {user.role}
        </Badge>
      </div>

      {user.bio && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {user.bio}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {showEmail && (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        )}
        
        {showPhone && user.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{user.phone}</span>
          </div>
        )}
        
        {showLocation && (user.city || user.address) && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{[user.city, user.address].filter(Boolean).join(', ')}</span>
          </div>
        )}
      </div>

      {user.dateOfBirth && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Ngày sinh:</span> {formatDate(user.dateOfBirth)}
        </div>
      )}

      {user.gender && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Giới tính:</span> {user.gender}
        </div>
      )}
    </div>
  )
} 