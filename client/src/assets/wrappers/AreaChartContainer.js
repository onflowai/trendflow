import styled from 'styled-components';

const Container = styled.section`
cursor: pointer; // Apply pointer cursor to the entire container
&:hover {
    cursor: pointer; // Ensures cursor changes on hover
  }
.recharts-surface{
  cursor: pointer; 
}

.recharts-wrapper, .recharts-surface {
  -webkit-tap-highlight-color: transparent;
}

  -webkit-tap-highlight-color: transparent;

  * {
    -webkit-tap-highlight-color: transparent;
  }
`;
export default Container;
