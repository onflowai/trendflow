import React, { useState, useMemo, useRef } from 'react';
import { Form, useLoaderData, useNavigation, redirect } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  ActionsList,
  SEOProtected,
  StatComponent,
  CustomErrorToast,
  DangerousMarkdown,
  ChartSettingsComponent,
} from '../components';
import {
  FaBook,
  FaRobot,
  FaToolbox,
  FaUsersCog,
  FaUserShield,
  FaBalanceScale,
  FaRegRegistered,
  FaFileSignature,
  FaUserAstronaut,
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
import {
  manual,
  contributing,
  documentation
} from '../assets/utils/data';
import DarkMode from '../components/DarkMode';
import customFetch from '../utils/customFetch';
import { useOutletContext } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // importing UserContext
import { useDashboardContext } from './DashboardLayout';
import Container from '../assets/wrappers/SettingsContainer';
import { toast } from 'react-toastify';
import {
  IoCheckmarkDoneOutline,
  IoEyeOutline,
  IoArrowUp,
  IoAlbumsOutline,
} from 'react-icons/io5';
/**
 * Setting will be used to display App based settings
 * @returns
 */
export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  try {
    // Fetching app stats for the charts
    const chartsResponse = await customFetch.get('/trends/app/stats');
    const chartsData = chartsResponse.data;

    // Return both sets of data
    return {
      charts: chartsData,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(<CustomErrorToast message={error?.response?.data?.msg} />);
    return redirect('/dashboard');
  }
};

const Settings = () => {
  const { isDarkTheme } = useTheme();
  const { charts } = useLoaderData();
  const { user, stats } = useOutletContext();
  const legalActions = [
    {
      id: 'manual',
      title: 'Manual',
      icon: FaBook,
      content: manual,
    },
    {
      id: 'contributing',
      title: 'Contributing',
      icon: FaUserAstronaut,
      content: contributing,
    },
    {
      id: 'documentation',
      title: 'Documentation',
      icon: FaToolbox,
      content: documentation,
    },
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

const [selectedLegalId, setSelectedLegalId] = useState('manual');

const selectedLegalItem = useMemo(() => {
  return (
    legalActions.find((item) => item.id === selectedLegalId) ||
    legalActions[0]
  );
}, [selectedLegalId]);

  return (
    <Container>
    <SEOProtected />
    <section className="settings-section">
      <StatComponent
        stats={[
          {
            title: 'Approved Trends',
            value: stats.approvedTrends,
            icon: <IoCheckmarkDoneOutline />,
          },
          {
            title: 'Total Trend Views',
            value: stats.totalTrendViews,
            icon: <IoEyeOutline />,
          },
          {
            title: 'Submitted Trends',
            value: stats.submittedTrends,
            icon: <IoArrowUp />,
          },
          {
            title: 'Total Site Trends',
            value: stats.totalSiteTrends,
            icon: <IoAlbumsOutline />,
          },
        ]}
      />
    </section>
    {charts.monthTrends?.length > 1 && (
      <section className="settings-section">
        <ChartSettingsComponent data={charts} title="App Stats:" />
      </section>
    )}
    <section className="settings-docs-hub">
      <div className="settings-docs-header">
        <div>
          <p className="eyebrow">Resources</p>
          <h2>Platform Docs</h2>
        </div>
      </div>
      <ActionsList
        items={legalActions}
        activeId={selectedLegalId}
        onChange={(item) => setSelectedLegalId(item.id)}
        ariaLabel="Settings documentation sections"
      />
      <section className="settings-docs-card">
        <DangerousMarkdown
          content={selectedLegalItem.content}
          isDarkTheme={isDarkTheme}
        />
      </section>
    </section>
  </Container>
  );
};

export default Settings;
