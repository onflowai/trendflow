import React, { useState } from 'react';
import styled from 'styled-components';

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name); // Default to the first tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <TabContainer>
      <TabButtons>
        {tabs.map((tab) => (
          <TabButton
            key={tab.name}
            isActive={activeTab === tab.name}
            onClick={() => handleTabClick(tab.name)}
          >
            {tab.name}
          </TabButton>
        ))}
      </TabButtons>

      <TabContent>
        {tabs.map(
          (tab) =>
            activeTab === tab.name && <div key={tab.name}>{tab.content}</div>
        )}
      </TabContent>
    </TabContainer>
  );
};

export default Tabs;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabButtons = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const TabButton = styled.button`
`;
