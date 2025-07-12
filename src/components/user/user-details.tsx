"use client"

import { User } from "@/lib/modules/user/user.interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, Clock, Mail, MapPin, Phone, User as UserIcon, Verified } from "lucide-react"

interface UserDetailsProps {
  user: User
  className?: string
  showSensitiveInfo?: boolean
}

export function UserDetails({ user, className, showSensitiveInfo = false }: UserDetailsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa cập nhật"
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Thông tin chi tiết
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Xác thực:</span>
              <div className="flex items-center gap-1">
                {user.isVerified ? (
                  <>
                    <Verified className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Đã xác thực</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Chưa xác thực</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Vai trò:</span>
              <Badge variant="outline">{user.role}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Số lần đăng nhập:</span>
              <span className="text-sm">{user.loginCount}</span>
            </div>
          </div>

          <div className="space-y-3">
            {showSensitiveInfo && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Số điện thoại:</span>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {(user.city || user.address) && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Địa chỉ:</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{[user.city, user.address].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            )}

            {user.dateOfBirth && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Ngày sinh:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(user.dateOfBirth)}</span>
                </div>
              </div>
            )}

            {user.gender && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Giới tính:</span>
                <span className="text-sm">{user.gender}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Thông tin hoạt động</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tham gia:</span>
              <div className="font-medium">{formatDate(user.created_at)}</div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Cập nhật lần cuối:</span>
              <div className="font-medium">{formatDate(user.updated_at)}</div>
            </div>

            {user.lastLoginAt && (
              <div>
                <span className="text-muted-foreground">Đăng nhập lần cuối:</span>
                <div className="font-medium">{formatDate(user.lastLoginAt)}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 