import { TAsset } from "brahma-templates-sdk";
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

const AssetsTable = ({
  assets,
  selectedAssets,
  handleAssetSelect,
  handleSelectAllAssets,
}: {
  assets: TAsset[];
  selectedAssets: TAsset[];
  handleAssetSelect: (token: TAsset) => void;
  handleSelectAllAssets: () => void;
}) => {
  const areAllSelected = assets.every((asset) =>
    selectedAssets.some(
      (selected) =>
        selected.address.toLowerCase() === asset.address.toLowerCase()
    )
  );

  return (
    <StyledTable>
      <thead>
        <tr style={{ backgroundColor: "#f4f4f4" }}>
          <StyledTh>Name</StyledTh>
          <StyledTh>Symbol</StyledTh>
          <StyledTh>Balance</StyledTh>
          <StyledTh
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            Select{" "}
            <input
              type="checkbox"
              checked={areAllSelected}
              onChange={handleSelectAllAssets}
            />
          </StyledTh>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
          >
            <StyledTd>{asset.name}</StyledTd>
            <StyledTd>{asset.symbol}</StyledTd>
            <StyledTd>{asset.balanceOf?.formatted}</StyledTd>
            <StyledTd>
              <input
                type="checkbox"
                checked={selectedAssets.includes(asset)}
                onChange={() => handleAssetSelect(asset)}
              />
            </StyledTd>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default AssetsTable;
