-- Database Seeding Script for AkabotDN 5.0
-- Generated based on TypeORM entities and enums

-- =====================================================
-- Insert Roles
-- =====================================================
INSERT INTO roles (id, name, description, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin', 'System Administrator', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'moderator', 'Content Moderator', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'editor', 'Content Editor', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'member', 'Regular Member', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'guest', 'Guest User', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Users
-- =====================================================
INSERT INTO users (id, email, password_hash, full_name, avatar, phone, user_status, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'admin@akabotdn.com', '$2b$10$hashedpassword123', 'System Administrator', 'https://example.com/avatars/admin.jpg', '+84123456789', 'active', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'moderator@akabotdn.com', '$2b$10$hashedpassword456', 'Content Moderator', 'https://example.com/avatars/moderator.jpg', '+84123456790', 'active', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'editor@akabotdn.com', '$2b$10$hashedpassword789', 'Content Editor', 'https://example.com/avatars/editor.jpg', '+84123456791', 'active', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'member1@akabotdn.com', '$2b$10$hashedpassword101', 'John Doe', 'https://example.com/avatars/john.jpg', '+84123456792', 'active', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'member2@akabotdn.com', '$2b$10$hashedpassword102', 'Jane Smith', 'https://example.com/avatars/jane.jpg', '+84123456793', 'active', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440106', 'guest@akabotdn.com', '$2b$10$hashedpassword103', 'Guest User', NULL, NULL, 'pending', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert User Roles (Many-to-Many relationship)
-- =====================================================
INSERT INTO user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440106', '550e8400-e29b-41d4-a716-446655440005');

-- =====================================================
-- Insert Categories
-- =====================================================
INSERT INTO categories (id, name, slug, description, parent_id, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'Technology', 'technology', 'Technology related content', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440202', 'Business', 'business', 'Business and entrepreneurship', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440203', 'Education', 'education', 'Educational content', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440204', 'Web Development', 'web-development', 'Web development tutorials', '550e8400-e29b-41d4-a716-446655440201', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440205', 'Mobile Development', 'mobile-development', 'Mobile app development', '550e8400-e29b-41d4-a716-446655440201', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440206', 'Startup', 'startup', 'Startup and entrepreneurship', '550e8400-e29b-41d4-a716-446655440202', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Tags
-- =====================================================
INSERT INTO tags (id, name, slug, description, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'JavaScript', 'javascript', 'JavaScript programming', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440302', 'TypeScript', 'typescript', 'TypeScript programming', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440303', 'React', 'react', 'React framework', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440304', 'Node.js', 'nodejs', 'Node.js runtime', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440305', 'Database', 'database', 'Database management', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440306', 'API', 'api', 'Application Programming Interface', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440307', 'Tutorial', 'tutorial', 'Tutorial content', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440308', 'Best Practices', 'best-practices', 'Best practices guide', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Posts
-- =====================================================
INSERT INTO posts (id, title, slug, content, post_status, summary, published_at, user_id, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', 'Getting Started with TypeScript', 'getting-started-with-typescript', 'TypeScript is a powerful superset of JavaScript that adds static typing...', 'published', 'Learn the basics of TypeScript and how to get started with your first project.', NOW(), '550e8400-e29b-41d4-a716-446655440103', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440402', 'Building REST APIs with Node.js', 'building-rest-apis-with-nodejs', 'Node.js provides a powerful platform for building scalable REST APIs...', 'published', 'A comprehensive guide to building REST APIs using Node.js and Express.', NOW(), '550e8400-e29b-41d4-a716-446655440103', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440403', 'React Best Practices 2024', 'react-best-practices-2024', 'React has evolved significantly over the years. Here are the best practices...', 'published', 'Updated best practices for React development in 2024.', NOW(), '550e8400-e29b-41d4-a716-446655440102', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440404', 'Database Design Principles', 'database-design-principles', 'Good database design is crucial for application performance and maintainability...', 'draft', 'Learn the fundamental principles of database design.', NULL, '550e8400-e29b-41d4-a716-446655440104', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440405', 'Startup Funding Guide', 'startup-funding-guide', 'Securing funding is one of the biggest challenges for startups...', 'published', 'A complete guide to startup funding strategies and options.', NOW(), '550e8400-e29b-41d4-a716-446655440105', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Post Categories (Many-to-Many relationship)
-- =====================================================
INSERT INTO post_categories (post_id, category_id) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440204'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440204'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440204'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440201'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440205'),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440202'),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440206');

-- =====================================================
-- Insert Post Tags (Many-to-Many relationship)
-- =====================================================
INSERT INTO post_tags (post_id, tag_id) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440302'),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440307'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440304'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440306'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440307'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440303'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440308'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440305'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440308'),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440307');

-- =====================================================
-- Insert Comments
-- =====================================================
INSERT INTO comments (id, content, author_id, post_id, parent_id, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440501', 'Great tutorial! Very helpful for beginners.', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440401', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440502', 'Thanks for sharing this knowledge!', '550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440401', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440503', 'I have a question about TypeScript interfaces...', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440501', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440504', 'Excellent API design patterns!', '550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440402', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440505', 'This React guide is exactly what I needed.', '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440403', NULL, 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Media
-- =====================================================
INSERT INTO media (id, file_name, mime_type, file_size, file_path, media_type, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440601', 'typescript-logo.png', 'image/png', 102400, '/uploads/images/typescript-logo.png', 'image', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440602', 'nodejs-tutorial.mp4', 'video/mp4', 52428800, '/uploads/videos/nodejs-tutorial.mp4', 'video', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440603', 'react-best-practices.pdf', 'application/pdf', 2048000, '/uploads/documents/react-best-practices.pdf', 'document', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440604', 'database-schema.png', 'image/png', 153600, '/uploads/images/database-schema.png', 'image', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440605', 'startup-pitch.mp3', 'audio/mpeg', 5120000, '/uploads/audio/startup-pitch.mp3', 'audio', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Companies
-- =====================================================
INSERT INTO companies (id, name, tax_number, email, phone_number, business_registration_form_url, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440701', 'TechCorp Solutions', '0123456789', 'contact@techcorp.com', '+84123456789', 'https://example.com/forms/techcorp-registration.pdf', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440702', 'InnovateLab Vietnam', '0987654321', 'info@innovatelab.vn', '+84987654321', 'https://example.com/forms/innovatelab-registration.pdf', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440703', 'Digital Dynamics', '1122334455', 'hello@digitaldynamics.com', '+84112233445', 'https://example.com/forms/digitaldynamics-registration.pdf', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440704', 'StartupHub Vietnam', '5566778899', 'contact@startuphub.vn', '+84556677889', 'https://example.com/forms/startuphub-registration.pdf', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Members
-- =====================================================
INSERT INTO members (id, membership_type, job_title, assistant_info, membership_registration_form_url, work_unit, expertise_level, curriculum_vitae_url, joined_at, user_id, company_id, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440801', 'corporate', 'Senior Software Engineer', 'AI-powered development assistant', 'https://example.com/forms/member1-registration.pdf', 'TechCorp Solutions', 'expert', 'https://example.com/cv/john-doe.pdf', NOW(), '550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440701', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440802', 'individual', 'Frontend Developer', 'React and TypeScript specialist', 'https://example.com/forms/member2-registration.pdf', 'Freelance', 'advanced', 'https://example.com/cv/jane-smith.pdf', NOW(), '550e8400-e29b-41d4-a716-446655440105', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440803', 'student', 'Computer Science Student', 'Learning web development', 'https://example.com/forms/member3-registration.pdf', 'Vietnam National University', 'beginner', 'https://example.com/cv/student-cv.pdf', NOW(), '550e8400-e29b-41d4-a716-446655440106', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440804', 'corporate', 'CTO', 'Technology leadership and strategy', 'https://example.com/forms/member4-registration.pdf', 'InnovateLab Vietnam', 'expert', 'https://example.com/cv/cto-cv.pdf', NOW(), '550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440702', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert Partners
-- =====================================================
INSERT INTO partners (id, name, description, logo, website, partner_type, sort_order, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655440901', 'Microsoft Vietnam', 'Strategic technology partner for cloud solutions', 'https://example.com/logos/microsoft.png', 'https://microsoft.com/vietnam', 'strategic', 1, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440902', 'Google Cloud Vietnam', 'Cloud infrastructure and AI solutions partner', 'https://example.com/logos/google-cloud.png', 'https://cloud.google.com', 'gold', 2, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440903', 'AWS Vietnam', 'Amazon Web Services partner for scalable solutions', 'https://example.com/logos/aws.png', 'https://aws.amazon.com', 'gold', 3, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440904', 'Viettel Solutions', 'Local telecommunications and digital solutions', 'https://example.com/logos/viettel.png', 'https://viettelsolutions.vn', 'silver', 4, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440905', 'FPT Software', 'Software development and IT services', 'https://example.com/logos/fpt.png', 'https://fptsoftware.com', 'silver', 5, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655440906', 'Local Startup Incubator', 'Supporting local startup ecosystem', 'https://example.com/logos/incubator.png', 'https://startupincubator.vn', 'bronze', 6, 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- Insert FAQs
-- =====================================================
INSERT INTO faqs (id, content, parent_id, status, created_by, created_at, modified_by, modified_at) VALUES
('550e8400-e29b-41d4-a716-446655441001', 'How do I become a member of AkabotDN?', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655441002', 'What are the benefits of membership?', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655441003', 'How can I submit content to the platform?', NULL, 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655441004', 'To become a member, please fill out our registration form and submit the required documents.', '550e8400-e29b-41d4-a716-446655441001', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655441005', 'Members get access to exclusive content, networking opportunities, and professional development resources.', '550e8400-e29b-41d4-a716-446655441002', 'active', 'system', NOW(), 'system', NOW()),
('550e8400-e29b-41d4-a716-446655441006', 'Content submission is available to registered members through our content management system.', '550e8400-e29b-41d4-a716-446655441003', 'active', 'system', NOW(), 'system', NOW());

-- =====================================================
-- End of Seeding Script
-- =====================================================
