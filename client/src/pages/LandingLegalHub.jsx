import React, { useMemo, useState } from 'react';
import Container from '../assets/wrappers/LegalHubContainer';
import { useTheme } from '../context/ThemeContext';
import {
  SEO,
  ActionsList,
  LandingFooter,
  LandingNavbar,
  DangerousMarkdownBasic
} from '../components';
import {
  FaRobot,
  FaUsersCog,
  FaUserShield,
  FaBalanceScale,
  FaRegRegistered,
  FaFileSignature,
  FaQuestionCircle,
} from 'react-icons/fa';

import {
  legalFaqContent,
  termsOfUseContent,
  privacyPolicyContent,
  trademarkLogoNoticeContent,
  dmcaIpRemovalPolicyContent,
  userContentGuidelinesContent,
  rankingAiDisclosureContent,
} from '../assets/utils/legal';
import logoLight from '../assets/images/logo-sphere-color-light-01.svg';
import logoDark from '../assets/images/logo-sphere-color-dark-01.svg';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL;
const cdnLogoLight =
  'https://cdn.trendflowai.com/content/logo-sphere-color-light-01.svg';
const cdnLogoDark =
  'https://cdn.trendflowai.com/content/logo-sphere-color-dark-01.svg';

const LandingLegalHub = () => {
  const { isDarkTheme } = useTheme();
  const [hasError, setHasError] = useState(false);
  const cdnSrc = isDarkTheme ? cdnLogoDark : cdnLogoLight;
  const localSrc = isDarkTheme ? logoDark : logoLight;

  const legalActions = [
    {
      id: 'legal-faq',
      title: 'FAQ',
      icon: FaQuestionCircle,
      content: legalFaqContent,
    },
    {
      id: 'terms-license',
      title: 'Terms of Use & Content License',
      icon: FaBalanceScale,
      content: termsOfUseContent,
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      icon: FaUserShield,
      content: privacyPolicyContent,
    },
    {
      id: 'trademark-logo-notice',
      title: 'Trademark & Logo Notice',
      icon: FaRegRegistered,
      content: trademarkLogoNoticeContent,
    },
    {
      id: 'dmca-ip-removal',
      title: 'DMCA / IP Removal Policy',
      icon: FaFileSignature,
      content: dmcaIpRemovalPolicyContent,
    },
    {
      id: 'user-content-guidelines',
      title: 'User Content Guidelines',
      icon: FaUsersCog,
      content: userContentGuidelinesContent,
    },
    {
      id: 'ranking-ai-disclosure',
      title: 'Ranking & AI Disclosure',
      icon: FaRobot,
      content: rankingAiDisclosureContent,
    }
  ];

  const [selectedLegalId, setSelectedLegalId] = useState('legal-faq');

  const selectedLegalItem = useMemo(() => {
    return (
      legalActions.find((item) => item.id === selectedLegalId) ||
      legalActions[0]
    );
  }, [selectedLegalId]);

  return (
    <Container>
      <SEO
        title="TrendFlow - Legal Hub"
        description="Review TrendFlowAI terms, privacy policy, trademark notices, content rules, ranking disclosures, and legal FAQ."
        url={`${FRONTEND_BASE_URL}/legal`}
        img_large={`${FRONTEND_BASE_URL}/og-image-legal.jpg`}
        img_small={`${FRONTEND_BASE_URL}/og-image-legal-twitter.jpg`}
      />
      <LandingNavbar />
      <section className="legal-hero">
        <div className="legal-logo-box">
          <img
            className="legal-logo"
            src={hasError ? localSrc : cdnSrc}
            alt="TrendFlowAI logo"
            onError={() => setHasError(true)}
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="legal-hero-content">
          <p className="eyebrow">Legal Center</p>
          <h1>trendFlowAI Legal Hub</h1>
          <p>
            Review platform terms, content rules, logo notices, ranking
            disclosures, and removal policies.
          </p>
        </div>
      </section>

      <ActionsList
        items={legalActions}
        activeId={selectedLegalId}
        onChange={(item) => setSelectedLegalId(item.id)}
        ariaLabel="Legal hub sections"
      />

      <section className="legal-content-card">
        <DangerousMarkdownBasic
          content={selectedLegalItem.content}
          legalPage
          isDarkTheme={isDarkTheme}
        />
      </section>
    <LandingFooter />
    </Container>
  );
};

export default LandingLegalHub;