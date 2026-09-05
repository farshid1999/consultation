import {
  FiTarget,
  FiWind,
  FiShield,
  FiTrendingUp,
  FiMoon,
  FiEye,
  FiUsers,
  FiUser,
} from "react-icons/fi";
import { PiBrainDuotone, PiHeartbeatDuotone } from "react-icons/pi";
import type {
  BenefitItem,
  FaqItem,
  NavLink,
  ProcessStep,
  ServiceItem,
  StatItem,
  TestimonialItem,
} from "@/types";



export const navLinks: NavLink[] = [
  { id: "why", label: "چرا روان‌شناسی ورزشی", href: "#why" },
  { id: "services", label: "خدمات", href: "#services" },
  { id: "process", label: "فرآیند مشاوره", href: "#process" },
  { id: "stats", label: "دستاوردها", href: "#stats" },
  { id: "testimonials", label: "نظرات ورزشکاران", href: "#testimonials" },
  { id: "faq", label: "پرسش‌های متداول", href: "#faq" },
  {id: "lines", label: "بخش ها", href: `#` },
];

export const services: ServiceItem[] = [
  {
    id: "performance-anxiety",
    title: "اضطراب عملکرد",
    description:
      "شناسایی ریشه‌های اضطراب پیش از رقابت و جایگزینی آن با آرامش کنترل‌شده‌ای که در لحظه‌ی تصمیم به کمک شما می‌آید.",
    icon: FiWind,
    layout: "stacked",
  },
  {
    id: "stress-management",
    title: "مدیریت استرس",
    description:
      "ابزارهای عملی تنفس، تمرکز و بازسازی شناختی برای عبور از فشارهای فصل مسابقات بدون فرسودگی ذهنی.",
    icon: PiHeartbeatDuotone,
    layout: "inline",
  },
  {
    id: "competition-prep",
    title: "آماده‌سازی پیش از رقابت",
    description:
      "طراحی روتین ذهنی اختصاصی برای روزهای منتهی به مسابقه؛ از تجسم‌سازی تا تثبیت تمرکز در دقایق پایانی.",
    icon: FiTarget,
    layout: "framed",
  },
  {
    id: "confidence-building",
    title: "تقویت اعتمادبه‌نفس",
    description:
      "بازسازی گفت‌وگوی درونی ورزشکار و جایگزینی باورهای محدودکننده با اعتماد پایدار و واقع‌بینانه.",
    icon: FiTrendingUp,
    layout: "overlap",
  },
  {
    id: "mental-recovery",
    title: "بازتوانی ذهنی",
    description:
      "همراهی روان‌شناختی در دوران آسیب‌دیدگی یا افت عملکرد؛ بازگشتی آگاهانه و بدون شتاب‌زدگی به میدان.",
    icon: FiMoon,
    layout: "stacked",
  },
  {
    id: "focus-improvement",
    title: "بهبود تمرکز",
    description:
      "تمرین‌های توجه‌محور برای حذف نویزهای ذهنی و ماندن در لحظه‌ی حال، حتی در پرفشارترین ثانیه‌های بازی.",
    icon: FiEye,
    layout: "inline",
  },
  {
    id: "team-psychology",
    title: "روان‌شناسی تیمی",
    description:
      "تقویت انسجام گروهی، ارتباط مؤثر میان بازیکنان و مربی، و ساخت فرهنگی که عملکرد جمعی را بالا می‌برد.",
    icon: FiUsers,
    layout: "framed",
  },
  {
    id: "individual-sessions",
    title: "جلسات فردی",
    description:
      "مسیر یک‌به‌یک، متناسب با رشته‌ی ورزشی، اهداف و شخصیت شما؛ بدون الگوهای از پیش‌ساخته.",
    icon: FiUser,
    layout: "overlap",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "step-1",
    order: "۰۱",
    title: "جلسه‌ی آشنایی",
    description: "گفت‌وگویی بی‌واسطه درباره‌ی چالش‌ها، اهداف و تجربه‌ی ورزشی شما؛ بدون قضاوت، فقط شنیدن دقیق.",
    icon: FiUser,
  },
  {
    id: "step-2",
    order: "۰۲",
    title: "ارزیابی ذهنی",
    description: "سنجش الگوهای فکری، سطح اضطراب و نقاط قوت روانی برای طراحی مسیری داده‌محور.",
    icon: PiBrainDuotone,
  },
  {
    id: "step-3",
    order: "۰۳",
    title: "طراحی برنامه‌ی اختصاصی",
    description: "تدوین برنامه‌ای مشخص با تمرین‌های قابل‌اجرا، متناسب با تقویم مسابقات شما.",
    icon: FiTarget,
  },
  {
    id: "step-4",
    order: "۰۴",
    title: "همراهی مستمر",
    description: "جلسات منظم پیگیری، بازبینی پیشرفت و تنظیم دقیق مسیر بر اساس نتایج میدانی.",
    icon: FiTrendingUp,
  },
];

export const benefits: BenefitItem[] = [
  {
    id: "clarity",
    title: "وضوح ذهنی در لحظه‌ی تصمیم",
    description: "توانایی تصمیم‌گیری سریع و دقیق، حتی زیر بیشترین فشار رقابتی.",
    icon: FiEye,
  },
  {
    id: "resilience",
    title: "تاب‌آوری پایدار",
    description: "بازگشت سریع‌تر از شکست، آسیب یا نتایج ناامیدکننده، بدون از دست دادن انگیزه.",
    icon: FiShield,
  },
  {
    id: "consistency",
    title: "ثبات عملکرد",
    description: "کاهش نوسان بین تمرین و مسابقه؛ عملکردی که در روز مهم هم قابل‌اتکاست.",
    icon: PiHeartbeatDuotone,
  },
  {
    id: "growth",
    title: "رشد بلندمدت هویت ورزشی",
    description: "شکل‌گیری تصویری سالم و پایدار از خود، فراتر از نتیجه‌ی یک بازی یا یک فصل.",
    icon: FiTrendingUp,
  },
];

export const stats: StatItem[] = [
  { id: "athletes", value: 420, suffix: "+", label: "ورزشکار همراهی‌شده" },
  { id: "years", value: 12, suffix: "", label: "سال تجربه‌ی بالینی" },
  { id: "satisfaction", value: 96, suffix: "٪", label: "رضایت از روند مشاوره" },
  { id: "federations", value: 8, suffix: "", label: "همکاری با فدراسیون‌ها" },
];

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    name: "آرمان کیانی",
    role: "دونده‌ی سرعت، تیم ملی",
    sport: "دو و میدانی",
    quote:
      "پیش از شروع این مسیر، اضطراب پیش از استارت کنترل من را در دست داشت. حالا همان اضطراب را می‌شناسم و می‌دانم چطور از آن انرژی بگیرم، نه اینکه تسلیمش شوم.",
  },
  {
    id: "t2",
    name: "نیلوفر صدر",
    role: "کاپیتان تیم والیبال",
    sport: "والیبال",
    quote:
      "جلسات روان‌شناسی تیمی چیزی را در ما تغییر داد که تمرین فنی به‌تنهایی نمی‌توانست. ارتباطمان روی زمین شفاف‌تر شد و همین، امتیازهای زیادی برایمان ساخت.",
  },
  {
    id: "t3",
    name: "بهراد امینی",
    role: "شناگر حرفه‌ای",
    sport: "شنا",
    quote:
      "بعد از یک آسیب طولانی، بازگشت ذهنی سخت‌تر از بازگشت جسمی بود. این همراهی به من کمک کرد بدون ترس دوباره وارد استخر شوم.",
  },
];

export const faqs: FaqItem[] = [
  {
    id: "f1",
    question: "روان‌شناسی ورزشی دقیقاً برای چه کسانی مناسب است؟",
    answer:
      "از ورزشکاران حرفه‌ای و نیمه‌حرفه‌ای گرفته تا نوجوانان در حال رشد در یک رشته‌ی ورزشی؛ هرکسی که عملکردش تحت‌تأثیر ذهنش قرار می‌گیرد، می‌تواند از این مسیر بهره ببرد.",
  },
  {
    id: "f2",
    question: "جلسات به چه شکل و با چه بازه‌ای برگزار می‌شود؟",
    answer:
      "جلسات به‌صورت حضوری یا آنلاین و معمولاً هفتگی برگزار می‌شوند. بازه‌ی دقیق بر اساس اهداف شما و تقویم مسابقاتتان تنظیم می‌شود.",
  },
  {
    id: "f3",
    question: "آیا نتایج این مسیر قابل‌اندازه‌گیری است؟",
    answer:
      "بله. در ابتدای مسیر یک ارزیابی پایه انجام می‌شود و در بازه‌های مشخص، پیشرفت شما در تمرکز، اضطراب و اعتمادبه‌نفس به‌صورت مستند بازبینی می‌گردد.",
  },
  {
    id: "f4",
    question: "چه زمانی می‌توان انتظار نتیجه داشت؟",
    answer:
      "بسیاری از ورزشکاران از همان چند جلسه‌ی اول تغییر در وضوح ذهنی را حس می‌کنند، اما نتایج پایدار معمولاً طی چند ماه همراهی مستمر شکل می‌گیرد.",
  },
  {
    id: "f5",
    question: "آیا محرمانگی جلسات تضمین می‌شود؟",
    answer:
      "کاملاً. تمام مکالمات و اطلاعات جلسات مطابق با اصول اخلاق حرفه‌ای، محرمانه باقی می‌ماند مگر با رضایت صریح شما.",
  },
];
