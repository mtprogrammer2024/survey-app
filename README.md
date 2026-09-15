# 📊 Survey App — سیستم نظرسنجی زنده

یه اپلیکیشن full-stack برای ساخت نظرسنجی و مشاهده‌ی نتایج به‌صورت **real-time** — بدون نیاز به رفرش صفحه.

## ویژگی‌ها

- 🔐 احراز هویت با Laravel Sanctum (SPA cookie-based)
- 📝 ساخت نظرسنجی با ۴ نوع سؤال: تک‌انتخابی، چندانتخابی، امتیاز (۱ تا ۵)، متن آزاد
- 🌐 پرکردن نظرسنجی بدون نیاز به لاگین (Public link)
- ⚡ نمایش نتایج به‌صورت **زنده** با WebSocket (Laravel Reverb)
- 📈 نمودار میله‌ای زنده با Recharts

## تکنولوژی‌ها

**Backend:**
- Laravel 12
- Laravel Sanctum (Auth)
- Laravel Reverb (WebSocket / Broadcasting)
- MySQL

**Frontend:**
- React 18 + Vite
- React Router
- Axios
- Laravel Echo + Pusher.js (کلاینت Reverb)
- Recharts

## ساختار پروژه

\`\`\`
survey-app/
├── backend/     # Laravel API
└── frontend/    # React SPA
\`\`\`

## راه‌اندازی

### پیش‌نیازها
- PHP >= 8.2
- Composer
- Node.js + npm
- MySQL

### بک‌اند

\`\`\`bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# تنظیم اطلاعات دیتابیس MySQL در .env
php artisan migrate
php artisan reverb:install
\`\`\`

سه ترمینال جدا لازمه:
\`\`\`bash
php artisan serve          # ترمینال ۱ - پورت 8000
php artisan reverb:start   # ترمینال ۲ - پورت 8080
\`\`\`

### فرانت

\`\`\`bash
cd frontend
npm install
npm run dev                # پورت 5173
\`\`\`

## نحوه‌ی استفاده

1. یه اکانت بساز و لاگین کن
2. نظرسنجی جدید بساز با سؤال‌های دلخواه
3. لینک عمومی نظرسنجی رو با دیگران به اشتراک بذار
4. نتایج رو به‌صورت زنده تو صفحه‌ی نتایج ببین 🎉

## License

MIT

## 👤 سازنده

**مهدی طلوعی**

- GitHub: [@mtprogrammer2024](https://github.com/mtprogrammer2024)
- Email: mt.programmer2024@gmail.com
- LinkedIn: https://www.linkedin.com/in/mahditoloee/
