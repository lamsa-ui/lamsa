import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsSettings } from '../shared/docs-settings';
import { PageComponent } from '../shared/page.component';

@Component({
  selector: 'app-accessibility',
  imports: [PageComponent, RouterLink],
  template: `
    <app-page
      title="Accessibility statement"
      lead="Lamsa is built so that everyone can use what is made with it: with a keyboard, a screen reader, high contrast, zoom or a small phone, in Arabic and in English. This page says what we aim for, how we check it, and what is not done yet."
    >
      <p class="doc-section">
        <a [routerLink]="[]" fragment="arabic" lang="ar"
          >اقرأ هذا البيان بالعربية</a
        >
        ·
        <a routerLink="/accessibility/conformance"
          >Conformance report, criterion by criterion</a
        >
      </p>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What we aim for</h2>
        <ul class="doc-list">
          <li>
            Every component meets the
            <a href="https://www.w3.org/TR/WCAG22/">
              Web Content Accessibility Guidelines (WCAG) 2.2</a
            >
            at level AA, in light and dark, left to right and right to left.
          </li>
          <li>
            Text goes further than AA: it reaches 7:1 contrast against its
            background in both themes (level AAA). Borders, focus rings and
            controls reach 3:1.
          </li>
          <li>
            Colour never carries meaning alone, every control works with the
            keyboard alone, and focus is always visible.
          </li>
          <li>
            Each component follows the matching
            <a href="https://www.w3.org/WAI/ARIA/apg/">
              WAI-ARIA Authoring Practices</a
            >
            pattern, or uses the native HTML element when one exists. Each
            component page lists its keys and what screen readers hear, under
            Keyboard and screen readers.
            @switch (settings.framework()) {
              @case ('angular') {
                Angular components are built on the Angular CDK.
              }
              @case ('react') {
                React components are built on React Aria.
              }
              @case ('vue') {
                Vue overlays, menus, dates and trees are built on Reka UI.
              }
              @case ('html') {
                Plain HTML gives you the classes and the markup; the keyboard
                script for tabs, menus and other widgets is yours to add, as
                each page says.
              }
            }
          </li>
          <li>
            Touch targets are at least 24 by 24 pixels, the WCAG 2.2 minimum,
            and buttons and fields are 44 pixels tall or more.
          </li>
          <li>
            The words components say on their own, such as Close and the names
            of page buttons, come in Arabic and English, switched in one place.
          </li>
          <li>
            Motion stops when the system asks for reduced motion, and every
            control keeps its edges and states in Windows high contrast. When
            the system asks for more contrast, borders and secondary text go to
            full text strength.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">How we check it</h2>
        <p>Every check below runs on every push, and any failure stops it.</p>
        <ul class="doc-list">
          <li>
            A contrast test measures every colour pair of both themes against
            its target.
          </li>
          <li>
            axe-core checks every page of this site in light and dark and in
            each framework's view, and again with dialogs, menus, popovers,
            tooltips and toasts open.
          </li>
          <li>
            Every page is loaded with text at 200%, with the WCAG text spacing
            override, and at 320 pixels wide; none of them may push the page
            sideways.
          </li>
          <li>
            Browser tests press the keys of the interactive components, left to
            right and right to left, in Chromium, Firefox and WebKit. The live
            demos on this site are the Angular components.
          </li>
          <li>
            Unit tests in Angular, React and Vue check every component's roles,
            names and states, the keys of the interactive ones, and the Arabic
            words they say.
          </li>
          <li>
            Screenshots of the main controls in Windows high contrast are
            compared with approved ones, and the more contrast setting is
            checked.
          </li>
        </ul>
        <p>
          By hand, before each release: a walk through with the keyboard only.
        </p>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Not done yet</h2>
        <ul class="doc-list">
          <li>
            Testing with real screen readers: NVDA and JAWS on Windows,
            VoiceOver on macOS and iOS, TalkBack on Android, including Arabic
            voices. Automated checks catch only part of what a screen reader
            user meets.
          </li>
          <li>
            React and Vue components are tested in a simulated browser only; the
            real-browser tests run on the Angular components.
          </li>
          <li>
            Tooltips never show on touch screens, so nothing needed may live
            only in a tooltip.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">What stays with your app</h2>
        <p>
          A component can only be as accessible as the page around it. Your app
          still needs to:
        </p>
        <ul class="doc-list">
          <li>
            set <code>lang</code> and <code>dir</code> on the
            <code>html</code> element, and change them with the language;
          </li>
          <li>give each page its own title and one main heading;</li>
          <li>write text alternatives for its images, and real labels;</li>
          <li>
            keep 7:1 for text and 3:1 for borders if it re-brands the colours.
          </li>
        </ul>
      </section>

      <section class="doc-section">
        <h2 class="ui-heading doc-h2">Tell us</h2>
        <p>
          If something is hard or impossible to use, please
          <a href="https://github.com/lamsa-ui/lamsa/issues">
            open an issue on GitHub</a
          >
          and say which component, which browser, and which assistive
          technology.
        </p>
        <p class="doc-muted">
          Written on <time datetime="2026-11-19">19 November 2026</time>,
          updated on <time datetime="2026-11-24">24 November 2026</time>, and
          reviewed with every release.
        </p>
      </section>

      <section class="doc-section" lang="ar" dir="rtl">
        <h2 class="ui-heading doc-h2" id="arabic">البيان بالعربية</h2>
        <p>
          صُمّمت لمسة ليستطيع الجميع استخدام ما يُبنى بها: بلوحة المفاتيح، أو بقارئ
          الشاشة، أو بالتباين العالي، أو بالتكبير، أو على هاتف صغير، بالعربية
          والإنجليزية.
        </p>

        <h3 class="ui-heading">ما نهدف إليه</h3>
        <ul class="doc-list">
          <li>
            يلتزم كل مكوّن بإرشادات الوصول إلى محتوى الويب
            <span dir="ltr">(WCAG 2.2)</span> على المستوى AA، في الوضعين الفاتح
            والداكن، ومن اليسار إلى اليمين ومن اليمين إلى اليسار.
          </li>
          <li>
            يبلغ تباين النص مع خلفيته <span dir="ltr">7:1</span> في الوضعين
            (المستوى AAA)، وتبلغ الحدود وحلقات التركيز وعناصر التحكم
            <span dir="ltr">3:1</span>.
          </li>
          <li>
            لا يحمل اللون وحده أي معنى، وكل عنصر تحكم يعمل بلوحة المفاتيح وحدها،
            والتركيز ظاهر دائمًا.
          </li>
          <li>
            يتبع كل مكوّن نمط WAI-ARIA المناسب، أو يستخدم عنصر HTML الأصلي حين
            يوجد. وتعرض صفحة كل مكوّن مفاتيحه وما يسمعه مستخدم قارئ الشاشة.
          </li>
          <li>
            لا تقل مساحة اللمس عن <span dir="ltr">24 × 24</span> بكسل، ولا يقل
            ارتفاع الأزرار والحقول عن 44 بكسل.
          </li>
          <li>
            الكلمات التي تقولها المكوّنات بنفسها، مثل «إغلاق» وأسماء أزرار
            الصفحات، متاحة بالعربية والإنجليزية، وتُبدَّل من مكان واحد.
          </li>
          <li>
            تتوقف الحركة حين يطلب النظام تقليلها، وتحتفظ عناصر التحكم بحدودها
            وحالاتها في وضع التباين العالي في ويندوز، ويشتد تباين الحدود والنص
            الثانوي حين يطلب النظام تباينًا أعلى.
          </li>
        </ul>

        <h3 class="ui-heading">كيف نتحقق</h3>
        <p>تعمل كل هذه الفحوص مع كل رفع للكود، وأي خطأ يوقفه.</p>
        <ul class="doc-list">
          <li>يقيس اختبار التباين كل زوج من الألوان في الوضعين.</li>
          <li>
            يفحص axe-core كل صفحة من هذا الموقع في الوضعين وفي عرض كل إطار عمل،
            ثم يفحصها مرة أخرى والنوافذ الحوارية والقوائم والتلميحات والإشعارات
            مفتوحة.
          </li>
          <li>
            تُفتح كل صفحة بنص مكبّر إلى 200%، وبتباعد النص الذي تحدده WCAG، وبعرض
            320 بكسل، ولا يجوز أن تحتاج الصفحة إلى تمرير أفقي.
          </li>
          <li>
            تجرّب اختبارات المتصفح مفاتيح المكوّنات التفاعلية، من اليسار إلى
            اليمين ومن اليمين إلى اليسار، على Chromium وFirefox وWebKit.
            والأمثلة الحية في هذا الموقع مبنية بمكوّنات Angular.
          </li>
          <li>
            تفحص اختبارات الوحدة أدوار كل مكوّن وأسماءه وحالاته في كل إطار عمل.
          </li>
          <li>
            تُقارن صور لعناصر التحكم الأساسية في وضع التباين العالي بصور معتمدة.
          </li>
        </ul>

        <h3 class="ui-heading">ما لم يكتمل بعد</h3>
        <ul class="doc-list">
          <li>
            مكوّنات React وVue مختبرة في متصفح محاكى فقط؛ واختبارات المتصفح
            الحقيقي تعمل على مكوّنات Angular.
          </li>
          <li>
            الاختبار بقارئات شاشة حقيقية: NVDA وJAWS على ويندوز، وVoiceOver على
            macOS وiOS، وTalkBack على أندرويد، بما فيها الأصوات العربية.
          </li>
          <li>
            لا تظهر التلميحات على شاشات اللمس، فلا تضع فيها شيئًا لا غنى عنه.
          </li>
        </ul>

        <h3 class="ui-heading">ما يبقى على تطبيقك</h3>
        <ul class="doc-list">
          <li>
            ضبط <code>lang</code> و<code>dir</code> على عنصر
            <code>html</code> وتغييرهما مع اللغة؛
          </li>
          <li>عنوان خاص لكل صفحة، وعنوان رئيسي واحد فيها؛</li>
          <li>نص بديل للصور، وتسميات حقيقية للحقول؛</li>
          <li>
            الحفاظ على <span dir="ltr">7:1</span> للنص و<span dir="ltr"
              >3:1</span
            >
            للحدود إن غيّرت الألوان.
          </li>
        </ul>

        <h3 class="ui-heading">أخبرنا</h3>
        <p>
          إن وجدت شيئًا صعب الاستخدام أو مستحيلًا، فافتح
          <a href="https://github.com/lamsa-ui/lamsa/issues"
            >مشكلة على GitHub</a
          >
          واذكر المكوّن والمتصفح والتقنية المساعدة التي تستخدمها.
        </p>
      </section>
    </app-page>
  `,
})
export class AccessibilityComponent {
  protected readonly settings = inject(DocsSettings);
}
