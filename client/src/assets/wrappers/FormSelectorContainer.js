import styled from 'styled-components';

const Container = styled.div`
 .form-select__control {
    border-radius: var(--input-radius) !important; // Apply rounded borders
    border: 1px solid #ccc !important; // Customize border color
  }

  .form-select__option--is-selected {
    background-color: var(--grey-100) !important; // Customize background color for selected option
  }

  .form-select__option--is-focused {
    background-color: var(--grey-50) !important; // Customize background color for focused option
  }

  .form-select__menu {
    border-radius: 10px !important; // Rounded borders for the dropdown menu
  }
`;

export default Container;
