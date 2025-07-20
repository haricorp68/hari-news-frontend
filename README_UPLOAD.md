# Hướng Dẫn Upload Ảnh với Cloudinary

## 🚀 Tính Năng Đã Tạo

Dự án đã được tích hợp với Cloudinary để upload ảnh. Có 2 trang demo:

### 1. Trang Upload Đầy Đủ (`/upload`)
- Upload nhiều ảnh cùng lúc
- Hiển thị danh sách tất cả ảnh đã upload
- Thông tin chi tiết: kích thước, định dạng, public ID
- Chức năng copy URL và Public ID
- Xóa từng ảnh hoặc xóa tất cả

### 2. Trang Upload Demo Đơn Giản (`/upload-demo`)
- Upload 1 ảnh
- Hiển thị URL và preview ảnh
- Copy URL nhanh chóng
- Giao diện đơn giản, dễ sử dụng

### 3. Trang Upload Nhiều Nguồn (`/upload-sources`)
- Hiển thị tất cả các nguồn upload có sẵn
- Upload từ 12+ nguồn khác nhau
- Thông tin chi tiết về từng nguồn
- Theo dõi nguồn upload của mỗi ảnh

## 📋 Các Bước Cấu Hình

### Bước 1: Tạo tài khoản Cloudinary
1. Truy cập [cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Lưu lại Cloud Name, API Key, API Secret

### Bước 2: Tạo Upload Preset
1. Vào Dashboard > Settings > Upload
2. Cuộn xuống "Upload presets"
3. Click "Add upload preset"
4. Đặt tên (ví dụ: "hari_news_upload")
5. Chọn "Unsigned" (quan trọng!)
6. Lưu preset

### Bước 3: Tạo file `.env.local`
Tạo file `.env.local` trong thư mục gốc:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Bước 4: Khởi động lại server
```bash
npm run dev
```

## 🎯 Cách Sử Dụng

### Truy cập trang upload:
- **Trang đầy đủ**: `http://localhost:3000/upload`
- **Trang demo**: `http://localhost:3000/upload-demo`
- **Trang nhiều nguồn**: `http://localhost:3000/upload-sources`

### Upload ảnh:
1. Click "Chọn Ảnh" hoặc kéo thả ảnh
2. Chọn file ảnh từ máy tính
3. Đợi upload hoàn tất
4. Copy URL để sử dụng

## 📁 Files Đã Tạo

```
src/
├── app/
│   ├── upload/
│   │   └── page.tsx          # Trang upload đầy đủ
│   ├── upload-demo/
│   │   └── page.tsx          # Trang upload demo
│   └── upload-sources/
│       └── page.tsx          # Trang upload nhiều nguồn
├── hooks/
│   └── useCloudinaryUpload.ts # Custom hook quản lý upload
└── CLOUDINARY_SETUP.md       # Hướng dẫn cấu hình chi tiết
```

## 🔧 Tùy Chỉnh

### Thay đổi kích thước file tối đa:
```typescript
maxFileSize: 10000000, // 10MB
```

### Thay đổi định dạng file được phép:
```typescript
clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
```

### Thay đổi số lượng file tối đa:
```typescript
maxFiles: 5 // Upload tối đa 5 file
```

### Thay đổi nguồn upload:
```typescript
sources: [
  'local',           // Máy tính
  'camera',          // Camera
  'url',             // URL
  'google_drive',    // Google Drive
  'dropbox',         // Dropbox
  'facebook',        // Facebook
  'instagram',       // Instagram
  'shutterstock',    // Shutterstock
  'gettyimages',     // Getty Images
  'istock',          // iStock
  'unsplash',        // Unsplash
  'image_search'     // Tìm kiếm ảnh
]
```

## 🌐 Các Nguồn Upload Hỗ Trợ

### 📁 **Local & Camera**
- **Máy Tính**: Upload file từ máy tính
- **Camera**: Chụp ảnh trực tiếp từ camera

### 🌍 **Internet & URL**
- **URL**: Nhập URL ảnh từ internet
- **Tìm Kiếm Ảnh**: Tìm kiếm ảnh từ nhiều nguồn

### ☁️ **Cloud Storage**
- **Google Drive**: Chọn ảnh từ Google Drive
- **Dropbox**: Chọn ảnh từ Dropbox

### 📱 **Social Media**
- **Facebook**: Chọn ảnh từ Facebook
- **Instagram**: Chọn ảnh từ Instagram

### 🖼️ **Stock Photos**
- **Shutterstock**: Tìm kiếm ảnh từ Shutterstock
- **Getty Images**: Tìm kiếm ảnh từ Getty Images
- **iStock**: Tìm kiếm ảnh từ iStock
- **Unsplash**: Tìm kiếm ảnh miễn phí từ Unsplash

## 🚨 Lưu Ý Quan Trọng

1. **Upload Preset phải là "Unsigned"** để hoạt động với client-side upload
2. **File `.env.local` không được commit** lên git
3. **Cloud Name phải chính xác** từ dashboard Cloudinary
4. **API Key và Secret** chỉ cần thiết cho server-side operations
5. **Một số nguồn có thể yêu cầu đăng nhập** (Google Drive, Dropbox, Facebook, Instagram)
6. **Stock photos có thể có phí** (Shutterstock, Getty Images, iStock)

## 🎨 Giao Diện

- Sử dụng shadcn/ui components
- Responsive design
- Toast notifications
- Loading states
- Error handling
- Copy to clipboard functionality
- Badge hiển thị nguồn upload
- Grid layout cho danh sách nguồn

## 🔗 Tích Hợp Vào Dự Án

Để sử dụng trong component khác:

```typescript
import { CldUploadWidget } from 'next-cloudinary';

<CldUploadWidget
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onSuccess={(result) => {
    console.log(result.info.secure_url);
  }}
>
  {({ open }) => (
    <button onClick={() => open()}>Upload</button>
  )}
</CldUploadWidget>
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser
2. Đảm bảo environment variables đúng
3. Kiểm tra upload preset là "Unsigned"
4. Xem file `CLOUDINARY_SETUP.md` để biết thêm chi tiết 