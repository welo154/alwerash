-- Arabic display names alongside the existing English names.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name_ar" TEXT;
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "title_ar" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "title_ar" TEXT;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "instructor_name_ar" TEXT;
ALTER TABLE "modules" ADD COLUMN IF NOT EXISTS "title_ar" TEXT;
ALTER TABLE "lessons" ADD COLUMN IF NOT EXISTS "title_ar" TEXT;
ALTER TABLE "assignments" ADD COLUMN IF NOT EXISTS "title_ar" TEXT;
ALTER TABLE "mentors" ADD COLUMN IF NOT EXISTS "name_ar" TEXT;

UPDATE "courses" SET "title_ar" = 'الرسم المعماري' WHERE "title" = 'Architectural illustration' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'زخرفة الباتيك' WHERE "title" = 'Batik Ornamentation' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'وظائف بلندر المتقدمة' WHERE "title" = 'Blender Deep functionality' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الهوية البصرية والذكاء الاصطناعي' WHERE "title" = 'Branding & AI' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الهوية البصرية بعمق' WHERE "title" = 'Branding DeepDive' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'استراتيجية التصميم والأعمال' WHERE "title" = 'Business-design strategy' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'التواصل مع العملاء' WHERE "title" = 'Client Outreach' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'البرمجة الإبداعية والمرئيات' WHERE "title" = 'Creatvie Coding & Visuals' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'السيرة الذاتية ومعرض الأعمال' WHERE "title" = 'Cv & portfolio' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الرسم الرقمي' WHERE "title" = 'Digital Illustration' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'فيجما بعمق' WHERE "title" = 'Figma Deep deive' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'مقدمة في البرمجة الإبداعية' WHERE "title" = 'Introduction To Creative Coding' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الخط اللاتيني' WHERE "title" = 'Latin Lettering' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'فن الخط' WHERE "title" = 'Lettering' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الزخرفة' WHERE "title" = 'Ornamentation' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'الخامات والتصميم ثلاثي الأبعاد' WHERE "title" = 'Texturing & 3D' AND "title_ar" IS NULL;
UPDATE "courses" SET "title_ar" = 'ماستر كلاس فيجما لواجهة وتجربة المستخدم' WHERE "title" = 'UI/UX Figma Masterclass' AND "title_ar" IS NULL;

UPDATE "courses" SET "instructor_name_ar" = 'عبد الرحمن أبو الفضل' WHERE "instructor_name" = 'Abdulrahman Aboelfadl' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'أحمد وليد' WHERE "instructor_name" = 'Ahmed Waleed' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'خلود الهلالي' WHERE "instructor_name" = 'Kholoud Elhelaly' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'محمد رفاعي' WHERE "instructor_name" = 'Mohamed Refay' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'محمد ياسين' WHERE "instructor_name" = 'Mohamed Yassin' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'نورهان غبور' WHERE "instructor_name" = 'Nourhan Ghabour' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'سليم الجارحي' WHERE "instructor_name" = 'Selim Elgarhy' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'شريف السيد' WHERE "instructor_name" = 'Sherif ElSayed' AND "instructor_name_ar" IS NULL;
UPDATE "courses" SET "instructor_name_ar" = 'وليد' WHERE "instructor_name" = 'Waleed' AND "instructor_name_ar" IS NULL;

UPDATE "tracks" SET "title_ar" = 'التصميم ثلاثي الأبعاد' WHERE "title" = '3D Design' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'الهوية البصرية' WHERE "title" = 'Branding' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'الأعمال والتصميم' WHERE "title" = 'Business & Design' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'السيرة الذاتية ومعرض الأعمال' WHERE "title" = 'CV & Portfolio' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'الخط العربي' WHERE "title" = 'Calligraphy' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'البرمجة الإبداعية' WHERE "title" = 'Creative Coding' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'الرسم' WHERE "title" = 'Illustration' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'الزخرفة' WHERE "title" = 'Ornamentation' AND "title_ar" IS NULL;
UPDATE "tracks" SET "title_ar" = 'واجهة وتجربة المستخدم' WHERE "title" = 'UI / UX' AND "title_ar" IS NULL;

UPDATE "modules" SET "title_ar" = 'متابعة القراءة' WHERE "title" = 'Continue reading' AND "title_ar" IS NULL;

UPDATE "lessons" SET "title_ar" = 'ملاحظات نبرة العلامة' WHERE "title" = 'Brand voice notes' AND "title_ar" IS NULL;
UPDATE "lessons" SET "title_ar" = 'ملاحظات بحث الواجهة' WHERE "title" = 'Interface research notes' AND "title_ar" IS NULL;
UPDATE "lessons" SET "title_ar" = 'قراءة الموجز' WHERE "title" = 'Reading the brief' AND "title_ar" IS NULL;
