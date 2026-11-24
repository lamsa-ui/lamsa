import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageComponent } from '../shared/page.component';

type Level = 'Supports' | 'Not applicable' | 'Your app';

interface Criterion {
  id: string;
  name: string;
  level: 'A' | 'AA';
  result: Level;
  remarks: string;
}

/**
 * WCAG 2.2 A and AA, one row per success criterion, for the components (not an app built
 * with them). Update a row when a component changes how it meets it.
 */
const CRITERIA: Criterion[] = [
  {
    id: '1.1.1',
    name: 'Non-text Content',
    level: 'A',
    result: 'Supports',
    remarks:
      'Icons are hidden from screen readers, avatars are read by the person’s name, and every field and group needs a label. Your app writes the alternatives for its own images and names icon-only buttons.',
  },
  {
    id: '1.2.1',
    name: 'Audio-only and Video-only (Prerecorded)',
    level: 'A',
    result: 'Not applicable',
    remarks: 'The kit has no audio or video.',
  },
  {
    id: '1.2.2',
    name: 'Captions (Prerecorded)',
    level: 'A',
    result: 'Not applicable',
    remarks: 'The kit has no audio or video.',
  },
  {
    id: '1.2.3',
    name: 'Audio Description or Media Alternative (Prerecorded)',
    level: 'A',
    result: 'Not applicable',
    remarks: 'The kit has no audio or video.',
  },
  {
    id: '1.2.4',
    name: 'Captions (Live)',
    level: 'AA',
    result: 'Not applicable',
    remarks: 'The kit has no audio or video.',
  },
  {
    id: '1.2.5',
    name: 'Audio Description (Prerecorded)',
    level: 'AA',
    result: 'Not applicable',
    remarks: 'The kit has no audio or video.',
  },
  {
    id: '1.3.1',
    name: 'Info and Relationships',
    level: 'A',
    result: 'Supports',
    remarks:
      'Native elements where they exist (fieldset and legend, description lists, tables with captions); labels, hints and errors are tied to their fields.',
  },
  {
    id: '1.3.2',
    name: 'Meaningful Sequence',
    level: 'A',
    result: 'Supports',
    remarks:
      'Menus, lists and popovers are placed right after their trigger, so reading order follows the page.',
  },
  {
    id: '1.3.3',
    name: 'Sensory Characteristics',
    level: 'A',
    result: 'Supports',
    remarks: 'No instruction in the kit depends on shape, place or sound.',
  },
  {
    id: '1.3.4',
    name: 'Orientation',
    level: 'AA',
    result: 'Supports',
    remarks: 'Nothing locks the screen orientation.',
  },
  {
    id: '1.3.5',
    name: 'Identify Input Purpose',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Fields pass autocomplete through; the phone field sets it. Your app sets it on fields about the user.',
  },
  {
    id: '1.4.1',
    name: 'Use of Color',
    level: 'A',
    result: 'Supports',
    remarks:
      'States are shown by words, shape, fill or a bar as well as colour.',
  },
  {
    id: '1.4.2',
    name: 'Audio Control',
    level: 'A',
    result: 'Not applicable',
    remarks: 'The kit plays no sound.',
  },
  {
    id: '1.4.3',
    name: 'Contrast (Minimum)',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Text reaches 7:1 in both themes (beyond AA), measured by a test on every push.',
  },
  {
    id: '1.4.4',
    name: 'Resize Text',
    level: 'AA',
    result: 'Supports',
    remarks: 'Sizes are in rem; every docs page is tested with text at 200%.',
  },
  {
    id: '1.4.5',
    name: 'Images of Text',
    level: 'AA',
    result: 'Supports',
    remarks: 'The kit draws no text as images.',
  },
  {
    id: '1.4.10',
    name: 'Reflow',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Every docs page is tested at 320 pixels wide. Data tables scroll inside their own box, as the criterion allows.',
  },
  {
    id: '1.4.11',
    name: 'Non-text Contrast',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Borders, focus rings and control edges reach 3:1, measured by the contrast test.',
  },
  {
    id: '1.4.12',
    name: 'Text Spacing',
    level: 'AA',
    result: 'Supports',
    remarks: 'Every docs page is tested with the WCAG text spacing override.',
  },
  {
    id: '1.4.13',
    name: 'Content on Hover or Focus',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Tooltips show on hover and focus, stay while the pointer is on them, and Escape hides them.',
  },
  {
    id: '2.1.1',
    name: 'Keyboard',
    level: 'A',
    result: 'Supports',
    remarks:
      'Every control works with the keyboard; the keys are listed on each component page, unit tested in each framework (React and Vue also in real Chromium), and pressed in Chromium, Firefox and WebKit on the Angular components.',
  },
  {
    id: '2.1.2',
    name: 'No Keyboard Trap',
    level: 'A',
    result: 'Supports',
    remarks:
      'Dialogs keep focus inside on purpose and release it on Escape, the close button or an answer.',
  },
  {
    id: '2.1.4',
    name: 'Character Key Shortcuts',
    level: 'A',
    result: 'Supports',
    remarks:
      'The only shortcut, Ctrl+K or ⌘K for the command palette, uses a modifier key, and the app can change or turn it off.',
  },
  {
    id: '2.2.1',
    name: 'Timing Adjustable',
    level: 'A',
    result: 'Supports',
    remarks:
      'Toasts pause while hovered or focused, never time out when they hold an action, and the app can turn the timer off.',
  },
  {
    id: '2.2.2',
    name: 'Pause, Stop, Hide',
    level: 'A',
    result: 'Supports',
    remarks:
      'Loading indicators stop moving when the system asks for reduced motion; nothing else moves on its own.',
  },
  {
    id: '2.3.1',
    name: 'Three Flashes or Below Threshold',
    level: 'A',
    result: 'Supports',
    remarks: 'Nothing flashes.',
  },
  {
    id: '2.4.1',
    name: 'Bypass Blocks',
    level: 'A',
    result: 'Your app',
    remarks:
      'The app shell and navigation are landmarks; your app adds a skip link.',
  },
  {
    id: '2.4.2',
    name: 'Page Titled',
    level: 'A',
    result: 'Your app',
    remarks: 'Your app titles each page.',
  },
  {
    id: '2.4.3',
    name: 'Focus Order',
    level: 'A',
    result: 'Supports',
    remarks:
      'Popups follow their trigger in the page, and focus returns to the trigger when they close.',
  },
  {
    id: '2.4.4',
    name: 'Link Purpose (In Context)',
    level: 'A',
    result: 'Your app',
    remarks:
      'Your app writes link text. Breadcrumbs and pagination name their links.',
  },
  {
    id: '2.4.5',
    name: 'Multiple Ways',
    level: 'AA',
    result: 'Your app',
    remarks:
      'Navigation, breadcrumbs and the command palette help; your app decides the ways.',
  },
  {
    id: '2.4.6',
    name: 'Headings and Labels',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Fields, groups and landmarks require a label; your app writes labels that describe.',
  },
  {
    id: '2.4.7',
    name: 'Focus Visible',
    level: 'AA',
    result: 'Supports',
    remarks:
      'One focus ring on every control, 3:1 in both themes and kept in high contrast.',
  },
  {
    id: '2.4.11',
    name: 'Focus Not Obscured (Minimum)',
    level: 'AA',
    result: 'Supports',
    remarks:
      'List items ring inside their edge. A sticky header in your app needs scroll-padding so it never covers focus.',
  },
  {
    id: '2.5.1',
    name: 'Pointer Gestures',
    level: 'A',
    result: 'Supports',
    remarks: 'Nothing needs a path or a multi-finger gesture.',
  },
  {
    id: '2.5.2',
    name: 'Pointer Cancellation',
    level: 'A',
    result: 'Supports',
    remarks: 'Actions run on release, as native buttons do.',
  },
  {
    id: '2.5.3',
    name: 'Label in Name',
    level: 'A',
    result: 'Supports',
    remarks: 'The visible label is the accessible name.',
  },
  {
    id: '2.5.4',
    name: 'Motion Actuation',
    level: 'A',
    result: 'Not applicable',
    remarks: 'Nothing responds to moving the device.',
  },
  {
    id: '2.5.7',
    name: 'Dragging Movements',
    level: 'AA',
    result: 'Supports',
    remarks:
      'A slider also moves with a single click or the keys; a drop zone also has its file button.',
  },
  {
    id: '2.5.8',
    name: 'Target Size (Minimum)',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Targets are at least 24 by 24 pixels; buttons and fields are 44 tall. axe checks it on every page.',
  },
  {
    id: '3.1.1',
    name: 'Language of Page',
    level: 'A',
    result: 'Your app',
    remarks: 'Your app sets lang on the html element.',
  },
  {
    id: '3.1.2',
    name: 'Language of Parts',
    level: 'AA',
    result: 'Supports',
    remarks:
      'The language switcher marks each language with its lang; elsewhere your app marks its own text.',
  },
  {
    id: '3.2.1',
    name: 'On Focus',
    level: 'A',
    result: 'Supports',
    remarks: 'Focus never changes the page; it only shows a tooltip.',
  },
  {
    id: '3.2.2',
    name: 'On Input',
    level: 'A',
    result: 'Supports',
    remarks: 'Choosing a value never moves to another page or submits a form.',
  },
  {
    id: '3.2.3',
    name: 'Consistent Navigation',
    level: 'AA',
    result: 'Your app',
    remarks: 'Your app keeps its navigation in the same place.',
  },
  {
    id: '3.2.4',
    name: 'Consistent Identification',
    level: 'AA',
    result: 'Supports',
    remarks: 'Each component looks and is named the same everywhere.',
  },
  {
    id: '3.2.6',
    name: 'Consistent Help',
    level: 'A',
    result: 'Your app',
    remarks: 'Your app places its help.',
  },
  {
    id: '3.3.1',
    name: 'Error Identification',
    level: 'A',
    result: 'Supports',
    remarks:
      'An error is written under its field, marks it invalid, and is announced.',
  },
  {
    id: '3.3.2',
    name: 'Labels or Instructions',
    level: 'A',
    result: 'Supports',
    remarks: 'Every field has a visible label and can have a hint.',
  },
  {
    id: '3.3.3',
    name: 'Error Suggestion',
    level: 'AA',
    result: 'Your app',
    remarks: 'Your app writes errors that say how to fix them.',
  },
  {
    id: '3.3.4',
    name: 'Error Prevention (Legal, Financial, Data)',
    level: 'AA',
    result: 'Your app',
    remarks:
      'The alert dialog is there to confirm such actions; your app decides when.',
  },
  {
    id: '3.3.7',
    name: 'Redundant Entry',
    level: 'A',
    result: 'Your app',
    remarks: 'Your app fills in what the user already gave.',
  },
  {
    id: '3.3.8',
    name: 'Accessible Authentication (Minimum)',
    level: 'AA',
    result: 'Supports',
    remarks:
      'The code input takes paste and the phone’s one-time-code autofill, so nobody has to copy digits by hand.',
  },
  {
    id: '4.1.2',
    name: 'Name, Role, Value',
    level: 'A',
    result: 'Supports',
    remarks:
      'Roles, names and states are checked by unit tests in each framework and by axe on every page.',
  },
  {
    id: '4.1.3',
    name: 'Status Messages',
    level: 'AA',
    result: 'Supports',
    remarks:
      'Toasts, pagination, the chip input and the command palette announce changes without moving focus.',
  },
];

/** The remarks in Arabic, by criterion. */
const REMARKS_AR: Record<string, string> = {
  '1.1.1':
    'الأيقونات مخفية عن قارئات الشاشة، والصورة الرمزية تُقرأ باسم الشخص، وكل حقل ومجموعة يحتاجان إلى تسمية. يكتب تطبيقك النص البديل لصوره ويسمّي الأزرار التي تحمل أيقونة فقط.',
  '1.2.1': 'لا تحتوي المكتبة على صوت أو فيديو.',
  '1.2.2': 'لا تحتوي المكتبة على صوت أو فيديو.',
  '1.2.3': 'لا تحتوي المكتبة على صوت أو فيديو.',
  '1.2.4': 'لا تحتوي المكتبة على صوت أو فيديو.',
  '1.2.5': 'لا تحتوي المكتبة على صوت أو فيديو.',
  '1.3.1':
    'عناصر HTML الأصلية حيث توجد (fieldset وlegend، وقوائم الوصف، والجداول ذات العناوين)، والتسميات والتلميحات والأخطاء مرتبطة بحقولها.',
  '1.3.2':
    'القوائم والنوافذ المنبثقة تأتي مباشرة بعد الزر الذي يفتحها، فيتبع ترتيب القراءة ترتيب الصفحة.',
  '1.3.3': 'لا تعتمد أي تعليمات في المكتبة على الشكل أو المكان أو الصوت.',
  '1.3.4': 'لا شيء يقفل اتجاه الشاشة.',
  '1.3.5':
    'الحقول تمرّر خاصية autocomplete، وحقل الهاتف يضبطها. يضبطها تطبيقك على الحقول الخاصة بالمستخدم.',
  '1.4.1': 'تظهر الحالات بالكلمات أو الشكل أو التعبئة أو شريط، لا باللون وحده.',
  '1.4.2': 'لا تُصدر المكتبة أي صوت.',
  '1.4.3':
    'يبلغ تباين النص ٧:١ في الوضعين (أعلى من AA)، ويقيسه اختبار مع كل رفع للكود.',
  '1.4.4': 'المقاسات بوحدة rem، وتُختبر كل صفحة من التوثيق بنص مكبّر إلى ٢٠٠٪.',
  '1.4.5': 'لا ترسم المكتبة نصوصًا على هيئة صور.',
  '1.4.10':
    'تُختبر كل صفحة من التوثيق بعرض ٣٢٠ بكسل. جداول البيانات تمرَّر داخل إطارها، كما يسمح المعيار.',
  '1.4.11':
    'الحدود وحلقات التركيز وحواف عناصر التحكم تبلغ ٣:١، ويقيسها اختبار التباين.',
  '1.4.12': 'تُختبر كل صفحة من التوثيق بتباعد النص الذي تحدده WCAG.',
  '1.4.13':
    'تظهر التلميحات عند المرور والتركيز، وتبقى ما دام المؤشر فوقها، ويخفيها مفتاح Escape.',
  '2.1.1':
    'كل عنصر تحكم يعمل بلوحة المفاتيح؛ المفاتيح مذكورة في صفحة كل مكوّن، ومختبرة باختبارات الوحدة في كل إطار عمل (React وVue في Chromium حقيقي أيضًا)، وفي Chromium وFirefox وWebKit على مكوّنات Angular.',
  '2.1.2':
    'النوافذ الحوارية تُبقي التركيز داخلها عن قصد، وتحرّره بمفتاح Escape أو زر الإغلاق أو الإجابة.',
  '2.1.4':
    'الاختصار الوحيد، Ctrl+K أو ⌘K للوحة الأوامر، يستخدم مفتاح تعديل، ويستطيع التطبيق تغييره أو إيقافه.',
  '2.2.1':
    'تتوقف الإشعارات مؤقتًا عند المرور أو التركيز عليها، ولا تنتهي مهلتها حين تحمل إجراءً، ويستطيع التطبيق إيقاف المؤقت.',
  '2.2.2':
    'تتوقف مؤشرات التحميل عن الحركة حين يطلب النظام تقليل الحركة؛ ولا شيء آخر يتحرك وحده.',
  '2.3.1': 'لا شيء يومض.',
  '2.4.1': 'إطار التطبيق والتنقل معالم في الصفحة؛ ويضيف تطبيقك رابط التخطي.',
  '2.4.2': 'يضع تطبيقك عنوانًا لكل صفحة.',
  '2.4.3':
    'النوافذ المنبثقة تتبع زرها في الصفحة، ويعود التركيز إليه عند إغلاقها.',
  '2.4.4':
    'يكتب تطبيقك نص الروابط. ومسار الصفحة والتنقل بين الصفحات يسمّيان روابطهما.',
  '2.4.5': 'التنقل ومسار الصفحة ولوحة الأوامر تساعد؛ ويقرر تطبيقك طرق الوصول.',
  '2.4.6':
    'الحقول والمجموعات والمعالم تحتاج إلى تسمية؛ ويكتب تطبيقك تسميات واضحة.',
  '2.4.7':
    'حلقة تركيز واحدة على كل عنصر تحكم، بتباين ٣:١ في الوضعين، وتبقى في وضع التباين العالي.',
  '2.4.11':
    'عناصر القوائم تحمل الحلقة داخل حدودها. والرأس الثابت في تطبيقك يحتاج إلى scroll-padding حتى لا يغطي التركيز.',
  '2.5.1': 'لا شيء يحتاج إلى مسار أو إيماءة بأكثر من إصبع.',
  '2.5.2': 'تعمل الإجراءات عند رفع المؤشر، كما تفعل الأزرار الأصلية.',
  '2.5.3': 'التسمية الظاهرة هي الاسم الذي تقرؤه قارئات الشاشة.',
  '2.5.4': 'لا شيء يستجيب لتحريك الجهاز.',
  '2.5.7':
    'شريط التمرير يتحرك أيضًا بنقرة واحدة أو بالمفاتيح، ومنطقة الإفلات لها زر اختيار الملف أيضًا.',
  '2.5.8':
    'لا تقل الأهداف عن ٢٤ × ٢٤ بكسل، والأزرار والحقول بارتفاع ٤٤. ويفحصها axe في كل صفحة.',
  '3.1.1': 'يضبط تطبيقك lang على عنصر html.',
  '3.1.2':
    'محوّل اللغة يعلّم كل لغة بخاصية lang الخاصة بها؛ وفي غيره يعلّم تطبيقك نصوصه.',
  '3.2.1': 'التركيز لا يغيّر الصفحة أبدًا؛ إنما يُظهر تلميحًا.',
  '3.2.2': 'اختيار قيمة لا ينقل إلى صفحة أخرى ولا يرسل نموذجًا.',
  '3.2.3': 'يُبقي تطبيقك التنقل في المكان نفسه.',
  '3.2.4': 'كل مكوّن يبدو ويُسمّى بالطريقة نفسها في كل مكان.',
  '3.2.6': 'يحدد تطبيقك مكان المساعدة.',
  '3.3.1': 'يُكتب الخطأ تحت حقله، ويعلّمه غير صالح، ويُعلَن لقارئ الشاشة.',
  '3.3.2': 'لكل حقل تسمية ظاهرة، ويمكن أن يكون له تلميح.',
  '3.3.3': 'يكتب تطبيقك رسائل خطأ تقول كيف يُصلَح.',
  '3.3.4': 'نافذة التنبيه موجودة لتأكيد هذه الإجراءات؛ ويقرر تطبيقك متى.',
  '3.3.7': 'يملأ تطبيقك ما سبق أن أدخله المستخدم.',
  '3.3.8':
    'حقل الرمز يقبل اللصق والملء التلقائي لرمز التحقق من الهاتف، فلا يحتاج أحد إلى نسخ الأرقام يدويًا.',
  '4.1.2':
    'الأدوار والأسماء والحالات تفحصها اختبارات الوحدة في كل إطار عمل وaxe في كل صفحة.',
  '4.1.3':
    'الإشعارات والتنقل بين الصفحات وحقل الوسوم ولوحة الأوامر تعلن التغييرات دون نقل التركيز.',
};

const RESULT_AR: Record<Level, string> = {
  Supports: 'مدعوم',
  'Your app': 'على تطبيقك',
  'Not applicable': 'لا ينطبق',
};

@Component({
  selector: 'app-conformance',
  imports: [PageComponent, RouterLink],
  template: `
    <app-page
      title="Conformance report"
      lead="How Ghazal's components meet each WCAG 2.2 success criterion at levels A and AA. It covers the components; an app built with them still needs its own review."
    >
      <section class="doc-section">
        <h2 class="ui-heading doc-h2">How to read it</h2>
        <ul class="doc-list">
          <li>
            <strong>Supports</strong>: the components meet it, with the checks
            in the <a routerLink="/accessibility">accessibility statement</a>.
          </li>
          <li>
            <strong>Your app</strong>: it depends on the page, not the
            components; the remark says what the kit gives.
          </li>
          <li>
            <strong>Not applicable</strong>: the kit has nothing it applies to.
          </li>
          <li>
            Not yet tested with real screen readers, so this is a claim from
            automated checks, code review and keyboard testing.
          </li>
        </ul>
        <p class="doc-muted">
          Reviewed on <time datetime="2026-11-24">24 November 2026</time>.
          {{ counts }}
        </p>
        <p>
          <a [routerLink]="[]" fragment="arabic" lang="ar"
            >اقرأ هذا التقرير بالعربية</a
          >
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Criteria</h2>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="WCAG 2.2 criteria"
        >
          <table class="doc-table">
            <caption class="ui-visually-hidden">
              WCAG 2.2 levels A and AA
            </caption>
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                <th scope="col">Level</th>
                <th scope="col">Result</th>
                <th scope="col">Remarks</th>
              </tr>
            </thead>
            <tbody>
              @for (c of criteria; track c.id) {
                <tr>
                  <th scope="row">
                    <a
                      [href]="
                        'https://www.w3.org/WAI/WCAG22/Understanding/' +
                        slug(c.name)
                      "
                      >{{ c.id }} {{ c.name }}</a
                    >
                  </th>
                  <td>{{ c.level }}</td>
                  <td>{{ c.result }}</td>
                  <td>{{ c.remarks }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
      <section class="doc-section" lang="ar" dir="rtl">
        <h2 class="ui-heading doc-h2" id="arabic">التقرير بالعربية</h2>
        <p>
          كيف تلتزم مكوّنات غزال بكل معيار نجاح في
          <span dir="ltr">WCAG 2.2</span>
          على المستويين A وAA. يغطي التقرير المكوّنات؛ أما التطبيق المبني بها
          فيحتاج إلى مراجعته الخاصة.
        </p>
        <ul class="doc-list">
          <li>
            <strong>مدعوم</strong>: تلتزم به المكوّنات، بالفحوص المذكورة في
            <a routerLink="/accessibility" fragment="arabic"
              >بيان إمكانية الوصول</a
            >.
          </li>
          <li>
            <strong>على تطبيقك</strong>: يعتمد على الصفحة لا على المكوّنات،
            والملاحظة تذكر ما تقدّمه المكتبة.
          </li>
          <li><strong>لا ينطبق</strong>: لا يوجد في المكتبة ما ينطبق عليه.</li>
          <li>
            لم يُختبر بعد بقارئات شاشة حقيقية، فهذا التقرير مبني على الفحوص
            الآلية ومراجعة الكود واختبار لوحة المفاتيح.
          </li>
        </ul>
        <div
          class="doc-table-wrap"
          tabindex="0"
          role="region"
          aria-label="معايير WCAG 2.2"
        >
          <table class="doc-table">
            <caption class="ui-visually-hidden">
              معايير WCAG 2.2 على المستويين A وAA
            </caption>
            <thead>
              <tr>
                <th scope="col">المعيار</th>
                <th scope="col">المستوى</th>
                <th scope="col">النتيجة</th>
                <th scope="col">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              @for (c of criteria; track c.id) {
                <tr>
                  <th scope="row">
                    <span dir="ltr" lang="en">{{ c.id }} {{ c.name }}</span>
                  </th>
                  <td>{{ c.level }}</td>
                  <td>{{ resultAr[c.result] }}</td>
                  <td>{{ remarksAr[c.id] }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </app-page>
  `,
})
export class ConformanceComponent {
  protected readonly criteria = CRITERIA;
  protected readonly remarksAr = REMARKS_AR;
  protected readonly resultAr = RESULT_AR;
  protected readonly counts =
    (['Supports', 'Your app', 'Not applicable'] as const)
      .map(
        (r) =>
          `${CRITERIA.filter((c) => c.result === r).length} ${r.toLowerCase()}`,
      )
      .join(', ') + '.';

  /** The Understanding page of a criterion, as W3C names it. */
  protected slug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/,/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
