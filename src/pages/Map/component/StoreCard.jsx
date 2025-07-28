import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  background: ${(props) => (props.$isSelected ? "#f8fafc" : "#fff")};
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  outline: none;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f1f5f9;
  }
`;

const StoreName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AffiliateIcon = styled.img`
  width: 26px;
  height: 26px;
  flex-shrink: 0;
`;

const StoreCategory = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
`;

const StoreAddress = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
  line-height: 1.3;
`;

const StorePhone = styled.div`
  font-size: 13px;
  color: #9ca3af;
`;

const StoreCard = React.memo(({ store, isSelected, onClick }) => {
  return (
    <CardContainer $isSelected={isSelected} onClick={onClick}>
      <StoreCategory>{store.category}</StoreCategory>
      <StoreName>
        {store.isAffiliate && (
          <AffiliateIcon src="/UI/specialstore.png" alt="제휴업체" />
        )}
        {store.name}
      </StoreName>
      <StoreAddress>{store.address}</StoreAddress>
      {store.phoneNumber && <StorePhone>{store.phoneNumber}</StorePhone>}
    </CardContainer>
  );
});

export default StoreCard;
