import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTh = styled.th`
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
  color: #000;
`;

const StyledTd = styled.td`
  border: 1px solid #ddd;
  padding: 0.75rem;
  color: #000;
`;

export { StyledTable, StyledTh, StyledTd };
