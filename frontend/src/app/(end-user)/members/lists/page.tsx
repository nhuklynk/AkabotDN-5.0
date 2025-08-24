import { MembersPageClient } from "@/app/(end-user)/members/lists/components/members-page-client";

// Mock data for members
const members = [
  {
    id: 1,
    name: "CÔNG TY CỔ PHẦN APPOTAPAY",
    representative: "Trương Thị Kiều Oanh",
    position: "Phó giám đốc Đối ngoại",
  },
  {
    id: 2,
    name: "CÔNG TY CỔ PHẦN APPOTAPAY",
    representative: "Trương Thị Kiều Oanh",
    position: "Phó giám đốc Đối ngoại",
  },
  {
    id: 3,
    name: "BẢO NHÂN DÂN",
    representative: "Lê Quốc Minh",
    position: "Tổng Biên tập báo Nhân Dân",
  },
  {
    id: 4,
    name: "CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ TIA CHỚP XANH",
    representative: "Nguyễn Thành Khôi",
    position: "Giám Đốc Vận Hành",
  },
  {
    id: 5,
    name: "CÔNG TY CỔ PHẦN BỆNH VIỆN ĐA KHOA TÂM ANH",
    representative: "Ngô Chí Dũng",
    position: "Chủ tịch HĐQT",
  },
  {
    id: 6,
    name: "CÔNG TY CỔ PHẦN TẬP ĐOÀN CÔNG NGHỆ CMC",
    representative: "Nguyễn Trung Chính",
    position: "Chủ tịch Hội đồng quản trị Chủ tịch điều hành tập đoàn",
  },
  {
    id: 7,
    name: "CÔNG TY TNHH CMV BUSINESS VALUE (VIỆT NAM)",
    representative: "Bùi Thị Thảo Yến",
    position: "Giám đốc",
  },
  {
    id: 8,
    name: "CỤC TIN HỌC VÀ THỐNG KÊ TÀI CHÍNH",
    representative: "Nguyễn Minh Ngọc",
    position: "Phó Cục trưởng",
  },
  {
    id: 9,
    name: "CÔNG TY CỔ PHẦN TẬP ĐOÀN GIẢI TRÍ ĐẠI DƯƠNG",
    representative: "Bùi Anh Tuấn",
    position: "Tổng Giám đốc",
  },
  {
    id: 10,
    name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ DATA NEST",
    representative: "Lê Đức Minh",
    position: "Chủ tịch HĐQT",
  },
  {
    id: 11,
    name: "CÔNG TY TNHH E-COURT VIỆT NAM",
    representative: "Nguyễn Hải Đăng",
    position: "Giám đốc",
  },
  {
    id: 12,
    name: "CÔNG TY CỔ PHẦN ECOIT",
    representative: "Nguyễn Đình Hải",
    position: "Tổng Giám đốc",
  },
  {
    id: 13,
    name: "CÔNG TY CỔ PHẦN EWAY",
    representative: "Phạm Hoàng Hằng",
    position: "Tổng Giám Đốc",
  },
  {
    id: 14,
    name: "NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN XUẤT NHẬP KHẨU VIỆT NAM",
    representative: "Huỳnh Bảo Phương",
    position: "Giám Đốc Trung Tâm Thẻ",
  },
  {
    id: 15,
    name: "CÔNG TY CỔ PHẦN FDS",
    representative: "Lê Phú Cường",
    position: "Tổng giám đốc",
  },
  {
    id: 16,
    name: "CÔNG TY CỔ PHẦN CÔNG NGHỆ FINVIET",
    representative: "Nguyễn Văn Cường",
    position: "Giám đốc phát triển dịch vụ",
  },
  {
    id: 17,
    name: "CÔNG TY TNHH FPT IS",
    representative: "Trần Phong Lâm",
    position: "Giám Đốc Khối CR",
  },
  {
    id: 18,
    name: "CÔNG TY CỔ PHẦN BẢN LỀ KỸ THUẬT SỐ FPT",
    representative: "Hoàng Trung Kiên",
    position: "Tổng Giám đốc",
  },
  {
    id: 19,
    name: "CÔNG TY CỔ PHẦN VIỄN THÔNG FPT",
    representative: "Hoàng Việt Anh",
    position: "Chủ tịch HĐQT",
  },
  {
    id: 20,
    name: "CÔNG TY TNHH CÔNG NGHỆ GIA BÌNH",
    representative: "Đào Trường Giang",
    position: "Tổng Giám đốc",
  },
];

export default function MemberListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DANH SÁCH HỘI VIÊN
          </h1>
          <div className="w-20 h-1 bg-emerald-600"></div>
          <p className="text-gray-600 mt-4">Danh sách hội viên tổ chức</p>
        </div>

        <MembersPageClient members={members} />
      </div>
    </div>
  );
}
