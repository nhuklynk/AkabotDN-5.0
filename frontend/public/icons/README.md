# Icons và Hình ảnh SVG

Thư mục này chứa các file SVG được tạo mới để thay thế các hình ảnh PNG trong dự án.

## Danh sách các file SVG

**Tổng cộng: 15 file SVG** được tạo để thay thế các hình ảnh PNG và tạo placeholder cho các trang khác nhau.

### 1. vietnam-data-ecosystem.svg

- **Mô tả**: Hệ sinh thái dữ liệu quốc gia Việt Nam
- **Kích thước**: 400x225
- **Sử dụng**: Hero section trang chủ
- **Đặc điểm**: Hiển thị các node dữ liệu, kết nối mạng, và trung tâm dữ liệu

### 2. vietnam-flag.svg

- **Mô tả**: Lá cờ Việt Nam
- **Kích thước**: 200x120
- **Sử dụng**: Các trang về Việt Nam
- **Đặc điểm**: Cờ đỏ sao vàng truyền thống

### 3. data-center.svg

- **Mô tả**: Trung tâm dữ liệu
- **Kích thước**: 300x200
- **Sử dụng**: Trang sản phẩm số, công nghệ
- **Đặc điểm**: Tòa nhà với server racks và kết nối mạng

### 4. ai-assistant.svg

- **Mô tả**: Trợ lý AI
- **Kích thước**: 250x180
- **Sử dụng**: Trang sản phẩm số
- **Đặc điểm**: Robot với màn hình và kết nối dữ liệu

### 5. blockchain.svg

- **Mô tả**: Nền tảng blockchain
- **Kích thước**: 280x200
- **Sử dụng**: Trang sản phẩm số
- **Đặc điểm**: Các block kết nối với hash values và network nodes

### 6. digital-identity.svg

- **Mô tả**: Định danh số
- **Kích thước**: 260x180
- **Sử dụng**: Trang sản phẩm số
- **Đặc điểm**: Thẻ ID với chip, ảnh và QR code

### 7. partnership.svg

- **Mô tả**: Hợp tác đối tác
- **Kích thước**: 300x200
- **Sử dụng**: Trang về đối tác
- **Đặc điểm**: Hai đối tác kết nối với handshake

### 8. innovation.svg

- **Mô tả**: Đổi mới sáng tạo
- **Kích thước**: 280x200
- **Sử dụng**: Trang về đổi mới
- **Đặc điểm**: Bóng đèn với các yếu tố AI, ML, IoT, Cloud

### 9. news-placeholder.svg

- **Mô tả**: Placeholder cho tin tức
- **Kích thước**: 400x225
- **Sử dụng**: News section
- **Đặc điểm**: Icon tin tức với calendar và các dòng text

### 10. about-us.svg

- **Mô tả**: Về chúng tôi
- **Kích thước**: 350x250
- **Sử dụng**: Trang about-us
- **Đặc điểm**: Tòa nhà với con người và các giá trị cốt lõi

### 11. contact.svg

- **Mô tả**: Liên hệ
- **Kích thước**: 320x220
- **Sử dụng**: Trang contact
- **Đặc điểm**: Phong bì, điện thoại và địa chỉ

### 12. activities-placeholder.svg

- **Mô tả**: Placeholder cho hoạt động & sự kiện
- **Kích thước**: 400x225
- **Sử dụng**: Trang activities
- **Đặc điểm**: Lịch với các ngày và icon sự kiện

### 13. expert-placeholder.svg

- **Mô tả**: Placeholder cho chuyên gia
- **Kích thước**: 200x200
- **Sử dụng**: Trang activities (phần chuyên gia)
- **Đặc điểm**: Icon người với các chuyên môn AI, ML, Data, Cloud

### 14. documents-placeholder.svg

- **Mô tả**: Placeholder cho tài liệu
- **Kích thước**: 300x200
- **Sử dụng**: Trang documents
- **Đặc điểm**: Chồng tài liệu với các định dạng PDF, DOC

### 15. search-placeholder.svg

- **Mô tả**: Placeholder cho tìm kiếm
- **Kích thước**: 350x250
- **Sử dụng**: Trang search
- **Đặc điểm**: Kính lúp tìm kiếm với các kết quả và danh mục

## Cách sử dụng

### Trong React/Next.js

```tsx
import Image from "next/image";

<Image
  src="/icons/vietnam-data-ecosystem.svg"
  alt="Hệ sinh thái dữ liệu Việt Nam"
  width={400}
  height={225}
  className="w-full h-full object-contain"
/>;
```

### Trong HTML thông thường

```html
<img
  src="/icons/vietnam-data-ecosystem.svg"
  alt="Hệ sinh thái dữ liệu Việt Nam"
  class="w-full h-full object-contain"
/>
```

## Lợi ích của SVG

1. **Chất lượng cao**: Không bị mất chất lượng khi scale
2. **Kích thước nhỏ**: File size nhỏ hơn PNG/JPG
3. **Dễ chỉnh sửa**: Có thể thay đổi màu sắc, kích thước bằng CSS
4. **Responsive**: Tự động scale theo container
5. **Accessibility**: Có thể thêm alt text và aria labels

## Màu sắc chủ đạo

- **Primary**: #0033FF (Xanh dương)
- **Secondary**: #977DFF (Tím)
- **Accent**: #FFCCF2 (Hồng nhạt)
- **Background**: #F2E6EE (Hồng rất nhạt)
- **Text**: #0600AF (Xanh đậm)

## Cập nhật

Các file SVG này đã được tạo để thay thế các hình ảnh PNG trong dự án. Khi cần thêm hình ảnh mới, hãy tạo file SVG với cùng style và màu sắc để đảm bảo tính nhất quán.
