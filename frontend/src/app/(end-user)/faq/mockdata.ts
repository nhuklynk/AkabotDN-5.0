type FAQ = {
  FAQID: number;
  Content: string;
  ParentId: number | null;
  Description?: string;
  ArticleCount?: number;
  Icon?: string;
};

export const faqData: FAQ[] = [
  // Categories (ParentId = null)
  {
    FAQID: 1,
    Content: "Tìm hiểu về Hiệp hội",
    Description: "Giới thiệu Hiệp hội và thông tin tổng quan",
    ParentId: null,
    ArticleCount: 9,
    Icon: "info",
  },
  {
    FAQID: 2,
    Content: "Hội viên",
    Description: "Điều kiện, quyền lợi và nghĩa vụ của hội viên",
    ParentId: null,
    ArticleCount: 12,
    Icon: "users",
  },
  {
    FAQID: 3,
    Content: "Dịch vụ & Sản phẩm",
    Description: "Các dịch vụ, sản phẩm và hỗ trợ liên quan",
    ParentId: null,
    ArticleCount: 15,
    Icon: "box",
  },
  {
    FAQID: 4,
    Content: "Hướng dẫn tham gia",
    Description: "Thông tin giúp bạn chuẩn bị và tham gia",
    ParentId: null,
    ArticleCount: 7,
    Icon: "book-open",
  },

  // Câu hỏi thuộc "Tìm hiểu về Hiệp hội"
  { FAQID: 5, Content: "Hiệp hội Dữ liệu Quốc gia là gì?", ParentId: 1 },
  { FAQID: 6, Content: "Sứ mệnh của Hiệp hội là gì?", ParentId: 1 },
  { FAQID: 7, Content: "Hiệp hội được thành lập năm nào?", ParentId: 1 },

  // Câu hỏi thuộc "Hội viên"
  { FAQID: 8, Content: "Ai có thể trở thành hội viên?", ParentId: 2 },
  { FAQID: 9, Content: "Quyền lợi của hội viên là gì?", ParentId: 2 },
  { FAQID: 10, Content: "Hội viên có nghĩa vụ gì?", ParentId: 2 },

  // Câu hỏi thuộc "Dịch vụ & Sản phẩm"
  { FAQID: 11, Content: "Hiệp hội cung cấp dịch vụ nào?", ParentId: 3 },
  { FAQID: 12, Content: "Có hỗ trợ kỹ thuật không?", ParentId: 3 },

  // Câu hỏi thuộc "Hướng dẫn tham gia"
  { FAQID: 13, Content: "Làm sao để đăng ký tham gia?", ParentId: 4 },
  { FAQID: 14, Content: "Có cần chuẩn bị gì trước khi tham gia?", ParentId: 4 },
];
