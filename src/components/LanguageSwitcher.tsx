import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as SupportedLanguage;
    i18n.changeLanguage(lang);
    window.location.search = `?locale=${lang}`;
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      className="language-switcher"
      aria-label={t('language.switch')}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {t(`language.${lang}`)}
        </option>
      ))}
    </select>
  );
}
