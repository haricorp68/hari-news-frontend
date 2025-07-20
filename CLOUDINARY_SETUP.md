# Cấu hình Cloudinary cho Upload Ảnh

## Bước 1: Tạo tài khoản Cloudinary
1. Truy cập [cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng nhập, bạn sẽ thấy Cloud Name, API Key, và API Secret

## Bước 2: Tạo Upload Preset
1. Vào Settings > Upload
2. Cuộn xuống phần "Upload presets"
3. Click "Add upload preset"
4. Đặt tên cho preset (ví dụ: "hari_news_upload")
5. Chọn "Unsigned" để cho phép upload từ client
6. Lưu preset

## Bước 3: Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục gốc của dự án với nội dung:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

Thay thế các giá trị:
- `your_cloud_name_here`: Cloud Name từ dashboard Cloudinary
- `your_api_key_here`: API Key từ dashboard Cloudinary  
- `your_api_secret_here`: API Secret từ dashboard Cloudinary
- `your_upload_preset_here`: Tên upload preset bạn vừa tạo

## Bước 4: Cập nhật Upload Preset trong Code
Trong file `src/app/upload/page.tsx`, thay đổi dòng:
```typescript
uploadPreset="ml_default"
```
thành:
```typescript
uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset_here"}
```

## Bước 5: Khởi động lại server
```bash
npm run dev
```

## Sử dụng
1. Truy cập `/upload` để sử dụng trang upload
2. Chọn ảnh hoặc kéo thả ảnh vào khu vực upload
3. Sau khi upload thành công, bạn sẽ thấy URL và Public ID của ảnh
4. Click nút copy để copy URL vào clipboard

## Lưu ý
- File `.env.local` không được commit lên git (đã có trong .gitignore)
- Upload preset phải được set là "Unsigned" để hoạt động với client-side upload
- Kích thước file tối đa được set là 10MB
- Hỗ trợ các định dạng: JPG, PNG, GIF, WebP 