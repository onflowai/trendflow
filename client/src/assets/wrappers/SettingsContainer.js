import styled from 'styled-components';

const Container = styled.div`
 .quick-actions {
    display: flex;
    flex-wrap: wrap; //items wrap on smaller screens
    gap: 10px;
    border: 1.5px solid var(--grey-50);
    border-radius: 8px;
    padding: 10px;
  }

  .btn-container {
    display: flex;
    align-items: center; // vertically centers the content within each container
  }

  .btn-container:not(:last-child)::after {
    content: '';
    display: block;
    width: 1px;
    height: 24px;
    margin-left: 10px;
  }

  .quick-tool {
    display: block;
    padding: 8px 12px;
    font-size: 14px;
    color: white;
    border: none;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }

  .dark-mode {
  
  }

  @media (max-width: 768px) {
    .quick-actions {
      flex-direction: column; //stack items
    }

    .btn-container {
      margin-bottom: 10px;
    }

    .btn-container::after {
      display: none;
    }
  }
`;

export default Container;
