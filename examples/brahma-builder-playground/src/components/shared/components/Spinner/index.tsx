import styled from "styled-components";

// Accept size as a prop and use it to set width and height
const Loader = styled.div<{ size: number }>`
  border: 4px solid #a8adb5;
  border-top: 4px solid #5aedfc;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Usage in a React component
const Spinner = ({ size = 20 }: { size?: number }) => {
  return <Loader size={size} />;
};

export default Spinner;
