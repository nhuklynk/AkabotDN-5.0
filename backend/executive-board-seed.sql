-- Insert sample data for Executive Board table
INSERT INTO executive_board (id, unit, position_title, professional_expertise, is_active, created_at, modified_at, created_by, modified_by) VALUES 
(gen_random_uuid(), 'Đại tướng Lương Tam Quang', 'Chairman', 'Ủy viên Bộ Chính trị, Bộ trưởng Bộ Công an', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Thượng tướng Nguyễn Văn Long', 'Standing Vice Chairman', 'Ủy viên Thường vụ Đảng ủy Công an Trung ương, Thứ trưởng Bộ Công an', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Thiếu tướng Nguyễn Ngọc Cương', 'Executive Vice Chairman', 'Tiến sĩ, Giám đốc Trung tâm Dữ liệu quốc gia, Bộ Công an', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Đại tá Phạm Minh Tiến', 'Member', 'Phó Giám đốc Trung tâm Dữ liệu quốc gia', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Đại tá Hà Nam Trung', 'Member', 'Phó Giám đốc Trung tâm Dữ liệu quốc gia', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Thượng tá Nguyễn Thành Vĩnh', 'Member', 'Thạc sĩ, Phó Giám đốc Trung tâm Dữ liệu quốc gia, Bộ Công an', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Trần Minh Sơn', 'Vice Chairman', 'Phó Chủ tịch Công ty cổ phần Tập đoàn Mặt trời (Sungroup)', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Lê Trí Thông', 'Vice Chairman', 'Thạc sĩ, Tổng Giám đốc Công ty Vàng bạc Đá quý Phú Nhuận (PNJ)', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Hồ Hùng Anh', 'Vice Chairman', 'Chủ tịch Hội đồng quản trị Ngân hàng thương mại cổ phần Kỹ thương Việt Nam', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Nguyễn Anh Tuấn', 'Member', 'Tổng Giám đốc Tập đoàn điện lực Việt Nam (EVN)', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Ngô Chí Dũng', 'Vice Chairman', 'Chủ tịch Bệnh viện Tâm Anh, Công ty cổ phần Vacxin Việt Nam', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Trương Gia Bình', 'Vice Chairman', 'Phó Giáo sư, Tiến sĩ, Chủ tịch Công ty Cổ phần FPT', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Nguyễn Việt Quang', 'Member', 'Thạc sĩ, Tổng giám đốc Tập đoàn VinGroup', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Nguyễn Trung Chính', 'Vice Chairman', 'Chủ tịch Tập đoàn CMC', true, NOW(), NOW(), 'system', 'system'),
(gen_random_uuid(), 'Đinh Bá Thành', 'Vice Chairman', 'Thạc sĩ, Chủ tịch Tập đoàn DatVietVAC', true, NOW(), NOW(), 'system', 'system');
