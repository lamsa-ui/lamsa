'use client';

import {
  Button as AriaButton,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import { Button, type ButtonSize } from './button.js';
import { Icon } from './icon.js';
import { useUiLabels } from './labels.js';

export interface Language {
  /** The language tag, such as 'en' or 'ar'. */
  code: string;
  /** The language's name in that language: 'English', 'عربي'. */
  name: string;
}

export interface LanguageSwitcherProps {
  /** The languages, each named in itself. */
  languages: readonly Language[];
  /** The current language's code. */
  current: string;
  /** Called with the chosen language's code. */
  onChange: (code: string) => void;
  /** Read before the current name on the menu button (three or more); translate it. */
  label?: string;
  size?: ButtonSize;
}

function Globe() {
  return <Icon name="globe" size="sm" />;
}

/**
 * Switches the interface language. With two languages it is one button that names the
 * other one in that language (a reader of it can find it); with more it opens a menu with
 * the current one checked, on React Aria. Each name carries its `lang`, so screen readers
 * say it right. Set `<html lang dir>` yourself in `onChange`.
 *
 * ```tsx
 * <LanguageSwitcher languages={languages} current={lang} onChange={setLang} />
 * ```
 */
export function LanguageSwitcher({
  languages,
  current,
  onChange,
  label,
  size = 'md',
}: LanguageSwitcherProps) {
  const t = useUiLabels();
  label ??= t.language;
  if (languages.length === 2) {
    const other = languages.find((l) => l.code !== current) ?? languages[0];
    return (
      <Button
        variant="secondary"
        size={size}
        type="button"
        lang={other.code}
        onClick={() => onChange(other.code)}
      >
        <Globe />
        {other.name}
      </Button>
    );
  }
  const active = languages.find((l) => l.code === current);
  return (
    <MenuTrigger>
      <AriaButton
        className={`ui-button ui-button--secondary ui-button--${size}`}
      >
        <Globe />
        <span className="ui-visually-hidden">{label}: </span>
        <span lang={active?.code}>{active?.name}</span>
      </AriaButton>
      <Popover
        placement="bottom start"
        offset={0}
        style={{ zIndex: 'var(--ui-layer-popover)' }}
      >
        <Menu
          className="ui-menu"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[current]}
          onSelectionChange={(keys) => {
            const [code] = keys === 'all' ? [] : keys;
            if (code != null) onChange(String(code));
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              id={language.code}
              lang={language.code}
              className="ui-menu__item"
            >
              {language.name}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
