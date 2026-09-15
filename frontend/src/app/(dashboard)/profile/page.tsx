// src/app/(dashboard)/profile/page.tsx
import MyProfile from "@/components/profile/MyProfile";

export default function ProfilePage() {
  return (
    <main dir="rtl" className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">پروفایل من</h1>
        <p className="text-cream/50 text-sm mt-1">مشاهده و مدیریت اطلاعات شخصی</p>
      </div>
      
      <MyProfile />
    </main>
  );
}