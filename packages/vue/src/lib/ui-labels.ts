// The words the components say on their own: hidden names of buttons, announcements, empty
// states. One set per language. This file is the same in @ghazal-ui/angular, /react and /vue
// (tools/api-parity.mjs checks it); each package wires it to its framework.

export type UiTimelineStatus = 'approved' | 'pending' | 'rejected';

export interface UiPaginationLabels {
  nav: string;
  previous: string;
  next: string;
  page: (page: number) => string;
  summary: (first: number, last: number, total: number) => string;
  pageSize: string;
}

export interface UiLabels {
  close: string;
  dismiss: string;
  remove: string;
  added: (value: string) => string;
  removed: (value: string) => string;
  menu: string;
  previousMonth: string;
  nextMonth: string;
  chooseDate: string;
  startDate: string;
  endDate: string;
  noMatches: string;
  commands: string;
  typeCommand: string;
  noCommands: string;
  commandCount: (count: number) => string;
  loading: string;
  noResults: string;
  decrease: string;
  increase: string;
  countryCode: string;
  clearSearch: string;
  dropFile: string;
  language: string;
  breadcrumb: string;
  digit: (n: number, of: number) => string;
  star: (count: number) => string;
  score: (value: number, max: number) => string;
  more: (count: number) => string;
  notifications: string;
  stepDone: string;
  stepBack: string;
  stepNext: string;
  stepFinish: string;
  pagination: UiPaginationLabels;
  timeline: Record<UiTimelineStatus, string>;
}

export const englishLabels: UiLabels = {
  close: 'Close',
  dismiss: 'Dismiss',
  remove: 'Remove',
  added: (value) => `${value} added`,
  removed: (value) => `${value} removed`,
  menu: 'Menu',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseDate: 'Choose date',
  startDate: 'Start date',
  endDate: 'End date',
  noMatches: 'No matches',
  commands: 'Commands',
  typeCommand: 'Type a command',
  noCommands: 'No commands match.',
  commandCount: (n) => (n === 1 ? '1 command' : `${n} commands`),
  loading: 'Loading',
  noResults: 'No results',
  decrease: 'Decrease',
  increase: 'Increase',
  countryCode: 'Country code',
  clearSearch: 'Clear search',
  dropFile: 'Or drop a file here',
  language: 'Language',
  breadcrumb: 'Breadcrumb',
  digit: (n, of) => `Digit ${n} of ${of}`,
  star: (n) => (n === 1 ? '1 star' : `${n} stars`),
  score: (value, max) => `${value} out of ${max} stars`,
  more: (n) => `${n} more`,
  notifications: 'Notifications',
  stepDone: 'Done',
  stepBack: 'Back',
  stepNext: 'Next',
  stepFinish: 'Finish',
  pagination: {
    nav: 'Pagination',
    previous: 'Previous page',
    next: 'Next page',
    page: (page) => `Page ${page}`,
    summary: (first, last, total) =>
      total === 0 ? 'No results' : `${first}–${last} of ${total}`,
    pageSize: 'Rows per page',
  },
  timeline: { approved: 'Approved', pending: 'Pending', rejected: 'Rejected' },
};

/** Numbers in Arabic-Indic digits, as Egyptian Arabic text writes them: 1042 → ١٠٤٢. */
const ar = (n: number) => n.toLocaleString('ar-EG', { useGrouping: false });

/** Arabic counts: one and two have their own words, 3 to 10 the plural, 11 and up the singular. */
function arabicCount(
  n: number,
  [one, two, few, many]: [string, string, string, string],
): string {
  if (n === 1) return one;
  if (n === 2) return two;
  const tail = n % 100;
  return `${ar(n)} ${tail >= 3 && tail <= 10 ? few : many}`;
}

export const arabicLabels: UiLabels = {
  close: 'إغلاق',
  dismiss: 'إخفاء',
  remove: 'إزالة',
  added: (value) => `تمت إضافة ${value}`,
  removed: (value) => `تمت إزالة ${value}`,
  menu: 'القائمة',
  previousMonth: 'الشهر السابق',
  nextMonth: 'الشهر التالي',
  chooseDate: 'اختر التاريخ',
  startDate: 'تاريخ البداية',
  endDate: 'تاريخ النهاية',
  noMatches: 'لا توجد نتائج',
  commands: 'الأوامر',
  typeCommand: 'اكتب أمرًا',
  noCommands: 'لا توجد أوامر مطابقة.',
  commandCount: (n) =>
    n === 0
      ? 'لا توجد أوامر'
      : arabicCount(n, ['أمر واحد', 'أمران', 'أوامر', 'أمرًا']),
  loading: 'جارٍ التحميل',
  noResults: 'لا توجد نتائج',
  decrease: 'إنقاص',
  increase: 'زيادة',
  countryCode: 'رمز الدولة',
  clearSearch: 'مسح البحث',
  dropFile: 'أو اسحب الملف هنا',
  language: 'اللغة',
  breadcrumb: 'مسار الصفحة',
  digit: (n, of) => `الرقم ${ar(n)} من ${ar(of)}`,
  star: (n) => arabicCount(n, ['نجمة واحدة', 'نجمتان', 'نجوم', 'نجمة']),
  score: (value, max) =>
    `${ar(value)} من ${ar(max)} ${max % 100 >= 3 && max % 100 <= 10 ? 'نجوم' : 'نجمة'}`,
  more: (n) => `${ar(n)} آخرون`,
  notifications: 'الإشعارات',
  stepDone: 'تم',
  stepBack: 'السابق',
  stepNext: 'التالي',
  stepFinish: 'إنهاء',
  pagination: {
    nav: 'التنقل بين الصفحات',
    previous: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    page: (page) => `الصفحة ${ar(page)}`,
    summary: (first, last, total) =>
      total === 0
        ? 'لا توجد نتائج'
        : `${ar(first)}–${ar(last)} من ${ar(total)}`,
    pageSize: 'عدد الصفوف',
  },
  timeline: {
    approved: 'تمت الموافقة',
    pending: 'قيد الانتظار',
    rejected: 'مرفوض',
  },
};
