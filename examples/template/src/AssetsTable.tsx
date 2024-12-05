import * as S from "./styles";

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
    <S.StyledTable>
      <thead>
        <tr style={{ backgroundColor: "#f4f4f4" }}>
          <S.StyledTh>Name</S.StyledTh>
          <S.StyledTh>Symbol</S.StyledTh>
          <S.StyledTh>Balance</S.StyledTh>
          <S.StyledTh
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
          </S.StyledTh>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
          >
            <S.StyledTd>{asset.name}</S.StyledTd>
            <S.StyledTd>{asset.symbol}</S.StyledTd>
            <S.StyledTd>{asset.balanceOf?.formatted}</S.StyledTd>
            <S.StyledTd>
              <input
                type="checkbox"
                checked={selectedAssets.includes(asset)}
                onChange={() => handleAssetSelect(asset)}
              />
            </S.StyledTd>
          </tr>
        ))}
      </tbody>
    </S.StyledTable>
  );
};

export default AssetsTable;
